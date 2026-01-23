// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "../interfaces/IERC4907.sol";

/**
 * @title ERC4907Upgradeable
 * @dev Implementation of ERC-4907: Rental NFT for ERC-721 (Upgradeable)
 * @notice Allows NFT owners to grant temporary usage rights to other addresses
 */
abstract contract ERC4907Upgradeable is ERC721Upgradeable, IERC4907 {
    struct UserInfo {
        address user;   // Address of user role
        uint64 expires; // Unix timestamp when user expires
    }

    // tokenId => UserInfo
    mapping(uint256 => UserInfo) internal _users;

    /**
     * @dev Initializes the ERC4907 extension
     */
    function __ERC4907_init() internal onlyInitializing {
        __ERC4907_init_unchained();
    }

    function __ERC4907_init_unchained() internal onlyInitializing {}

    /**
     * @notice Set the user and expires of an NFT
     * @dev Only owner or approved operator can set user
     * @param tokenId The token ID
     * @param user The new user address
     * @param expires Expiration timestamp
     */
    function setUser(uint256 tokenId, address user, uint64 expires) public virtual override {
        require(_isAuthorized(_ownerOf(tokenId), _msgSender(), tokenId), "ERC4907: caller is not owner nor approved");

        UserInfo storage info = _users[tokenId];
        info.user = user;
        info.expires = expires;

        emit UpdateUser(tokenId, user, expires);
    }

    /**
     * @notice Get the user address of an NFT
     * @param tokenId The token ID
     * @return The user address (zero address if no user or expired)
     */
    function userOf(uint256 tokenId) public view virtual override returns (address) {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        }
        return address(0);
    }

    /**
     * @notice Get the user expires timestamp
     * @param tokenId The token ID
     * @return The expiration timestamp
     */
    function userExpires(uint256 tokenId) public view virtual override returns (uint256) {
        return _users[tokenId].expires;
    }

    /**
     * @dev Clear user info when token is transferred
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override
        returns (address)
    {
        address from = super._update(to, tokenId, auth);

        // Clear user info on transfer (not on mint)
        if (from != address(0) && to != address(0) && from != to) {
            delete _users[tokenId];
            emit UpdateUser(tokenId, address(0), 0);
        }

        return from;
    }

    /**
     * @dev See {IERC165-supportsInterface}
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return interfaceId == type(IERC4907).interfaceId || super.supportsInterface(interfaceId);
    }
}
