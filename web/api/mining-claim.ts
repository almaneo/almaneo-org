/**
 * Mining Claim API (lightweight edge version)
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
 *
 * Uses raw fetch() + @noble/curves — no viem, no ethers (edge-safe < 4 MB)
 */

import {
  sendTransaction,
  ethCall,
  isAddress,
  MiningPool,
  decodeUint256,
  formatEther,
  parseEther,
  jsonResponse,
  CORS_HEADERS,
} from './_lib/rpc';

const CLAIMER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');

const CONTRACT_ADDRESSES: Record<number, string> = {
  80002: '0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9',
  137: '0x0000000000000000000000000000000000000000',
};

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405, CORS_HEADERS);
  }

  const contractAddress = CONTRACT_ADDRESSES[CHAIN_ID];
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return jsonResponse({ success: false, error: 'Contract not available' }, 500, CORS_HEADERS);
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'claimTokens') {
      return handleClaimTokens(body, contractAddress);
    }
    if (action === 'getStatus') {
      return handleGetStatus(body, contractAddress);
    }

    return jsonResponse({ success: false, error: 'Invalid action' }, 400, CORS_HEADERS);
  } catch (error) {
    console.error('[Mining API] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      CORS_HEADERS
    );
  }
}

async function handleClaimTokens(
  body: { userAddress: string; amount: string; gamePoints?: number },
  contractAddress: string,
): Promise<Response> {
  if (!CLAIMER_PRIVATE_KEY) {
    return jsonResponse({ success: false, error: 'Server configuration error' }, 500, CORS_HEADERS);
  }

  const { userAddress, amount, gamePoints } = body;

  if (!userAddress || !amount) {
    return jsonResponse({ success: false, error: 'Missing required fields: userAddress, amount' }, 400, CORS_HEADERS);
  }
  if (!isAddress(userAddress)) {
    return jsonResponse({ success: false, error: 'Invalid user address' }, 400, CORS_HEADERS);
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return jsonResponse({ success: false, error: 'Amount must be positive' }, 400, CORS_HEADERS);
  }
  if (amountNum > 1000) {
    return jsonResponse({ success: false, error: 'Amount exceeds maximum per claim (1000 ALMAN)' }, 400, CORS_HEADERS);
  }

  try {
    const amountWei = parseEther(amount);
    console.log(`[Mining API] Claiming ${amount} ALMAN for ${userAddress} (points: ${gamePoints || 'N/A'})`);

    const data = MiningPool.claimForUser(userAddress, amountWei);
    const hash = await sendTransaction(CHAIN_ID, CLAIMER_PRIVATE_KEY, contractAddress, data);

    console.log(`[Mining API] Claim tx sent: ${hash}`);

    return jsonResponse(
      {
        success: true,
        data: { txHash: hash, amount, userAddress },
      },
      200,
      CORS_HEADERS
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Mining API] Claim failed:`, errorMsg);

    if (errorMsg.includes('Daily limit')) {
      return jsonResponse({ success: false, error: 'Daily claim limit reached' }, 429, CORS_HEADERS);
    }
    if (errorMsg.includes('User daily limit')) {
      return jsonResponse({ success: false, error: 'User daily limit reached' }, 429, CORS_HEADERS);
    }
    if (errorMsg.includes('Pool depleted')) {
      return jsonResponse({ success: false, error: 'Mining pool is depleted' }, 410, CORS_HEADERS);
    }

    return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
  }
}

async function handleGetStatus(
  body: { userAddress?: string },
  contractAddress: string,
): Promise<Response> {
  try {
    // Fetch all status in parallel
    const queries = [
      ethCall(CHAIN_ID, contractAddress, MiningPool.getCurrentEpoch()),
      ethCall(CHAIN_ID, contractAddress, MiningPool.remainingPool()),
      ethCall(CHAIN_ID, contractAddress, MiningPool.totalClaimed()),
      ethCall(CHAIN_ID, contractAddress, MiningPool.miningProgress()),
      ethCall(CHAIN_ID, contractAddress, MiningPool.getDailyRemaining()),
      ethCall(CHAIN_ID, contractAddress, MiningPool.getContractBalance()),
      ethCall(CHAIN_ID, contractAddress, MiningPool.dailyClaimLimit()),
      ethCall(CHAIN_ID, contractAddress, MiningPool.userDailyClaimLimit()),
    ];

    if (body.userAddress && isAddress(body.userAddress)) {
      queries.push(
        ethCall(CHAIN_ID, contractAddress, MiningPool.getUserDailyRemaining(body.userAddress))
      );
    }

    const results = await Promise.all(queries);

    const data: Record<string, unknown> = {
      currentEpoch: Number(decodeUint256(results[0])),
      remainingPool: formatEther(decodeUint256(results[1])),
      totalClaimed: formatEther(decodeUint256(results[2])),
      miningProgress: Number(decodeUint256(results[3])) / 100,
      dailyRemaining: formatEther(decodeUint256(results[4])),
      contractBalance: formatEther(decodeUint256(results[5])),
      dailyClaimLimit: formatEther(decodeUint256(results[6])),
      userDailyClaimLimit: formatEther(decodeUint256(results[7])),
    };

    if (results.length > 8) {
      data.userDailyRemaining = formatEther(decodeUint256(results[8]));
    }

    return jsonResponse({ success: true, data }, 200, CORS_HEADERS);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Mining API] Status query failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
  }
}
