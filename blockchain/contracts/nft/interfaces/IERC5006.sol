// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IERC5006
 * @dev Interface for ERC-5006: Rental NFT, NFT User Extension for ERC-1155
 * @notice This standard is an extension of EIP-1155. It proposes an additional role (user)
 *         which can be granted to addresses that represent a user of the assets rather than an owner.
 */
interface IERC5006 {
    /**
     * @dev Emitted when a user record is created or updated.
     */
    event CreateUserRecord(
        uint256 indexed recordId,
        uint256 indexed tokenId,
        uint256 amount,
        address owner,
        address user,
        uint64 expiry
    );

    /**
     * @dev Emitted when a user record is deleted.
     */
    event DeleteUserRecord(uint256 indexed recordId);

    /**
     * @notice Structure to represent a user record
     */
    struct UserRecord {
        uint256 tokenId;
        address owner;
        uint256 amount;
        address user;
        uint64 expiry;
    }

    /**
     * @notice Create a new user record
     * @param owner The address that owns the NFTs
     * @param user The address that will use the NFTs
     * @param tokenId The token ID of the NFT
     * @param amount The number of NFTs to create the record for
     * @param expiry The Unix timestamp when the record expires
     * @return recordId The ID of the created record
     */
    function createUserRecord(
        address owner,
        address user,
        uint256 tokenId,
        uint256 amount,
        uint64 expiry
    ) external returns (uint256 recordId);

    /**
     * @notice Delete a user record
     * @param recordId The ID of the record to delete
     */
    function deleteUserRecord(uint256 recordId) external;

    /**
     * @notice Get a user record
     * @param recordId The ID of the record
     * @return The UserRecord struct
     */
    function userRecordOf(uint256 recordId) external view returns (UserRecord memory);

    /**
     * @notice Get the usable balance of a user for a token
     * @param user The address of the user
     * @param tokenId The token ID
     * @return amount The usable balance
     */
    function usableBalanceOf(address user, uint256 tokenId) external view returns (uint256 amount);

    /**
     * @notice Get the frozen balance of an owner for a token
     * @param owner The address of the owner
     * @param tokenId The token ID
     * @return amount The frozen balance
     */
    function frozenBalanceOf(address owner, uint256 tokenId) external view returns (uint256 amount);
}
