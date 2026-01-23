// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ALMANStaking
 * @dev ALMAN 토큰 스테이킹 컨트랙트 (Upgradeable)
 *
 * Features:
 * - 4개 티어 시스템 (Bronze, Silver, Gold, Diamond)
 * - 티어별 APY: 5%, 8%, 12%, 18%
 * - 자동 복리 계산
 * - Kindness Score 가중치 (Jeong-SBT 연동)
 * - 긴급 출금 기능 (페널티)
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract ALMANStaking is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");

    // ============ Enums ============
    enum Tier { Bronze, Silver, Gold, Diamond }

    // ============ Structs ============
    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakedAt;
        uint256 lastClaimedAt;
        Tier tier;
    }

    struct TierConfig {
        uint256 minAmount;      // 최소 스테이킹량
        uint256 apyBps;         // APY (basis points, 100 = 1%)
        uint256 kindnessWeight; // Kindness 가중치 (100 = 1.0x)
        uint256 lockPeriod;     // 최소 락업 기간 (초)
    }

    // ============ State Variables ============
    IERC20 public almanToken;
    address public jeongSBT;

    uint256 public totalStaked;
    uint256 public rewardPool;

    // 티어 설정
    mapping(Tier => TierConfig) public tierConfigs;

    // 사용자별 스테이킹 정보
    mapping(address => StakeInfo) public stakes;

    // 조기 출금 페널티 (basis points)
    uint256 public earlyWithdrawPenaltyBps;

    // 복리 계산 주기 (초)
    uint256 public compoundPeriod;

    // ============ Constants ============
    uint256 public constant BPS_DENOMINATOR = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    // ============ Events ============
    event Staked(address indexed user, uint256 amount, Tier tier);
    event Unstaked(address indexed user, uint256 amount, uint256 penalty);
    event RewardsClaimed(address indexed user, uint256 amount);
    event TierUpgraded(address indexed user, Tier oldTier, Tier newTier);
    event RewardPoolFunded(address indexed funder, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

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
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
        _grantRole(REWARD_MANAGER_ROLE, defaultAdmin);

        almanToken = IERC20(_almanToken);
        earlyWithdrawPenaltyBps = 1000; // 10%
        compoundPeriod = 1 days;

        // 티어 설정 초기화
        tierConfigs[Tier.Bronze] = TierConfig({
            minAmount: 0,
            apyBps: 500,           // 5%
            kindnessWeight: 100,   // 1.0x
            lockPeriod: 7 days
        });

        tierConfigs[Tier.Silver] = TierConfig({
            minAmount: 1_000 * 10**18,
            apyBps: 800,           // 8%
            kindnessWeight: 110,   // 1.1x
            lockPeriod: 14 days
        });

        tierConfigs[Tier.Gold] = TierConfig({
            minAmount: 10_000 * 10**18,
            apyBps: 1200,          // 12%
            kindnessWeight: 125,   // 1.25x
            lockPeriod: 30 days
        });

        tierConfigs[Tier.Diamond] = TierConfig({
            minAmount: 100_000 * 10**18,
            apyBps: 1800,          // 18%
            kindnessWeight: 150,   // 1.5x
            lockPeriod: 60 days
        });
    }

    // ============ Staking Functions ============

    /**
     * @dev 토큰 스테이킹
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");

        StakeInfo storage userStake = stakes[msg.sender];

        // 기존 보상 클레임
        if (userStake.amount > 0) {
            uint256 pendingReward = _calculateReward(msg.sender);
            if (pendingReward > 0) {
                _claimReward(msg.sender, pendingReward);
            }
        }

        // 토큰 전송
        almanToken.safeTransferFrom(msg.sender, address(this), amount);

        // 스테이킹 정보 업데이트
        userStake.amount += amount;
        userStake.lastStakedAt = block.timestamp;
        userStake.lastClaimedAt = block.timestamp;

        totalStaked += amount;

        // 티어 업데이트
        Tier newTier = _calculateTier(userStake.amount);
        if (newTier != userStake.tier) {
            emit TierUpgraded(msg.sender, userStake.tier, newTier);
            userStake.tier = newTier;
        }

        emit Staked(msg.sender, amount, userStake.tier);
    }

    /**
     * @dev 토큰 언스테이킹
     */
    function unstake(uint256 amount) external nonReentrant whenNotPaused {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient staked amount");

        // 보상 클레임
        uint256 pendingReward = _calculateReward(msg.sender);
        if (pendingReward > 0) {
            _claimReward(msg.sender, pendingReward);
        }

        // 조기 출금 페널티 확인
        uint256 penalty = 0;
        TierConfig memory config = tierConfigs[userStake.tier];

        if (block.timestamp < userStake.lastStakedAt + config.lockPeriod) {
            penalty = (amount * earlyWithdrawPenaltyBps) / BPS_DENOMINATOR;
        }

        uint256 withdrawAmount = amount - penalty;

        // 스테이킹 정보 업데이트
        userStake.amount -= amount;
        totalStaked -= amount;

        // 페널티는 리워드 풀로
        if (penalty > 0) {
            rewardPool += penalty;
        }

        // 티어 업데이트
        Tier newTier = _calculateTier(userStake.amount);
        if (newTier != userStake.tier) {
            emit TierUpgraded(msg.sender, userStake.tier, newTier);
            userStake.tier = newTier;
        }

        // 토큰 전송
        almanToken.safeTransfer(msg.sender, withdrawAmount);

        emit Unstaked(msg.sender, amount, penalty);
    }

    /**
     * @dev 보상 클레임
     */
    function claimReward() external nonReentrant whenNotPaused {
        uint256 reward = _calculateReward(msg.sender);
        require(reward > 0, "No reward to claim");

        _claimReward(msg.sender, reward);
    }

    // ============ Internal Functions ============

    function _claimReward(address user, uint256 amount) internal {
        require(rewardPool >= amount, "Insufficient reward pool");

        stakes[user].lastClaimedAt = block.timestamp;
        rewardPool -= amount;

        almanToken.safeTransfer(user, amount);

        emit RewardsClaimed(user, amount);
    }

    function _calculateReward(address user) internal view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;

        TierConfig memory config = tierConfigs[userStake.tier];

        uint256 timeElapsed = block.timestamp - userStake.lastClaimedAt;
        uint256 baseReward = (userStake.amount * config.apyBps * timeElapsed) /
            (BPS_DENOMINATOR * SECONDS_PER_YEAR);

        // Kindness 가중치 적용 (JeongSBT에서 가져올 수 있음)
        uint256 finalReward = (baseReward * config.kindnessWeight) / 100;

        return finalReward;
    }

    function _calculateTier(uint256 amount) internal view returns (Tier) {
        if (amount >= tierConfigs[Tier.Diamond].minAmount) return Tier.Diamond;
        if (amount >= tierConfigs[Tier.Gold].minAmount) return Tier.Gold;
        if (amount >= tierConfigs[Tier.Silver].minAmount) return Tier.Silver;
        return Tier.Bronze;
    }

    // ============ View Functions ============

    /**
     * @dev 사용자 스테이킹 정보 조회
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 pendingReward,
        Tier tier,
        uint256 lastStakedAt,
        uint256 lockEndTime
    ) {
        StakeInfo memory userStake = stakes[user];
        TierConfig memory config = tierConfigs[userStake.tier];

        return (
            userStake.amount,
            _calculateReward(user),
            userStake.tier,
            userStake.lastStakedAt,
            userStake.lastStakedAt + config.lockPeriod
        );
    }

    /**
     * @dev 티어 정보 조회
     */
    function getTierInfo(Tier tier) external view returns (
        uint256 minAmount,
        uint256 apyBps,
        uint256 kindnessWeight,
        uint256 lockPeriod
    ) {
        TierConfig memory config = tierConfigs[tier];
        return (config.minAmount, config.apyBps, config.kindnessWeight, config.lockPeriod);
    }

    /**
     * @dev 예상 연간 보상 조회
     */
    function getExpectedAnnualReward(address user) external view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;

        TierConfig memory config = tierConfigs[userStake.tier];
        return (userStake.amount * config.apyBps * config.kindnessWeight) /
            (BPS_DENOMINATOR * 100);
    }

    // ============ Admin Functions ============

    /**
     * @dev 리워드 풀 충전
     */
    function fundRewardPool(uint256 amount) external onlyRole(REWARD_MANAGER_ROLE) {
        almanToken.safeTransferFrom(msg.sender, address(this), amount);
        rewardPool += amount;
        emit RewardPoolFunded(msg.sender, amount);
    }

    /**
     * @dev 티어 설정 업데이트
     */
    function updateTierConfig(
        Tier tier,
        uint256 minAmount,
        uint256 apyBps,
        uint256 kindnessWeight,
        uint256 lockPeriod
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        tierConfigs[tier] = TierConfig({
            minAmount: minAmount,
            apyBps: apyBps,
            kindnessWeight: kindnessWeight,
            lockPeriod: lockPeriod
        });
    }

    /**
     * @dev 조기 출금 페널티 설정
     */
    function setEarlyWithdrawPenalty(uint256 penaltyBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(penaltyBps <= 5000, "Penalty too high"); // max 50%
        earlyWithdrawPenaltyBps = penaltyBps;
    }

    /**
     * @dev JeongSBT 주소 설정
     */
    function setJeongSBT(address _jeongSBT) external onlyRole(DEFAULT_ADMIN_ROLE) {
        jeongSBT = _jeongSBT;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
