// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./extensions/ERC5006Upgradeable.sol";

/**
 * @title AlmaNFT1155
 * @dev AlmaNEO Platform ERC-1155 Multi-Token NFT with gasless transactions
 *
 * Features:
 * - ERC-1155: Multi-token standard (editions, collections)
 * - ERC-5006: Rental extension for ERC-1155
 * - ERC-2981: Royalty standard
 * - ERC-2771: Meta transactions (gasless for Web3Auth users)
 * - Jeong-SBT integration: Kindness Score based benefits
 * - UUPS Upgradeable
 *
 * Use Cases:
 * - Edition NFTs (multiple copies of same artwork)
 * - Gaming items (weapons, skins, etc.)
 * - Membership passes
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract AlmaNFT1155 is
    Initializable,
    ERC1155Upgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155SupplyUpgradeable,
    ERC1155URIStorageUpgradeable,
    ERC5006Upgradeable,
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
    struct TokenMetadata {
        address creator;
        uint256 createdAt;
        uint256 collectionId;
        uint256 maxSupply;      // 0 = unlimited
        string category;
        bool isVerified;
    }

    // ============ State Variables ============
    uint256 private _tokenIdCounter;
    string public name;
    string public symbol;

    // Collection Manager contract
    address public collectionManager;

    // Jeong-SBT contract for Kindness Score integration
    address public jeongSBT;

    // tokenId => TokenMetadata
    mapping(uint256 => TokenMetadata) public tokenMetadata;

    // creator => tokenIds
    mapping(address => uint256[]) public creatorTokens;

    // Default royalty (basis points)
    uint96 public defaultRoyaltyBps;

    // Kindness Score discount tiers (basis points)
    uint256 public constant SILVER_DISCOUNT_BPS = 200;   // 2%
    uint256 public constant GOLD_DISCOUNT_BPS = 500;     // 5%
    uint256 public constant DIAMOND_DISCOUNT_BPS = 1000; // 10%

    // ============ Events ============
    event TokenCreated(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 maxSupply,
        uint256 collectionId,
        string uri
    );
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed to,
        uint256 amount
    );
    event TokenBurned(
        uint256 indexed tokenId,
        address indexed from,
        uint256 amount
    );
    event TokenVerified(uint256 indexed tokenId, bool verified);
    event JeongSBTUpdated(address indexed newJeongSBT);
    event CollectionManagerUpdated(address indexed newCollectionManager);

    // ============ Errors ============
    error MaxSupplyExceeded();
    error TokenDoesNotExist();
    error NotCreator();
    error ZeroAmount();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) {
        _disableInitializers();
    }

    /**
     * @dev Initialize the contract
     */
    function initialize(
        address defaultAdmin,
        string memory baseURI_,
        address _jeongSBT,
        uint96 _defaultRoyaltyBps
    ) public initializer {
        __ERC1155_init(baseURI_);
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
        __ERC1155URIStorage_init();
        __ERC5006_init();
        __ERC2981_init();
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
        _grantRole(ROYALTY_ADMIN_ROLE, defaultAdmin);

        name = "AlmaNEO Multi-Token";
        symbol = "ALMA1155";
        jeongSBT = _jeongSBT;
        defaultRoyaltyBps = _defaultRoyaltyBps;

        _setDefaultRoyalty(defaultAdmin, _defaultRoyaltyBps);
    }

    // ============ Token Creation & Minting ============

    /**
     * @dev Create a new token type (gasless for Web3Auth users)
     * @param maxSupply Maximum supply (0 = unlimited)
     * @param initialSupply Initial amount to mint to creator
     * @param tokenURI_ Token metadata URI
     * @param collectionId Collection ID (0 for no collection)
     * @param category Token category
     * @param royaltyReceiver Royalty receiver address
     * @param royaltyBps Royalty in basis points
     */
    function createToken(
        uint256 maxSupply,
        uint256 initialSupply,
        string memory tokenURI_,
        uint256 collectionId,
        string memory category,
        address royaltyReceiver,
        uint96 royaltyBps
    ) external whenNotPaused returns (uint256) {
        address creator = _msgSender();

        if (maxSupply > 0 && initialSupply > maxSupply) revert MaxSupplyExceeded();

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        // Set token URI
        _setURI(tokenId, tokenURI_);

        // Set royalty
        if (royaltyReceiver != address(0) && royaltyBps > 0) {
            _setTokenRoyalty(tokenId, royaltyReceiver, royaltyBps);
        }

        // Store metadata
        tokenMetadata[tokenId] = TokenMetadata({
            creator: creator,
            createdAt: block.timestamp,
            collectionId: collectionId,
            maxSupply: maxSupply,
            category: category,
            isVerified: hasRole(MINTER_ROLE, creator)
        });

        creatorTokens[creator].push(tokenId);

        emit TokenCreated(tokenId, creator, maxSupply, collectionId, tokenURI_);

        // Mint initial supply to creator
        if (initialSupply > 0) {
            _mint(creator, tokenId, initialSupply, "");
            emit TokenMinted(tokenId, creator, initialSupply);
        }

        return tokenId;
    }

    /**
     * @dev Mint more of an existing token (creator or admin only)
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external whenNotPaused {
        TokenMetadata storage meta = tokenMetadata[tokenId];
        if (meta.creator == address(0)) revert TokenDoesNotExist();
        if (amount == 0) revert ZeroAmount();

        // Only creator or admin can mint
        require(
            _msgSender() == meta.creator || hasRole(MINTER_ROLE, _msgSender()),
            "Not creator or admin"
        );

        // Check max supply
        if (meta.maxSupply > 0) {
            if (totalSupply(tokenId) + amount > meta.maxSupply) revert MaxSupplyExceeded();
        }

        _mint(to, tokenId, amount, "");
        emit TokenMinted(tokenId, to, amount);
    }

    /**
     * @dev Batch mint multiple tokens (admin only)
     */
    function batchMint(
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(tokenIds.length == amounts.length, "Length mismatch");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            TokenMetadata storage meta = tokenMetadata[tokenIds[i]];
            if (meta.creator == address(0)) revert TokenDoesNotExist();

            if (meta.maxSupply > 0) {
                if (totalSupply(tokenIds[i]) + amounts[i] > meta.maxSupply) revert MaxSupplyExceeded();
            }
        }

        _mintBatch(to, tokenIds, amounts, "");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            emit TokenMinted(tokenIds[i], to, amounts[i]);
        }
    }

    /**
     * @dev Burn tokens
     */
    function burn(address from, uint256 tokenId, uint256 amount) public override {
        super.burn(from, tokenId, amount);
        emit TokenBurned(tokenId, from, amount);
    }

    // ============ Jeong-SBT Integration ============

    /**
     * @dev Get Kindness Score discount for a user
     */
    function getKindnessDiscount(address user) public view returns (uint256 discountBps) {
        if (jeongSBT == address(0)) return 0;

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

    function setVerified(uint256 tokenId, bool verified) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (tokenMetadata[tokenId].creator == address(0)) revert TokenDoesNotExist();
        tokenMetadata[tokenId].isVerified = verified;
        emit TokenVerified(tokenId, verified);
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

    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator)
        external
        onlyRole(ROYALTY_ADMIN_ROLE)
    {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
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

    function totalTokenTypes() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getRemainingSupply(uint256 tokenId) external view returns (uint256) {
        TokenMetadata storage meta = tokenMetadata[tokenId];
        if (meta.maxSupply == 0) return type(uint256).max; // Unlimited
        return meta.maxSupply - totalSupply(tokenId);
    }

    // ============ Required Overrides ============

    function uri(uint256 tokenId)
        public
        view
        override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable)
        returns (string memory)
    {
        return ERC1155URIStorageUpgradeable.uri(tokenId);
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    )
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable, ERC5006Upgradeable)
    {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(
            ERC1155Upgradeable,
            ERC5006Upgradeable,
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
