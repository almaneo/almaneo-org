// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IERC4907
 * @dev Interface for ERC-4907: Rental NFT, NFT User Extension for ERC-721
 * @notice This standard is an extension of EIP-721. It proposes an additional role (user)
 *         which can be granted to addresses that represent a user of the assets rather than an owner.
 */
interface IERC4907 {
    /**
     * @dev Emitted when the user of an NFT is changed or expires is changed.
     */
    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);

    /**
     * @notice Set the user and expires of an NFT
     * @dev The zero address indicates there is no user.
     *      Throws if `tokenId` is not a valid NFT.
     * @param tokenId The tokenId of the NFT
     * @param user The new user of the NFT
     * @param expires UNIX timestamp when the user expires
     */
    function setUser(uint256 tokenId, address user, uint64 expires) external;

    /**
     * @notice Get the user address of an NFT
     * @dev The zero address indicates that there is no user or the user is expired.
     * @param tokenId The tokenId of the NFT
     * @return The user address for this NFT
     */
    function userOf(uint256 tokenId) external view returns (address);

    /**
     * @notice Get the user expires of an NFT
     * @dev The zero value indicates that there is no user
     * @param tokenId The tokenId of the NFT
     * @return The user expires for this NFT
     */
    function userExpires(uint256 tokenId) external view returns (uint256);
}
