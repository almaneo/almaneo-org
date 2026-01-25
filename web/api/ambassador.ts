/**
 * Ambassador API
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
 * - Should only be called from trusted backend services
 */

import { ethers } from 'ethers';

// Contract ABI (only the functions we need)
const AMBASSADOR_SBT_ABI = [
  'function recordMeetupAttendance(address account) external',
  'function recordMeetupHosted(address account) external',
  'function updateKindnessScore(address account, uint256 newScore) external',
  'function recordReferral(address referrer, address referee) external',
  'function hasAmbassadorSBT(address account) view returns (bool)',
  'function getAmbassadorByAddress(address account) view returns (uint256 tokenId, uint8 tier, uint256 meetupsAttended, uint256 meetupsHosted, uint256 kindnessScore, uint256 referralCount, uint256 mintedAt)',
];

// Contract addresses by network
const CONTRACT_ADDRESSES: Record<number, string> = {
  80002: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B', // Polygon Amoy
  137: '', // Polygon Mainnet (not deployed yet)
};

// RPC URLs
const RPC_URLS: Record<number, string> = {
  80002: 'https://rpc-amoy.polygon.technology',
  137: 'https://polygon-rpc.com',
};

// Environment variables
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');

// Request types
interface MeetupVerificationRequest {
  action: 'recordMeetupVerification';
  meetupId: string;
  hostAddress: string;
  attendedAddresses: string[];
}

interface UpdateScoreRequest {
  action: 'updateKindnessScore';
  userAddress: string;
  newScore: number;
}

interface RecordReferralRequest {
  action: 'recordReferral';
  referrerAddress: string;
  refereeAddress: string;
}

type AmbassadorRequest = MeetupVerificationRequest | UpdateScoreRequest | RecordReferralRequest;

// Response types
interface SuccessResponse {
  success: true;
  txHashes?: string[];
  message: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type AmbassadorResponse = SuccessResponse | ErrorResponse;

export const config = {
  runtime: 'nodejs', // Need nodejs for ethers.js
  maxDuration: 60, // Allow up to 60 seconds for multiple transactions
};

export default async function handler(request: Request): Promise<Response> {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // POST only
  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405, corsHeaders);
  }

  // Check environment variables
  if (!VERIFIER_PRIVATE_KEY) {
    console.error('[Ambassador API] VERIFIER_PRIVATE_KEY is not set');
    return jsonResponse({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
  }

  const contractAddress = CONTRACT_ADDRESSES[CHAIN_ID];
  if (!contractAddress) {
    console.error('[Ambassador API] Contract not deployed on chain:', CHAIN_ID);
    return jsonResponse({ success: false, error: 'Contract not available' }, 500, corsHeaders);
  }

  try {
    const body = (await request.json()) as AmbassadorRequest;
    const { action } = body;

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_URLS[CHAIN_ID]);
    const wallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, AMBASSADOR_SBT_ABI, wallet);

    console.log(`[Ambassador API] Action: ${action}, Chain: ${CHAIN_ID}`);

    switch (action) {
      case 'recordMeetupVerification':
        return handleMeetupVerification(body as MeetupVerificationRequest, contract, corsHeaders);

      case 'updateKindnessScore':
        return handleUpdateScore(body as UpdateScoreRequest, contract, corsHeaders);

      case 'recordReferral':
        return handleRecordReferral(body as RecordReferralRequest, contract, corsHeaders);

      default:
        return jsonResponse({ success: false, error: 'Invalid action' }, 400, corsHeaders);
    }
  } catch (error) {
    console.error('[Ambassador API] Error:', error);
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      500,
      corsHeaders
    );
  }
}

/**
 * Handle meetup verification - record attendance for all participants and host
 */
async function handleMeetupVerification(
  body: MeetupVerificationRequest,
  contract: ethers.Contract,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { meetupId, hostAddress, attendedAddresses } = body;

  if (!meetupId || !hostAddress || !attendedAddresses || !Array.isArray(attendedAddresses)) {
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
  for (const address of attendedAddresses) {
    try {
      if (!ethers.isAddress(address)) {
        errors.push(`Invalid address: ${address}`);
        continue;
      }

      console.log(`[Ambassador API] Recording attendance for ${address}`);
      const tx = await contract.recordMeetupAttendance(address);
      await tx.wait();
      txHashes.push(tx.hash);
      console.log(`[Ambassador API] Attendance recorded: ${tx.hash}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Ambassador API] Failed to record attendance for ${address}:`, errorMsg);
      errors.push(`${address}: ${errorMsg}`);
    }
  }

  // Record host's meetup
  try {
    if (ethers.isAddress(hostAddress)) {
      console.log(`[Ambassador API] Recording host meetup for ${hostAddress}`);
      const tx = await contract.recordMeetupHosted(hostAddress);
      await tx.wait();
      txHashes.push(tx.hash);
      console.log(`[Ambassador API] Host recorded: ${tx.hash}`);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Ambassador API] Failed to record host:`, errorMsg);
    errors.push(`Host (${hostAddress}): ${errorMsg}`);
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

/**
 * Handle kindness score update
 */
async function handleUpdateScore(
  body: UpdateScoreRequest,
  contract: ethers.Contract,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { userAddress, newScore } = body;

  if (!userAddress || newScore === undefined) {
    return jsonResponse(
      { success: false, error: 'Missing required fields: userAddress, newScore' },
      400,
      corsHeaders
    );
  }

  if (!ethers.isAddress(userAddress)) {
    return jsonResponse({ success: false, error: 'Invalid user address' }, 400, corsHeaders);
  }

  try {
    console.log(`[Ambassador API] Updating score for ${userAddress} to ${newScore}`);
    const tx = await contract.updateKindnessScore(userAddress, newScore);
    await tx.wait();
    console.log(`[Ambassador API] Score updated: ${tx.hash}`);

    return jsonResponse(
      {
        success: true,
        txHashes: [tx.hash],
        message: `Kindness score updated to ${newScore}`,
      },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Ambassador API] Failed to update score:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

/**
 * Handle referral recording
 */
async function handleRecordReferral(
  body: RecordReferralRequest,
  contract: ethers.Contract,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { referrerAddress, refereeAddress } = body;

  if (!referrerAddress || !refereeAddress) {
    return jsonResponse(
      { success: false, error: 'Missing required fields: referrerAddress, refereeAddress' },
      400,
      corsHeaders
    );
  }

  if (!ethers.isAddress(referrerAddress) || !ethers.isAddress(refereeAddress)) {
    return jsonResponse({ success: false, error: 'Invalid address' }, 400, corsHeaders);
  }

  try {
    console.log(`[Ambassador API] Recording referral: ${referrerAddress} -> ${refereeAddress}`);
    const tx = await contract.recordReferral(referrerAddress, refereeAddress);
    await tx.wait();
    console.log(`[Ambassador API] Referral recorded: ${tx.hash}`);

    return jsonResponse(
      {
        success: true,
        txHashes: [tx.hash],
        message: `Referral recorded: ${referrerAddress} -> ${refereeAddress}`,
      },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Ambassador API] Failed to record referral:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

/**
 * Helper to create JSON response
 */
function jsonResponse(
  data: AmbassadorResponse,
  status: number,
  headers: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
