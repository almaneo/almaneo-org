/**
 * Admin Action API (viem version)
 * Vercel Serverless Function that executes admin-only operations directly
 *
 * POST /api/admin-action
 * Body: { target: 'partner-sbt' | 'ambassador', action: string, params: object }
 *
 * Security: ADMIN_API_SECRET verified on each request
 * Uses viem instead of ethers for faster cold starts and smaller bundle
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

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const chain = CHAIN_ID === 137 ? polygon : polygonAmoy;

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

const PARTNER_SBT_ADDRESS: Record<number, `0x${string}`> = {
  80002: '0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08',
  137: '0x0000000000000000000000000000000000000000',
};

const AMBASSADOR_SBT_ADDRESS: Record<number, `0x${string}`> = {
  80002: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B',
  137: '0x0000000000000000000000000000000000000000',
};

const PARTNER_SBT_ABI = parseAbi([
  'function mintPartnerSBT(address to, string businessName) external returns (uint256)',
  'function renewPartnerSBT(address partner) external',
  'function revokePartnerSBT(address partner, string reason) external',
  'function getPartnerByAddress(address account) view returns (uint256 tokenId, string businessName, uint256 mintedAt, uint256 expiresAt, uint256 lastRenewedAt, uint256 renewalCount, bool isRevoked, bool valid)',
]);

const AMBASSADOR_SBT_ABI = parseAbi([
  'function recordMeetupAttendance(address user) external',
  'function recordMeetupHosted(address user) external',
  'function updateKindnessScore(address user, uint256 newScore) external',
  'function recordReferral(address referrer) external',
]);

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

interface AdminActionRequest {
  target: 'partner-sbt' | 'ambassador';
  action: string;
  params: Record<string, unknown>;
}

function getClients() {
  if (!VERIFIER_PRIVATE_KEY) throw new Error('VERIFIER_PRIVATE_KEY not configured');

  const key = VERIFIER_PRIVATE_KEY.startsWith('0x')
    ? (VERIFIER_PRIVATE_KEY as `0x${string}`)
    : (`0x${VERIFIER_PRIVATE_KEY}` as `0x${string}`);

  const account = privateKeyToAccount(key);
  const urls = RPC_URLS[CHAIN_ID] || [];
  const transport = fallback(urls.map(url => http(url, { timeout: 15_000 })));

  const publicClient = createPublicClient({ chain, transport });
  const walletClient = createWalletClient({ chain, transport, account });

  return { publicClient, walletClient, account };
}

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405, corsHeaders);
  }

  if (!ADMIN_API_SECRET) {
    return jsonResponse({ success: false, error: 'ADMIN_API_SECRET not configured' }, 500, corsHeaders);
  }

  if (!VERIFIER_PRIVATE_KEY) {
    return jsonResponse({ success: false, error: 'VERIFIER_PRIVATE_KEY not configured' }, 500, corsHeaders);
  }

  try {
    const body = (await request.json()) as AdminActionRequest;
    const { target, action, params } = body;

    if (!target || !action) {
      return jsonResponse({ success: false, error: 'Missing required fields: target, action' }, 400, corsHeaders);
    }

    console.log(`[Admin Action] target=${target}, action=${action}`);

    const { publicClient, walletClient, account } = getClients();

    if (target === 'partner-sbt') {
      return handlePartnerSBT(action, params, publicClient, walletClient, account, corsHeaders);
    }

    if (target === 'ambassador') {
      return handleAmbassador(action, params, publicClient, walletClient, account, corsHeaders);
    }

    return jsonResponse({ success: false, error: 'Invalid target' }, 400, corsHeaders);
  } catch (error) {
    console.error('[Admin Action] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      corsHeaders
    );
  }
}

// --- Partner SBT Actions ---

async function handlePartnerSBT(
  action: string,
  params: Record<string, unknown>,
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const address = PARTNER_SBT_ADDRESS[CHAIN_ID];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    return jsonResponse({ success: false, error: 'PartnerSBT not deployed on this chain' }, 500, corsHeaders);
  }

  if (action === 'mintPartner') {
    const { partnerAddress, businessName } = params as { partnerAddress: string; businessName: string };
    if (!partnerAddress || !businessName) {
      return jsonResponse({ success: false, error: 'Missing partnerAddress or businessName' }, 400, corsHeaders);
    }
    if (!isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
    }

    try {
      console.log(`[Admin Action] Minting PartnerSBT for ${partnerAddress}: ${businessName}`);
      const hash = await walletClient.writeContract({
        address,
        abi: PARTNER_SBT_ABI,
        functionName: 'mintPartnerSBT',
        args: [partnerAddress as `0x${string}`, businessName],
        account,
        chain,
      });
      console.log(`[Admin Action] Tx sent: ${hash}`);

      // Best-effort Supabase sync (non-blocking, short timeout)
      syncPartnerAfterTx(hash, partnerAddress, address, publicClient).catch(() => {});

      return jsonResponse({ success: true, txHash: hash, message: `Partner SBT minted for ${businessName}` }, 200, corsHeaders);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] Mint failed:`, errorMsg);
      if (errorMsg.includes('AccessControl') || errorMsg.includes('account 0x')) {
        return jsonResponse({ success: false, error: 'Mint requires MINTER_ROLE. Run grant-partner-roles.js to grant the role.' }, 403, corsHeaders);
      }
      return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
    }
  }

  if (action === 'renewPartner') {
    const { partnerAddress } = params as { partnerAddress: string };
    if (!partnerAddress || !isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
    }

    try {
      console.log(`[Admin Action] Renewing PartnerSBT for ${partnerAddress}`);
      const hash = await walletClient.writeContract({
        address,
        abi: PARTNER_SBT_ABI,
        functionName: 'renewPartnerSBT',
        args: [partnerAddress as `0x${string}`],
        account,
        chain,
      });
      console.log(`[Admin Action] Tx sent: ${hash}`);

      syncPartnerAfterTx(hash, partnerAddress, address, publicClient).catch(() => {});

      return jsonResponse({ success: true, txHash: hash, message: 'Partner SBT renewed' }, 200, corsHeaders);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] Renew failed:`, errorMsg);
      return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
    }
  }

  if (action === 'revokePartner') {
    const { partnerAddress, reason } = params as { partnerAddress: string; reason: string };
    if (!partnerAddress || !reason) {
      return jsonResponse({ success: false, error: 'Missing partnerAddress or reason' }, 400, corsHeaders);
    }
    if (!isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
    }

    try {
      console.log(`[Admin Action] Revoking PartnerSBT for ${partnerAddress}: ${reason}`);
      const hash = await walletClient.writeContract({
        address,
        abi: PARTNER_SBT_ABI,
        functionName: 'revokePartnerSBT',
        args: [partnerAddress as `0x${string}`, reason],
        account,
        chain,
      });
      console.log(`[Admin Action] Tx sent: ${hash}`);

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

      return jsonResponse({ success: true, txHash: hash, message: `Partner SBT revoked: ${reason}` }, 200, corsHeaders);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] Revoke failed:`, errorMsg);
      if (errorMsg.includes('AccessControl') || errorMsg.includes('account 0x')) {
        return jsonResponse({ success: false, error: 'Revoke requires DEFAULT_ADMIN_ROLE (Foundation wallet only).' }, 403, corsHeaders);
      }
      return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
    }
  }

  return jsonResponse({ success: false, error: `Unknown partner-sbt action: ${action}` }, 400, corsHeaders);
}

// --- Ambassador SBT Actions ---

async function handleAmbassador(
  action: string,
  params: Record<string, unknown>,
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const address = AMBASSADOR_SBT_ADDRESS[CHAIN_ID];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    return jsonResponse({ success: false, error: 'AmbassadorSBT not deployed on this chain' }, 500, corsHeaders);
  }

  if (action === 'recordMeetupVerification') {
    const { hostAddress, participantAddresses } = params as {
      hostAddress: string;
      participantAddresses: string[];
    };

    const results: string[] = [];

    // Record host
    if (hostAddress && isAddress(hostAddress)) {
      try {
        const hash = await walletClient.writeContract({
          address,
          abi: AMBASSADOR_SBT_ABI,
          functionName: 'recordMeetupHosted',
          args: [hostAddress as `0x${string}`],
          account,
          chain,
        });
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
            const hash = await walletClient.writeContract({
              address,
              abi: AMBASSADOR_SBT_ABI,
              functionName: 'recordMeetupAttendance',
              args: [addr as `0x${string}`],
              account,
              chain,
            });
            results.push(`Participant ${addr}: ${hash}`);
          } catch {
            results.push(`Participant ${addr}: failed`);
          }
        }
      }
    }

    return jsonResponse({ success: true, message: 'Meetup verification recorded', data: { results } }, 200, corsHeaders);
  }

  if (action === 'updateKindnessScore') {
    const { userAddress, score } = params as { userAddress: string; score: number };
    if (!userAddress || !isAddress(userAddress) || score == null) {
      return jsonResponse({ success: false, error: 'Invalid userAddress or score' }, 400, corsHeaders);
    }

    try {
      const hash = await walletClient.writeContract({
        address,
        abi: AMBASSADOR_SBT_ABI,
        functionName: 'updateKindnessScore',
        args: [userAddress as `0x${string}`, BigInt(score)],
        account,
        chain,
      });
      return jsonResponse({ success: true, txHash: hash, message: 'Kindness score updated on-chain' }, 200, corsHeaders);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] updateKindnessScore failed:`, errorMsg);
      return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
    }
  }

  return jsonResponse({ success: false, error: `Unknown ambassador action: ${action}` }, 400, corsHeaders);
}

// --- Helpers ---

/**
 * Best-effort: wait for tx receipt then sync on-chain data to Supabase
 * Uses 10s timeout - if it fails, the next page load will re-fetch from chain
 */
async function syncPartnerAfterTx(
  hash: Hash,
  partnerAddress: string,
  contractAddress: `0x${string}`,
  publicClient: ReturnType<typeof createPublicClient>
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;

  try {
    // Wait for receipt with short timeout
    await publicClient.waitForTransactionReceipt({ hash, timeout: 15_000 });

    // Read on-chain data
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

    console.log(`[Admin Action] Supabase synced: tokenId=${tokenId}, expires=${expiresDate}`);
  } catch (error) {
    console.error('[Admin Action] Supabase sync failed (best-effort):', error);
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
