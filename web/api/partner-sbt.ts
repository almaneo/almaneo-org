/**
 * Partner SBT API (viem version)
 * Vercel Serverless Function for PartnerSBT contract interactions
 *
 * POST /api/partner-sbt
 * Actions:
 * - mintPartner: Mint new Partner SBT (ADMIN_API_SECRET required)
 * - renewPartner: Renew Partner SBT (RENEWER_ROLE via VERIFIER_PRIVATE_KEY)
 * - revokePartner: Revoke Partner SBT (ADMIN_API_SECRET required)
 * - checkValidity: Check if partner SBT is valid (public)
 * - getPartnerData: Get on-chain partner data (public)
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  fallback,
  isAddress,
  parseAbi,
  type Hash,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy, polygon } from 'viem/chains';
import { createClient } from '@supabase/supabase-js';

const PARTNER_SBT_ABI = parseAbi([
  'function mintPartnerSBT(address to, string businessName) external returns (uint256)',
  'function renewPartnerSBT(address partner) external',
  'function revokePartnerSBT(address partner, string reason) external',
  'function isValid(address account) view returns (bool)',
  'function hasPartnerSBT(address account) view returns (bool)',
  'function getPartnerByAddress(address account) view returns (uint256 tokenId, string businessName, uint256 mintedAt, uint256 expiresAt, uint256 lastRenewedAt, uint256 renewalCount, bool isRevoked, bool valid)',
  'function daysUntilExpiry(address account) view returns (int256)',
  'function totalMinted() view returns (uint256)',
]);

const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  80002: '0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08',
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
const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const chain = CHAIN_ID === 137 ? polygon : polygonAmoy;

function getTransport() {
  const urls = RPC_URLS[CHAIN_ID] || [];
  return fallback(urls.map(url => http(url, { timeout: 15_000 })));
}

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Secret',
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

    console.log(`[PartnerSBT API] Action: ${action}, Chain: ${CHAIN_ID}`);

    const transport = getTransport();

    // Public read-only actions (no auth needed)
    if (action === 'checkValidity' || action === 'getPartnerData') {
      const publicClient = createPublicClient({ chain, transport });

      if (action === 'checkValidity') {
        return handleCheckValidity(body.partnerAddress, contractAddress, publicClient, corsHeaders);
      }
      return handleGetPartnerData(body.partnerAddress, contractAddress, publicClient, corsHeaders);
    }

    // Admin write actions
    if (action === 'mintPartner' || action === 'revokePartner') {
      const adminSecret = request.headers.get('X-Admin-Secret');
      if (!ADMIN_API_SECRET || adminSecret !== ADMIN_API_SECRET) {
        return jsonResponse({ success: false, error: 'Unauthorized' }, 401, corsHeaders);
      }
    }

    // All write actions need VERIFIER_PRIVATE_KEY
    if (!VERIFIER_PRIVATE_KEY) {
      return jsonResponse({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
    }

    const key = VERIFIER_PRIVATE_KEY.startsWith('0x')
      ? (VERIFIER_PRIVATE_KEY as `0x${string}`)
      : (`0x${VERIFIER_PRIVATE_KEY}` as `0x${string}`);
    const account = privateKeyToAccount(key);
    const publicClient = createPublicClient({ chain, transport });
    const walletClient = createWalletClient({ chain, transport, account });

    if (action === 'mintPartner') {
      return handleMintPartner(body, contractAddress, publicClient, walletClient, account, corsHeaders);
    }
    if (action === 'renewPartner') {
      return handleRenewPartner(body, contractAddress, publicClient, walletClient, account, corsHeaders);
    }
    if (action === 'revokePartner') {
      return handleRevokePartner(body, contractAddress, walletClient, account, corsHeaders);
    }

    return jsonResponse({ success: false, error: 'Invalid action' }, 400, corsHeaders);
  } catch (error) {
    console.error('[PartnerSBT API] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      corsHeaders
    );
  }
}

async function handleMintPartner(
  body: { partnerAddress: string; businessName: string },
  contractAddress: `0x${string}`,
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { partnerAddress, businessName } = body;
  if (!partnerAddress || !businessName) {
    return jsonResponse({ success: false, error: 'Missing required fields: partnerAddress, businessName' }, 400, corsHeaders);
  }
  if (!isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    console.log(`[PartnerSBT API] Minting for ${partnerAddress}: ${businessName}`);
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: PARTNER_SBT_ABI,
      functionName: 'mintPartnerSBT',
      args: [partnerAddress as `0x${string}`, businessName],
      account,
      chain,
    });
    console.log(`[PartnerSBT API] Tx sent: ${hash}`);

    syncPartnerAfterTx(hash, partnerAddress, contractAddress, publicClient).catch(() => {});

    return jsonResponse({ success: true, txHash: hash, message: `Partner SBT minted for ${businessName}` }, 200, corsHeaders);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Mint failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

async function handleRenewPartner(
  body: { partnerAddress: string },
  contractAddress: `0x${string}`,
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { partnerAddress } = body;
  if (!partnerAddress || !isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    console.log(`[PartnerSBT API] Renewing for ${partnerAddress}`);
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: PARTNER_SBT_ABI,
      functionName: 'renewPartnerSBT',
      args: [partnerAddress as `0x${string}`],
      account,
      chain,
    });
    console.log(`[PartnerSBT API] Tx sent: ${hash}`);

    syncPartnerAfterTx(hash, partnerAddress, contractAddress, publicClient).catch(() => {});

    return jsonResponse({ success: true, txHash: hash, message: 'Partner SBT renewed' }, 200, corsHeaders);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Renew failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

async function handleRevokePartner(
  body: { partnerAddress: string; reason: string },
  contractAddress: `0x${string}`,
  walletClient: ReturnType<typeof createWalletClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { partnerAddress, reason } = body;
  if (!partnerAddress || !reason) {
    return jsonResponse({ success: false, error: 'Missing required fields: partnerAddress, reason' }, 400, corsHeaders);
  }
  if (!isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    console.log(`[PartnerSBT API] Revoking for ${partnerAddress}: ${reason}`);
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: PARTNER_SBT_ABI,
      functionName: 'revokePartnerSBT',
      args: [partnerAddress as `0x${string}`, reason],
      account,
      chain,
    });
    console.log(`[PartnerSBT API] Tx sent: ${hash}`);

    // Clear Supabase SBT data
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        await supabase
          .from('partners')
          .update({ sbt_token_id: null, partnership_expires_at: null })
          .eq('owner_user_id', partnerAddress);
      } catch { /* ignore */ }
    }

    return jsonResponse({ success: true, txHash: hash, message: `Partner SBT revoked: ${reason}` }, 200, corsHeaders);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Revoke failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

async function handleCheckValidity(
  partnerAddress: string,
  contractAddress: `0x${string}`,
  publicClient: ReturnType<typeof createPublicClient>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (!partnerAddress || !isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    const valid = await publicClient.readContract({
      address: contractAddress,
      abi: PARTNER_SBT_ABI,
      functionName: 'isValid',
      args: [partnerAddress as `0x${string}`],
    });
    return jsonResponse(
      { success: true, data: { isValid: valid }, message: valid ? 'Partner is verified' : 'Partner is not verified' },
      200,
      corsHeaders
    );
  } catch {
    return jsonResponse(
      { success: true, data: { isValid: false }, message: 'No Partner SBT found' },
      200,
      corsHeaders
    );
  }
}

async function handleGetPartnerData(
  partnerAddress: string,
  contractAddress: `0x${string}`,
  publicClient: ReturnType<typeof createPublicClient>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (!partnerAddress || !isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    const hasSBT = await publicClient.readContract({
      address: contractAddress,
      abi: PARTNER_SBT_ABI,
      functionName: 'hasPartnerSBT',
      args: [partnerAddress as `0x${string}`],
    });

    if (!hasSBT) {
      return jsonResponse(
        { success: true, data: { hasSBT: false }, message: 'No Partner SBT found' },
        200,
        corsHeaders
      );
    }

    const result = await publicClient.readContract({
      address: contractAddress,
      abi: PARTNER_SBT_ABI,
      functionName: 'getPartnerByAddress',
      args: [partnerAddress as `0x${string}`],
    });

    const [tokenId, businessName, mintedAt, expiresAt, lastRenewedAt, renewalCount, isRevoked, valid] =
      result as [bigint, string, bigint, bigint, bigint, bigint, boolean, boolean];

    const daysLeft = await publicClient.readContract({
      address: contractAddress,
      abi: PARTNER_SBT_ABI,
      functionName: 'daysUntilExpiry',
      args: [partnerAddress as `0x${string}`],
    });

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
          daysUntilExpiry: Number(daysLeft as bigint),
        },
        message: valid ? 'Verified Partner' : 'Partner SBT expired or revoked',
      },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] GetPartnerData failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

async function syncPartnerAfterTx(
  hash: Hash,
  partnerAddress: string,
  contractAddress: `0x${string}`,
  publicClient: ReturnType<typeof createPublicClient>
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;

  try {
    await publicClient.waitForTransactionReceipt({ hash, timeout: 15_000 });

    const result = await publicClient.readContract({
      address: contractAddress,
      abi: PARTNER_SBT_ABI,
      functionName: 'getPartnerByAddress',
      args: [partnerAddress as `0x${string}`],
    });

    const [tokenId, , , expiresAt] = result as [bigint, string, bigint, bigint, bigint, bigint, boolean, boolean];
    const expiresDate = new Date(Number(expiresAt) * 1000).toISOString();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    await supabase
      .from('partners')
      .update({
        sbt_token_id: Number(tokenId),
        partnership_expires_at: expiresDate,
      })
      .eq('owner_user_id', partnerAddress);

    console.log(`[PartnerSBT API] Supabase synced: tokenId=${tokenId}, expires=${expiresDate}`);
  } catch (error) {
    console.error('[PartnerSBT API] Supabase sync failed (best-effort):', error);
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
