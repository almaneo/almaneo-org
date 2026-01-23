/**
 * Web3Auth Integration Helpers
 * Convert Web3Auth provider to ethers.js
 */

import { ethers } from 'ethers';
import { NETWORK_CONFIG } from '@/contracts/addresses';

/**
 * Get ethers provider from Web3Auth
 * @param web3AuthProvider - Web3Auth provider instance
 */
export function getEthersProvider(web3AuthProvider: any): ethers.BrowserProvider {
  return new ethers.BrowserProvider(web3AuthProvider);
}

/**
 * Get ethers signer from Web3Auth provider
 * @param web3AuthProvider - Web3Auth provider instance
 */
export async function getEthersSigner(
  web3AuthProvider: any
): Promise<ethers.Signer> {
  const provider = getEthersProvider(web3AuthProvider);
  return await provider.getSigner();
}

/**
 * Get user address from Web3Auth provider
 * @param web3AuthProvider - Web3Auth provider instance
 */
export async function getUserAddress(web3AuthProvider: any): Promise<string> {
  const signer = await getEthersSigner(web3AuthProvider);
  return await signer.getAddress();
}

/**
 * Get chain ID from Web3Auth provider
 */
export async function getChainId(web3AuthProvider: any): Promise<number> {
  const provider = getEthersProvider(web3AuthProvider);
  const network = await provider.getNetwork();
  return Number(network.chainId);
}

/**
 * Check if connected to correct network
 */
export async function checkNetwork(web3AuthProvider: any): Promise<boolean> {
  try {
    const chainId = await getChainId(web3AuthProvider);
    return chainId === NETWORK_CONFIG.CHAIN_ID;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
}

/**
 * Switch to Polygon Amoy network
 * @param web3AuthProvider - Web3Auth provider instance
 */
export async function switchToPolygonAmoy(web3AuthProvider: any): Promise<boolean> {
  try {
    await web3AuthProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${NETWORK_CONFIG.CHAIN_ID.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    // Chain not added, try to add it
    if (error.code === 4902) {
      try {
        await web3AuthProvider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${NETWORK_CONFIG.CHAIN_ID.toString(16)}`,
              chainName: NETWORK_CONFIG.NETWORK_NAME,
              rpcUrls: [NETWORK_CONFIG.RPC_URL],
              blockExplorerUrls: [NETWORK_CONFIG.BLOCK_EXPLORER],
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding network:', addError);
        return false;
      }
    }
    
    console.error('Error switching network:', error);
    return false;
  }
}

export default {
  getEthersProvider,
  getEthersSigner,
  getUserAddress,
  getChainId,
  checkNetwork,
  switchToPolygonAmoy,
};
