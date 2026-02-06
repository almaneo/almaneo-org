// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MiningPool
 * @dev ALMAN 게임 마이닝 풀 컨트랙트
 *
 * Features:
 * - 800M ALMAN 토큰 보관
 * - 서버 백엔드가 CLAIMER_ROLE로 사용자에게 토큰 전송
 * - 4단계 반감기 에포크 추적
 * - 일일 클레임 한도 설정
 * - 온체인 투명성 (잔액, 소진율 조회)
 * - UUPS Upgradeable
 *
 * @custom:security-contact security@almaneo.org
 */
contract MiningPool is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant CLAIMER_ROLE = keccak256("CLAIMER_ROLE");

    // ============ Constants ============
    uint256 public constant MINING_POOL_TOTAL = 800_000_000 * 10**18; // 800M ALMAN

    // 반감기 에포크 경계값 (누적 클레임 기준)
    uint256 public constant EPOCH_1_END = 200_000_000 * 10**18;  // 0 ~ 200M
    uint256 public constant EPOCH_2_END = 400_000_000 * 10**18;  // 200M ~ 400M
    uint256 public constant EPOCH_3_END = 600_000_000 * 10**18;  // 400M ~ 600M
    uint256 public constant EPOCH_4_END = 800_000_000 * 10**18;  // 600M ~ 800M

    // ============ State Variables ============
    IERC20 public token;

    uint256 public totalClaimed;                          // 총 클레임된 토큰
    uint256 public dailyClaimLimit;                       // 일일 클레임 한도 (전체)
    uint256 public userDailyClaimLimit;                   // 사용자별 일일 클레임 한도

    mapping(address => uint256) public userTotalClaimed;  // 사용자별 총 클레임
    mapping(address => uint256) public userDailyClaimed;  // 사용자별 일일 클레임
    mapping(address => uint256) public userLastClaimDay;  // 사용자별 마지막 클레임 날짜

    uint256 public dailyTotalClaimed;                     // 오늘의 총 클레임
    uint256 public currentClaimDay;                       // 현재 날짜 (일 단위)

    // ============ Events ============
    event TokensClaimed(address indexed user, uint256 amount, uint256 epoch);
    event DailyLimitUpdated(uint256 dailyLimit, uint256 userDailyLimit);
    event EmergencyWithdraw(address indexed to, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev 초기화 함수
     * @param defaultAdmin 관리자 주소
     * @param tokenAddress ALMAN 토큰 주소
     */
    function initialize(
        address defaultAdmin,
        address tokenAddress
    ) public initializer {
        require(tokenAddress != address(0), "Invalid token address");

        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
        _grantRole(CLAIMER_ROLE, defaultAdmin);

        token = IERC20(tokenAddress);

        // 기본 일일 한도: 전체 500K, 사용자별 1K
        dailyClaimLimit = 500_000 * 10**18;
        userDailyClaimLimit = 1_000 * 10**18;
        currentClaimDay = block.timestamp / 1 days;
    }

    // ============ Claim Functions ============

    /**
     * @dev 사용자에게 마이닝 보상 토큰 전송 (백엔드 서버 호출)
     * @param user 수신자 주소
     * @param amount 클레임 토큰량
     */
    function claimForUser(
        address user,
        uint256 amount
    ) external onlyRole(CLAIMER_ROLE) nonReentrant {
        require(user != address(0), "Invalid user");
        require(amount > 0, "Amount must be > 0");
        require(totalClaimed + amount <= MINING_POOL_TOTAL, "Exceeds mining pool");

        // 날짜 리셋 확인
        _checkDayReset();

        // 일일 한도 확인
        require(dailyTotalClaimed + amount <= dailyClaimLimit, "Exceeds daily limit");
        require(
            userDailyClaimed[user] + amount <= userDailyClaimLimit,
            "Exceeds user daily limit"
        );

        // 상태 업데이트
        totalClaimed += amount;
        userTotalClaimed[user] += amount;
        dailyTotalClaimed += amount;
        userDailyClaimed[user] += amount;
        userLastClaimDay[user] = currentClaimDay;

        // 토큰 전송
        token.safeTransfer(user, amount);

        emit TokensClaimed(user, amount, getCurrentEpoch());
    }

    // ============ Admin Functions ============

    /**
     * @dev 일일 클레임 한도 수정
     */
    function setDailyLimits(
        uint256 _dailyLimit,
        uint256 _userDailyLimit
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        dailyClaimLimit = _dailyLimit;
        userDailyClaimLimit = _userDailyLimit;
        emit DailyLimitUpdated(_dailyLimit, _userDailyLimit);
    }

    /**
     * @dev 긴급 출금 (미사용 토큰 회수)
     */
    function emergencyWithdraw(
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != address(0), "Invalid address");
        token.safeTransfer(to, amount);
        emit EmergencyWithdraw(to, amount);
    }

    // ============ View Functions ============

    /**
     * @dev 현재 반감기 에포크 (1~4, 0=마이닝 완료)
     */
    function getCurrentEpoch() public view returns (uint256) {
        if (totalClaimed < EPOCH_1_END) return 1;
        if (totalClaimed < EPOCH_2_END) return 2;
        if (totalClaimed < EPOCH_3_END) return 3;
        if (totalClaimed < EPOCH_4_END) return 4;
        return 0; // 마이닝 완료
    }

    /**
     * @dev 남은 마이닝 풀 잔액
     */
    function remainingPool() external view returns (uint256) {
        return MINING_POOL_TOTAL - totalClaimed;
    }

    /**
     * @dev 마이닝 진행률 (0-10000, basis points)
     */
    function miningProgress() external view returns (uint256) {
        return (totalClaimed * 10000) / MINING_POOL_TOTAL;
    }

    /**
     * @dev 사용자의 오늘 남은 클레임 가능량
     */
    function getUserDailyRemaining(address user) external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        if (userLastClaimDay[user] < today) {
            return userDailyClaimLimit;
        }
        if (userDailyClaimed[user] >= userDailyClaimLimit) return 0;
        return userDailyClaimLimit - userDailyClaimed[user];
    }

    /**
     * @dev 오늘 전체 남은 클레임 가능량
     */
    function getDailyRemaining() external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        if (currentClaimDay < today) {
            return dailyClaimLimit;
        }
        if (dailyTotalClaimed >= dailyClaimLimit) return 0;
        return dailyClaimLimit - dailyTotalClaimed;
    }

    /**
     * @dev 컨트랙트에 보관된 실제 토큰 잔액
     */
    function getContractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // ============ Internal Functions ============

    /**
     * @dev 날짜 변경 시 일일 카운터 리셋
     */
    function _checkDayReset() internal {
        uint256 today = block.timestamp / 1 days;
        if (currentClaimDay < today) {
            currentClaimDay = today;
            dailyTotalClaimed = 0;
        }
    }

    // ============ UUPS ============

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
