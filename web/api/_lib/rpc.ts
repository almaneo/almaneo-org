/**
 * Lightweight Ethereum JSON-RPC utilities for Vercel Edge Functions.
 *
 * Uses raw fetch() + @noble/curves for transaction signing.
 * No viem, no ethers — keeps the bundle under 4 MB for edge runtime.
 */

import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

// ────────────────────────────────────────────────────────────────
// ABI encoding helpers
// ────────────────────────────────────────────────────────────────

/** keccak256 of a UTF-8 string, returned as 0x hex */
export function keccak256(data: string | Uint8Array): `0x${string}` {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  return `0x${bytesToHex(keccak_256(bytes))}` as `0x${string}`;
}

/** First 4 bytes of keccak256(signature) */
export function fnSelector(signature: string): string {
  return keccak256(signature).slice(0, 10);
}

/** Pad a 20-byte address to 32 bytes */
export function encodeAddress(addr: string): string {
  return addr.slice(2).toLowerCase().padStart(64, '0');
}

/** Encode a uint256 value */
export function encodeUint256(val: bigint): string {
  return val.toString(16).padStart(64, '0');
}

/** Encode a string (dynamic type) — offset + length + padded data */
export function encodeString(str: string): { offset: string; data: string } {
  const bytes = new TextEncoder().encode(str);
  const len = bytes.length;
  const paddedLen = Math.ceil(len / 32) * 32;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  const data = encodeUint256(BigInt(len)) + bytesToHex(padded);
  return { offset: '', data };
}

/** Simple address validator */
export function isAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

// ────────────────────────────────────────────────────────────────
// JSON-RPC transport
// ────────────────────────────────────────────────────────────────

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

let rpcCounter = 0;

async function rpcCall(chainId: number, method: string, params: unknown[]): Promise<unknown> {
  const urls = RPC_URLS[chainId] || [];
  if (urls.length === 0) throw new Error(`No RPC URLs for chain ${chainId}`);

  let lastError: Error | null = null;
  for (let i = 0; i < urls.length; i++) {
    const url = urls[(rpcCounter + i) % urls.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: ++rpcCounter,
          method,
          params,
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const json = await res.json() as { result?: unknown; error?: { message: string; code: number } };
      if (json.error) throw new Error(json.error.message || `RPC error ${json.error.code}`);
      if (json.result === undefined || json.result === null) {
        throw new Error(`RPC returned empty result for ${method}`);
      }
      return json.result;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      console.warn(`[RPC] ${url} failed:`, lastError.message);
    }
  }
  throw lastError || new Error('All RPC endpoints failed');
}

// ────────────────────────────────────────────────────────────────
// Read contract (eth_call)
// ────────────────────────────────────────────────────────────────

export async function ethCall(
  chainId: number,
  to: string,
  data: string
): Promise<string> {
  const result = await rpcCall(chainId, 'eth_call', [{ to, data }, 'latest']);
  return result as string;
}

// ────────────────────────────────────────────────────────────────
// Transaction signing & sending
// ────────────────────────────────────────────────────────────────

function privateKeyToAddress(privateKey: string): `0x${string}` {
  const pkBytes = hexToBytes(privateKey.replace(/^0x/, ''));
  const pubKey = secp256k1.getPublicKey(pkBytes, false); // uncompressed
  const hash = keccak_256(pubKey.slice(1)); // skip 0x04 prefix
  return `0x${bytesToHex(hash.slice(-20))}` as `0x${string}`;
}

/** RLP encode a list of items */
function rlpEncode(items: (Uint8Array | Uint8Array[])[]): Uint8Array {
  const encoded = items.map(item => {
    if (Array.isArray(item)) {
      return rlpEncodeList(item);
    }
    return rlpEncodeBytes(item);
  });
  return rlpEncodeList(encoded);
}

function rlpEncodeBytes(bytes: Uint8Array): Uint8Array {
  if (bytes.length === 1 && bytes[0] < 0x80) return bytes;
  if (bytes.length <= 55) {
    const out = new Uint8Array(1 + bytes.length);
    out[0] = 0x80 + bytes.length;
    out.set(bytes, 1);
    return out;
  }
  const lenBytes = bigintToMinBytes(BigInt(bytes.length));
  const out = new Uint8Array(1 + lenBytes.length + bytes.length);
  out[0] = 0xb7 + lenBytes.length;
  out.set(lenBytes, 1);
  out.set(bytes, 1 + lenBytes.length);
  return out;
}

function rlpEncodeList(items: Uint8Array[]): Uint8Array {
  const payload = concatBytes(items);
  if (payload.length <= 55) {
    const out = new Uint8Array(1 + payload.length);
    out[0] = 0xc0 + payload.length;
    out.set(payload, 1);
    return out;
  }
  const lenBytes = bigintToMinBytes(BigInt(payload.length));
  const out = new Uint8Array(1 + lenBytes.length + payload.length);
  out[0] = 0xf7 + lenBytes.length;
  out.set(lenBytes, 1);
  out.set(payload, 1 + lenBytes.length);
  return out;
}

function concatBytes(arrays: Uint8Array[]): Uint8Array {
  const totalLen = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

function bigintToMinBytes(val: bigint): Uint8Array {
  if (val === 0n) return new Uint8Array(0);
  const hex = val.toString(16);
  const padded = hex.length % 2 ? '0' + hex : hex;
  return hexToBytes(padded);
}

function bigintToBytes32(val: bigint): Uint8Array {
  const hex = val.toString(16).padStart(64, '0');
  return hexToBytes(hex);
}

/**
 * Sign and send a transaction (EIP-155 legacy tx).
 * Returns the tx hash immediately — does NOT wait for receipt.
 */
export async function sendTransaction(
  chainId: number,
  privateKey: string,
  to: string,
  data: string,
  gasLimit = 500_000n,
): Promise<string> {
  const pk = privateKey.replace(/^0x/, '');
  const from = privateKeyToAddress(pk);

  // Get nonce
  const nonceHex = await rpcCall(chainId, 'eth_getTransactionCount', [from, 'latest']) as string;
  if (!nonceHex) throw new Error(`Failed to get nonce for ${from}`);
  const nonce = BigInt(nonceHex);

  // Get gas price
  const gasPriceHex = await rpcCall(chainId, 'eth_gasPrice', []) as string;
  if (!gasPriceHex) throw new Error('Failed to get gas price');
  const gasPrice = BigInt(gasPriceHex);

  // Build legacy tx fields
  const txFields = [
    bigintToMinBytes(nonce),           // nonce
    bigintToMinBytes(gasPrice),        // gasPrice
    bigintToMinBytes(gasLimit),        // gasLimit
    hexToBytes(to.replace(/^0x/, '')), // to
    new Uint8Array(0),                 // value (0)
    hexToBytes(data.replace(/^0x/, '')), // data
  ];

  // EIP-155 signing: hash(tx || chainId || 0 || 0)
  const sigFields = [
    ...txFields,
    bigintToMinBytes(BigInt(chainId)),
    new Uint8Array(0),
    new Uint8Array(0),
  ];
  const encoded = rlpEncode(sigFields);
  const hash = keccak_256(encoded);

  // Sign
  const sig = secp256k1.sign(hash, hexToBytes(pk));
  const r = bigintToBytes32(sig.r);
  const s = bigintToBytes32(sig.s);
  const v = BigInt(sig.recovery) + BigInt(chainId) * 2n + 35n;

  // Build signed tx
  const signedTx = rlpEncode([
    ...txFields,
    bigintToMinBytes(v),
    r,
    s,
  ]);

  const rawTx = `0x${bytesToHex(signedTx)}`;

  // Send raw transaction
  const txHash = await rpcCall(chainId, 'eth_sendRawTransaction', [rawTx]) as string;
  return txHash;
}

/**
 * Sign, send, wait for receipt, and verify success.
 * Throws if the transaction reverts on-chain.
 */
export async function sendTransactionAndWait(
  chainId: number,
  privateKey: string,
  to: string,
  data: string,
  gasLimit = 500_000n,
  receiptTimeoutMs = 30_000,
): Promise<{ txHash: string; receipt: Record<string, unknown> }> {
  const txHash = await sendTransaction(chainId, privateKey, to, data, gasLimit);
  const receipt = await waitForReceipt(chainId, txHash, receiptTimeoutMs);
  if (!receipt) {
    throw new Error(`Transaction ${txHash} not confirmed within ${receiptTimeoutMs / 1000}s`);
  }
  const status = receipt.status as string;
  if (status === '0x0' || status === '0x00') {
    throw new Error(`Transaction ${txHash} reverted on-chain (out of gas or contract error)`);
  }
  return { txHash, receipt };
}

/**
 * Derive the sender address from a private key.
 */
export function getAddress(privateKey: string): `0x${string}` {
  return privateKeyToAddress(privateKey);
}

/**
 * Wait for a transaction receipt (best-effort, non-blocking timeout).
 */
export async function waitForReceipt(
  chainId: number,
  txHash: string,
  timeoutMs = 30_000,
): Promise<Record<string, unknown> | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const receipt = await rpcCall(chainId, 'eth_getTransactionReceipt', [txHash]);
      if (receipt) return receipt as Record<string, unknown>;
    } catch { /* ignore */ }
    await new Promise(r => setTimeout(r, 2000));
  }
  return null;
}

// ────────────────────────────────────────────────────────────────
// Calldata builders for our contracts
// ────────────────────────────────────────────────────────────────

// PartnerSBT
export const PartnerSBT = {
  mintPartnerSBT(to: string, businessName: string): string {
    // mintPartnerSBT(address,string)
    const sel = fnSelector('mintPartnerSBT(address,string)');
    const addrEnc = encodeAddress(to);
    // string is dynamic type → needs offset pointer
    const offset = encodeUint256(64n); // offset to string data (2 * 32 bytes)
    const strEnc = encodeString(businessName);
    return sel + addrEnc + offset + strEnc.data;
  },
  renewPartnerSBT(partner: string): string {
    return fnSelector('renewPartnerSBT(address)') + encodeAddress(partner);
  },
  revokePartnerSBT(partner: string, reason: string): string {
    const sel = fnSelector('revokePartnerSBT(address,string)');
    const addrEnc = encodeAddress(partner);
    const offset = encodeUint256(64n);
    const strEnc = encodeString(reason);
    return sel + addrEnc + offset + strEnc.data;
  },
  isValid(account: string): string {
    return fnSelector('isValid(address)') + encodeAddress(account);
  },
  hasPartnerSBT(account: string): string {
    return fnSelector('hasPartnerSBT(address)') + encodeAddress(account);
  },
  getPartnerByAddress(account: string): string {
    return fnSelector('getPartnerByAddress(address)') + encodeAddress(account);
  },
  daysUntilExpiry(account: string): string {
    return fnSelector('daysUntilExpiry(address)') + encodeAddress(account);
  },
  totalMinted(): string {
    return fnSelector('totalMinted()');
  },
};

// AmbassadorSBT
export const AmbassadorSBT = {
  recordMeetupAttendance(account: string): string {
    return fnSelector('recordMeetupAttendance(address)') + encodeAddress(account);
  },
  recordMeetupHosted(account: string): string {
    return fnSelector('recordMeetupHosted(address)') + encodeAddress(account);
  },
  updateKindnessScore(account: string, score: bigint): string {
    return fnSelector('updateKindnessScore(address,uint256)') + encodeAddress(account) + encodeUint256(score);
  },
  recordReferral(referrer: string, referee: string): string {
    return fnSelector('recordReferral(address,address)') + encodeAddress(referrer) + encodeAddress(referee);
  },
};

// MiningPool
export const MiningPool = {
  claimForUser(user: string, amount: bigint): string {
    return fnSelector('claimForUser(address,uint256)') + encodeAddress(user) + encodeUint256(amount);
  },
  getCurrentEpoch(): string { return fnSelector('getCurrentEpoch()'); },
  remainingPool(): string { return fnSelector('remainingPool()'); },
  totalClaimed(): string { return fnSelector('totalClaimed()'); },
  miningProgress(): string { return fnSelector('miningProgress()'); },
  getDailyRemaining(): string { return fnSelector('getDailyRemaining()'); },
  getUserDailyRemaining(user: string): string {
    return fnSelector('getUserDailyRemaining(address)') + encodeAddress(user);
  },
  getContractBalance(): string { return fnSelector('getContractBalance()'); },
  dailyClaimLimit(): string { return fnSelector('dailyClaimLimit()'); },
  userDailyClaimLimit(): string { return fnSelector('userDailyClaimLimit()'); },
};

// ────────────────────────────────────────────────────────────────
// Response helpers
// ────────────────────────────────────────────────────────────────

/** Decode a single uint256 from eth_call return data */
export function decodeUint256(hex: string): bigint {
  return BigInt(hex.slice(0, 66)); // 0x + 64 hex chars
}

/** Decode a bool (uint256 that's 0 or 1) */
export function decodeBool(hex: string): boolean {
  return decodeUint256(hex) !== 0n;
}

/** Decode an int256 (signed) */
export function decodeInt256(hex: string): bigint {
  const val = decodeUint256(hex);
  if (val >= 2n ** 255n) return val - 2n ** 256n;
  return val;
}

/** Format wei to ether string */
export function formatEther(wei: bigint): string {
  const str = wei.toString().padStart(19, '0');
  const whole = str.slice(0, -18) || '0';
  const frac = str.slice(-18).replace(/0+$/, '') || '0';
  return `${whole}.${frac}`;
}

/** Parse ether string to wei */
export function parseEther(ether: string): bigint {
  const parts = ether.split('.');
  const whole = parts[0] || '0';
  const frac = (parts[1] || '').padEnd(18, '0').slice(0, 18);
  return BigInt(whole + frac);
}

/** Standard JSON response */
export function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  headers: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

/** Standard CORS headers */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Secret',
};
