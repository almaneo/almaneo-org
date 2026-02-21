/**
 * Ambassador API (viem version)
 * Vercel Serverless Function for AmbassadorSBT contract interactions
 *
 * POST /api/ambassador
 * Actions:
 * - recordMeetupVerification: Record meetup attendance for all participants and host
 * - updateKindnessScore: Update a user's kindness score
 * - recordReferral: Record a referral relationship
 *
 * Security:
 * - Uses VERIFIER_PRIVATE_KEY to sign transactions (VERIFIER_ROLE on contract)
 */

import {
  createWalletClient,
  http,
  fallback,
  isAddress,
  parseAbi,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy, polygon } from 'viem/chains';

const AMBASSADOR_SBT_ABI = parseAbi([
  'function recordMeetupAttendance(address account) external',
  'function recordMeetupHosted(address account) external',
  'function updateKindnessScore(address account, uint256 newScore) external',
  'function recordReferral(address referrer, address referee) external',
  'function hasAmbassadorSBT(address account) view returns (bool)',
  'function getAmbassadorByAddress(address account) view returns (uint256 tokenId, uint8 tier, uint256 meetupsAttended, uint256 meetupsHosted, uint256 kindnessScore, uint256 referralCount, uint256 mintedAt)',
]);

const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  80002: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B',
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

const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');

const chain = CHAIN_ID === 137 ? polygon : polygonAmoy;

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

function getWalletClient() {
  if (!VERIFIER_PRIVATE_KEY) throw new Error('VERIFIER_PRIVATE_KEY not configured');

  const key = VERIFIER_PRIVATE_KEY.startsWith('0x')
    ? (VERIFIER_PRIVATE_KEY as `0x${string}`)
    : (`0x${VERIFIER_PRIVATE_KEY}` as `0x${string}`);

  const account = privateKeyToAccount(key);
  const urls = RPC_URLS[CHAIN_ID] || [];
  const transport = fallback(urls.map(url => http(url, { timeout: 15_000 })));
  const walletClient = createWalletClient({ chain, transport, account });

  return { walletClient, account };
}

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

  if (!VERIFIER_PRIVATE_KEY) {
    return jsonResponse({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
  }

  const contractAddress = CONTRACT_ADDRESSES[CHAIN_ID];
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return jsonResponse({ success: false, error: 'Contract not available' }, 500, corsHeaders);
  }

  try {
    const body = await request.json();
    const { action } = body;

    const { walletClient, account } = getWalletClient();

    console.log(`[Ambassador API] Action: ${action}, Chain: ${CHAIN_ID}`);

    switch (action) {
      case 'recordMeetupVerification':
        return handleMeetupVerification(body, contractAddress, walletClient, account, corsHeaders);
      case 'updateKindnessScore':
        return handleUpdateScore(body, contractAddress, walletClient, account, corsHeaders);
      case 'recordReferral':
        return handleRecordReferral(body, contractAddress, walletClient, account, corsHeaders);
      default:
        return jsonResponse({ success: false, error: 'Invalid action' }, 400, corsHeaders);
    }
  } catch (error) {
    console.error('[Ambassador API] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      corsHeaders
    );
  }
}

async function handleMeetupVerification(
  body: { meetupId: string; hostAddress: string; attendedAddresses: string[] },
  contractAddress: `0x${string}`,
  walletClient: ReturnType<typeof createWalletClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { meetupId, hostAddress, attendedAddresses } = body;

  if (!meetupId || !hostAddress || !Array.isArray(attendedAddresses)) {
    return jsonResponse(
      { success: false, error: 'Missing required fields: meetupId, hostAddress, attendedAddresses' },
      400,
      corsHeaders
    );
  }

  const txHashes: string[] = [];
  const errors: string[] = [];

  console.log(`[Ambassador API] Recording meetup ${meetupId} with ${attendedAddresses.length} attendees`);

  // Record attendance for each participant
  for (const addr of attendedAddresses) {
    if (!isAddress(addr)) {
      errors.push(`Invalid address: ${addr}`);
      continue;
    }
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: AMBASSADOR_SBT_ABI,
        functionName: 'recordMeetupAttendance',
        args: [addr as `0x${string}`],
        account,
        chain,
      });
      txHashes.push(hash);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${addr}: ${errorMsg}`);
    }
  }

  // Record host's meetup
  if (isAddress(hostAddress)) {
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: AMBASSADOR_SBT_ABI,
        functionName: 'recordMeetupHosted',
        args: [hostAddress as `0x${string}`],
        account,
        chain,
      });
      txHashes.push(hash);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Host (${hostAddress}): ${errorMsg}`);
    }
  }

  if (txHashes.length === 0 && errors.length > 0) {
    return jsonResponse(
      { success: false, error: `All transactions failed: ${errors.join('; ')}` },
      500,
      corsHeaders
    );
  }

  return jsonResponse(
    {
      success: true,
      txHashes,
      message: `Recorded ${txHashes.length} transactions. ${errors.length > 0 ? `Errors: ${errors.join('; ')}` : ''}`,
    },
    200,
    corsHeaders
  );
}

async function handleUpdateScore(
  body: { userAddress: string; newScore: number },
  contractAddress: `0x${string}`,
  walletClient: ReturnType<typeof createWalletClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { userAddress, newScore } = body;

  if (!userAddress || newScore === undefined) {
    return jsonResponse({ success: false, error: 'Missing required fields: userAddress, newScore' }, 400, corsHeaders);
  }
  if (!isAddress(userAddress)) {
    return jsonResponse({ success: false, error: 'Invalid user address' }, 400, corsHeaders);
  }

  try {
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: AMBASSADOR_SBT_ABI,
      functionName: 'updateKindnessScore',
      args: [userAddress as `0x${string}`, BigInt(newScore)],
      account,
      chain,
    });

    return jsonResponse(
      { success: true, txHashes: [hash], message: `Kindness score updated to ${newScore}` },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Ambassador API] Failed to update score:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

async function handleRecordReferral(
  body: { referrerAddress: string; refereeAddress: string },
  contractAddress: `0x${string}`,
  walletClient: ReturnType<typeof createWalletClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { referrerAddress, refereeAddress } = body;

  if (!referrerAddress || !refereeAddress) {
    return jsonResponse({ success: false, error: 'Missing required fields: referrerAddress, refereeAddress' }, 400, corsHeaders);
  }
  if (!isAddress(referrerAddress) || !isAddress(refereeAddress)) {
    return jsonResponse({ success: false, error: 'Invalid address' }, 400, corsHeaders);
  }

  try {
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: AMBASSADOR_SBT_ABI,
      functionName: 'recordReferral',
      args: [referrerAddress as `0x${string}`, refereeAddress as `0x${string}`],
      account,
      chain,
    });

    return jsonResponse(
      { success: true, txHashes: [hash], message: `Referral recorded: ${referrerAddress} -> ${refereeAddress}` },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Ambassador API] Failed to record referral:`, errorMsg);
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
