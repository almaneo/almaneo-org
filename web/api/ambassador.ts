/**
 * Ambassador API (lightweight edge version)
 * Vercel Edge Function for AmbassadorSBT contract interactions
 *
 * POST /api/ambassador
 * Actions:
 * - recordMeetupVerification: Record meetup attendance for all participants and host
 * - updateKindnessScore: Update a user's kindness score
 * - recordReferral: Record a referral relationship
 *
 * Security:
 * - Uses VERIFIER_PRIVATE_KEY to sign transactions (VERIFIER_ROLE on contract)
 *
 * Uses raw fetch() + @noble/curves — no viem, no ethers (edge-safe < 4 MB)
 */

import {
  sendTransactionAndWait,
  isAddress,
  AmbassadorSBT,
  jsonResponse,
  CORS_HEADERS,
} from './_lib/rpc';

const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');

const CONTRACT_ADDRESSES: Record<number, string> = {
  80002: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B',
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

  if (!VERIFIER_PRIVATE_KEY) {
    return jsonResponse({ success: false, error: 'Server configuration error' }, 500, CORS_HEADERS);
  }

  const contractAddress = CONTRACT_ADDRESSES[CHAIN_ID];
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return jsonResponse({ success: false, error: 'Contract not available' }, 500, CORS_HEADERS);
  }

  try {
    const body = await request.json();
    const { action } = body;
    const pk = VERIFIER_PRIVATE_KEY;

    console.log(`[Ambassador API] Action: ${action}, Chain: ${CHAIN_ID}`);

    if (action === 'recordMeetupVerification') {
      return handleMeetupVerification(body, contractAddress, pk);
    }
    if (action === 'updateKindnessScore') {
      return handleUpdateScore(body, contractAddress, pk);
    }
    if (action === 'recordReferral') {
      return handleRecordReferral(body, contractAddress, pk);
    }

    return jsonResponse({ success: false, error: 'Invalid action' }, 400, CORS_HEADERS);
  } catch (error) {
    console.error('[Ambassador API] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      CORS_HEADERS
    );
  }
}

async function handleMeetupVerification(
  body: { meetupId: string; hostAddress: string; attendedAddresses: string[] },
  contractAddress: string,
  pk: string,
): Promise<Response> {
  const { meetupId, hostAddress, attendedAddresses } = body;

  if (!meetupId || !hostAddress || !Array.isArray(attendedAddresses)) {
    return jsonResponse(
      { success: false, error: 'Missing required fields: meetupId, hostAddress, attendedAddresses' },
      400,
      CORS_HEADERS
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
      const data = AmbassadorSBT.recordMeetupAttendance(addr);
      const { txHash } = await sendTransactionAndWait(CHAIN_ID, pk, contractAddress, data);
      txHashes.push(txHash);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${addr}: ${errorMsg}`);
    }
  }

  // Record host's meetup
  if (isAddress(hostAddress)) {
    try {
      const data = AmbassadorSBT.recordMeetupHosted(hostAddress);
      const { txHash } = await sendTransactionAndWait(CHAIN_ID, pk, contractAddress, data);
      txHashes.push(txHash);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Host (${hostAddress}): ${errorMsg}`);
    }
  }

  if (txHashes.length === 0 && errors.length > 0) {
    return jsonResponse(
      { success: false, error: `All transactions failed: ${errors.join('; ')}` },
      500,
      CORS_HEADERS
    );
  }

  return jsonResponse(
    {
      success: true,
      txHashes,
      message: `Recorded ${txHashes.length} transactions. ${errors.length > 0 ? `Errors: ${errors.join('; ')}` : ''}`,
    },
    200,
    CORS_HEADERS
  );
}

async function handleUpdateScore(
  body: { userAddress: string; newScore: number },
  contractAddress: string,
  pk: string,
): Promise<Response> {
  const { userAddress, newScore } = body;

  if (!userAddress || newScore === undefined) {
    return jsonResponse({ success: false, error: 'Missing required fields: userAddress, newScore' }, 400, CORS_HEADERS);
  }
  if (!isAddress(userAddress)) {
    return jsonResponse({ success: false, error: 'Invalid user address' }, 400, CORS_HEADERS);
  }

  try {
    const data = AmbassadorSBT.updateKindnessScore(userAddress, BigInt(newScore));
    const { txHash } = await sendTransactionAndWait(CHAIN_ID, pk, contractAddress, data);

    return jsonResponse(
      { success: true, txHashes: [txHash], message: `Kindness score updated to ${newScore}` },
      200,
      CORS_HEADERS
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Ambassador API] Failed to update score:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
  }
}

async function handleRecordReferral(
  body: { referrerAddress: string; refereeAddress: string },
  contractAddress: string,
  pk: string,
): Promise<Response> {
  const { referrerAddress, refereeAddress } = body;

  if (!referrerAddress || !refereeAddress) {
    return jsonResponse({ success: false, error: 'Missing required fields: referrerAddress, refereeAddress' }, 400, CORS_HEADERS);
  }
  if (!isAddress(referrerAddress) || !isAddress(refereeAddress)) {
    return jsonResponse({ success: false, error: 'Invalid address' }, 400, CORS_HEADERS);
  }

  try {
    const data = AmbassadorSBT.recordReferral(referrerAddress, refereeAddress);
    const { txHash } = await sendTransactionAndWait(CHAIN_ID, pk, contractAddress, data);

    return jsonResponse(
      { success: true, txHashes: [txHash], message: `Referral recorded: ${referrerAddress} -> ${refereeAddress}` },
      200,
      CORS_HEADERS
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Ambassador API] Failed to record referral:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
  }
}
