// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./extensions/ERC4907Upgradeable.sol";

/**
 * @title AlmaNFT721
 * @dev AlmaNEO Platform ERC-721 NFT with gasless transactions (ERC-2771)
 *
 * Features:
 * - ERC-721 Enumerable: Full NFT standard with enumeration
 * - ERC-4907: Rental/User extension for NFT lending
 * - ERC-2981: Royalty standard
 * - ERC-2771: Meta transactions (gasless for Web3Auth users)
 * - Jeong-SBT integration: Kindness Score based benefits
 * - UUPS Upgradeable
 *
 * User Types:
 * - Regular users: Web3Auth (gasless via Trusted Forwarder)
 * - Admin: MetaMask (direct transactions)
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract AlmaNFT721 is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC4907Upgradeable,
    ERC2981Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ERC2771ContextUpgradeable,
    UUPSUpgradeable
{
    // ============ Roles ============
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant ROYALTY_ADMIN_ROLE = keccak256("ROYALTY_ADMIN_ROLE");

    // ============ Structs ============
    struct NFTMetadata {
        address creator;
        uint256 createdAt;
        uint256 collectionId;
        string category;
        bool isVerified;
    }

    // ============ State Variables ============
    uint256 private _tokenIdCounter;
    string public baseURI;

    // Collection Manager contract address
    address public collectionManager;

    // Jeong-SBT contract address for Kindness Score integration
    address public jeongSBT;

    // tokenId => NFTMetadata
    mapping(uint256 => NFTMetadata) public nftMetadata;

    // creator => tokenIds
    mapping(address => uint256[]) public creatorTokens;

    // Default royalty (basis points, 10000 = 100%)
    uint96 public defaultRoyaltyBps;

    // Kindness Score discount tiers (basis points)
    uint256 public constant SILVER_DISCOUNT_BPS = 200;   // 2% discount
    uint256 public constant GOLD_DISCOUNT_BPS = 500;     // 5% discount
    uint256 public constant DIAMOND_DISCOUNT_BPS = 1000; // 10% discount

    // ============ Events ============
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed to,
        uint256 collectionId,
        string tokenURI
    );
    event NFTBurned(uint256 indexed tokenId, address indexed owner);
    event NFTVerified(uint256 indexed tokenId, bool verified);
    event BaseURIUpdated(string newBaseURI);
    event JeongSBTUpdated(address indexed newJeongSBT);
    event CollectionManagerUpdated(address indexed newCollectionManager);

    // ============ Errors ============
    error InvalidCollectionId();
    error NotCreator();
    error TokenDoesNotExist();
    error ZeroAddress();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) {
        _disableInitializers();
    }

    /**
     * @dev Initialize the contract
     * @param defaultAdmin Admin address (MetaMask)
     * @param baseURI_ Base URI for token metadata
     * @param _jeongSBT JeongSBT contract address
     * @param _defaultRoyaltyBps Default royalty in basis points
     */
    function initialize(
        address defaultAdmin,
        string memory baseURI_,
        address _jeongSBT,
        uint96 _defaultRoyaltyBps
    ) public initializer {
        __ERC721_init("AlmaNEO NFT", "ALMANFT");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC4907_init();
        __ERC2981_init();
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
        _grantRole(ROYALTY_ADMIN_ROLE, defaultAdmin);

        baseURI = baseURI_;
        jeongSBT = _jeongSBT;
        defaultRoyaltyBps = _defaultRoyaltyBps;

        // Set default royalty receiver to admin
        _setDefaultRoyalty(defaultAdmin, _defaultRoyaltyBps);
    }

    // ============ Minting Functions ============

    /**
     * @dev Mint a new NFT (gasless for Web3Auth users)
     * @param to Recipient address
     * @param tokenURI_ Token metadata URI
     * @param collectionId Collection ID (0 for no collection)
     * @param category NFT category
     * @param royaltyReceiver Royalty receiver address
     * @param royaltyBps Royalty in basis points
     */
    function mint(
        address to,
        string memory tokenURI_,
        uint256 collectionId,
        string memory category,
        address royaltyReceiver,
        uint96 royaltyBps
    ) external whenNotPaused returns (uint256) {
        // Allow minting by MINTER_ROLE or any user (for user-minted NFTs)
        address creator = _msgSender();

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        // Set royalty
        if (royaltyReceiver != address(0) && royaltyBps > 0) {
            _setTokenRoyalty(tokenId, royaltyReceiver, royaltyBps);
        }

        // Store metadata
        nftMetadata[tokenId] = NFTMetadata({
            creator: creator,
            createdAt: block.timestamp,
            collectionId: collectionId,
            category: category,
            isVerified: hasRole(MINTER_ROLE, creator) // Auto-verify if minted by admin
        });

        creatorTokens[creator].push(tokenId);

        emit NFTMinted(tokenId, creator, to, collectionId, tokenURI_);

        return tokenId;
    }

    /**
     * @dev Batch mint NFTs (admin only, for efficiency)
     */
    function batchMint(
        address to,
        string[] memory tokenURIs,
        uint256 collectionId,
        string memory category,
        address royaltyReceiver,
        uint96 royaltyBps
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](tokenURIs.length);

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            _tokenIdCounter++;
            uint256 tokenId = _tokenIdCounter;

            _safeMint(to, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);

            if (royaltyReceiver != address(0) && royaltyBps > 0) {
                _setTokenRoyalty(tokenId, royaltyReceiver, royaltyBps);
            }

            nftMetadata[tokenId] = NFTMetadata({
                creator: _msgSender(),
                createdAt: block.timestamp,
                collectionId: collectionId,
                category: category,
                isVerified: true
            });

            creatorTokens[_msgSender()].push(tokenId);
            tokenIds[i] = tokenId;

            emit NFTMinted(tokenId, _msgSender(), to, collectionId, tokenURIs[i]);
        }

        return tokenIds;
    }

    /**
     * @dev Burn an NFT
     */
    function burn(uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        require(
            _msgSender() == owner ||
            isApprovedForAll(owner, _msgSender()) ||
            getApproved(tokenId) == _msgSender(),
            "Not owner or approved"
        );

        _burn(tokenId);
        emit NFTBurned(tokenId, owner);
    }

    // ============ Jeong-SBT Integration ============

    /**
     * @dev Get Kindness Score discount for a user
     * @param user User address
     * @return discountBps Discount in basis points
     */
    function getKindnessDiscount(address user) public view returns (uint256 discountBps) {
        if (jeongSBT == address(0)) return 0;

        // Call JeongSBT to get user's tier
        // Interface: getSoulByAddress(address) returns (tokenId, kindnessScore, tier, mintedAt, totalActivities)
        try IJeongSBT(jeongSBT).getSoulByAddress(user) returns (
            uint256,
            uint256,
            IJeongSBT.Tier tier,
            uint256,
            uint256
        ) {
            if (tier == IJeongSBT.Tier.Diamond) return DIAMOND_DISCOUNT_BPS;
            if (tier == IJeongSBT.Tier.Gold) return GOLD_DISCOUNT_BPS;
            if (tier == IJeongSBT.Tier.Silver) return SILVER_DISCOUNT_BPS;
            return 0;
        } catch {
            return 0;
        }
    }

    /**
     * @dev Check if user has a Jeong Soul
     */
    function hasJeongSoul(address user) public view returns (bool) {
        if (jeongSBT == address(0)) return false;

        try IJeongSBT(jeongSBT).hasSoul(user) returns (bool hasSoul) {
            return hasSoul;
        } catch {
            return false;
        }
    }

    // ============ Admin Functions ============

    /**
     * @dev Verify/unverify an NFT (admin only)
     */
    function setVerified(uint256 tokenId, bool verified) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        nftMetadata[tokenId].isVerified = verified;
        emit NFTVerified(tokenId, verified);
    }

    function setBaseURI(string memory newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function setJeongSBT(address _jeongSBT) external onlyRole(DEFAULT_ADMIN_ROLE) {
        jeongSBT = _jeongSBT;
        emit JeongSBTUpdated(_jeongSBT);
    }

    function setCollectionManager(address _collectionManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        collectionManager = _collectionManager;
        emit CollectionManagerUpdated(_collectionManager);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator)
        external
        onlyRole(ROYALTY_ADMIN_ROLE)
    {
        _setDefaultRoyalty(receiver, feeNumerator);
        defaultRoyaltyBps = feeNumerator;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ============ View Functions ============

    function getCreatorTokens(address creator) external view returns (uint256[] memory) {
        return creatorTokens[creator];
    }

    function getTokensByCollection(uint256 collectionId, uint256 offset, uint256 limit)
        external
        view
        returns (uint256[] memory tokenIds, uint256 total)
    {
        // Count tokens in collection
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (nftMetadata[i].collectionId == collectionId && _ownerOf(i) != address(0)) {
                count++;
            }
        }

        // Apply pagination
        uint256 resultCount = count > offset ? count - offset : 0;
        if (resultCount > limit) resultCount = limit;

        tokenIds = new uint256[](resultCount);
        uint256 index = 0;
        uint256 skipped = 0;

        for (uint256 i = 1; i <= _tokenIdCounter && index < resultCount; i++) {
            if (nftMetadata[i].collectionId == collectionId && _ownerOf(i) != address(0)) {
                if (skipped >= offset) {
                    tokenIds[index] = i;
                    index++;
                } else {
                    skipped++;
                }
            }
        }

        return (tokenIds, count);
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // ============ Required Overrides ============

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC4907Upgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721URIStorageUpgradeable,
            ERC4907Upgradeable,
            ERC2981Upgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ============ ERC-2771 Context Overrides (Gasless) ============

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

    function hasSoul(address account) external view returns (bool);
}
