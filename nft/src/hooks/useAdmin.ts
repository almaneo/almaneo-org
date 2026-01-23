import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useContracts } from './useContracts';

// Admin wallet address
const ADMIN_ADDRESS = '0x883D5c1a4aCF5859f20156B4E27Bd90C313DB0B8';

export const useAdmin = () => {
  const { address, isConnected } = useWeb3();
  const contracts = useContracts();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasOperatorRole, setHasOperatorRole] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = useCallback(async () => {
    // Wait for connection
    if (!isConnected) {
      setLoading(false);
      return;
    }

    if (!address) {
      setIsAdmin(false);
      setHasOperatorRole(false);
      setLoading(false);
      return;
    }

    // Check if wallet is the admin address (case-insensitive)
    const isAdminWallet = address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
    setIsAdmin(isAdminWallet);

    // Try to check OPERATOR_ROLE on NFT721 contract
    if (contracts?.nft721 && isAdminWallet) {
      try {
        const OPERATOR_ROLE = await contracts.nft721.OPERATOR_ROLE();
        const hasRole = await contracts.nft721.hasRole(OPERATOR_ROLE, address);
        setHasOperatorRole(hasRole);
      } catch (error) {
        console.error('Error checking operator role:', error);
        // Don't change isAdmin status on contract call failure
        setHasOperatorRole(false);
      }
    }

    setLoading(false);
  }, [address, isConnected, contracts]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return {
    isAdmin,
    hasOperatorRole,
    loading,
    isConnected,
    address,
    adminAddress: ADMIN_ADDRESS,
  };
};
