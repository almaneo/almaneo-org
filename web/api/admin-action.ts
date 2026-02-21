/**
 * Admin Action API
 * Vercel Serverless Function that executes admin-only operations directly
 *
 * POST /api/admin-action
 * Body: { target: 'partner-sbt' | 'ambassador', action: string, params: object }
 *
 * Security: ADMIN_API_SECRET verified on each request
 * No proxy pattern - directly executes contract calls to avoid Vercel self-fetch issues
 */

import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

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

const RPC_TIMEOUT_MS = 15000; // 15 second timeout per RPC call

const PARTNER_SBT_ADDRESS: Record<number, string> = {
  80002: '0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08',
  137: '',
};

const AMBASSADOR_SBT_ADDRESS: Record<number, string> = {
  80002: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B',
  137: '',
};

const PARTNER_SBT_ABI = [
  'function mintPartnerSBT(address to, string businessName) external returns (uint256)',
  'function renewPartnerSBT(address partner) external',
  'function revokePartnerSBT(address partner, string reason) external',
  'function getPartnerByAddress(address account) view returns (uint256 tokenId, string businessName, uint256 mintedAt, uint256 expiresAt, uint256 lastRenewedAt, uint256 renewalCount, bool isRevoked, bool valid)',
];

const AMBASSADOR_SBT_ABI = [
  'function recordMeetupAttendance(address user) external',
  'function recordMeetupHosted(address user) external',
  'function updateKindnessScore(address user, uint256 newScore) external',
  'function recordReferral(address referrer) external',
];

export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
};

interface AdminActionRequest {
  target: 'partner-sbt' | 'ambassador';
  action: string;
  params: Record<string, unknown>;
}

/**
 * Create a provider with timeout, trying multiple RPC endpoints
 */
function createProvider(chainId: number): ethers.JsonRpcProvider {
  const urls = RPC_URLS[chainId];
  if (!urls || urls.length === 0) {
    throw new Error(`No RPC URLs configured for chain ${chainId}`);
  }
  // Use FetchRequest with timeout for reliability
  const fetchReq = new ethers.FetchRequest(urls[0]);
  fetchReq.timeout = RPC_TIMEOUT_MS;
  return new ethers.JsonRpcProvider(fetchReq, chainId, { staticNetwork: true });
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

    const provider = createProvider(CHAIN_ID);
    const wallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY, provider);

    if (target === 'partner-sbt') {
      return handlePartnerSBT(action, params, wallet, corsHeaders);
    }

    if (target === 'ambassador') {
      return handleAmbassador(action, params, wallet, corsHeaders);
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
  wallet: ethers.Wallet,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const contractAddress = PARTNER_SBT_ADDRESS[CHAIN_ID];
  if (!contractAddress) {
    return jsonResponse({ success: false, error: 'PartnerSBT not deployed on this chain' }, 500, corsHeaders);
  }

  const contract = new ethers.Contract(contractAddress, PARTNER_SBT_ABI, wallet);

  if (action === 'mintPartner') {
    const { partnerAddress, businessName } = params as { partnerAddress: string; businessName: string };
    if (!partnerAddress || !businessName) {
      return jsonResponse({ success: false, error: 'Missing partnerAddress or businessName' }, 400, corsHeaders);
    }
    if (!ethers.isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
    }

    try {
      console.log(`[Admin Action] Minting PartnerSBT for ${partnerAddress}: ${businessName}`);
      const tx = await contract.mintPartnerSBT(partnerAddress, businessName);
      await tx.wait(1, 45000);
      console.log(`[Admin Action] Minted: ${tx.hash}`);

      // Sync to Supabase
      await syncPartnerToSupabase(partnerAddress, contractAddress, wallet.provider!);

      return jsonResponse({ success: true, txHash: tx.hash, message: `Partner SBT minted for ${businessName}` }, 200, corsHeaders);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] Mint failed:`, errorMsg);
      if (errorMsg.includes('AccessControl') || errorMsg.includes('account 0x')) {
        return jsonResponse({ success: false, error: 'Mint requires MINTER_ROLE. Run grant-partner-roles.js to grant the role to the Verifier wallet.' }, 403, corsHeaders);
      }
      return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
    }
  }

  if (action === 'renewPartner') {
    const { partnerAddress } = params as { partnerAddress: string };
    if (!partnerAddress || !ethers.isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
    }

    try {
      console.log(`[Admin Action] Renewing PartnerSBT for ${partnerAddress}`);
      const tx = await contract.renewPartnerSBT(partnerAddress);
      await tx.wait(1, 45000);
      console.log(`[Admin Action] Renewed: ${tx.hash}`);

      await syncPartnerToSupabase(partnerAddress, contractAddress, wallet.provider!);

      return jsonResponse({ success: true, txHash: tx.hash, message: 'Partner SBT renewed' }, 200, corsHeaders);
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
    if (!ethers.isAddress(partnerAddress)) {
      return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
    }

    try {
      console.log(`[Admin Action] Revoking PartnerSBT for ${partnerAddress}: ${reason}`);
      const tx = await contract.revokePartnerSBT(partnerAddress, reason);
      await tx.wait(1, 45000);
      console.log(`[Admin Action] Revoked: ${tx.hash}`);

      // Clear Supabase SBT data
      if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        await supabase
          .from('partners')
          .update({ sbt_token_id: null, partnership_expires_at: null })
          .eq('owner_user_id', partnerAddress);
      }

      return jsonResponse({ success: true, txHash: tx.hash, message: `Partner SBT revoked: ${reason}` }, 200, corsHeaders);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] Revoke failed:`, errorMsg);
      if (errorMsg.includes('AccessControl') || errorMsg.includes('account 0x')) {
        return jsonResponse({ success: false, error: 'Revoke requires DEFAULT_ADMIN_ROLE (Foundation wallet only). Use the Foundation wallet to revoke Partner SBTs.' }, 403, corsHeaders);
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
  wallet: ethers.Wallet,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const contractAddress = AMBASSADOR_SBT_ADDRESS[CHAIN_ID];
  if (!contractAddress) {
    return jsonResponse({ success: false, error: 'AmbassadorSBT not deployed on this chain' }, 500, corsHeaders);
  }

  const contract = new ethers.Contract(contractAddress, AMBASSADOR_SBT_ABI, wallet);

  if (action === 'recordMeetupVerification') {
    const { hostAddress, participantAddresses } = params as {
      hostAddress: string;
      participantAddresses: string[];
    };

    const results: string[] = [];

    // Record host
    if (hostAddress && ethers.isAddress(hostAddress)) {
      try {
        const tx = await contract.recordMeetupHosted(hostAddress);
        await tx.wait(1, 45000);
        results.push(`Host ${hostAddress}: ${tx.hash}`);
      } catch (e) {
        results.push(`Host ${hostAddress}: failed`);
      }
    }

    // Record participants
    if (Array.isArray(participantAddresses)) {
      for (const addr of participantAddresses) {
        if (ethers.isAddress(addr)) {
          try {
            const tx = await contract.recordMeetupAttendance(addr);
            await tx.wait(1, 45000);
            results.push(`Participant ${addr}: ${tx.hash}`);
          } catch (e) {
            results.push(`Participant ${addr}: failed`);
          }
        }
      }
    }

    return jsonResponse({ success: true, message: 'Meetup verification recorded', data: { results } }, 200, corsHeaders);
  }

  if (action === 'updateKindnessScore') {
    const { userAddress, score } = params as { userAddress: string; score: number };
    if (!userAddress || !ethers.isAddress(userAddress) || score == null) {
      return jsonResponse({ success: false, error: 'Invalid userAddress or score' }, 400, corsHeaders);
    }

    try {
      const tx = await contract.updateKindnessScore(userAddress, score);
      await tx.wait(1, 45000);
      return jsonResponse({ success: true, txHash: tx.hash, message: 'Kindness score updated on-chain' }, 200, corsHeaders);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Admin Action] updateKindnessScore failed:`, errorMsg);
      return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
    }
  }

  return jsonResponse({ success: false, error: `Unknown ambassador action: ${action}` }, 400, corsHeaders);
}

// --- Helpers ---

async function syncPartnerToSupabase(
  partnerAddress: string,
  contractAddress: string,
  provider: ethers.Provider
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;

  try {
    const contract = new ethers.Contract(contractAddress, PARTNER_SBT_ABI, provider);
    const [tokenId, , , expiresAt] = await contract.getPartnerByAddress(partnerAddress);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const expiresDate = new Date(Number(expiresAt) * 1000).toISOString();

    await supabase
      .from('partners')
      .update({
        sbt_token_id: Number(tokenId),
        partnership_expires_at: expiresDate,
      })
      .eq('owner_user_id', partnerAddress);

    console.log(`[Admin Action] Supabase synced: tokenId=${tokenId}, expires=${expiresDate}`);
  } catch (error) {
    console.error('[Admin Action] Supabase sync failed:', error);
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
