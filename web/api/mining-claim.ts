/**
 * Mining Claim API (viem version)
 * Vercel Edge Function for MiningPool contract interactions
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

import {
  createPublicClient,
  createWalletClient,
  http,
  fallback,
  isAddress,
  parseAbi,
  parseEther,
  formatEther,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy, polygon } from 'viem/chains';

const MINING_POOL_ABI = parseAbi([
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
]);

const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  80002: '0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9',
  137: '0x0000000000000000000000000000000000000000',
};

const RPC_URLS: Record<number, string[]> = {
  80002: [
    'https://rpc-amoy.polygon.technology',
    'https://polygon-amoy-bor-rpc.publicnode.com',
    'https://amoy.drpc.org',
  ],
  137: [
    'https://polygon-rpc.com',
    'https://polygon-bor-rpc.publicnode.com',
  ],
};

const CLAIMER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');

const chain = CHAIN_ID === 137 ? polygon : polygonAmoy;

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
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
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return jsonResponse({ success: false, error: 'Contract not available' }, 500, corsHeaders);
  }

  try {
    const body = await request.json();
    const { action } = body;

    const urls = RPC_URLS[CHAIN_ID] || [];
    const transport = fallback(urls.map(url => http(url, { timeout: 15_000 })));

    switch (action) {
      case 'claimTokens':
        return handleClaimTokens(body, contractAddress, transport, corsHeaders);
      case 'getStatus':
        return handleGetStatus(body, contractAddress, transport, corsHeaders);
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
  body: { userAddress: string; amount: string; gamePoints?: number },
  contractAddress: `0x${string}`,
  transport: ReturnType<typeof fallback>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (!CLAIMER_PRIVATE_KEY) {
    return jsonResponse({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
  }

  const { userAddress, amount, gamePoints } = body;

  if (!userAddress || !amount) {
    return jsonResponse({ success: false, error: 'Missing required fields: userAddress, amount' }, 400, corsHeaders);
  }
  if (!isAddress(userAddress)) {
    return jsonResponse({ success: false, error: 'Invalid user address' }, 400, corsHeaders);
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return jsonResponse({ success: false, error: 'Amount must be positive' }, 400, corsHeaders);
  }
  if (amountNum > 1000) {
    return jsonResponse({ success: false, error: 'Amount exceeds maximum per claim (1000 ALMAN)' }, 400, corsHeaders);
  }

  const key = CLAIMER_PRIVATE_KEY.startsWith('0x')
    ? (CLAIMER_PRIVATE_KEY as `0x${string}`)
    : (`0x${CLAIMER_PRIVATE_KEY}` as `0x${string}`);
  const account = privateKeyToAccount(key);
  const walletClient = createWalletClient({ chain, transport, account });

  try {
    const amountWei = parseEther(amount);
    console.log(`[Mining API] Claiming ${amount} ALMAN for ${userAddress} (points: ${gamePoints || 'N/A'})`);

    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: MINING_POOL_ABI,
      functionName: 'claimForUser',
      args: [userAddress as `0x${string}`, amountWei],
      account,
      chain,
    });

    console.log(`[Mining API] Claim tx sent: ${hash}`);

    return jsonResponse(
      {
        success: true,
        data: { txHash: hash, amount, userAddress },
      },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Mining API] Claim failed:`, errorMsg);

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
  body: { userAddress?: string },
  contractAddress: `0x${string}`,
  transport: ReturnType<typeof fallback>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const publicClient = createPublicClient({ chain, transport });

  try {
    const queries = [
      publicClient.readContract({ address: contractAddress, abi: MINING_POOL_ABI, functionName: 'getCurrentEpoch' }),
      publicClient.readContract({ address: contractAddress, abi: MINING_POOL_ABI, functionName: 'remainingPool' }),
      publicClient.readContract({ address: contractAddress, abi: MINING_POOL_ABI, functionName: 'totalClaimed' }),
      publicClient.readContract({ address: contractAddress, abi: MINING_POOL_ABI, functionName: 'miningProgress' }),
      publicClient.readContract({ address: contractAddress, abi: MINING_POOL_ABI, functionName: 'getDailyRemaining' }),
      publicClient.readContract({ address: contractAddress, abi: MINING_POOL_ABI, functionName: 'getContractBalance' }),
      publicClient.readContract({ address: contractAddress, abi: MINING_POOL_ABI, functionName: 'dailyClaimLimit' }),
      publicClient.readContract({ address: contractAddress, abi: MINING_POOL_ABI, functionName: 'userDailyClaimLimit' }),
    ];

    if (body.userAddress && isAddress(body.userAddress)) {
      queries.push(
        publicClient.readContract({
          address: contractAddress,
          abi: MINING_POOL_ABI,
          functionName: 'getUserDailyRemaining',
          args: [body.userAddress as `0x${string}`],
        })
      );
    }

    const results = await Promise.all(queries);

    const data: Record<string, unknown> = {
      currentEpoch: Number(results[0]),
      remainingPool: formatEther(results[1] as bigint),
      totalClaimed: formatEther(results[2] as bigint),
      miningProgress: Number(results[3]) / 100,
      dailyRemaining: formatEther(results[4] as bigint),
      contractBalance: formatEther(results[5] as bigint),
      dailyClaimLimit: formatEther(results[6] as bigint),
      userDailyClaimLimit: formatEther(results[7] as bigint),
    };

    if (results.length > 8) {
      data.userDailyRemaining = formatEther(results[8] as bigint);
    }

    return jsonResponse({ success: true, data }, 200, corsHeaders);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Mining API] Status query failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  headers: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
