// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title KindnessAirdrop
 * @dev Kindness 활동 기반 에어드롭 컨트랙트 (Upgradeable)
 *
 * Features:
 * - 작업 기반 에어드롭 (Kindness 활동)
 * - Merkle Proof 검증 (대량 배포용)
 * - 개별 클레임 한도 설정
 * - 일일 클레임 한도
 * - 업그레이드 가능
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract KindnessAirdrop is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant AIRDROP_MANAGER_ROLE = keccak256("AIRDROP_MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // ============ Structs ============
    struct AirdropCampaign {
        bytes32 merkleRoot;
        uint256 totalAmount;
        uint256 claimedAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 maxClaimPerUser;
        bool active;
        string description;
    }

    struct UserClaimInfo {
        uint256 totalClaimed;
        uint256 lastClaimTime;
        uint256 dailyClaimed;
    }

    // ============ State Variables ============
    IERC20 public almanToken;

    // 캠페인 ID => 캠페인 정보
    mapping(uint256 => AirdropCampaign) public campaigns;
    uint256 public campaignCount;

    // 캠페인 ID => 사용자 주소 => 클레임 여부
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    // 사용자 주소 => 클레임 정보
    mapping(address => UserClaimInfo) public userClaimInfo;

    // 일일 클레임 한도 (전체)
    uint256 public dailyClaimLimit;
    uint256 public todayClaimed;
    uint256 public lastResetDay;

    // 개인 일일 클레임 한도
    uint256 public userDailyClaimLimit;

    // ============ Events ============
    event CampaignCreated(uint256 indexed campaignId, uint256 totalAmount, string description);
    event CampaignUpdated(uint256 indexed campaignId, bytes32 newMerkleRoot);
    event TokensClaimed(uint256 indexed campaignId, address indexed user, uint256 amount);
    event DirectAirdrop(address indexed to, uint256 amount, string reason);
    event CampaignDeactivated(uint256 indexed campaignId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev 초기화 함수
     */
    function initialize(
        address defaultAdmin,
        address _almanToken
    ) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(AIRDROP_MANAGER_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);

        almanToken = IERC20(_almanToken);
        dailyClaimLimit = 10_000_000 * 10**18;  // 1천만 ALMAN/일
        userDailyClaimLimit = 10_000 * 10**18;  // 1만 ALMAN/인/일
        lastResetDay = block.timestamp / 1 days;
    }

    // ============ Campaign Management ============

    /**
     * @dev 새 에어드롭 캠페인 생성
     */
    function createCampaign(
        bytes32 merkleRoot,
        uint256 totalAmount,
        uint256 startTime,
        uint256 endTime,
        uint256 maxClaimPerUser,
        string calldata description
    ) external onlyRole(AIRDROP_MANAGER_ROLE) returns (uint256) {
        require(startTime < endTime, "Invalid time range");
        require(totalAmount > 0, "Amount must be > 0");

        campaignCount++;
        uint256 campaignId = campaignCount;

        campaigns[campaignId] = AirdropCampaign({
            merkleRoot: merkleRoot,
            totalAmount: totalAmount,
            claimedAmount: 0,
            startTime: startTime,
            endTime: endTime,
            maxClaimPerUser: maxClaimPerUser,
            active: true,
            description: description
        });

        emit CampaignCreated(campaignId, totalAmount, description);
        return campaignId;
    }

    /**
     * @dev 캠페인 Merkle Root 업데이트
     */
    function updateCampaignMerkleRoot(
        uint256 campaignId,
        bytes32 newMerkleRoot
    ) external onlyRole(AIRDROP_MANAGER_ROLE) {
        require(campaigns[campaignId].active, "Campaign not active");
        campaigns[campaignId].merkleRoot = newMerkleRoot;
        emit CampaignUpdated(campaignId, newMerkleRoot);
    }

    /**
     * @dev 캠페인 비활성화
     */
    function deactivateCampaign(uint256 campaignId) external onlyRole(AIRDROP_MANAGER_ROLE) {
        campaigns[campaignId].active = false;
        emit CampaignDeactivated(campaignId);
    }

    // ============ Claim Functions ============

    /**
     * @dev Merkle Proof로 에어드롭 클레임
     */
    function claim(
        uint256 campaignId,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external nonReentrant whenNotPaused {
        _checkDailyReset();

        AirdropCampaign storage campaign = campaigns[campaignId];

        require(campaign.active, "Campaign not active");
        require(block.timestamp >= campaign.startTime, "Campaign not started");
        require(block.timestamp <= campaign.endTime, "Campaign ended");
        require(!hasClaimed[campaignId][msg.sender], "Already claimed");
        require(amount <= campaign.maxClaimPerUser, "Exceeds max claim");
        require(campaign.claimedAmount + amount <= campaign.totalAmount, "Campaign depleted");

        // 일일 한도 확인
        require(todayClaimed + amount <= dailyClaimLimit, "Daily limit reached");

        UserClaimInfo storage userInfo = userClaimInfo[msg.sender];
        uint256 currentDay = block.timestamp / 1 days;

        if (userInfo.lastClaimTime / 1 days < currentDay) {
            userInfo.dailyClaimed = 0;
        }
        require(userInfo.dailyClaimed + amount <= userDailyClaimLimit, "User daily limit reached");

        // Merkle Proof 검증
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, amount))));
        require(MerkleProof.verify(merkleProof, campaign.merkleRoot, leaf), "Invalid proof");

        // 상태 업데이트
        hasClaimed[campaignId][msg.sender] = true;
        campaign.claimedAmount += amount;
        todayClaimed += amount;

        userInfo.totalClaimed += amount;
        userInfo.lastClaimTime = block.timestamp;
        userInfo.dailyClaimed += amount;

        // 토큰 전송
        almanToken.safeTransfer(msg.sender, amount);

        emit TokensClaimed(campaignId, msg.sender, amount);
    }

    /**
     * @dev 직접 에어드롭 (관리자용)
     */
    function directAirdrop(
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyRole(AIRDROP_MANAGER_ROLE) nonReentrant {
        _checkDailyReset();
        require(todayClaimed + amount <= dailyClaimLimit, "Daily limit reached");

        todayClaimed += amount;

        UserClaimInfo storage userInfo = userClaimInfo[to];
        userInfo.totalClaimed += amount;
        userInfo.lastClaimTime = block.timestamp;

        almanToken.safeTransfer(to, amount);

        emit DirectAirdrop(to, amount, reason);
    }

    /**
     * @dev 대량 에어드롭 (관리자용)
     */
    function batchAirdrop(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string calldata reason
    ) external onlyRole(AIRDROP_MANAGER_ROLE) nonReentrant {
        require(recipients.length == amounts.length, "Length mismatch");

        _checkDailyReset();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        require(todayClaimed + totalAmount <= dailyClaimLimit, "Daily limit reached");
        todayClaimed += totalAmount;

        for (uint256 i = 0; i < recipients.length; i++) {
            UserClaimInfo storage userInfo = userClaimInfo[recipients[i]];
            userInfo.totalClaimed += amounts[i];
            userInfo.lastClaimTime = block.timestamp;

            almanToken.safeTransfer(recipients[i], amounts[i]);
            emit DirectAirdrop(recipients[i], amounts[i], reason);
        }
    }

    // ============ Internal Functions ============

    function _checkDailyReset() internal {
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > lastResetDay) {
            todayClaimed = 0;
            lastResetDay = currentDay;
        }
    }

    // ============ View Functions ============

    /**
     * @dev 캠페인 정보 조회
     */
    function getCampaignInfo(uint256 campaignId) external view returns (
        bytes32 merkleRoot,
        uint256 totalAmount,
        uint256 claimedAmount,
        uint256 startTime,
        uint256 endTime,
        uint256 maxClaimPerUser,
        bool active,
        string memory description
    ) {
        AirdropCampaign memory campaign = campaigns[campaignId];
        return (
            campaign.merkleRoot,
            campaign.totalAmount,
            campaign.claimedAmount,
            campaign.startTime,
            campaign.endTime,
            campaign.maxClaimPerUser,
            campaign.active,
            campaign.description
        );
    }

    /**
     * @dev 사용자 클레임 정보 조회
     */
    function getUserInfo(address user) external view returns (
        uint256 totalClaimed,
        uint256 lastClaimTime,
        uint256 dailyClaimed,
        uint256 remainingDailyLimit
    ) {
        UserClaimInfo memory info = userClaimInfo[user];
        uint256 currentDay = block.timestamp / 1 days;

        uint256 todaysClaimed = info.dailyClaimed;
        if (info.lastClaimTime / 1 days < currentDay) {
            todaysClaimed = 0;
        }

        uint256 remaining = userDailyClaimLimit > todaysClaimed ?
            userDailyClaimLimit - todaysClaimed : 0;

        return (info.totalClaimed, info.lastClaimTime, todaysClaimed, remaining);
    }

    /**
     * @dev 오늘 남은 전체 클레임 가능량 조회
     */
    function getRemainingDailyLimit() external view returns (uint256) {
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > lastResetDay) {
            return dailyClaimLimit;
        }
        return dailyClaimLimit > todayClaimed ? dailyClaimLimit - todayClaimed : 0;
    }

    // ============ Admin Functions ============

    function setDailyClaimLimit(uint256 limit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        dailyClaimLimit = limit;
    }

    function setUserDailyClaimLimit(uint256 limit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        userDailyClaimLimit = limit;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev 잔여 토큰 회수 (긴급용)
     */
    function withdrawTokens(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        almanToken.safeTransfer(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
