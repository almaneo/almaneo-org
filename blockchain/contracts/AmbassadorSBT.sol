// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title AmbassadorSBT
 * @dev Ambassador Soulbound Token - Kindness Protocol 역할 기반 SBT
 *
 * Features:
 * - ERC-5484 기반 Soulbound Token (양도 불가)
 * - 4개 티어: Friend → Host → Ambassador → Guardian
 * - 활동 기반 자동 발급 (밋업, 추천인 등)
 * - 업그레이드 가능 (UUPS)
 *
 * 티어 조건:
 * - Friend: 첫 밋업 참가
 * - Host: 밋업 3회 주최
 * - Ambassador: Kindness Score 500점 달성
 * - Guardian: Kindness Score 1,000점 + 추천인 10명
 *
 * @custom:security-contact security@almaneo.org
 */
contract AmbassadorSBT is
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
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // ============ Enums ============
    enum AmbassadorTier { None, Friend, Host, Ambassador, Guardian }

    // ============ Structs ============
    struct AmbassadorData {
        AmbassadorTier tier;
        uint256 meetupsAttended;
        uint256 meetupsHosted;
        uint256 kindnessScore;
        uint256 referralCount;
        uint256 mintedAt;
        uint256 lastUpdated;
    }

    // ============ State Variables ============
    uint256 private _tokenIdCounter;
    string public baseURI;

    // tokenId => AmbassadorData
    mapping(uint256 => AmbassadorData) public ambassadorData;

    // wallet address => tokenId (1인 1개 제한)
    mapping(address => uint256) public addressToTokenId;

    // referral tracking: referrer => referees[]
    mapping(address => address[]) public referrals;

    // referee => referrer (역방향 매핑)
    mapping(address => address) public referredBy;

    // 티어 임계값
    uint256 public constant FRIEND_MEETUPS = 1;
    uint256 public constant HOST_MEETUPS = 3;
    uint256 public constant AMBASSADOR_SCORE = 500;
    uint256 public constant GUARDIAN_SCORE = 1000;
    uint256 public constant GUARDIAN_REFERRALS = 10;

    // ============ Events ============
    event AmbassadorMinted(address indexed to, uint256 indexed tokenId, AmbassadorTier tier);
    event TierUpgraded(address indexed account, uint256 indexed tokenId, AmbassadorTier oldTier, AmbassadorTier newTier);
    event MeetupAttended(address indexed account, uint256 indexed tokenId, uint256 totalMeetups);
    event MeetupHosted(address indexed account, uint256 indexed tokenId, uint256 totalHosted);
    event KindnessScoreUpdated(address indexed account, uint256 indexed tokenId, uint256 newScore);
    event ReferralRecorded(address indexed referrer, address indexed referee);

    // ============ Errors ============
    error SoulboundTokenNonTransferable();
    error AlreadyHasAmbassadorSBT();
    error NoAmbassadorSBTFound();
    error AlreadyReferred();
    error CannotReferSelf();
    error InvalidTierDowngrade();

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
        __ERC721_init("Ambassador Soulbound Token", "AMBASSADOR");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
        _grantRole(VERIFIER_ROLE, defaultAdmin);

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
     * @dev 새 Ambassador SBT 발행 (1인 1개)
     * @notice 첫 밋업 참가 시 자동으로 Friend 티어로 발급
     */
    function mintAmbassador(address to) external onlyRole(MINTER_ROLE) returns (uint256) {
        if (addressToTokenId[to] != 0) {
            revert AlreadyHasAmbassadorSBT();
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        addressToTokenId[to] = tokenId;

        ambassadorData[tokenId] = AmbassadorData({
            tier: AmbassadorTier.Friend,
            meetupsAttended: 1, // 첫 밋업 참가로 발급
            meetupsHosted: 0,
            kindnessScore: 0,
            referralCount: 0,
            mintedAt: block.timestamp,
            lastUpdated: block.timestamp
        });

        _setTokenURI(tokenId, _getTierURI(AmbassadorTier.Friend));

        emit AmbassadorMinted(to, tokenId, AmbassadorTier.Friend);
        return tokenId;
    }

    // ============ Activity Recording ============

    /**
     * @dev 밋업 참가 기록
     */
    function recordMeetupAttendance(address account) external onlyRole(VERIFIER_ROLE) {
        uint256 tokenId = addressToTokenId[account];

        // 토큰이 없으면 자동 발급
        if (tokenId == 0) {
            tokenId = _mintNewAmbassador(account);
        } else {
            AmbassadorData storage data = ambassadorData[tokenId];
            data.meetupsAttended++;
            data.lastUpdated = block.timestamp;

            emit MeetupAttended(account, tokenId, data.meetupsAttended);
        }

        _checkAndUpgradeTier(account, tokenId);
    }

    /**
     * @dev 밋업 주최 기록
     */
    function recordMeetupHosted(address account) external onlyRole(VERIFIER_ROLE) {
        uint256 tokenId = addressToTokenId[account];

        if (tokenId == 0) {
            tokenId = _mintNewAmbassador(account);
        }

        AmbassadorData storage data = ambassadorData[tokenId];
        data.meetupsHosted++;
        data.lastUpdated = block.timestamp;

        emit MeetupHosted(account, tokenId, data.meetupsHosted);
        _checkAndUpgradeTier(account, tokenId);
    }

    /**
     * @dev Kindness Score 업데이트
     */
    function updateKindnessScore(address account, uint256 newScore) external onlyRole(VERIFIER_ROLE) {
        uint256 tokenId = addressToTokenId[account];

        if (tokenId == 0) {
            // 점수 업데이트 시 SBT가 없으면 발급하지 않음
            revert NoAmbassadorSBTFound();
        }

        AmbassadorData storage data = ambassadorData[tokenId];
        data.kindnessScore = newScore;
        data.lastUpdated = block.timestamp;

        emit KindnessScoreUpdated(account, tokenId, newScore);
        _checkAndUpgradeTier(account, tokenId);
    }

    /**
     * @dev 추천인 기록
     */
    function recordReferral(address referrer, address referee) external onlyRole(VERIFIER_ROLE) {
        if (referrer == referee) revert CannotReferSelf();
        if (referredBy[referee] != address(0)) revert AlreadyReferred();

        referredBy[referee] = referrer;
        referrals[referrer].push(referee);

        uint256 tokenId = addressToTokenId[referrer];
        if (tokenId != 0) {
            AmbassadorData storage data = ambassadorData[tokenId];
            data.referralCount = referrals[referrer].length;
            data.lastUpdated = block.timestamp;

            emit ReferralRecorded(referrer, referee);
            _checkAndUpgradeTier(referrer, tokenId);
        }
    }

    // ============ Internal Functions ============

    /**
     * @dev 새 Ambassador SBT 발급 (internal)
     */
    function _mintNewAmbassador(address to) internal returns (uint256) {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        addressToTokenId[to] = tokenId;

        ambassadorData[tokenId] = AmbassadorData({
            tier: AmbassadorTier.Friend,
            meetupsAttended: 1,
            meetupsHosted: 0,
            kindnessScore: 0,
            referralCount: 0,
            mintedAt: block.timestamp,
            lastUpdated: block.timestamp
        });

        _setTokenURI(tokenId, _getTierURI(AmbassadorTier.Friend));

        emit AmbassadorMinted(to, tokenId, AmbassadorTier.Friend);
        return tokenId;
    }

    /**
     * @dev 티어 업그레이드 확인 및 적용
     */
    function _checkAndUpgradeTier(address account, uint256 tokenId) internal {
        AmbassadorData storage data = ambassadorData[tokenId];
        AmbassadorTier currentTier = data.tier;
        AmbassadorTier newTier = _calculateTier(data);

        if (newTier > currentTier) {
            data.tier = newTier;
            _setTokenURI(tokenId, _getTierURI(newTier));
            emit TierUpgraded(account, tokenId, currentTier, newTier);
        }
    }

    /**
     * @dev 조건에 따른 티어 계산
     */
    function _calculateTier(AmbassadorData memory data) internal pure returns (AmbassadorTier) {
        // Guardian: 1,000점 + 추천인 10명
        if (data.kindnessScore >= GUARDIAN_SCORE && data.referralCount >= GUARDIAN_REFERRALS) {
            return AmbassadorTier.Guardian;
        }

        // Ambassador: 500점 달성
        if (data.kindnessScore >= AMBASSADOR_SCORE) {
            return AmbassadorTier.Ambassador;
        }

        // Host: 밋업 3회 주최
        if (data.meetupsHosted >= HOST_MEETUPS) {
            return AmbassadorTier.Host;
        }

        // Friend: 첫 밋업 참가 (기본)
        if (data.meetupsAttended >= FRIEND_MEETUPS) {
            return AmbassadorTier.Friend;
        }

        return AmbassadorTier.None;
    }

    function _getTierURI(AmbassadorTier tier) internal view returns (string memory) {
        return string(abi.encodePacked(baseURI, getTierName(tier), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // ============ View Functions ============

    /**
     * @dev 주소로 Ambassador 데이터 조회
     */
    function getAmbassadorByAddress(address account) external view returns (
        uint256 tokenId,
        AmbassadorTier tier,
        uint256 meetupsAttended,
        uint256 meetupsHosted,
        uint256 kindnessScore,
        uint256 referralCount,
        uint256 mintedAt
    ) {
        tokenId = addressToTokenId[account];
        if (tokenId == 0) revert NoAmbassadorSBTFound();

        AmbassadorData memory data = ambassadorData[tokenId];
        return (
            tokenId,
            data.tier,
            data.meetupsAttended,
            data.meetupsHosted,
            data.kindnessScore,
            data.referralCount,
            data.mintedAt
        );
    }

    /**
     * @dev 주소가 Ambassador SBT를 보유하고 있는지 확인
     */
    function hasAmbassadorSBT(address account) external view returns (bool) {
        return addressToTokenId[account] != 0;
    }

    /**
     * @dev 주소의 현재 티어 조회
     */
    function getTierByAddress(address account) external view returns (AmbassadorTier) {
        uint256 tokenId = addressToTokenId[account];
        if (tokenId == 0) return AmbassadorTier.None;
        return ambassadorData[tokenId].tier;
    }

    /**
     * @dev 추천인 목록 조회
     */
    function getReferrals(address account) external view returns (address[] memory) {
        return referrals[account];
    }

    /**
     * @dev 티어 문자열 반환
     */
    function getTierName(AmbassadorTier tier) public pure returns (string memory) {
        if (tier == AmbassadorTier.Friend) return "Friend";
        if (tier == AmbassadorTier.Host) return "Host";
        if (tier == AmbassadorTier.Ambassador) return "Ambassador";
        if (tier == AmbassadorTier.Guardian) return "Guardian";
        return "None";
    }

    /**
     * @dev 다음 티어 달성 조건 조회
     */
    function getNextTierRequirements(address account) external view returns (
        AmbassadorTier nextTier,
        uint256 meetupsNeeded,
        uint256 hostingsNeeded,
        uint256 scoreNeeded,
        uint256 referralsNeeded
    ) {
        uint256 tokenId = addressToTokenId[account];
        if (tokenId == 0) {
            return (AmbassadorTier.Friend, 1, 0, 0, 0);
        }

        AmbassadorData memory data = ambassadorData[tokenId];

        if (data.tier == AmbassadorTier.Friend) {
            return (
                AmbassadorTier.Host,
                0,
                HOST_MEETUPS > data.meetupsHosted ? HOST_MEETUPS - data.meetupsHosted : 0,
                AMBASSADOR_SCORE > data.kindnessScore ? AMBASSADOR_SCORE - data.kindnessScore : 0,
                0
            );
        }

        if (data.tier == AmbassadorTier.Host) {
            return (
                AmbassadorTier.Ambassador,
                0,
                0,
                AMBASSADOR_SCORE > data.kindnessScore ? AMBASSADOR_SCORE - data.kindnessScore : 0,
                0
            );
        }

        if (data.tier == AmbassadorTier.Ambassador) {
            return (
                AmbassadorTier.Guardian,
                0,
                0,
                GUARDIAN_SCORE > data.kindnessScore ? GUARDIAN_SCORE - data.kindnessScore : 0,
                GUARDIAN_REFERRALS > data.referralCount ? GUARDIAN_REFERRALS - data.referralCount : 0
            );
        }

        // Already Guardian
        return (AmbassadorTier.Guardian, 0, 0, 0, 0);
    }

    // ============ Admin Functions ============

    function setBaseURI(string memory _newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _newBaseURI;
    }

    /**
     * @dev 수동 티어 설정 (관리자용, 예외 상황)
     */
    function setTier(address account, AmbassadorTier newTier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 tokenId = addressToTokenId[account];
        if (tokenId == 0) revert NoAmbassadorSBTFound();

        AmbassadorData storage data = ambassadorData[tokenId];
        AmbassadorTier oldTier = data.tier;
        data.tier = newTier;
        data.lastUpdated = block.timestamp;

        _setTokenURI(tokenId, _getTierURI(newTier));
        emit TierUpgraded(account, tokenId, oldTier, newTier);
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
