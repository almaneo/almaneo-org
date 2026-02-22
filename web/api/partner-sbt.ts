/**
 * Partner SBT API (lightweight edge version)
 * Vercel Edge Function for PartnerSBT contract interactions
 *
 * POST /api/partner-sbt
 * Actions:
 * - mintPartner: Mint new Partner SBT (ADMIN_API_SECRET required)
 * - renewPartner: Renew Partner SBT (RENEWER_ROLE via VERIFIER_PRIVATE_KEY)
 * - revokePartner: Revoke Partner SBT (ADMIN_API_SECRET required)
 * - checkValidity: Check if partner SBT is valid (public)
 * - getPartnerData: Get on-chain partner data (public)
 *
 * Uses raw fetch() + @noble/curves — no viem, no ethers (edge-safe < 4 MB)
 */

import {
  sendTransactionAndWait,
  ethCall,
  waitForReceipt,
  isAddress,
  PartnerSBT,
  decodeBool,
  decodeInt256,
  jsonResponse,
  CORS_HEADERS,
} from './_lib/rpc';
import { createClient } from '@supabase/supabase-js';

const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const CONTRACT_ADDRESSES: Record<number, string> = {
  80002: '0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08',
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

    console.log(`[PartnerSBT API] Action: ${action}, Chain: ${CHAIN_ID}`);

    // Public read-only actions (no auth needed)
    if (action === 'checkValidity') {
      return handleCheckValidity(body.partnerAddress, contractAddress);
    }
    if (action === 'getPartnerData') {
      return handleGetPartnerData(body.partnerAddress, contractAddress);
    }

    // Admin write actions
    if (action === 'mintPartner' || action === 'revokePartner') {
      const adminSecret = request.headers.get('X-Admin-Secret');
      if (!ADMIN_API_SECRET || adminSecret !== ADMIN_API_SECRET) {
        return jsonResponse({ success: false, error: 'Unauthorized' }, 401, CORS_HEADERS);
      }
    }

    // All write actions need VERIFIER_PRIVATE_KEY
    if (!VERIFIER_PRIVATE_KEY) {
      return jsonResponse({ success: false, error: 'Server configuration error' }, 500, CORS_HEADERS);
    }

    const pk = VERIFIER_PRIVATE_KEY;

    if (action === 'mintPartner') {
      return handleMintPartner(body, contractAddress, pk);
    }
    if (action === 'renewPartner') {
      return handleRenewPartner(body, contractAddress, pk);
    }
    if (action === 'revokePartner') {
      return handleRevokePartner(body, contractAddress, pk);
    }

    return jsonResponse({ success: false, error: 'Invalid action' }, 400, CORS_HEADERS);
  } catch (error) {
    console.error('[PartnerSBT API] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      CORS_HEADERS
    );
  }
}

async function handleMintPartner(
  body: { partnerAddress: string; businessName: string },
  contractAddress: string,
  pk: string,
): Promise<Response> {
  const { partnerAddress, businessName } = body;
  if (!partnerAddress || !businessName) {
    return jsonResponse({ success: false, error: 'Missing required fields: partnerAddress, businessName' }, 400, CORS_HEADERS);
  }
  if (!isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, CORS_HEADERS);
  }

  try {
    console.log(`[PartnerSBT API] Minting for ${partnerAddress}: ${businessName}`);
    const data = PartnerSBT.mintPartnerSBT(partnerAddress, businessName);
    const { txHash } = await sendTransactionAndWait(CHAIN_ID, pk, contractAddress, data);
    console.log(`[PartnerSBT API] Mint confirmed: ${txHash}`);

    await syncPartnerAfterTx(txHash, partnerAddress, contractAddress).catch((e) => {
      console.warn('[PartnerSBT API] Supabase sync failed (non-critical):', e);
    });

    return jsonResponse({ success: true, txHash, message: `Partner SBT minted for ${businessName}` }, 200, CORS_HEADERS);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Mint failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
  }
}

async function handleRenewPartner(
  body: { partnerAddress: string },
  contractAddress: string,
  pk: string,
): Promise<Response> {
  const { partnerAddress } = body;
  if (!partnerAddress || !isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, CORS_HEADERS);
  }

  try {
    console.log(`[PartnerSBT API] Renewing for ${partnerAddress}`);
    const data = PartnerSBT.renewPartnerSBT(partnerAddress);
    const { txHash } = await sendTransactionAndWait(CHAIN_ID, pk, contractAddress, data);
    console.log(`[PartnerSBT API] Renew confirmed: ${txHash}`);

    await syncPartnerAfterTx(txHash, partnerAddress, contractAddress).catch((e) => {
      console.warn('[PartnerSBT API] Supabase sync failed (non-critical):', e);
    });

    return jsonResponse({ success: true, txHash, message: 'Partner SBT renewed' }, 200, CORS_HEADERS);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Renew failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
  }
}

async function handleRevokePartner(
  body: { partnerAddress: string; reason: string },
  contractAddress: string,
  pk: string,
): Promise<Response> {
  const { partnerAddress, reason } = body;
  if (!partnerAddress || !reason) {
    return jsonResponse({ success: false, error: 'Missing required fields: partnerAddress, reason' }, 400, CORS_HEADERS);
  }
  if (!isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, CORS_HEADERS);
  }

  try {
    console.log(`[PartnerSBT API] Revoking for ${partnerAddress}: ${reason}`);
    const data = PartnerSBT.revokePartnerSBT(partnerAddress, reason);
    const { txHash } = await sendTransactionAndWait(CHAIN_ID, pk, contractAddress, data);
    console.log(`[PartnerSBT API] Revoke confirmed: ${txHash}`);

    // Clear Supabase SBT data
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        await supabase
          .from('partners')
          .update({ sbt_token_id: null, partnership_expires_at: null })
          .eq('owner_user_id', partnerAddress.toLowerCase());
      } catch { /* ignore */ }
    }

    return jsonResponse({ success: true, txHash, message: `Partner SBT revoked: ${reason}` }, 200, CORS_HEADERS);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Revoke failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
  }
}

async function handleCheckValidity(
  partnerAddress: string,
  contractAddress: string,
): Promise<Response> {
  if (!partnerAddress || !isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, CORS_HEADERS);
  }

  try {
    const calldata = PartnerSBT.isValid(partnerAddress);
    const result = await ethCall(CHAIN_ID, contractAddress, calldata);
    const valid = decodeBool(result);
    return jsonResponse(
      { success: true, data: { isValid: valid }, message: valid ? 'Partner is verified' : 'Partner is not verified' },
      200,
      CORS_HEADERS
    );
  } catch {
    return jsonResponse(
      { success: true, data: { isValid: false }, message: 'No Partner SBT found' },
      200,
      CORS_HEADERS
    );
  }
}

async function handleGetPartnerData(
  partnerAddress: string,
  contractAddress: string,
): Promise<Response> {
  if (!partnerAddress || !isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, CORS_HEADERS);
  }

  try {
    // Check if has SBT
    const hasCalldata = PartnerSBT.hasPartnerSBT(partnerAddress);
    const hasResult = await ethCall(CHAIN_ID, contractAddress, hasCalldata);
    const hasSBT = decodeBool(hasResult);

    if (!hasSBT) {
      return jsonResponse(
        { success: true, data: { hasSBT: false }, message: 'No Partner SBT found' },
        200,
        CORS_HEADERS
      );
    }

    // Get partner data — returns packed tuple of 8 fields (32 bytes each for fixed types)
    const calldata = PartnerSBT.getPartnerByAddress(partnerAddress);
    const result = await ethCall(CHAIN_ID, contractAddress, calldata);

    // Decode each 32-byte slot from the result
    // tokenId(uint256), businessName(string-offset), mintedAt(uint256), expiresAt(uint256),
    // lastRenewedAt(uint256), renewalCount(uint256), isRevoked(bool), valid(bool)
    const hex = result.slice(2); // remove 0x
    const slot = (i: number) => BigInt('0x' + hex.slice(i * 64, (i + 1) * 64));

    const tokenId = slot(0);
    // slot(1) is offset to string data — skip complex string decoding for business name
    const mintedAt = slot(2);
    const expiresAt = slot(3);
    const lastRenewedAt = slot(4);
    const renewalCount = slot(5);
    const isRevoked = slot(6) !== 0n;
    const valid = slot(7) !== 0n;

    // Decode business name from dynamic data
    const strOffset = Number(slot(1)); // byte offset from start of data
    const strSlotStart = (strOffset / 32) * 64; // hex char position
    const strLen = Number(BigInt('0x' + hex.slice(strSlotStart, strSlotStart + 64)));
    const strHex = hex.slice(strSlotStart + 64, strSlotStart + 64 + strLen * 2);
    const businessName = decodeHexString(strHex);

    // Get days until expiry
    const daysCalldata = PartnerSBT.daysUntilExpiry(partnerAddress);
    const daysResult = await ethCall(CHAIN_ID, contractAddress, daysCalldata);
    const daysLeft = decodeInt256(daysResult);

    return jsonResponse(
      {
        success: true,
        data: {
          hasSBT: true,
          tokenId: tokenId.toString(),
          businessName,
          mintedAt: Number(mintedAt),
          expiresAt: Number(expiresAt),
          lastRenewedAt: Number(lastRenewedAt),
          renewalCount: Number(renewalCount),
          isRevoked,
          valid,
          daysUntilExpiry: Number(daysLeft),
        },
        message: valid ? 'Verified Partner' : 'Partner SBT expired or revoked',
      },
      200,
      CORS_HEADERS
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] GetPartnerData failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, CORS_HEADERS);
  }
}

function decodeHexString(hex: string): string {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

async function syncPartnerAfterTx(
  txHash: string,
  partnerAddress: string,
  contractAddress: string,
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;

  try {
    await waitForReceipt(CHAIN_ID, txHash, 15_000);

    const calldata = PartnerSBT.getPartnerByAddress(partnerAddress);
    const result = await ethCall(CHAIN_ID, contractAddress, calldata);

    const hex = result.slice(2);
    const tokenId = BigInt('0x' + hex.slice(0, 64));
    const expiresAt = BigInt('0x' + hex.slice(3 * 64, 4 * 64));
    const expiresDate = new Date(Number(expiresAt) * 1000).toISOString();

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    await supabase
      .from('partners')
      .update({
        sbt_token_id: Number(tokenId),
        partnership_expires_at: expiresDate,
      })
      .eq('owner_user_id', partnerAddress.toLowerCase());

    console.log(`[PartnerSBT API] Supabase synced: tokenId=${tokenId}, expires=${expiresDate}`);
  } catch (error) {
    console.error('[PartnerSBT API] Supabase sync failed (best-effort):', error);
  }
}
