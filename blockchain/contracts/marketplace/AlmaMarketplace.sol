// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title AlmaMarketplace
 * @dev NFT Marketplace for AlmaNEO platform with gasless transactions
 *
 * Features:
 * - Fixed price listings (ERC-721 & ERC-1155)
 * - English auctions
 * - NFT Rental (ERC-4907 & ERC-5006)
 * - Multi-token payments (POL, USDC, ALMAN)
 * - Gasless transactions via ERC-2771 (for Web3Auth users)
 * - Jeong-SBT integration for discounts
 * - Royalty support (ERC-2981)
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract AlmaMarketplace is
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

    // ============ Enums ============
    enum ListingType { FixedPrice, Auction, Rental }
    enum ListingStatus { Active, Sold, Cancelled, Expired }
    enum TokenStandard { ERC721, ERC1155 }

    // ============ Structs ============
    struct Listing {
        uint256 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 amount;             // For ERC-1155 (1 for ERC-721)
        TokenStandard tokenStandard;
        ListingType listingType;
        ListingStatus status;
        address paymentToken;       // address(0) for native token
        uint256 price;              // Fixed price or starting price for auction
        uint256 endTime;            // Auction/Rental end time (0 for fixed price)
        uint256 createdAt;
    }

    struct Auction {
        uint256 listingId;
        address highestBidder;
        uint256 highestBid;
        uint256 minBidIncrement;    // Minimum bid increment (basis points)
        uint256 reservePrice;       // Minimum price to accept
        bool reserveMet;
    }

    struct Rental {
        uint256 listingId;
        uint256 pricePerDay;
        uint256 minDays;
        uint256 maxDays;
        address currentRenter;
        uint64 rentalExpiry;
    }

    struct Offer {
        uint256 offerId;
        address buyer;
        address nftContract;
        uint256 tokenId;
        address paymentToken;
        uint256 price;
        uint256 expiresAt;
        bool isActive;
    }

    // ============ State Variables ============
    uint256 private _listingIdCounter;
    uint256 private _offerIdCounter;

    // External contracts
    address public paymentManager;
    address public collectionManager;
    address public jeongSBT;

    // listingId => Listing
    mapping(uint256 => Listing) public listings;

    // listingId => Auction (for auction listings)
    mapping(uint256 => Auction) public auctions;

    // listingId => Rental (for rental listings)
    mapping(uint256 => Rental) public rentals;

    // offerId => Offer
    mapping(uint256 => Offer) public offers;

    // seller => listingIds
    mapping(address => uint256[]) public sellerListings;

    // nftContract => tokenId => active listingId
    mapping(address => mapping(uint256 => uint256)) public activeListings;

    // Approved NFT contracts
    mapping(address => bool) public approvedNFTContracts;

    // Platform fee (basis points, managed by PaymentManager)
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10%

    // Auction settings
    uint256 public minAuctionDuration;
    uint256 public maxAuctionDuration;
    uint256 public defaultMinBidIncrement; // basis points

    // Native token identifier
    address public constant NATIVE_TOKEN = address(0);

    // ============ Events ============
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        ListingType listingType,
        uint256 price
    );
    event ListingCancelled(uint256 indexed listingId);
    event ListingSold(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 price
    );
    event BidPlaced(
        uint256 indexed listingId,
        address indexed bidder,
        uint256 bid
    );
    event AuctionEnded(
        uint256 indexed listingId,
        address indexed winner,
        uint256 finalPrice
    );
    event NFTRented(
        uint256 indexed listingId,
        address indexed renter,
        uint64 expiry
    );
    event OfferCreated(
        uint256 indexed offerId,
        address indexed buyer,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    event OfferAccepted(uint256 indexed offerId, address indexed seller);
    event OfferCancelled(uint256 indexed offerId);

    // ============ Errors ============
    error ListingNotFound();
    error NotSeller();
    error ListingNotActive();
    error InvalidPrice();
    error InvalidDuration();
    error AuctionNotEnded();
    error AuctionAlreadyEnded();
    error BidTooLow();
    error NotApprovedNFT();
    error TransferFailed();
    error InsufficientPayment();
    error OfferNotFound();
    error OfferExpired();
    error NotBuyer();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) {
        _disableInitializers();
    }

    /**
     * @dev Initialize the contract
     */
    function initialize(
        address defaultAdmin,
        address _paymentManager,
        address _collectionManager,
        address _jeongSBT
    ) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(OPERATOR_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);

        paymentManager = _paymentManager;
        collectionManager = _collectionManager;
        jeongSBT = _jeongSBT;

        minAuctionDuration = 1 hours;
        maxAuctionDuration = 30 days;
        defaultMinBidIncrement = 500; // 5%
    }

    // ============ Listing Functions ============

    /**
     * @dev Create a fixed price listing (gasless for Web3Auth users)
     */
    function createListing(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        TokenStandard tokenStandard,
        address paymentToken,
        uint256 price
    ) external whenNotPaused returns (uint256) {
        if (price == 0) revert InvalidPrice();
        _validateNFTContract(nftContract);

        address seller = _msgSender();

        // Verify ownership and approval
        _verifyOwnershipAndApproval(seller, nftContract, tokenId, amount, tokenStandard);

        _listingIdCounter++;
        uint256 listingId = _listingIdCounter;

        listings[listingId] = Listing({
            listingId: listingId,
            seller: seller,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            tokenStandard: tokenStandard,
            listingType: ListingType.FixedPrice,
            status: ListingStatus.Active,
            paymentToken: paymentToken,
            price: price,
            endTime: 0,
            createdAt: block.timestamp
        });

        sellerListings[seller].push(listingId);
        activeListings[nftContract][tokenId] = listingId;

        emit ListingCreated(listingId, seller, nftContract, tokenId, ListingType.FixedPrice, price);

        return listingId;
    }

    /**
     * @dev Create an auction listing
     */
    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        TokenStandard tokenStandard,
        address paymentToken,
        uint256 startingPrice,
        uint256 reservePrice,
        uint256 duration,
        uint256 minBidIncrement
    ) external whenNotPaused returns (uint256) {
        if (startingPrice == 0) revert InvalidPrice();
        if (duration < minAuctionDuration || duration > maxAuctionDuration) revert InvalidDuration();
        _validateNFTContract(nftContract);

        address seller = _msgSender();
        _verifyOwnershipAndApproval(seller, nftContract, tokenId, amount, tokenStandard);

        _listingIdCounter++;
        uint256 listingId = _listingIdCounter;

        listings[listingId] = Listing({
            listingId: listingId,
            seller: seller,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            tokenStandard: tokenStandard,
            listingType: ListingType.Auction,
            status: ListingStatus.Active,
            paymentToken: paymentToken,
            price: startingPrice,
            endTime: block.timestamp + duration,
            createdAt: block.timestamp
        });

        auctions[listingId] = Auction({
            listingId: listingId,
            highestBidder: address(0),
            highestBid: 0,
            minBidIncrement: minBidIncrement > 0 ? minBidIncrement : defaultMinBidIncrement,
            reservePrice: reservePrice,
            reserveMet: false
        });

        sellerListings[seller].push(listingId);
        activeListings[nftContract][tokenId] = listingId;

        emit ListingCreated(listingId, seller, nftContract, tokenId, ListingType.Auction, startingPrice);

        return listingId;
    }

    /**
     * @dev Create a rental listing (ERC-4907 for ERC721)
     */
    function createRentalListing(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        TokenStandard tokenStandard,
        address paymentToken,
        uint256 pricePerDay,
        uint256 minDays,
        uint256 maxDays
    ) external whenNotPaused returns (uint256) {
        if (pricePerDay == 0) revert InvalidPrice();
        if (minDays == 0 || maxDays < minDays) revert InvalidDuration();
        _validateNFTContract(nftContract);

        address seller = _msgSender();
        _verifyOwnershipAndApproval(seller, nftContract, tokenId, amount, tokenStandard);

        _listingIdCounter++;
        uint256 listingId = _listingIdCounter;

        listings[listingId] = Listing({
            listingId: listingId,
            seller: seller,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            tokenStandard: tokenStandard,
            listingType: ListingType.Rental,
            status: ListingStatus.Active,
            paymentToken: paymentToken,
            price: pricePerDay,
            endTime: 0,
            createdAt: block.timestamp
        });

        rentals[listingId] = Rental({
            listingId: listingId,
            pricePerDay: pricePerDay,
            minDays: minDays,
            maxDays: maxDays,
            currentRenter: address(0),
            rentalExpiry: 0
        });

        sellerListings[seller].push(listingId);
        activeListings[nftContract][tokenId] = listingId;

        emit ListingCreated(listingId, seller, nftContract, tokenId, ListingType.Rental, pricePerDay);

        return listingId;
    }

    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        if (listing.listingId == 0) revert ListingNotFound();
        if (listing.seller != _msgSender() && !hasRole(OPERATOR_ROLE, _msgSender())) {
            revert NotSeller();
        }
        if (listing.status != ListingStatus.Active) revert ListingNotActive();

        // For auctions, check if there are bids
        if (listing.listingType == ListingType.Auction && auctions[listingId].highestBidder != address(0)) {
            // Refund highest bidder
            _refundBid(listingId);
        }

        listing.status = ListingStatus.Cancelled;
        delete activeListings[listing.nftContract][listing.tokenId];

        emit ListingCancelled(listingId);
    }

    // ============ Purchase Functions ============

    /**
     * @dev Buy a fixed price listing (gasless for Web3Auth users)
     */
    function buy(uint256 listingId) external payable nonReentrant whenNotPaused {
        Listing storage listing = listings[listingId];
        if (listing.listingId == 0) revert ListingNotFound();
        if (listing.status != ListingStatus.Active) revert ListingNotActive();
        if (listing.listingType != ListingType.FixedPrice) revert ListingNotActive();

        address buyer = _msgSender();
        uint256 price = listing.price;

        // Get royalty info
        (address royaltyReceiver, uint256 royaltyBps) = _getRoyaltyInfo(
            listing.nftContract,
            listing.tokenId,
            price
        );

        // Process payment through PaymentManager
        _processPayment(
            buyer,
            listing.seller,
            listing.paymentToken,
            price,
            royaltyReceiver,
            royaltyBps
        );

        // Transfer NFT
        _transferNFT(listing.seller, buyer, listing.nftContract, listing.tokenId, listing.amount, listing.tokenStandard);

        listing.status = ListingStatus.Sold;
        delete activeListings[listing.nftContract][listing.tokenId];

        emit ListingSold(listingId, buyer, price);
    }

    /**
     * @dev Place a bid on an auction
     */
    function placeBid(uint256 listingId, uint256 bidAmount) external payable nonReentrant whenNotPaused {
        Listing storage listing = listings[listingId];
        if (listing.listingId == 0) revert ListingNotFound();
        if (listing.status != ListingStatus.Active) revert ListingNotActive();
        if (listing.listingType != ListingType.Auction) revert ListingNotActive();
        if (block.timestamp >= listing.endTime) revert AuctionAlreadyEnded();

        Auction storage auction = auctions[listingId];
        address bidder = _msgSender();

        // Calculate minimum bid
        uint256 minBid;
        if (auction.highestBid == 0) {
            minBid = listing.price; // Starting price
        } else {
            minBid = auction.highestBid + (auction.highestBid * auction.minBidIncrement / 10000);
        }

        if (bidAmount < minBid) revert BidTooLow();

        // Handle payment token
        if (listing.paymentToken == NATIVE_TOKEN) {
            if (msg.value < bidAmount) revert InsufficientPayment();
        } else {
            IERC20(listing.paymentToken).safeTransferFrom(bidder, address(this), bidAmount);
        }

        // Refund previous bidder
        if (auction.highestBidder != address(0)) {
            _refundBid(listingId);
        }

        auction.highestBidder = bidder;
        auction.highestBid = bidAmount;

        // Check if reserve is met
        if (!auction.reserveMet && bidAmount >= auction.reservePrice) {
            auction.reserveMet = true;
        }

        emit BidPlaced(listingId, bidder, bidAmount);
    }

    /**
     * @dev End an auction and transfer NFT to winner
     */
    function endAuction(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        if (listing.listingId == 0) revert ListingNotFound();
        if (listing.status != ListingStatus.Active) revert ListingNotActive();
        if (listing.listingType != ListingType.Auction) revert ListingNotActive();
        if (block.timestamp < listing.endTime) revert AuctionNotEnded();

        Auction storage auction = auctions[listingId];

        if (auction.highestBidder != address(0) && auction.reserveMet) {
            // Get royalty info
            (address royaltyReceiver, uint256 royaltyBps) = _getRoyaltyInfo(
                listing.nftContract,
                listing.tokenId,
                auction.highestBid
            );

            // Distribute payment (bid is already in contract)
            _distributeAuctionPayment(
                listing.seller,
                listing.paymentToken,
                auction.highestBid,
                royaltyReceiver,
                royaltyBps
            );

            // Transfer NFT to winner
            _transferNFT(
                listing.seller,
                auction.highestBidder,
                listing.nftContract,
                listing.tokenId,
                listing.amount,
                listing.tokenStandard
            );

            listing.status = ListingStatus.Sold;
            emit AuctionEnded(listingId, auction.highestBidder, auction.highestBid);
        } else {
            // No valid bids or reserve not met - refund and cancel
            if (auction.highestBidder != address(0)) {
                _refundBid(listingId);
            }
            listing.status = ListingStatus.Expired;
            emit AuctionEnded(listingId, address(0), 0);
        }

        delete activeListings[listing.nftContract][listing.tokenId];
    }

    /**
     * @dev Rent an NFT
     */
    function rent(uint256 listingId, uint256 daysToRent) external payable nonReentrant whenNotPaused {
        Listing storage listing = listings[listingId];
        if (listing.listingId == 0) revert ListingNotFound();
        if (listing.status != ListingStatus.Active) revert ListingNotActive();
        if (listing.listingType != ListingType.Rental) revert ListingNotActive();

        Rental storage rental = rentals[listingId];
        if (daysToRent < rental.minDays || daysToRent > rental.maxDays) revert InvalidDuration();

        // Check if currently rented
        if (rental.currentRenter != address(0) && block.timestamp < rental.rentalExpiry) {
            revert ListingNotActive();
        }

        address renter = _msgSender();
        uint256 totalPrice = rental.pricePerDay * daysToRent;
        uint64 expiry = uint64(block.timestamp + (daysToRent * 1 days));

        // Process payment
        _processPayment(
            renter,
            listing.seller,
            listing.paymentToken,
            totalPrice,
            address(0),
            0
        );

        // Set user via ERC-4907 (for ERC721)
        if (listing.tokenStandard == TokenStandard.ERC721) {
            IERC4907(listing.nftContract).setUser(listing.tokenId, renter, expiry);
        }
        // For ERC-1155, use ERC-5006 (handled separately)

        rental.currentRenter = renter;
        rental.rentalExpiry = expiry;

        emit NFTRented(listingId, renter, expiry);
    }

    // ============ Offer Functions ============

    /**
     * @dev Create an offer for any NFT
     */
    function createOffer(
        address nftContract,
        uint256 tokenId,
        address paymentToken,
        uint256 price,
        uint256 duration
    ) external payable whenNotPaused returns (uint256) {
        if (price == 0) revert InvalidPrice();
        _validateNFTContract(nftContract);

        address buyer = _msgSender();

        // Lock payment
        if (paymentToken == NATIVE_TOKEN) {
            if (msg.value < price) revert InsufficientPayment();
        } else {
            IERC20(paymentToken).safeTransferFrom(buyer, address(this), price);
        }

        _offerIdCounter++;
        uint256 offerId = _offerIdCounter;

        offers[offerId] = Offer({
            offerId: offerId,
            buyer: buyer,
            nftContract: nftContract,
            tokenId: tokenId,
            paymentToken: paymentToken,
            price: price,
            expiresAt: block.timestamp + duration,
            isActive: true
        });

        emit OfferCreated(offerId, buyer, nftContract, tokenId, price);

        return offerId;
    }

    /**
     * @dev Accept an offer (seller)
     */
    function acceptOffer(uint256 offerId) external nonReentrant whenNotPaused {
        Offer storage offer = offers[offerId];
        if (!offer.isActive) revert OfferNotFound();
        if (block.timestamp >= offer.expiresAt) revert OfferExpired();

        address seller = _msgSender();

        // Verify seller owns the NFT
        // Assuming ERC721 for simplicity, can be extended
        if (IERC721(offer.nftContract).ownerOf(offer.tokenId) != seller) {
            revert NotSeller();
        }

        // Get royalty info
        (address royaltyReceiver, uint256 royaltyBps) = _getRoyaltyInfo(
            offer.nftContract,
            offer.tokenId,
            offer.price
        );

        // Payment is already in contract, distribute it
        _distributeOfferPayment(
            seller,
            offer.paymentToken,
            offer.price,
            royaltyReceiver,
            royaltyBps
        );

        // Transfer NFT
        IERC721(offer.nftContract).safeTransferFrom(seller, offer.buyer, offer.tokenId);

        offer.isActive = false;

        // Cancel any active listing for this NFT
        uint256 listingId = activeListings[offer.nftContract][offer.tokenId];
        if (listingId != 0) {
            listings[listingId].status = ListingStatus.Sold;
            delete activeListings[offer.nftContract][offer.tokenId];
        }

        emit OfferAccepted(offerId, seller);
    }

    /**
     * @dev Cancel an offer (buyer)
     */
    function cancelOffer(uint256 offerId) external nonReentrant {
        Offer storage offer = offers[offerId];
        if (!offer.isActive) revert OfferNotFound();
        if (offer.buyer != _msgSender()) revert NotBuyer();

        offer.isActive = false;

        // Refund buyer
        if (offer.paymentToken == NATIVE_TOKEN) {
            (bool success, ) = offer.buyer.call{value: offer.price}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(offer.paymentToken).safeTransfer(offer.buyer, offer.price);
        }

        emit OfferCancelled(offerId);
    }

    // ============ Internal Functions ============

    function _validateNFTContract(address nftContract) internal view {
        if (!approvedNFTContracts[nftContract]) revert NotApprovedNFT();
    }

    function _verifyOwnershipAndApproval(
        address seller,
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        TokenStandard tokenStandard
    ) internal view {
        if (tokenStandard == TokenStandard.ERC721) {
            require(IERC721(nftContract).ownerOf(tokenId) == seller, "Not owner");
            require(
                IERC721(nftContract).isApprovedForAll(seller, address(this)) ||
                IERC721(nftContract).getApproved(tokenId) == address(this),
                "Not approved"
            );
        } else {
            require(IERC1155(nftContract).balanceOf(seller, tokenId) >= amount, "Insufficient balance");
            require(IERC1155(nftContract).isApprovedForAll(seller, address(this)), "Not approved");
        }
    }

    function _transferNFT(
        address from,
        address to,
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        TokenStandard tokenStandard
    ) internal {
        if (tokenStandard == TokenStandard.ERC721) {
            IERC721(nftContract).safeTransferFrom(from, to, tokenId);
        } else {
            IERC1155(nftContract).safeTransferFrom(from, to, tokenId, amount, "");
        }
    }

    function _processPayment(
        address payer,
        address recipient,
        address paymentToken,
        uint256 amount,
        address royaltyReceiver,
        uint256 royaltyBps
    ) internal {
        if (paymentToken == NATIVE_TOKEN) {
            if (msg.value < amount) revert InsufficientPayment();

            // Call PaymentManager
            IAlmaPaymentManager(paymentManager).processPayment{value: amount}(
                payer,
                recipient,
                paymentToken,
                amount,
                royaltyReceiver,
                royaltyBps
            );

            // Refund excess
            if (msg.value > amount) {
                (bool success, ) = payer.call{value: msg.value - amount}("");
                if (!success) revert TransferFailed();
            }
        } else {
            // Approve PaymentManager to spend tokens
            IERC20(paymentToken).safeTransferFrom(payer, address(this), amount);
            IERC20(paymentToken).approve(paymentManager, amount);

            IAlmaPaymentManager(paymentManager).processPayment(
                address(this),
                recipient,
                paymentToken,
                amount,
                royaltyReceiver,
                royaltyBps
            );
        }
    }

    function _distributeAuctionPayment(
        address seller,
        address paymentToken,
        uint256 amount,
        address royaltyReceiver,
        uint256 royaltyBps
    ) internal {
        // Get fees from PaymentManager
        (uint256 platformFee, uint256 royaltyAmount) = IAlmaPaymentManager(paymentManager)
            .calculateFees(seller, paymentToken, amount, royaltyBps);

        uint256 sellerAmount = amount - platformFee - royaltyAmount;

        if (paymentToken == NATIVE_TOKEN) {
            // Transfer platform fee
            if (platformFee > 0) {
                (bool feeSuccess, ) = IAlmaPaymentManager(paymentManager).feeConfig().platformWallet.call{value: platformFee}("");
                if (!feeSuccess) revert TransferFailed();
            }

            // Transfer royalty
            if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
                (bool royaltySuccess, ) = royaltyReceiver.call{value: royaltyAmount}("");
                if (!royaltySuccess) revert TransferFailed();
            }

            // Transfer to seller
            (bool sellerSuccess, ) = seller.call{value: sellerAmount}("");
            if (!sellerSuccess) revert TransferFailed();
        } else {
            IERC20 token = IERC20(paymentToken);

            if (platformFee > 0) {
                token.safeTransfer(IAlmaPaymentManager(paymentManager).feeConfig().platformWallet, platformFee);
            }

            if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
                token.safeTransfer(royaltyReceiver, royaltyAmount);
            }

            token.safeTransfer(seller, sellerAmount);
        }
    }

    function _distributeOfferPayment(
        address seller,
        address paymentToken,
        uint256 amount,
        address royaltyReceiver,
        uint256 royaltyBps
    ) internal {
        _distributeAuctionPayment(seller, paymentToken, amount, royaltyReceiver, royaltyBps);
    }

    function _refundBid(uint256 listingId) internal {
        Listing storage listing = listings[listingId];
        Auction storage auction = auctions[listingId];

        if (listing.paymentToken == NATIVE_TOKEN) {
            (bool success, ) = auction.highestBidder.call{value: auction.highestBid}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(listing.paymentToken).safeTransfer(auction.highestBidder, auction.highestBid);
        }
    }

    function _getRoyaltyInfo(
        address nftContract,
        uint256 tokenId,
        uint256 salePrice
    ) internal view returns (address receiver, uint256 royaltyBps) {
        try IERC2981(nftContract).royaltyInfo(tokenId, salePrice) returns (
            address _receiver,
            uint256 royaltyAmount
        ) {
            receiver = _receiver;
            royaltyBps = salePrice > 0 ? (royaltyAmount * 10000) / salePrice : 0;
        } catch {
            receiver = address(0);
            royaltyBps = 0;
        }
    }

    // ============ Admin Functions ============

    function setApprovedNFTContract(address nftContract, bool approved) external onlyRole(DEFAULT_ADMIN_ROLE) {
        approvedNFTContracts[nftContract] = approved;
    }

    function setPaymentManager(address _paymentManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        paymentManager = _paymentManager;
    }

    function setCollectionManager(address _collectionManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        collectionManager = _collectionManager;
    }

    function setJeongSBT(address _jeongSBT) external onlyRole(DEFAULT_ADMIN_ROLE) {
        jeongSBT = _jeongSBT;
    }

    function setAuctionSettings(
        uint256 _minDuration,
        uint256 _maxDuration,
        uint256 _defaultMinBidIncrement
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        minAuctionDuration = _minDuration;
        maxAuctionDuration = _maxDuration;
        defaultMinBidIncrement = _defaultMinBidIncrement;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function emergencyWithdraw(address token, address to, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (token == NATIVE_TOKEN) {
            (bool success, ) = to.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    // ============ View Functions ============

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    function getAuction(uint256 listingId) external view returns (Auction memory) {
        return auctions[listingId];
    }

    function getRental(uint256 listingId) external view returns (Rental memory) {
        return rentals[listingId];
    }

    function getSellerListings(address seller) external view returns (uint256[] memory) {
        return sellerListings[seller];
    }

    function totalListings() external view returns (uint256) {
        return _listingIdCounter;
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

// ============ Interfaces ============
interface IERC4907 {
    function setUser(uint256 tokenId, address user, uint64 expires) external;
}

interface IAlmaPaymentManager {
    struct FeeConfig {
        uint256 platformFeeBps;
        uint256 maxPlatformFeeBps;
        address platformWallet;
    }

    function processPayment(
        address payer,
        address recipient,
        address paymentToken,
        uint256 amount,
        address royaltyReceiver,
        uint256 royaltyBps
    ) external payable returns (uint256 netAmount);

    function calculateFees(
        address payer,
        address paymentToken,
        uint256 amount,
        uint256 royaltyBps
    ) external view returns (uint256 platformFee, uint256 royaltyAmount);

    function feeConfig() external view returns (FeeConfig memory);
}
