// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title PartnerSBT
 * @dev Partner Soulbound Token - 공식 파트너 인증 SBT
 *
 * Features:
 * - ERC-5484 기반 Soulbound Token (양도 불가)
 * - 단일 "Verified Partner" 등급 (티어 없음)
 * - 1년 유효기간, 활동 기반 자동 갱신
 * - 어드민 직접 발급 (MINTER_ROLE)
 * - 업그레이드 가능 (UUPS)
 *
 * 혜택:
 * - Verified Partner 배지 표시
 * - 파트너 목록 노출 우선순위
 * - NFT 마켓플레이스 수수료 15% 할인
 *
 * @custom:security-contact security@almaneo.org
 */
contract PartnerSBT is
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
    bytes32 public constant RENEWER_ROLE = keccak256("RENEWER_ROLE");

    // ============ Constants ============
    uint256 public constant VALIDITY_PERIOD = 365 days;

    // ============ Structs ============
    struct PartnerData {
        string businessName;
        uint256 mintedAt;
        uint256 expiresAt;
        uint256 lastRenewedAt;
        uint256 renewalCount;
        bool isRevoked;
    }

    // ============ State Variables ============
    uint256 private _tokenIdCounter;
    string public baseURI;

    // tokenId => PartnerData
    mapping(uint256 => PartnerData) public partnerData;

    // wallet address => tokenId (1인 1토큰 제한)
    mapping(address => uint256) public addressToTokenId;

    // ============ Events ============
    event PartnerMinted(address indexed to, uint256 indexed tokenId, string businessName, uint256 expiresAt);
    event PartnerRenewed(address indexed partner, uint256 indexed tokenId, uint256 newExpiresAt, uint256 renewalCount);
    event PartnerRevoked(address indexed partner, uint256 indexed tokenId, string reason);

    // ============ Errors ============
    error SoulboundTokenNonTransferable();
    error AlreadyHasPartnerSBT();
    error NoPartnerSBTFound();
    error PartnerIsRevoked();
    error EmptyBusinessName();

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
        __ERC721_init("Partner Soulbound Token", "PARTNER");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
        _grantRole(RENEWER_ROLE, defaultAdmin);

        baseURI = baseURI_;
    }

    // ============ Soulbound Logic ============

    /**
     * @dev 전송 차단 (Soulbound) - 민팅과 소각만 허용
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
     * @dev 새 Partner SBT 발급 (MINTER_ROLE, 1인 1토큰)
     * @param to 파트너 지갑 주소
     * @param businessName 비즈니스 이름
     */
    function mintPartnerSBT(address to, string calldata businessName)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        if (addressToTokenId[to] != 0) {
            revert AlreadyHasPartnerSBT();
        }
        if (bytes(businessName).length == 0) {
            revert EmptyBusinessName();
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        addressToTokenId[to] = tokenId;

        partnerData[tokenId] = PartnerData({
            businessName: businessName,
            mintedAt: block.timestamp,
            expiresAt: block.timestamp + VALIDITY_PERIOD,
            lastRenewedAt: 0,
            renewalCount: 0,
            isRevoked: false
        });

        _setTokenURI(tokenId, string(abi.encodePacked(baseURI, "verified.json")));

        emit PartnerMinted(to, tokenId, businessName, block.timestamp + VALIDITY_PERIOD);
        return tokenId;
    }

    // ============ Renewal ============

    /**
     * @dev Partner SBT 갱신 (RENEWER_ROLE)
     * - 만료된 경우: now + 365일
     * - 유효한 경우: expiresAt + 365일
     * - 취소된 경우: 갱신 불가
     */
    function renewPartnerSBT(address partner) external onlyRole(RENEWER_ROLE) {
        uint256 tokenId = addressToTokenId[partner];
        if (tokenId == 0) revert NoPartnerSBTFound();

        PartnerData storage data = partnerData[tokenId];
        if (data.isRevoked) revert PartnerIsRevoked();

        uint256 newExpiresAt;
        if (block.timestamp >= data.expiresAt) {
            // 만료된 경우: 현재 시점부터 1년
            newExpiresAt = block.timestamp + VALIDITY_PERIOD;
        } else {
            // 유효한 경우: 기존 만료일에서 1년 연장
            newExpiresAt = data.expiresAt + VALIDITY_PERIOD;
        }

        data.expiresAt = newExpiresAt;
        data.lastRenewedAt = block.timestamp;
        data.renewalCount++;

        emit PartnerRenewed(partner, tokenId, newExpiresAt, data.renewalCount);
    }

    // ============ Revocation ============

    /**
     * @dev Partner SBT 취소 (DEFAULT_ADMIN_ROLE)
     * - SBT는 온체인에 남지만 isRevoked=true로 무효화
     * - 취소된 SBT는 갱신 불가 (영구 조치)
     */
    function revokePartnerSBT(address partner, string calldata reason)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        uint256 tokenId = addressToTokenId[partner];
        if (tokenId == 0) revert NoPartnerSBTFound();

        PartnerData storage data = partnerData[tokenId];
        data.isRevoked = true;

        emit PartnerRevoked(partner, tokenId, reason);
    }

    // ============ View Functions ============

    /**
     * @dev 파트너 SBT 유효성 확인
     * @return true: SBT 존재 + 미만료 + 미취소
     */
    function isValid(address account) external view returns (bool) {
        uint256 tokenId = addressToTokenId[account];
        if (tokenId == 0) return false;

        PartnerData memory data = partnerData[tokenId];
        return !data.isRevoked && block.timestamp < data.expiresAt;
    }

    /**
     * @dev 주소로 파트너 데이터 전체 조회
     */
    function getPartnerByAddress(address account) external view returns (
        uint256 tokenId,
        string memory businessName,
        uint256 mintedAt,
        uint256 expiresAt,
        uint256 lastRenewedAt,
        uint256 renewalCount,
        bool isRevoked,
        bool valid
    ) {
        tokenId = addressToTokenId[account];
        if (tokenId == 0) revert NoPartnerSBTFound();

        PartnerData memory data = partnerData[tokenId];
        return (
            tokenId,
            data.businessName,
            data.mintedAt,
            data.expiresAt,
            data.lastRenewedAt,
            data.renewalCount,
            data.isRevoked,
            !data.isRevoked && block.timestamp < data.expiresAt
        );
    }

    /**
     * @dev 만료까지 남은 일수 (양수=유효, 음수=만료)
     */
    function daysUntilExpiry(address account) external view returns (int256) {
        uint256 tokenId = addressToTokenId[account];
        if (tokenId == 0) revert NoPartnerSBTFound();

        PartnerData memory data = partnerData[tokenId];
        if (data.isRevoked) return type(int256).min; // revoked

        if (block.timestamp >= data.expiresAt) {
            // 만료됨: 음수 반환
            return -int256((block.timestamp - data.expiresAt) / 1 days);
        } else {
            // 유효함: 양수 반환
            return int256((data.expiresAt - block.timestamp) / 1 days);
        }
    }

    /**
     * @dev Partner SBT 보유 여부 확인
     */
    function hasPartnerSBT(address account) external view returns (bool) {
        return addressToTokenId[account] != 0;
    }

    /**
     * @dev 총 발급량 조회
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // ============ Admin Functions ============

    function setBaseURI(string memory _newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
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
