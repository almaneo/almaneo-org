/**
 * Mining Claim API
 * Vercel Serverless Function for MiningPool contract interactions
 *
 * POST /api/mining-claim
 * Actions:
 * - claimTokens: Claim ALMAN tokens for a game user
 * - getStatus: Get mining pool status (no tx needed)
 *
 * Security:
 * - Uses VERIFIER_PRIVATE_KEY to sign transactions (CLAIMER_ROLE on contract)
 * - Should only be called from trusted backend services (game server)
 */

import { ethers } from 'ethers';

// MiningPool ABI (only the functions we need)
const MINING_POOL_ABI = [
  'function claimForUser(address user, uint256 amount) external',
  'function getCurrentEpoch() view returns (uint256)',
  'function remainingPool() view returns (uint256)',
  'function totalClaimed() view returns (uint256)',
  'function miningProgress() view returns (uint256)',
  'function getDailyRemaining() view returns (uint256)',
  'function getUserDailyRemaining(address user) view returns (uint256)',
  'function getContractBalance() view returns (uint256)',
  'function dailyClaimLimit() view returns (uint256)',
  'function userDailyClaimLimit() view returns (uint256)',
];

// Contract addresses by network
const CONTRACT_ADDRESSES: Record<number, string> = {
  80002: '0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9', // Polygon Amoy
  137: '', // Polygon Mainnet (not deployed yet)
};

// RPC URLs
const RPC_URLS: Record<number, string> = {
  80002: 'https://rpc-amoy.polygon.technology',
  137: 'https://polygon-rpc.com',
};

// Environment variables
const CLAIMER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');

// Request types
interface ClaimTokensRequest {
  action: 'claimTokens';
  userAddress: string;
  amount: string; // ALMAN amount (not wei) - e.g. "100" for 100 ALMAN
  gamePoints?: number;
}

interface GetStatusRequest {
  action: 'getStatus';
  userAddress?: string;
}

type MiningRequest = ClaimTokensRequest | GetStatusRequest;

interface SuccessResponse {
  success: true;
  data: Record<string, unknown>;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type MiningResponse = SuccessResponse | ErrorResponse;

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405, corsHeaders);
  }

  const contractAddress = CONTRACT_ADDRESSES[CHAIN_ID];
  if (!contractAddress) {
    return jsonResponse({ success: false, error: 'Contract not available' }, 500, corsHeaders);
  }

  try {
    const body = (await request.json()) as MiningRequest;
    const { action } = body;

    const provider = new ethers.JsonRpcProvider(RPC_URLS[CHAIN_ID]);

    switch (action) {
      case 'claimTokens':
        return handleClaimTokens(body as ClaimTokensRequest, provider, contractAddress, corsHeaders);

      case 'getStatus':
        return handleGetStatus(body as GetStatusRequest, provider, contractAddress, corsHeaders);

      default:
        return jsonResponse({ success: false, error: 'Invalid action' }, 400, corsHeaders);
    }
  } catch (error) {
    console.error('[Mining API] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      corsHeaders
    );
  }
}

async function handleClaimTokens(
  body: ClaimTokensRequest,
  provider: ethers.JsonRpcProvider,
  contractAddress: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (!CLAIMER_PRIVATE_KEY) {
    console.error('[Mining API] VERIFIER_PRIVATE_KEY is not set');
    return jsonResponse({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
  }

  const { userAddress, amount, gamePoints } = body;

  if (!userAddress || !amount) {
    return jsonResponse(
      { success: false, error: 'Missing required fields: userAddress, amount' },
      400,
      corsHeaders
    );
  }

  if (!ethers.isAddress(userAddress)) {
    return jsonResponse({ success: false, error: 'Invalid user address' }, 400, corsHeaders);
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return jsonResponse({ success: false, error: 'Amount must be positive' }, 400, corsHeaders);
  }

  // Max 1000 ALMAN per claim (safety limit)
  if (amountNum > 1000) {
    return jsonResponse({ success: false, error: 'Amount exceeds maximum per claim (1000 ALMAN)' }, 400, corsHeaders);
  }

  try {
    const wallet = new ethers.Wallet(CLAIMER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, MINING_POOL_ABI, wallet);

    const amountWei = ethers.parseEther(amount);

    console.log(`[Mining API] Claiming ${amount} ALMAN for ${userAddress} (points: ${gamePoints || 'N/A'})`);

    const tx = await contract.claimForUser(userAddress, amountWei);
    const receipt = await tx.wait();

    console.log(`[Mining API] Claim success: ${tx.hash}`);

    // Get updated status
    const [currentEpoch, remaining, progress] = await Promise.all([
      contract.getCurrentEpoch(),
      contract.remainingPool(),
      contract.miningProgress(),
    ]);

    return jsonResponse(
      {
        success: true,
        data: {
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          amount,
          userAddress,
          currentEpoch: Number(currentEpoch),
          remainingPool: ethers.formatEther(remaining),
          miningProgress: Number(progress) / 100, // basis points to percentage
        },
      },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Mining API] Claim failed:`, errorMsg);

    // Parse common contract errors
    if (errorMsg.includes('Daily limit')) {
      return jsonResponse({ success: false, error: 'Daily claim limit reached' }, 429, corsHeaders);
    }
    if (errorMsg.includes('User daily limit')) {
      return jsonResponse({ success: false, error: 'User daily limit reached' }, 429, corsHeaders);
    }
    if (errorMsg.includes('Pool depleted')) {
      return jsonResponse({ success: false, error: 'Mining pool is depleted' }, 410, corsHeaders);
    }

    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

async function handleGetStatus(
  body: GetStatusRequest,
  provider: ethers.JsonRpcProvider,
  contractAddress: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const contract = new ethers.Contract(contractAddress, MINING_POOL_ABI, provider);

    const queries: Promise<unknown>[] = [
      contract.getCurrentEpoch(),
      contract.remainingPool(),
      contract.totalClaimed(),
      contract.miningProgress(),
      contract.getDailyRemaining(),
      contract.getContractBalance(),
      contract.dailyClaimLimit(),
      contract.userDailyClaimLimit(),
    ];

    // Optionally get user-specific data
    if (body.userAddress && ethers.isAddress(body.userAddress)) {
      queries.push(contract.getUserDailyRemaining(body.userAddress));
    }

    const results = await Promise.all(queries);

    const data: Record<string, unknown> = {
      currentEpoch: Number(results[0]),
      remainingPool: ethers.formatEther(results[1] as bigint),
      totalClaimed: ethers.formatEther(results[2] as bigint),
      miningProgress: Number(results[3]) / 100,
      dailyRemaining: ethers.formatEther(results[4] as bigint),
      contractBalance: ethers.formatEther(results[5] as bigint),
      dailyClaimLimit: ethers.formatEther(results[6] as bigint),
      userDailyClaimLimit: ethers.formatEther(results[7] as bigint),
    };

    if (results.length > 8) {
      data.userDailyRemaining = ethers.formatEther(results[8] as bigint);
    }

    return jsonResponse({ success: true, data }, 200, corsHeaders);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Mining API] Status query failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

function jsonResponse(
  data: MiningResponse,
  status: number,
  headers: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
