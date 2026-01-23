// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title JeongSBT
 * @dev 정(情) Soulbound Token - 양도 불가능한 영혼 토큰
 *
 * Features:
 * - ERC-5484 기반 Soulbound Token (양도 불가)
 * - 티어 시스템: Bronze → Silver → Gold → Diamond
 * - Kindness Score 연동
 * - 업그레이드 가능 (UUPS)
 *
 * 티어 기준:
 * - Bronze: 0-999 Kindness Score
 * - Silver: 1,000-9,999 Kindness Score
 * - Gold: 10,000-99,999 Kindness Score
 * - Diamond: 100,000+ Kindness Score
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract JeongSBT is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    // ============ Roles ============
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant SCORE_UPDATER_ROLE = keccak256("SCORE_UPDATER_ROLE");

    // ============ Enums ============
    enum Tier { Bronze, Silver, Gold, Diamond }

    // ============ Structs ============
    struct SoulData {
        uint256 kindnessScore;
        Tier tier;
        uint256 mintedAt;
        uint256 lastUpdated;
        uint256 totalActivities;
    }

    // ============ State Variables ============
    uint256 private _tokenIdCounter;
    string public baseURI;

    // tokenId => SoulData
    mapping(uint256 => SoulData) public soulData;

    // wallet address => tokenId (1인 1개 제한)
    mapping(address => uint256) public addressToTokenId;

    // 티어별 임계값
    uint256 public constant SILVER_THRESHOLD = 1_000;
    uint256 public constant GOLD_THRESHOLD = 10_000;
    uint256 public constant DIAMOND_THRESHOLD = 100_000;

    // ============ Events ============
    event SoulMinted(address indexed to, uint256 indexed tokenId, Tier tier);
    event ScoreUpdated(uint256 indexed tokenId, uint256 oldScore, uint256 newScore, Tier newTier);
    event TierUpgraded(uint256 indexed tokenId, Tier oldTier, Tier newTier);
    event ActivityRecorded(uint256 indexed tokenId, uint256 points, string activityType);

    // ============ Errors ============
    error SoulboundTokenNonTransferable();
    error AlreadyHasSoul();
    error NoSoulFound();
    error InvalidScoreDecrease();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev 초기화 함수
     */
    function initialize(
        address defaultAdmin,
        string memory baseURI_
    ) public initializer {
        __ERC721_init("Jeong Soulbound Token", "JEONG");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
        _grantRole(SCORE_UPDATER_ROLE, defaultAdmin);

        baseURI = baseURI_;
    }

    // ============ Soulbound Logic ============

    /**
     * @dev 전송 차단 (Soulbound)
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (address)
    {
        address from = _ownerOf(tokenId);

        // 민팅과 소각만 허용, 전송은 차단
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenNonTransferable();
        }

        return super._update(to, tokenId, auth);
    }

    // ============ Minting ============

    /**
     * @dev 새 영혼 토큰 발행 (1인 1개)
     */
    function mintSoul(address to) external onlyRole(MINTER_ROLE) returns (uint256) {
        if (addressToTokenId[to] != 0) {
            revert AlreadyHasSoul();
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        addressToTokenId[to] = tokenId;

        soulData[tokenId] = SoulData({
            kindnessScore: 0,
            tier: Tier.Bronze,
            mintedAt: block.timestamp,
            lastUpdated: block.timestamp,
            totalActivities: 0
        });

        // 티어별 메타데이터 URI 설정
        _setTokenURI(tokenId, _getTierURI(Tier.Bronze));

        emit SoulMinted(to, tokenId, Tier.Bronze);
        return tokenId;
    }

    // ============ Score Management ============

    /**
     * @dev Kindness Score 증가 (활동 기록)
     */
    function addKindnessScore(
        uint256 tokenId,
        uint256 points,
        string calldata activityType
    ) external onlyRole(SCORE_UPDATER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        SoulData storage soul = soulData[tokenId];
        uint256 oldScore = soul.kindnessScore;
        Tier oldTier = soul.tier;

        soul.kindnessScore += points;
        soul.lastUpdated = block.timestamp;
        soul.totalActivities++;

        Tier newTier = _calculateTier(soul.kindnessScore);

        if (newTier != oldTier) {
            soul.tier = newTier;
            _setTokenURI(tokenId, _getTierURI(newTier));
            emit TierUpgraded(tokenId, oldTier, newTier);
        }

        emit ActivityRecorded(tokenId, points, activityType);
        emit ScoreUpdated(tokenId, oldScore, soul.kindnessScore, newTier);
    }

    /**
     * @dev Kindness Score 직접 설정 (관리자용)
     */
    function setKindnessScore(
        uint256 tokenId,
        uint256 newScore
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        SoulData storage soul = soulData[tokenId];
        uint256 oldScore = soul.kindnessScore;
        Tier oldTier = soul.tier;

        soul.kindnessScore = newScore;
        soul.lastUpdated = block.timestamp;

        Tier newTier = _calculateTier(newScore);

        if (newTier != oldTier) {
            soul.tier = newTier;
            _setTokenURI(tokenId, _getTierURI(newTier));
            emit TierUpgraded(tokenId, oldTier, newTier);
        }

        emit ScoreUpdated(tokenId, oldScore, newScore, newTier);
    }

    // ============ View Functions ============

    /**
     * @dev 주소로 영혼 데이터 조회
     */
    function getSoulByAddress(address account) external view returns (
        uint256 tokenId,
        uint256 kindnessScore,
        Tier tier,
        uint256 mintedAt,
        uint256 totalActivities
    ) {
        tokenId = addressToTokenId[account];
        if (tokenId == 0) revert NoSoulFound();

        SoulData memory soul = soulData[tokenId];
        return (
            tokenId,
            soul.kindnessScore,
            soul.tier,
            soul.mintedAt,
            soul.totalActivities
        );
    }

    /**
     * @dev 주소가 영혼을 보유하고 있는지 확인
     */
    function hasSoul(address account) external view returns (bool) {
        return addressToTokenId[account] != 0;
    }

    /**
     * @dev 티어 문자열 반환
     */
    function getTierName(Tier tier) public pure returns (string memory) {
        if (tier == Tier.Bronze) return "Bronze";
        if (tier == Tier.Silver) return "Silver";
        if (tier == Tier.Gold) return "Gold";
        return "Diamond";
    }

    // ============ Internal Functions ============

    function _calculateTier(uint256 score) internal pure returns (Tier) {
        if (score >= DIAMOND_THRESHOLD) return Tier.Diamond;
        if (score >= GOLD_THRESHOLD) return Tier.Gold;
        if (score >= SILVER_THRESHOLD) return Tier.Silver;
        return Tier.Bronze;
    }

    function _getTierURI(Tier tier) internal view returns (string memory) {
        return string(abi.encodePacked(baseURI, getTierName(tier), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // ============ Admin Functions ============

    function setBaseURI(string memory _newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _newBaseURI;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    // ============ Required Overrides ============

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
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
