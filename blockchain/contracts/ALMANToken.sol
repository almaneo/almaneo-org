// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title ALMANToken
 * @dev AlmaNEO Platform의 기본 거버넌스 토큰 (ERC-20 + Votes + Upgradeable)
 *
 * Features:
 * - 8,000,000,000 (8B) 총 공급량 - 8 billion humans
 * - ERC20Votes: 거버넌스 투표 지원
 * - ERC20Permit: 가스리스 승인
 * - Pausable: 긴급 정지 기능
 * - Burnable: 토큰 소각 가능
 * - UUPS Upgradeable: 업그레이드 가능
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract ALMANToken is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PausableUpgradeable,
    ERC20VotesUpgradeable,
    ERC20PermitUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    // ============ Roles ============
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // ============ Constants ============
    uint256 public constant TOTAL_SUPPLY = 8_000_000_000 * 10**18; // 8B tokens

    // ============ Token Distribution ============
    uint256 public constant COMMUNITY_ECOSYSTEM = 3_200_000_000 * 10**18;  // 40%
    uint256 public constant FOUNDATION_RESERVE = 2_000_000_000 * 10**18;   // 25%
    uint256 public constant LIQUIDITY_EXCHANGE = 1_200_000_000 * 10**18;   // 15%
    uint256 public constant TEAM_ADVISORS = 800_000_000 * 10**18;          // 10%
    uint256 public constant KINDNESS_GRANTS = 800_000_000 * 10**18;        // 10%

    // ============ State Variables ============
    uint256 public mintedAmount;
    mapping(string => uint256) public categoryMinted;

    // ============ Events ============
    event TokensMinted(address indexed to, uint256 amount, string category);
    event EmergencyPause(address indexed by);
    event EmergencyUnpause(address indexed by);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev 초기화 함수 (생성자 대신 사용)
     * @param defaultAdmin 관리자 주소
     * @param foundationWallet 재단 지갑 주소
     */
    function initialize(
        address defaultAdmin,
        address foundationWallet
    ) public initializer {
        __ERC20_init("AlmaNEO", "ALMAN");
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __ERC20Votes_init();
        __ERC20Permit_init("AlmaNEO");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);

        // 초기 발행: 재단 지갑에 Foundation Reserve (25%)
        _mintWithCategory(foundationWallet, FOUNDATION_RESERVE, "foundation");
    }

    // ============ Minting Functions ============

    /**
     * @dev 카테고리별 토큰 발행
     * @param to 수신자 주소
     * @param amount 발행량
     * @param category 카테고리 ("community", "liquidity", "team", "kindness")
     */
    function mintWithCategory(
        address to,
        uint256 amount,
        string calldata category
    ) external onlyRole(MINTER_ROLE) {
        _mintWithCategory(to, amount, category);
    }

    function _mintWithCategory(
        address to,
        uint256 amount,
        string memory category
    ) internal {
        require(mintedAmount + amount <= TOTAL_SUPPLY, "Exceeds total supply");

        // 카테고리별 한도 확인
        uint256 categoryLimit = _getCategoryLimit(category);
        require(
            categoryMinted[category] + amount <= categoryLimit,
            "Exceeds category limit"
        );

        categoryMinted[category] += amount;
        mintedAmount += amount;

        _mint(to, amount);
        emit TokensMinted(to, amount, category);
    }

    function _getCategoryLimit(string memory category) internal pure returns (uint256) {
        bytes32 catHash = keccak256(bytes(category));

        if (catHash == keccak256("community")) return COMMUNITY_ECOSYSTEM;
        if (catHash == keccak256("foundation")) return FOUNDATION_RESERVE;
        if (catHash == keccak256("liquidity")) return LIQUIDITY_EXCHANGE;
        if (catHash == keccak256("team")) return TEAM_ADVISORS;
        if (catHash == keccak256("kindness")) return KINDNESS_GRANTS;

        revert("Invalid category");
    }

    // ============ Pause Functions ============

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit EmergencyPause(msg.sender);
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit EmergencyUnpause(msg.sender);
    }

    // ============ View Functions ============

    /**
     * @dev 카테고리별 남은 발행 가능량 조회
     */
    function getRemainingMintable(string calldata category) external view returns (uint256) {
        uint256 limit = _getCategoryLimit(category);
        return limit - categoryMinted[category];
    }

    /**
     * @dev 전체 남은 발행 가능량 조회
     */
    function getTotalRemainingMintable() external view returns (uint256) {
        return TOTAL_SUPPLY - mintedAmount;
    }

    // ============ Overrides ============

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    // Required overrides for multiple inheritance
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable, ERC20VotesUpgradeable)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20PermitUpgradeable, NoncesUpgradeable)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
