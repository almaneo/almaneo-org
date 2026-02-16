/**
 * User Chain Data API
 *
 * GET /api/user-chain-data?address=0x...
 * Returns on-chain + off-chain data for a wallet address:
 * - AmbassadorSBT: tier, meetups attended/hosted, referral count
 * - ALMANToken: token balance
 * - Supabase: Kindness Score
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';

// AmbassadorSBT 최소 ABI (읽기 전용)
const AMBASSADOR_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function getUserStats(address) view returns (uint8 tier, uint256 meetupsAttended, uint256 meetupsHosted, uint256 kindnessScore, uint256 referralCount)',
];

// ALMANToken 최소 ABI (잔액 조회)
const TOKEN_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

// Polygon Amoy 컨트랙트 주소
const AMBASSADOR_SBT_ADDRESS = '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B';
const ALMAN_TOKEN_ADDRESS = '0x2B52bD2daFd82683Dcf0A994eb24427afb9C1c63';

const TIER_NAMES: Record<number, string> = {
  0: 'friend',
  1: 'host',
  2: 'ambassador',
  3: 'guardian',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const address = req.query.address as string;
  if (!address || !ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const rpcUrl = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology';
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // 병렬 조회
    const [ambassadorData, tokenData, kindnessData] = await Promise.allSettled([
      getAmbassadorData(provider, address),
      getTokenBalance(provider, address),
      getKindnessScore(address),
    ]);

    const ambassador = ambassadorData.status === 'fulfilled' ? ambassadorData.value : null;
    const tokenBalance = tokenData.status === 'fulfilled' ? tokenData.value : 0;
    const kindnessScore = kindnessData.status === 'fulfilled' ? kindnessData.value : 0;

    return res.status(200).json({
      kindnessScore: ambassador?.kindnessScore ?? kindnessScore,
      ambassadorTier: ambassador?.tier ?? null,
      tokenBalance,
      meetupsAttended: ambassador?.meetupsAttended ?? 0,
      meetupsHosted: ambassador?.meetupsHosted ?? 0,
      referralCount: ambassador?.referralCount ?? 0,
    });
  } catch (error) {
    console.error('user-chain-data error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAmbassadorData(provider: ethers.JsonRpcProvider, address: string) {
  const contract = new ethers.Contract(AMBASSADOR_SBT_ADDRESS, AMBASSADOR_ABI, provider);

  // SBT 보유 여부 확인
  const balance = await contract.balanceOf(address);
  if (balance === 0n) return null;

  // 사용자 통계 조회
  const stats = await contract.getUserStats(address);
  return {
    tier: TIER_NAMES[Number(stats.tier)] ?? null,
    meetupsAttended: Number(stats.meetupsAttended),
    meetupsHosted: Number(stats.meetupsHosted),
    kindnessScore: Number(stats.kindnessScore),
    referralCount: Number(stats.referralCount),
  };
}

async function getTokenBalance(provider: ethers.JsonRpcProvider, address: string) {
  const contract = new ethers.Contract(ALMAN_TOKEN_ADDRESS, TOKEN_ABI, provider);
  const [balance, decimals] = await Promise.all([
    contract.balanceOf(address),
    contract.decimals(),
  ]);
  return Number(ethers.formatUnits(balance, decimals));
}

async function getKindnessScore(address: string): Promise<number> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) return 0;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase
    .from('users')
    .select('kindness_score')
    .eq('wallet_address', address.toLowerCase())
    .maybeSingle();

  return data?.kindness_score ?? 0;
}
