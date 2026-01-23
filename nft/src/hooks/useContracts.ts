import { useMemo } from 'react';
import { Contract, JsonRpcProvider } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { CONTRACTS, CHAIN_CONFIG } from '../contracts/addresses';

// ABIs - AlmaNEO Contracts
import AlmaNFT721ABI from '../contracts/abis/AlmaNFT721.json';
import AlmaNFT1155ABI from '../contracts/abis/AlmaNFT1155.json';
import AlmaCollectionManagerABI from '../contracts/abis/AlmaCollectionManager.json';
import AlmaPaymentManagerABI from '../contracts/abis/AlmaPaymentManager.json';
import AlmaMarketplaceABI from '../contracts/abis/AlmaMarketplace.json';

// Default read-only provider for public data access (no wallet needed)
const defaultProvider = new JsonRpcProvider(CHAIN_CONFIG.rpcUrls[0]);

export const useContracts = () => {
  const { signer, provider } = useWeb3();

  const contracts = useMemo(() => {
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;

    return {
      nft721: new Contract(CONTRACTS.AlmaNFT721, AlmaNFT721ABI.abi, signerOrProvider),
      nft1155: new Contract(CONTRACTS.AlmaNFT1155, AlmaNFT1155ABI.abi, signerOrProvider),
      collectionManager: new Contract(CONTRACTS.AlmaCollectionManager, AlmaCollectionManagerABI.abi, signerOrProvider),
      paymentManager: new Contract(CONTRACTS.AlmaPaymentManager, AlmaPaymentManagerABI.abi, signerOrProvider),
      marketplace: new Contract(CONTRACTS.AlmaMarketplace, AlmaMarketplaceABI.abi, signerOrProvider),
    };
  }, [signer, provider]);

  return contracts;
};

export const useNFT721 = () => {
  const { signer, provider } = useWeb3();

  return useMemo(() => {
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;
    return new Contract(CONTRACTS.AlmaNFT721, AlmaNFT721ABI.abi, signerOrProvider);
  }, [signer, provider]);
};

export const useNFT1155 = () => {
  const { signer, provider } = useWeb3();

  return useMemo(() => {
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;
    return new Contract(CONTRACTS.AlmaNFT1155, AlmaNFT1155ABI.abi, signerOrProvider);
  }, [signer, provider]);
};

export const useMarketplace = () => {
  const { signer, provider } = useWeb3();

  return useMemo(() => {
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;
    return new Contract(CONTRACTS.AlmaMarketplace, AlmaMarketplaceABI.abi, signerOrProvider);
  }, [signer, provider]);
};

export const useCollectionManager = () => {
  const { signer, provider } = useWeb3();

  return useMemo(() => {
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;
    return new Contract(CONTRACTS.AlmaCollectionManager, AlmaCollectionManagerABI.abi, signerOrProvider);
  }, [signer, provider]);
};

export const usePaymentManager = () => {
  const { signer, provider } = useWeb3();

  return useMemo(() => {
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;
    return new Contract(CONTRACTS.AlmaPaymentManager, AlmaPaymentManagerABI.abi, signerOrProvider);
  }, [signer, provider]);
};

/**
 * Read-only contracts that work without wallet connection
 * Uses default RPC provider for public data access
 */
export const useReadOnlyContracts = () => {
  const contracts = useMemo(() => {
    return {
      nft721: new Contract(CONTRACTS.AlmaNFT721, AlmaNFT721ABI.abi, defaultProvider),
      nft1155: new Contract(CONTRACTS.AlmaNFT1155, AlmaNFT1155ABI.abi, defaultProvider),
      collectionManager: new Contract(CONTRACTS.AlmaCollectionManager, AlmaCollectionManagerABI.abi, defaultProvider),
      paymentManager: new Contract(CONTRACTS.AlmaPaymentManager, AlmaPaymentManagerABI.abi, defaultProvider),
      marketplace: new Contract(CONTRACTS.AlmaMarketplace, AlmaMarketplaceABI.abi, defaultProvider),
    };
  }, []);

  return contracts;
};
