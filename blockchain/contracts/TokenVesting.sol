// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title TokenVesting
 * @dev ALMAN 토큰 베스팅 컨트랙트 (Team & Advisors 락업)
 *
 * Features:
 * - 수혜자별 개별 베스팅 스케줄
 * - Cliff 기간 지원 (12개월)
 * - 선형 베스팅 (3년)
 * - 관리자가 수혜자 추가/취소 가능
 * - UUPS Upgradeable
 *
 * @custom:security-contact security@almaneo.org
 */
contract TokenVesting is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant VESTING_ADMIN_ROLE = keccak256("VESTING_ADMIN_ROLE");

    // ============ Structs ============
    struct VestingSchedule {
        uint256 totalAmount;       // 총 베스팅 토큰량
        uint256 releasedAmount;    // 이미 인출된 토큰량
        uint256 startTime;         // 베스팅 시작 시간
        uint256 cliffDuration;     // Cliff 기간 (초)
        uint256 vestingDuration;   // 총 베스팅 기간 (초, cliff 포함)
        bool revoked;              // 취소 여부
    }

    // ============ State Variables ============
    IERC20 public token;

    mapping(address => VestingSchedule) public vestingSchedules;
    address[] public beneficiaries;

    uint256 public totalAllocated;
    uint256 public totalReleased;

    // ============ Events ============
    event VestingScheduleCreated(
        address indexed beneficiary,
        uint256 totalAmount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration
    );
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 refundedAmount);

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
        _grantRole(VESTING_ADMIN_ROLE, defaultAdmin);

        token = IERC20(tokenAddress);
    }

    // ============ Admin Functions ============

    /**
     * @dev 베스팅 스케줄 생성
     * @param beneficiary 수혜자 주소
     * @param totalAmount 총 베스팅 토큰량
     * @param startTime 베스팅 시작 시간 (0이면 현재 시간)
     * @param cliffDuration Cliff 기간 (초)
     * @param vestingDuration 총 베스팅 기간 (초, cliff 포함)
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 totalAmount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration
    ) external onlyRole(VESTING_ADMIN_ROLE) {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(totalAmount > 0, "Amount must be > 0");
        require(vestingDuration > 0, "Duration must be > 0");
        require(cliffDuration <= vestingDuration, "Cliff > duration");
        require(vestingSchedules[beneficiary].totalAmount == 0, "Schedule already exists");

        uint256 _startTime = startTime == 0 ? block.timestamp : startTime;

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: totalAmount,
            releasedAmount: 0,
            startTime: _startTime,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            revoked: false
        });

        beneficiaries.push(beneficiary);
        totalAllocated += totalAmount;

        emit VestingScheduleCreated(
            beneficiary,
            totalAmount,
            _startTime,
            cliffDuration,
            vestingDuration
        );
    }

    /**
     * @dev 베스팅 취소 (미해제 토큰 회수)
     * @param beneficiary 수혜자 주소
     */
    function revokeVesting(address beneficiary) external onlyRole(VESTING_ADMIN_ROLE) {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "No schedule");
        require(!schedule.revoked, "Already revoked");

        uint256 vested = _vestedAmount(schedule);
        uint256 unreleased = vested - schedule.releasedAmount;

        // 아직 해제 가능한 토큰이 있으면 먼저 지급
        if (unreleased > 0) {
            schedule.releasedAmount += unreleased;
            totalReleased += unreleased;
            token.safeTransfer(beneficiary, unreleased);
            emit TokensReleased(beneficiary, unreleased);
        }

        // 미귀속 토큰 회수
        uint256 refunded = schedule.totalAmount - vested;
        schedule.revoked = true;
        totalAllocated -= refunded;

        if (refunded > 0) {
            token.safeTransfer(msg.sender, refunded);
        }

        emit VestingRevoked(beneficiary, refunded);
    }

    // ============ Beneficiary Functions ============

    /**
     * @dev 해제된 토큰 인출
     */
    function release() external nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.totalAmount > 0, "No schedule");
        require(!schedule.revoked, "Vesting revoked");

        uint256 releasable = releasableAmount(msg.sender);
        require(releasable > 0, "Nothing to release");

        schedule.releasedAmount += releasable;
        totalReleased += releasable;

        token.safeTransfer(msg.sender, releasable);
        emit TokensReleased(msg.sender, releasable);
    }

    // ============ View Functions ============

    /**
     * @dev 현재 귀속된 총 토큰량 (시간 경과에 따라 증가)
     */
    function vestedAmount(address beneficiary) external view returns (uint256) {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        if (schedule.totalAmount == 0) return 0;
        return _vestedAmount(schedule);
    }

    /**
     * @dev 현재 인출 가능한 토큰량
     */
    function releasableAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        if (schedule.totalAmount == 0 || schedule.revoked) return 0;
        return _vestedAmount(schedule) - schedule.releasedAmount;
    }

    /**
     * @dev 베스팅 진행률 (0-10000, basis points)
     */
    function vestingProgress(address beneficiary) external view returns (uint256) {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        if (schedule.totalAmount == 0) return 0;
        return (_vestedAmount(schedule) * 10000) / schedule.totalAmount;
    }

    /**
     * @dev 수혜자 목록 조회
     */
    function getBeneficiaryCount() external view returns (uint256) {
        return beneficiaries.length;
    }

    /**
     * @dev 컨트랙트에 보관된 토큰 잔액
     */
    function getContractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // ============ Internal Functions ============

    function _vestedAmount(VestingSchedule storage schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            // Cliff 기간 내: 0
            return 0;
        } else if (block.timestamp >= schedule.startTime + schedule.vestingDuration) {
            // 베스팅 완료: 전액
            return schedule.totalAmount;
        } else {
            // 선형 베스팅: (경과시간 / 총기간) * 총량
            uint256 elapsed = block.timestamp - schedule.startTime;
            return (schedule.totalAmount * elapsed) / schedule.vestingDuration;
        }
    }

    // ============ UUPS ============

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
