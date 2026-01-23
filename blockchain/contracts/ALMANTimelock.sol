// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @title ALMANTimelock
 * @dev AlmaNEO DAO 타임락 컨트랙트 (Upgradeable)
 *
 * Features:
 * - 거버넌스 실행 지연 (2일)
 * - 제안 취소 가능
 * - 업그레이드 가능
 *
 * @custom:security-contact security@almaneo.foundation
 */
contract ALMANTimelock is
    Initializable,
    TimelockControllerUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev 초기화 함수
     * @param minDelay 최소 실행 지연 시간 (초)
     * @param proposers 제안자 목록 (Governor)
     * @param executors 실행자 목록 (address(0) = 누구나)
     * @param admin 관리자 주소
     */
    function initialize(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) public override initializer {
        __TimelockController_init(minDelay, proposers, executors, admin);
        __UUPSUpgradeable_init();

        _grantRole(UPGRADER_ROLE, admin);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
