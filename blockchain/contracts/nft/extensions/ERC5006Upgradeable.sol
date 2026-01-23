// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "../interfaces/IERC5006.sol";

/**
 * @title ERC5006Upgradeable
 * @dev Implementation of ERC-5006: Rental NFT for ERC-1155 (Upgradeable)
 * @notice Allows NFT owners to grant temporary usage rights for specific amounts
 */
abstract contract ERC5006Upgradeable is ERC1155Upgradeable, IERC5006 {
    // Record ID counter
    uint256 private _recordIdCounter;

    // recordId => UserRecord
    mapping(uint256 => UserRecord) private _records;

    // user => tokenId => usable balance
    mapping(address => mapping(uint256 => uint256)) private _usableBalances;

    // owner => tokenId => frozen balance
    mapping(address => mapping(uint256 => uint256)) private _frozenBalances;

    // owner => tokenId => recordIds
    mapping(address => mapping(uint256 => uint256[])) private _ownerRecords;

    /**
     * @dev Initializes the ERC5006 extension
     */
    function __ERC5006_init() internal onlyInitializing {
        __ERC5006_init_unchained();
    }

    function __ERC5006_init_unchained() internal onlyInitializing {}

    /**
     * @notice Create a new user record
     */
    function createUserRecord(
        address owner,
        address user,
        uint256 tokenId,
        uint256 amount,
        uint64 expiry
    ) public virtual override returns (uint256) {
        require(user != address(0), "ERC5006: user is zero address");
        require(amount > 0, "ERC5006: amount is zero");
        require(expiry > block.timestamp, "ERC5006: expiry must be in future");
        require(
            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC5006: caller is not owner nor approved"
        );

        // Check available balance
        uint256 available = balanceOf(owner, tokenId) - _frozenBalances[owner][tokenId];
        require(available >= amount, "ERC5006: insufficient available balance");

        _recordIdCounter++;
        uint256 recordId = _recordIdCounter;

        _records[recordId] = UserRecord({
            tokenId: tokenId,
            owner: owner,
            amount: amount,
            user: user,
            expiry: expiry
        });

        _frozenBalances[owner][tokenId] += amount;
        _usableBalances[user][tokenId] += amount;
        _ownerRecords[owner][tokenId].push(recordId);

        emit CreateUserRecord(recordId, tokenId, amount, owner, user, expiry);

        return recordId;
    }

    /**
     * @notice Delete a user record
     */
    function deleteUserRecord(uint256 recordId) public virtual override {
        UserRecord storage record = _records[recordId];
        require(record.owner != address(0), "ERC5006: record does not exist");
        require(
            _msgSender() == record.owner ||
            isApprovedForAll(record.owner, _msgSender()) ||
            record.expiry <= block.timestamp,
            "ERC5006: caller cannot delete record"
        );

        _frozenBalances[record.owner][record.tokenId] -= record.amount;
        _usableBalances[record.user][record.tokenId] -= record.amount;

        // Remove from owner records array
        _removeFromOwnerRecords(record.owner, record.tokenId, recordId);

        delete _records[recordId];

        emit DeleteUserRecord(recordId);
    }

    /**
     * @notice Get a user record
     */
    function userRecordOf(uint256 recordId) public view virtual override returns (UserRecord memory) {
        return _records[recordId];
    }

    /**
     * @notice Get the usable balance of a user
     */
    function usableBalanceOf(address user, uint256 tokenId) public view virtual override returns (uint256) {
        return _usableBalances[user][tokenId];
    }

    /**
     * @notice Get the frozen balance of an owner
     */
    function frozenBalanceOf(address owner, uint256 tokenId) public view virtual override returns (uint256) {
        return _frozenBalances[owner][tokenId];
    }

    /**
     * @dev Clean up expired records for a token
     */
    function cleanExpiredRecords(address owner, uint256 tokenId) external {
        uint256[] storage records = _ownerRecords[owner][tokenId];

        for (uint256 i = 0; i < records.length;) {
            uint256 recordId = records[i];
            if (_records[recordId].expiry <= block.timestamp) {
                deleteUserRecord(recordId);
                // Don't increment i since array shifted
            } else {
                i++;
            }
        }
    }

    /**
     * @dev Remove recordId from owner records array
     */
    function _removeFromOwnerRecords(address owner, uint256 tokenId, uint256 recordId) internal {
        uint256[] storage records = _ownerRecords[owner][tokenId];
        for (uint256 i = 0; i < records.length; i++) {
            if (records[i] == recordId) {
                records[i] = records[records.length - 1];
                records.pop();
                break;
            }
        }
    }

    /**
     * @dev Hook before token transfer - check frozen balance
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        // Check frozen balance before transfer
        if (from != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 available = balanceOf(from, ids[i]) - _frozenBalances[from][ids[i]];
                require(available >= values[i], "ERC5006: transfer amount exceeds available");
            }
        }

        super._update(from, to, ids, values);
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
        return interfaceId == type(IERC5006).interfaceId || super.supportsInterface(interfaceId);
    }
}
