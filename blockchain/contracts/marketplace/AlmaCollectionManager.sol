// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title AlmaCollectionManager
 * @dev Manages NFT collections for the AlmaNEO marketplace
 *
 * Features:
 * - Collection creation and management
 * - Verified collections (curated by admin)
 * - Collection statistics tracking
 * - Jeong-SBT benefits for collection creators
 * - Gasless transactions (ERC-2771)
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract AlmaCollectionManager is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ERC2771ContextUpgradeable,
    UUPSUpgradeable
{
    // ============ Roles ============
    bytes32 public constant CURATOR_ROLE = keccak256("CURATOR_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // ============ Enums ============
    enum CollectionType { ERC721, ERC1155, Mixed }
    enum CollectionStatus { Active, Paused, Archived }

    // ============ Structs ============
    struct Collection {
        uint256 id;
        address owner;
        string name;
        string description;
        string imageURI;
        string bannerURI;
        CollectionType collectionType;
        CollectionStatus status;
        bool isVerified;
        uint256 createdAt;
        uint256 royaltyBps;         // Default royalty for collection items
        address royaltyReceiver;
        string category;
        string[] tags;
    }

    struct CollectionStats {
        uint256 totalItems;
        uint256 totalOwners;
        uint256 floorPrice;
        uint256 totalVolume;
        uint256 totalSales;
        uint256 lastSalePrice;
        uint256 lastSaleAt;
    }

    // ============ State Variables ============
    uint256 private _collectionIdCounter;

    // Jeong-SBT contract
    address public jeongSBT;

    // collectionId => Collection
    mapping(uint256 => Collection) public collections;

    // collectionId => CollectionStats
    mapping(uint256 => CollectionStats) public collectionStats;

    // owner => collectionIds
    mapping(address => uint256[]) public ownerCollections;

    // name hash => collectionId (prevent duplicate names)
    mapping(bytes32 => uint256) private _collectionNames;

    // Minimum Jeong tier to create verified collection
    uint256 public minTierForVerifiedCreation;

    // Collection creation fee (in native token)
    uint256 public creationFee;
    address public feeRecipient;

    // ============ Events ============
    event CollectionCreated(
        uint256 indexed collectionId,
        address indexed owner,
        string name,
        CollectionType collectionType
    );
    event CollectionUpdated(uint256 indexed collectionId);
    event CollectionVerified(uint256 indexed collectionId, bool verified);
    event CollectionStatusChanged(uint256 indexed collectionId, CollectionStatus status);
    event CollectionStatsUpdated(uint256 indexed collectionId);
    event JeongSBTUpdated(address indexed newJeongSBT);

    // ============ Errors ============
    error CollectionNotFound();
    error NotCollectionOwner();
    error CollectionNameTaken();
    error InsufficientFee();
    error InvalidRoyalty();
    error CollectionArchived();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) {
        _disableInitializers();
    }

    /**
     * @dev Initialize the contract
     */
    function initialize(
        address defaultAdmin,
        address _jeongSBT,
        address _feeRecipient,
        uint256 _creationFee
    ) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(CURATOR_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);

        jeongSBT = _jeongSBT;
        feeRecipient = _feeRecipient;
        creationFee = _creationFee;
        minTierForVerifiedCreation = 2; // Gold tier minimum
    }

    // ============ Collection Management ============

    /**
     * @dev Create a new collection (gasless for Web3Auth users)
     */
    function createCollection(
        string memory name,
        string memory description,
        string memory imageURI,
        string memory bannerURI,
        CollectionType collectionType,
        uint256 royaltyBps,
        address royaltyReceiver,
        string memory category,
        string[] memory tags
    ) external payable whenNotPaused returns (uint256) {
        // Check creation fee
        if (msg.value < creationFee) revert InsufficientFee();
        if (royaltyBps > 1000) revert InvalidRoyalty(); // Max 10%

        // Check name uniqueness
        bytes32 nameHash = keccak256(bytes(name));
        if (_collectionNames[nameHash] != 0) revert CollectionNameTaken();

        address creator = _msgSender();

        _collectionIdCounter++;
        uint256 collectionId = _collectionIdCounter;

        // Check if creator can auto-verify (Gold+ Jeong tier)
        bool autoVerify = _canAutoVerify(creator);

        collections[collectionId] = Collection({
            id: collectionId,
            owner: creator,
            name: name,
            description: description,
            imageURI: imageURI,
            bannerURI: bannerURI,
            collectionType: collectionType,
            status: CollectionStatus.Active,
            isVerified: autoVerify,
            createdAt: block.timestamp,
            royaltyBps: royaltyBps,
            royaltyReceiver: royaltyReceiver != address(0) ? royaltyReceiver : creator,
            category: category,
            tags: tags
        });

        _collectionNames[nameHash] = collectionId;
        ownerCollections[creator].push(collectionId);

        // Transfer fee to recipient
        if (creationFee > 0 && feeRecipient != address(0)) {
            (bool success, ) = feeRecipient.call{value: creationFee}("");
            require(success, "Fee transfer failed");
        }

        // Refund excess
        if (msg.value > creationFee) {
            (bool success, ) = creator.call{value: msg.value - creationFee}("");
            require(success, "Refund failed");
        }

        emit CollectionCreated(collectionId, creator, name, collectionType);

        return collectionId;
    }

    /**
     * @dev Update collection details (owner only)
     */
    function updateCollection(
        uint256 collectionId,
        string memory description,
        string memory imageURI,
        string memory bannerURI,
        string memory category,
        string[] memory tags
    ) external {
        Collection storage collection = collections[collectionId];
        if (collection.id == 0) revert CollectionNotFound();
        if (collection.owner != _msgSender()) revert NotCollectionOwner();
        if (collection.status == CollectionStatus.Archived) revert CollectionArchived();

        collection.description = description;
        collection.imageURI = imageURI;
        collection.bannerURI = bannerURI;
        collection.category = category;
        collection.tags = tags;

        emit CollectionUpdated(collectionId);
    }

    /**
     * @dev Update collection royalty settings
     */
    function updateRoyalty(
        uint256 collectionId,
        uint256 royaltyBps,
        address royaltyReceiver
    ) external {
        Collection storage collection = collections[collectionId];
        if (collection.id == 0) revert CollectionNotFound();
        if (collection.owner != _msgSender()) revert NotCollectionOwner();
        if (royaltyBps > 1000) revert InvalidRoyalty();

        collection.royaltyBps = royaltyBps;
        collection.royaltyReceiver = royaltyReceiver;

        emit CollectionUpdated(collectionId);
    }

    /**
     * @dev Transfer collection ownership
     */
    function transferOwnership(uint256 collectionId, address newOwner) external {
        Collection storage collection = collections[collectionId];
        if (collection.id == 0) revert CollectionNotFound();
        if (collection.owner != _msgSender()) revert NotCollectionOwner();

        address oldOwner = collection.owner;
        collection.owner = newOwner;

        // Update owner collections lists
        _removeFromOwnerCollections(oldOwner, collectionId);
        ownerCollections[newOwner].push(collectionId);

        emit CollectionUpdated(collectionId);
    }

    /**
     * @dev Set collection status (owner only)
     */
    function setCollectionStatus(uint256 collectionId, CollectionStatus status) external {
        Collection storage collection = collections[collectionId];
        if (collection.id == 0) revert CollectionNotFound();
        if (collection.owner != _msgSender() && !hasRole(CURATOR_ROLE, _msgSender())) {
            revert NotCollectionOwner();
        }

        collection.status = status;
        emit CollectionStatusChanged(collectionId, status);
    }

    // ============ Statistics ============

    /**
     * @dev Update collection statistics (called by marketplace)
     */
    function updateStats(
        uint256 collectionId,
        uint256 salePrice,
        bool isNewOwner
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        CollectionStats storage stats = collectionStats[collectionId];

        stats.totalSales++;
        stats.totalVolume += salePrice;
        stats.lastSalePrice = salePrice;
        stats.lastSaleAt = block.timestamp;

        if (isNewOwner) {
            stats.totalOwners++;
        }

        // Update floor price (simplified - in production, use proper floor tracking)
        if (stats.floorPrice == 0 || salePrice < stats.floorPrice) {
            stats.floorPrice = salePrice;
        }

        emit CollectionStatsUpdated(collectionId);
    }

    /**
     * @dev Increment total items (called when NFT is minted to collection)
     */
    function incrementItems(uint256 collectionId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        collectionStats[collectionId].totalItems++;
    }

    // ============ Admin Functions ============

    /**
     * @dev Verify/unverify a collection (curator only)
     */
    function setVerified(uint256 collectionId, bool verified) external onlyRole(CURATOR_ROLE) {
        if (collections[collectionId].id == 0) revert CollectionNotFound();
        collections[collectionId].isVerified = verified;
        emit CollectionVerified(collectionId, verified);
    }

    function setJeongSBT(address _jeongSBT) external onlyRole(DEFAULT_ADMIN_ROLE) {
        jeongSBT = _jeongSBT;
        emit JeongSBTUpdated(_jeongSBT);
    }

    function setCreationFee(uint256 _fee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        creationFee = _fee;
    }

    function setFeeRecipient(address _recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        feeRecipient = _recipient;
    }

    function setMinTierForVerifiedCreation(uint256 _tier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        minTierForVerifiedCreation = _tier;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ============ Internal Functions ============

    function _canAutoVerify(address creator) internal view returns (bool) {
        if (jeongSBT == address(0)) return false;

        try IJeongSBT(jeongSBT).getSoulByAddress(creator) returns (
            uint256,
            uint256,
            IJeongSBT.Tier tier,
            uint256,
            uint256
        ) {
            return uint256(tier) >= minTierForVerifiedCreation;
        } catch {
            return false;
        }
    }

    function _removeFromOwnerCollections(address owner, uint256 collectionId) internal {
        uint256[] storage ownerList = ownerCollections[owner];
        for (uint256 i = 0; i < ownerList.length; i++) {
            if (ownerList[i] == collectionId) {
                ownerList[i] = ownerList[ownerList.length - 1];
                ownerList.pop();
                break;
            }
        }
    }

    // ============ View Functions ============

    function getCollection(uint256 collectionId) external view returns (Collection memory) {
        return collections[collectionId];
    }

    function getCollectionStats(uint256 collectionId) external view returns (CollectionStats memory) {
        return collectionStats[collectionId];
    }

    function getOwnerCollections(address owner) external view returns (uint256[] memory) {
        return ownerCollections[owner];
    }

    function totalCollections() external view returns (uint256) {
        return _collectionIdCounter;
    }

    function isCollectionActive(uint256 collectionId) external view returns (bool) {
        return collections[collectionId].status == CollectionStatus.Active;
    }

    /**
     * @dev Get collections with pagination
     */
    function getCollections(
        uint256 offset,
        uint256 limit,
        bool verifiedOnly
    ) external view returns (Collection[] memory result, uint256 total) {
        // Count matching collections
        uint256 count = 0;
        for (uint256 i = 1; i <= _collectionIdCounter; i++) {
            if (collections[i].id != 0 &&
                collections[i].status == CollectionStatus.Active &&
                (!verifiedOnly || collections[i].isVerified)) {
                count++;
            }
        }

        // Apply pagination
        uint256 resultCount = count > offset ? count - offset : 0;
        if (resultCount > limit) resultCount = limit;

        result = new Collection[](resultCount);
        uint256 index = 0;
        uint256 skipped = 0;

        for (uint256 i = 1; i <= _collectionIdCounter && index < resultCount; i++) {
            if (collections[i].id != 0 &&
                collections[i].status == CollectionStatus.Active &&
                (!verifiedOnly || collections[i].isVerified)) {
                if (skipped >= offset) {
                    result[index] = collections[i];
                    index++;
                } else {
                    skipped++;
                }
            }
        }

        return (result, count);
    }

    // ============ ERC-2771 Overrides ============

    function _msgSender()
        internal
        view
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (address sender)
    {
        return ERC2771ContextUpgradeable._msgSender();
    }

    function _msgData()
        internal
        view
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (bytes calldata)
    {
        return ERC2771ContextUpgradeable._msgData();
    }

    function _contextSuffixLength()
        internal
        view
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (uint256)
    {
        return ERC2771ContextUpgradeable._contextSuffixLength();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    // Allow receiving native token for creation fee
    receive() external payable {}
}

// ============ Interface for JeongSBT ============
interface IJeongSBT {
    enum Tier { Bronze, Silver, Gold, Diamond }

    function getSoulByAddress(address account) external view returns (
        uint256 tokenId,
        uint256 kindnessScore,
        Tier tier,
        uint256 mintedAt,
        uint256 totalActivities
    );
}
