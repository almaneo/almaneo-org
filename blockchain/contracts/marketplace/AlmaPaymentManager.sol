// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AlmaPaymentManager
 * @dev Multi-token payment management for AlmaNEO marketplace
 *
 * Features:
 * - Multi-token support: POL (native), USDC, ALMAN token
 * - Platform fee management
 * - Jeong-SBT discount integration
 * - Gasless transactions (ERC-2771)
 * - Fee distribution to platform wallet
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract AlmaPaymentManager is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    ERC2771ContextUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");

    // ============ Structs ============
    struct PaymentToken {
        bool isActive;
        uint256 minAmount;
        uint8 decimals;
        string symbol;
    }

    struct FeeConfig {
        uint256 platformFeeBps;     // Platform fee (basis points, 10000 = 100%)
        uint256 maxPlatformFeeBps;  // Max platform fee cap
        address platformWallet;     // Platform fee recipient
    }

    // ============ State Variables ============
    FeeConfig public feeConfig;

    // Jeong-SBT contract for discount
    address public jeongSBT;

    // ALMAN Token address (for token payments and discounts)
    address public almanToken;

    // Payment token address => PaymentToken config
    mapping(address => PaymentToken) public paymentTokens;

    // List of active payment tokens
    address[] public activeTokenList;

    // Native token identifier (address(0))
    address public constant NATIVE_TOKEN = address(0);

    // Discount tiers for Jeong-SBT holders (basis points)
    uint256 public constant SILVER_FEE_DISCOUNT = 1000;   // 10% fee reduction
    uint256 public constant GOLD_FEE_DISCOUNT = 2500;     // 25% fee reduction
    uint256 public constant DIAMOND_FEE_DISCOUNT = 5000;  // 50% fee reduction

    // ALMAN token payment discount
    uint256 public almanPaymentDiscountBps; // Extra discount when paying with ALMAN

    // ============ Events ============
    event PaymentProcessed(
        address indexed payer,
        address indexed recipient,
        address paymentToken,
        uint256 amount,
        uint256 platformFee,
        uint256 royaltyAmount
    );
    event PaymentTokenUpdated(address indexed token, bool isActive, uint256 minAmount);
    event FeeConfigUpdated(uint256 platformFeeBps, address platformWallet);
    event JeongSBTUpdated(address indexed newJeongSBT);
    event ALMANTokenUpdated(address indexed newNeosToken);
    event FeesWithdrawn(address indexed token, address indexed to, uint256 amount);

    // ============ Errors ============
    error InvalidPaymentToken();
    error InsufficientPayment();
    error TransferFailed();
    error InvalidFeeConfig();
    error ZeroAddress();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) {
        _disableInitializers();
    }

    /**
     * @dev Initialize the contract
     */
    function initialize(
        address defaultAdmin,
        address _platformWallet,
        uint256 _platformFeeBps,
        address _jeongSBT,
        address _almanToken
    ) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(OPERATOR_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
        _grantRole(FEE_MANAGER_ROLE, defaultAdmin);

        feeConfig = FeeConfig({
            platformFeeBps: _platformFeeBps,
            maxPlatformFeeBps: 1000, // Max 10%
            platformWallet: _platformWallet
        });

        jeongSBT = _jeongSBT;
        almanToken = _almanToken;
        almanPaymentDiscountBps = 500; // 5% extra discount when paying with ALMAN

        // Initialize native token (POL/MATIC)
        paymentTokens[NATIVE_TOKEN] = PaymentToken({
            isActive: true,
            minAmount: 0.001 ether,
            decimals: 18,
            symbol: "POL"
        });
        activeTokenList.push(NATIVE_TOKEN);
    }

    // ============ Payment Processing ============

    /**
     * @dev Process a payment with fee distribution
     * @param payer Address paying
     * @param recipient Address receiving (seller)
     * @param paymentToken Token address (address(0) for native)
     * @param amount Total payment amount
     * @param royaltyReceiver Royalty recipient address
     * @param royaltyBps Royalty in basis points
     * @return netAmount Amount after fees
     */
    function processPayment(
        address payer,
        address recipient,
        address paymentToken,
        uint256 amount,
        address royaltyReceiver,
        uint256 royaltyBps
    ) external payable nonReentrant whenNotPaused returns (uint256 netAmount) {
        // Verify caller is operator (marketplace contract)
        require(hasRole(OPERATOR_ROLE, _msgSender()), "Not operator");

        // Verify payment token
        if (!paymentTokens[paymentToken].isActive) revert InvalidPaymentToken();
        if (amount < paymentTokens[paymentToken].minAmount) revert InsufficientPayment();

        // Calculate fees with discounts
        (uint256 platformFee, uint256 royaltyAmount) = calculateFees(
            payer,
            paymentToken,
            amount,
            royaltyBps
        );

        netAmount = amount - platformFee - royaltyAmount;

        // Process payment based on token type
        if (paymentToken == NATIVE_TOKEN) {
            require(msg.value >= amount, "Insufficient native token");

            // Transfer platform fee
            if (platformFee > 0) {
                _transferNative(feeConfig.platformWallet, platformFee);
            }

            // Transfer royalty
            if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
                _transferNative(royaltyReceiver, royaltyAmount);
            }

            // Transfer net amount to seller
            _transferNative(recipient, netAmount);

            // Refund excess
            if (msg.value > amount) {
                _transferNative(payer, msg.value - amount);
            }
        } else {
            // ERC-20 payment
            IERC20 token = IERC20(paymentToken);

            // Transfer platform fee
            if (platformFee > 0) {
                token.safeTransferFrom(payer, feeConfig.platformWallet, platformFee);
            }

            // Transfer royalty
            if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
                token.safeTransferFrom(payer, royaltyReceiver, royaltyAmount);
            }

            // Transfer net amount to seller
            token.safeTransferFrom(payer, recipient, netAmount);
        }

        emit PaymentProcessed(payer, recipient, paymentToken, amount, platformFee, royaltyAmount);

        return netAmount;
    }

    /**
     * @dev Calculate fees with Jeong-SBT and NEOS discounts
     */
    function calculateFees(
        address payer,
        address paymentToken,
        uint256 amount,
        uint256 royaltyBps
    ) public view returns (uint256 platformFee, uint256 royaltyAmount) {
        // Base platform fee
        uint256 basePlatformFeeBps = feeConfig.platformFeeBps;

        // Apply Jeong-SBT discount to platform fee
        uint256 feeDiscount = _getJeongFeeDiscount(payer);
        uint256 discountedFeeBps = basePlatformFeeBps * (10000 - feeDiscount) / 10000;

        // Apply extra discount for NEOS token payments
        if (paymentToken == almanToken && almanPaymentDiscountBps > 0) {
            discountedFeeBps = discountedFeeBps * (10000 - almanPaymentDiscountBps) / 10000;
        }

        // Calculate final fees
        platformFee = amount * discountedFeeBps / 10000;
        royaltyAmount = amount * royaltyBps / 10000;

        return (platformFee, royaltyAmount);
    }

    /**
     * @dev Get the effective price after Jeong-SBT discount
     */
    function getEffectivePrice(
        address buyer,
        address paymentToken,
        uint256 price,
        uint256 royaltyBps
    ) external view returns (
        uint256 totalPrice,
        uint256 platformFee,
        uint256 royaltyAmount,
        uint256 savedAmount
    ) {
        (platformFee, royaltyAmount) = calculateFees(buyer, paymentToken, price, royaltyBps);
        totalPrice = price;

        // Calculate how much was saved compared to no discount
        uint256 basePlatformFee = price * feeConfig.platformFeeBps / 10000;
        savedAmount = basePlatformFee - platformFee;

        return (totalPrice, platformFee, royaltyAmount, savedAmount);
    }

    // ============ Internal Functions ============

    function _transferNative(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    function _getJeongFeeDiscount(address user) internal view returns (uint256) {
        if (jeongSBT == address(0)) return 0;

        try IJeongSBT(jeongSBT).getSoulByAddress(user) returns (
            uint256,
            uint256,
            IJeongSBT.Tier tier,
            uint256,
            uint256
        ) {
            if (tier == IJeongSBT.Tier.Diamond) return DIAMOND_FEE_DISCOUNT;
            if (tier == IJeongSBT.Tier.Gold) return GOLD_FEE_DISCOUNT;
            if (tier == IJeongSBT.Tier.Silver) return SILVER_FEE_DISCOUNT;
            return 0;
        } catch {
            return 0;
        }
    }

    // ============ Admin Functions ============

    /**
     * @dev Add or update a payment token
     */
    function setPaymentToken(
        address token,
        bool isActive,
        uint256 minAmount,
        uint8 decimals,
        string memory symbol
    ) external onlyRole(FEE_MANAGER_ROLE) {
        bool wasActive = paymentTokens[token].isActive;

        paymentTokens[token] = PaymentToken({
            isActive: isActive,
            minAmount: minAmount,
            decimals: decimals,
            symbol: symbol
        });

        // Update active token list
        if (isActive && !wasActive) {
            activeTokenList.push(token);
        } else if (!isActive && wasActive) {
            _removeFromActiveList(token);
        }

        emit PaymentTokenUpdated(token, isActive, minAmount);
    }

    function _removeFromActiveList(address token) internal {
        for (uint256 i = 0; i < activeTokenList.length; i++) {
            if (activeTokenList[i] == token) {
                activeTokenList[i] = activeTokenList[activeTokenList.length - 1];
                activeTokenList.pop();
                break;
            }
        }
    }

    function setFeeConfig(
        uint256 _platformFeeBps,
        address _platformWallet
    ) external onlyRole(FEE_MANAGER_ROLE) {
        if (_platformFeeBps > feeConfig.maxPlatformFeeBps) revert InvalidFeeConfig();
        if (_platformWallet == address(0)) revert ZeroAddress();

        feeConfig.platformFeeBps = _platformFeeBps;
        feeConfig.platformWallet = _platformWallet;

        emit FeeConfigUpdated(_platformFeeBps, _platformWallet);
    }

    function setNeosPaymentDiscount(uint256 _discountBps) external onlyRole(FEE_MANAGER_ROLE) {
        require(_discountBps <= 5000, "Max 50% discount");
        almanPaymentDiscountBps = _discountBps;
    }

    function setJeongSBT(address _jeongSBT) external onlyRole(DEFAULT_ADMIN_ROLE) {
        jeongSBT = _jeongSBT;
        emit JeongSBTUpdated(_jeongSBT);
    }

    function setNeosToken(address _almanToken) external onlyRole(DEFAULT_ADMIN_ROLE) {
        almanToken = _almanToken;
        emit ALMANTokenUpdated(_almanToken);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Emergency withdraw stuck funds
     */
    function emergencyWithdraw(address token, address to, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (token == NATIVE_TOKEN) {
            _transferNative(to, amount);
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
        emit FeesWithdrawn(token, to, amount);
    }

    // ============ View Functions ============

    function getActivePaymentTokens() external view returns (address[] memory) {
        return activeTokenList;
    }

    function isPaymentTokenActive(address token) external view returns (bool) {
        return paymentTokens[token].isActive;
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

    // Allow receiving native token
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
