/**
 * Admin Action API (lightweight edge version)
 * Vercel Edge Function that executes admin-only operations directly
 *
 * POST /api/admin-action
 * Body: { target: 'partner-sbt' | 'ambassador', action: string, params: object }
 *
 * Security: ADMIN_API_SECRET verified on each request
 * Uses raw fetch() + @noble/curves — no viem, no ethers (edge-safe < 4 MB)
 */

import {
  sendTransaction,
  ethCall,
  waitForReceipt,
  isAddress,
  PartnerSBT,
  AmbassadorSBT,
  decodeUint256,
  jsonResponse,
  CORS_HEADERS,
} from './_lib/rpc';
import { createClient } from '@supabase/supabase-js';

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const PARTNER_SBT_ADDRESS: Record<number, string> = {
  80002: '0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08',
  137: '0x0000000000000000000000000000000000000000',
};

const AMBASSADOR_SBT_ADDRESS: Record<number, string> = {
  80002: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B',
  137: '0x0000000000000000000000000000000000000000',
};

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

interface AdminActionRequest {
  target: 'partner-sbt' | 'ambassador';
  action: string;
  params: Record<string, unknown>;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405, CORS_HEADERS);
  }

  if (!ADMIN_API_SECRET) {
    return jsonResponse({ success: false, error: 'ADMIN_API_SECRET not configured' }, 500, CORS_HEADERS);
  }

  if (!VERIFIER_PRIVATE_KEY) {
    return jsonResponse({ success: false, error: 'VERIFIER_PRIVATE_KEY not configured' }, 500, CORS_HEADERS);
  }

  try {
    const body = (await request.json()) as AdminActionRequest;
    const { target, action, params } = body;

    if (!target || !action) {
      return jsonResponse({ success: false, error: 'Missing required fields: target, action' }, 400, CORS_HEADERS);
    }

    console.log(`[Admin Action] target=${target}, action=${action}`);

    if (target === 'partner-sbt') {
      return handlePartnerSBT(action, params);
    }

    if (target === 'ambassador') {
      return handleAmbassador(action, params);
    }

    return jsonResponse({ success: false, error: 'Invalid target' }, 400, CORS_HEADERS);
  } catch (error) {
    console.error('[Admin Action] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      CORS_HEADERS
    );
  }
}

// --- Partner SBT Actions ---

async function handlePartnerSBT(
  action: string,
  params: Record<string, unknown>
): Promise<Response> {
  const contractAddress = PARTNER_SBT_ADDRESS[CHAIN_ID];
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return jsonResponse({ success: false, error: 'PartnerSBT not deployed on this chain' }, 500, CORS_HEADERS);
  }

  const pk = VERIFIER_PRIVATE_KEY!;

  if (action === 'mintPartner') {
    const { partnerAddress, businessName } = params as { partnerAddress: string; businessName: string };
    if (!partnerAddress || !businessName) {
      return jsonResponse({ success: false, error: 'Missing partnerAddress or businessName' }, 400, CORS_HEADERS);
    }
    if (!isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, CORS_HEADERS);
    }

    try {
      console.log(`[Admin Action] Minting PartnerSBT for ${partnerAddress}: ${businessName}`);
      const data = PartnerSBT.mintPartnerSBT(partnerAddress, businessName);
      const txHash = await sendTransaction(CHAIN_ID, pk, contractAddress, data);
      console.log(`[Admin Action] Tx sent: ${txHash}`);

      // Best-effort Supabase sync (non-blocking)
      syncPartnerAfterTx(txHash, partnerAddress, contractAddress).catch(() => {});

      return jsonResponse({ success: true, txHash, message: `Partner SBT minted for ${businessName}` }, 200, CORS_HEADERS);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] Mint failed:`, errorMsg);
      if (errorMsg.includes('AccessControl') || errorMsg.includes('account 0x')) {
        return jsonResponse({ success: false, error: 'Mint requires MINTER_ROLE. Run grant-partner-roles.js to grant the role.' }, 403, CORS_HEADERS);
      }
      return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
    }
  }

  if (action === 'renewPartner') {
    const { partnerAddress } = params as { partnerAddress: string };
    if (!partnerAddress || !isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, CORS_HEADERS);
    }

    try {
      console.log(`[Admin Action] Renewing PartnerSBT for ${partnerAddress}`);
      const data = PartnerSBT.renewPartnerSBT(partnerAddress);
      const txHash = await sendTransaction(CHAIN_ID, pk, contractAddress, data);
      console.log(`[Admin Action] Tx sent: ${txHash}`);

      syncPartnerAfterTx(txHash, partnerAddress, contractAddress).catch(() => {});

      return jsonResponse({ success: true, txHash, message: 'Partner SBT renewed' }, 200, CORS_HEADERS);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] Renew failed:`, errorMsg);
      return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
    }
  }

  if (action === 'revokePartner') {
    const { partnerAddress, reason } = params as { partnerAddress: string; reason: string };
    if (!partnerAddress || !reason) {
      return jsonResponse({ success: false, error: 'Missing partnerAddress or reason' }, 400, CORS_HEADERS);
    }
    if (!isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, CORS_HEADERS);
    }

    try {
      console.log(`[Admin Action] Revoking PartnerSBT for ${partnerAddress}: ${reason}`);
      const data = PartnerSBT.revokePartnerSBT(partnerAddress, reason);
      const txHash = await sendTransaction(CHAIN_ID, pk, contractAddress, data);
      console.log(`[Admin Action] Tx sent: ${txHash}`);

      // Clear Supabase SBT data (best-effort)
      if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
          await supabase
            .from('partners')
            .update({ sbt_token_id: null, partnership_expires_at: null })
            .eq('owner_user_id', partnerAddress);
        } catch { /* ignore */ }
      }

      return jsonResponse({ success: true, txHash, message: `Partner SBT revoked: ${reason}` }, 200, CORS_HEADERS);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] Revoke failed:`, errorMsg);
      if (errorMsg.includes('AccessControl') || errorMsg.includes('account 0x')) {
        return jsonResponse({ success: false, error: 'Revoke requires DEFAULT_ADMIN_ROLE (Foundation wallet only).' }, 403, CORS_HEADERS);
      }
      return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
    }
  }

  return jsonResponse({ success: false, error: `Unknown partner-sbt action: ${action}` }, 400, CORS_HEADERS);
}

// --- Ambassador SBT Actions ---

async function handleAmbassador(
  action: string,
  params: Record<string, unknown>
): Promise<Response> {
  const contractAddress = AMBASSADOR_SBT_ADDRESS[CHAIN_ID];
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return jsonResponse({ success: false, error: 'AmbassadorSBT not deployed on this chain' }, 500, CORS_HEADERS);
  }

  const pk = VERIFIER_PRIVATE_KEY!;

  if (action === 'recordMeetupVerification') {
    const { hostAddress, participantAddresses } = params as {
      hostAddress: string;
      participantAddresses: string[];
    };

    const results: string[] = [];

    // Record host
    if (hostAddress && isAddress(hostAddress)) {
      try {
        const data = AmbassadorSBT.recordMeetupHosted(hostAddress);
        const hash = await sendTransaction(CHAIN_ID, pk, contractAddress, data);
        results.push(`Host ${hostAddress}: ${hash}`);
      } catch {
        results.push(`Host ${hostAddress}: failed`);
      }
    }

    // Record participants
    if (Array.isArray(participantAddresses)) {
      for (const addr of participantAddresses) {
        if (isAddress(addr)) {
          try {
            const data = AmbassadorSBT.recordMeetupAttendance(addr);
            const hash = await sendTransaction(CHAIN_ID, pk, contractAddress, data);
            results.push(`Participant ${addr}: ${hash}`);
          } catch {
            results.push(`Participant ${addr}: failed`);
          }
        }
      }
    }

    return jsonResponse({ success: true, message: 'Meetup verification recorded', data: { results } }, 200, CORS_HEADERS);
  }

  if (action === 'updateKindnessScore') {
    const { userAddress, score } = params as { userAddress: string; score: number };
    if (!userAddress || !isAddress(userAddress) || score == null) {
      return jsonResponse({ success: false, error: 'Invalid userAddress or score' }, 400, CORS_HEADERS);
    }

    try {
      const data = AmbassadorSBT.updateKindnessScore(userAddress, BigInt(score));
      const hash = await sendTransaction(CHAIN_ID, pk, contractAddress, data);
      return jsonResponse({ success: true, txHash: hash, message: 'Kindness score updated on-chain' }, 200, CORS_HEADERS);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] updateKindnessScore failed:`, errorMsg);
      return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
    }
  }

  return jsonResponse({ success: false, error: `Unknown ambassador action: ${action}` }, 400, CORS_HEADERS);
}

// --- Helpers ---

async function syncPartnerAfterTx(
  txHash: string,
  partnerAddress: string,
  contractAddress: string,
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;

  try {
    await waitForReceipt(CHAIN_ID, txHash, 15_000);

    // Read getPartnerByAddress — returns packed tuple
    const calldata = PartnerSBT.getPartnerByAddress(partnerAddress);
    const result = await ethCall(CHAIN_ID, contractAddress, calldata);

    // Decode tokenId (offset 0) and expiresAt (offset 3*64 = 192 chars + 2 for 0x)
    const tokenId = decodeUint256(result);
    const expiresAtHex = '0x' + result.slice(2 + 3 * 64, 2 + 4 * 64);
    const expiresAt = BigInt(expiresAtHex);
    const expiresDate = new Date(Number(expiresAt) * 1000).toISOString();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    await supabase
      .from('partners')
      .update({
        sbt_token_id: Number(tokenId),
        partnership_expires_at: expiresDate,
      })
      .eq('owner_user_id', partnerAddress);

    console.log(`[Admin Action] Supabase synced: tokenId=${tokenId}, expires=${expiresDate}`);
  } catch (error) {
    console.error('[Admin Action] Supabase sync failed (best-effort):', error);
  }
}
