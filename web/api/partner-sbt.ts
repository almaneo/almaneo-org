/**
 * Partner SBT API
 * Vercel Serverless Function for PartnerSBT contract interactions
 *
 * POST /api/partner-sbt
 * Actions:
 * - mintPartner: Mint new Partner SBT (ADMIN_API_SECRET required)
 * - renewPartner: Renew Partner SBT (RENEWER_ROLE via VERIFIER_PRIVATE_KEY)
 * - revokePartner: Revoke Partner SBT (ADMIN_API_SECRET required)
 * - checkValidity: Check if partner SBT is valid (public)
 * - getPartnerData: Get on-chain partner data (public)
 *
 * Security:
 * - mintPartner/revokePartner: Requires ADMIN_API_SECRET header
 * - renewPartner: Uses VERIFIER_PRIVATE_KEY (RENEWER_ROLE on contract)
 * - checkValidity/getPartnerData: Public read-only
 */

import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';

// Contract ABI (only the functions we need)
const PARTNER_SBT_ABI = [
  'function mintPartnerSBT(address to, string businessName) external returns (uint256)',
  'function renewPartnerSBT(address partner) external',
  'function revokePartnerSBT(address partner, string reason) external',
  'function isValid(address account) view returns (bool)',
  'function hasPartnerSBT(address account) view returns (bool)',
  'function getPartnerByAddress(address account) view returns (uint256 tokenId, string businessName, uint256 mintedAt, uint256 expiresAt, uint256 lastRenewedAt, uint256 renewalCount, bool isRevoked, bool valid)',
  'function daysUntilExpiry(address account) view returns (int256)',
  'function totalMinted() view returns (uint256)',
];

// Contract addresses by network
const CONTRACT_ADDRESSES: Record<number, string> = {
  80002: '0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08', // Polygon Amoy
  137: '', // Polygon Mainnet (not deployed yet)
};

// RPC URLs (multiple for fallback)
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

/**
 * Create a provider with timeout for reliability
 */
function createProvider(chainId: number): ethers.JsonRpcProvider {
  const urls = RPC_URLS[chainId];
  if (!urls || urls.length === 0) {
    throw new Error(`No RPC URLs configured for chain ${chainId}`);
  }
  const fetchReq = new ethers.FetchRequest(urls[0]);
  fetchReq.timeout = RPC_TIMEOUT_MS;
  return new ethers.JsonRpcProvider(fetchReq, chainId, { staticNetwork: true });
}

// Environment variables
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '80002');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

// Request types
interface MintPartnerRequest {
  action: 'mintPartner';
  partnerAddress: string;
  businessName: string;
}

interface RenewPartnerRequest {
  action: 'renewPartner';
  partnerAddress: string;
}

interface RevokePartnerRequest {
  action: 'revokePartner';
  partnerAddress: string;
  reason: string;
}

interface CheckValidityRequest {
  action: 'checkValidity';
  partnerAddress: string;
}

interface GetPartnerDataRequest {
  action: 'getPartnerData';
  partnerAddress: string;
}

type PartnerSBTRequest =
  | MintPartnerRequest
  | RenewPartnerRequest
  | RevokePartnerRequest
  | CheckValidityRequest
  | GetPartnerDataRequest;

// Response types
interface SuccessResponse {
  success: true;
  txHash?: string;
  data?: Record<string, unknown>;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type PartnerSBTResponse = SuccessResponse | ErrorResponse;

export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
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
  if (!contractAddress) {
    return jsonResponse({ success: false, error: 'Contract not available' }, 500, corsHeaders);
  }

  try {
    const body = (await request.json()) as PartnerSBTRequest;
    const { action } = body;

    console.log(`[PartnerSBT API] Action: ${action}, Chain: ${CHAIN_ID}`);

    // Public read-only actions (no auth needed)
    if (action === 'checkValidity' || action === 'getPartnerData') {
      const provider = createProvider(CHAIN_ID);
      const contract = new ethers.Contract(contractAddress, PARTNER_SBT_ABI, provider);

      if (action === 'checkValidity') {
        return handleCheckValidity(body as CheckValidityRequest, contract, corsHeaders);
      }
      return handleGetPartnerData(body as GetPartnerDataRequest, contract, corsHeaders);
    }

    // Admin actions require ADMIN_API_SECRET
    if (action === 'mintPartner' || action === 'revokePartner') {
      const adminSecret = request.headers.get('X-Admin-Secret');
      if (!ADMIN_API_SECRET || adminSecret !== ADMIN_API_SECRET) {
        return jsonResponse({ success: false, error: 'Unauthorized' }, 401, corsHeaders);
      }

      if (!VERIFIER_PRIVATE_KEY) {
        return jsonResponse({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
      }

      const provider = createProvider(CHAIN_ID);
      const wallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(contractAddress, PARTNER_SBT_ABI, wallet);

      if (action === 'mintPartner') {
        return handleMintPartner(body as MintPartnerRequest, contract, corsHeaders);
      }
      return handleRevokePartner(body as RevokePartnerRequest, contract, corsHeaders);
    }

    // Renew action uses VERIFIER_PRIVATE_KEY (RENEWER_ROLE)
    if (action === 'renewPartner') {
      if (!VERIFIER_PRIVATE_KEY) {
        return jsonResponse({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
      }

      const provider = createProvider(CHAIN_ID);
      const wallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(contractAddress, PARTNER_SBT_ABI, wallet);

      return handleRenewPartner(body as RenewPartnerRequest, contract, corsHeaders);
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

/**
 * Mint new Partner SBT + sync to Supabase
 */
async function handleMintPartner(
  body: MintPartnerRequest,
  contract: ethers.Contract,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { partnerAddress, businessName } = body;

  if (!partnerAddress || !businessName) {
    return jsonResponse(
      { success: false, error: 'Missing required fields: partnerAddress, businessName' },
      400,
      corsHeaders
    );
  }

  if (!ethers.isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    console.log(`[PartnerSBT API] Minting for ${partnerAddress}: ${businessName}`);
    const tx = await contract.mintPartnerSBT(partnerAddress, businessName);
    const receipt = await tx.wait();
    console.log(`[PartnerSBT API] Minted: ${tx.hash}`);

    // Sync to Supabase
    await syncPartnerToSupabase(partnerAddress);

    return jsonResponse(
      { success: true, txHash: tx.hash, message: `Partner SBT minted for ${businessName}` },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Mint failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

/**
 * Renew Partner SBT + sync to Supabase
 */
async function handleRenewPartner(
  body: RenewPartnerRequest,
  contract: ethers.Contract,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { partnerAddress } = body;

  if (!partnerAddress) {
    return jsonResponse({ success: false, error: 'Missing required field: partnerAddress' }, 400, corsHeaders);
  }

  if (!ethers.isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    console.log(`[PartnerSBT API] Renewing for ${partnerAddress}`);
    const tx = await contract.renewPartnerSBT(partnerAddress);
    await tx.wait();
    console.log(`[PartnerSBT API] Renewed: ${tx.hash}`);

    // Sync to Supabase
    await syncPartnerToSupabase(partnerAddress);

    return jsonResponse(
      { success: true, txHash: tx.hash, message: `Partner SBT renewed` },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Renew failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

/**
 * Revoke Partner SBT
 */
async function handleRevokePartner(
  body: RevokePartnerRequest,
  contract: ethers.Contract,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { partnerAddress, reason } = body;

  if (!partnerAddress || !reason) {
    return jsonResponse(
      { success: false, error: 'Missing required fields: partnerAddress, reason' },
      400,
      corsHeaders
    );
  }

  if (!ethers.isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    console.log(`[PartnerSBT API] Revoking for ${partnerAddress}: ${reason}`);
    const tx = await contract.revokePartnerSBT(partnerAddress, reason);
    await tx.wait();
    console.log(`[PartnerSBT API] Revoked: ${tx.hash}`);

    // Sync to Supabase - clear SBT data
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      await supabase
        .from('partners')
        .update({ sbt_token_id: null, partnership_expires_at: null })
        .eq('owner_user_id', partnerAddress);
    }

    return jsonResponse(
      { success: true, txHash: tx.hash, message: `Partner SBT revoked: ${reason}` },
      200,
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] Revoke failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

/**
 * Check partner SBT validity (public)
 */
async function handleCheckValidity(
  body: CheckValidityRequest,
  contract: ethers.Contract,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { partnerAddress } = body;

  if (!partnerAddress || !ethers.isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    const isValid = await contract.isValid(partnerAddress);
    return jsonResponse(
      { success: true, data: { isValid }, message: isValid ? 'Partner is verified' : 'Partner is not verified' },
      200,
      corsHeaders
    );
  } catch (error) {
    return jsonResponse(
      { success: true, data: { isValid: false }, message: 'No Partner SBT found' },
      200,
      corsHeaders
    );
  }
}

/**
 * Get full on-chain partner data (public)
 */
async function handleGetPartnerData(
  body: GetPartnerDataRequest,
  contract: ethers.Contract,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { partnerAddress } = body;

  if (!partnerAddress || !ethers.isAddress(partnerAddress)) {
    return jsonResponse({ success: false, error: 'Invalid partner address' }, 400, corsHeaders);
  }

  try {
    const hasSBT = await contract.hasPartnerSBT(partnerAddress);
    if (!hasSBT) {
      return jsonResponse(
        { success: true, data: { hasSBT: false }, message: 'No Partner SBT found' },
        200,
        corsHeaders
      );
    }

    const [tokenId, businessName, mintedAt, expiresAt, lastRenewedAt, renewalCount, isRevoked, valid] =
      await contract.getPartnerByAddress(partnerAddress);

    const daysLeft = await contract.daysUntilExpiry(partnerAddress);

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
      corsHeaders
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PartnerSBT API] GetPartnerData failed:`, errorMsg);
    return jsonResponse({ success: false, error: errorMsg }, 500, corsHeaders);
  }
}

/**
 * Sync on-chain partner data to Supabase partners table
 */
async function syncPartnerToSupabase(partnerAddress: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.log('[PartnerSBT API] Supabase not configured, skipping sync');
    return;
  }

  try {
    const provider = createProvider(CHAIN_ID);
    const contract = new ethers.Contract(CONTRACT_ADDRESSES[CHAIN_ID], PARTNER_SBT_ABI, provider);

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

    console.log(`[PartnerSBT API] Supabase synced: tokenId=${tokenId}, expires=${expiresDate}`);
  } catch (error) {
    console.error('[PartnerSBT API] Supabase sync failed:', error);
  }
}

/**
 * Helper to create JSON response
 */
function jsonResponse(
  data: PartnerSBTResponse,
  status: number,
  headers: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
