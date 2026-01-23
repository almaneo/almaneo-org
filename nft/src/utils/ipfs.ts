// IPFS Gateway utilities

// Ordered by reliability - Pinata is most reliable for our pinned content
export const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
];

/**
 * Convert IPFS URI to HTTP URL using Pinata gateway
 * Handles various malformed formats like ipfs://ipfs://... or ipfs:/bafk...
 */
export const ipfsToHttp = (ipfsUri: string): string => {
  if (!ipfsUri) return '';

  let uri = ipfsUri.trim();

  // Already an HTTP URL
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    // If it's using a different gateway, convert to Pinata
    for (const gateway of IPFS_GATEWAYS.slice(1)) {
      if (uri.startsWith(gateway)) {
        const hash = uri.replace(gateway, '');
        return `${IPFS_GATEWAYS[0]}${hash}`;
      }
    }
    // Check if URL contains malformed ipfs path like /ipfs/ipfs:/...
    if (uri.includes('/ipfs/ipfs:')) {
      const match = uri.match(/\/ipfs\/ipfs:?\/?(.+)$/);
      if (match) {
        return `${IPFS_GATEWAYS[0]}${match[1]}`;
      }
    }
    return uri;
  }

  // Handle malformed formats: ipfs://ipfs://... or ipfs://ipfs:/...
  // Keep removing ipfs:// or ipfs:/ prefix until we get the CID
  while (uri.startsWith('ipfs://') || uri.startsWith('ipfs:/')) {
    if (uri.startsWith('ipfs://')) {
      uri = uri.slice(7); // Remove 'ipfs://'
    } else if (uri.startsWith('ipfs:/')) {
      uri = uri.slice(6); // Remove 'ipfs:/'
    }
  }

  // Now uri should be just the CID or CID/path
  // Handle if it still has 'ipfs/' prefix (from malformed ipfs://ipfs/CID)
  if (uri.startsWith('ipfs/')) {
    uri = uri.slice(5);
  }

  // Raw CID (starts with Qm for v0 or bafy for v1)
  if (uri.startsWith('Qm') || uri.startsWith('bafy') || uri.startsWith('bafk')) {
    return `${IPFS_GATEWAYS[0]}${uri}`;
  }

  // If nothing matched, return original (might be a regular URL or invalid)
  return ipfsUri;
};

/**
 * Try to load image from multiple IPFS gateways
 * Returns the first working URL
 */
export const tryIPFSGateways = async (ipfsUri: string): Promise<string> => {
  if (!ipfsUri) return '';

  // Not an IPFS URI
  if (!ipfsUri.startsWith('ipfs://') && !ipfsUri.includes('/ipfs/')) {
    return ipfsUri;
  }

  // Extract the CID/path
  let hashPath = '';
  if (ipfsUri.startsWith('ipfs://')) {
    hashPath = ipfsUri.replace('ipfs://', '');
  } else {
    const ipfsIndex = ipfsUri.indexOf('/ipfs/');
    if (ipfsIndex !== -1) {
      hashPath = ipfsUri.substring(ipfsIndex + 6);
    }
  }

  if (!hashPath) return ipfsUri;

  // Try each gateway
  for (const gateway of IPFS_GATEWAYS) {
    const url = `${gateway}${hashPath}`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return url;
      }
    } catch {
      // Try next gateway
    }
  }

  // Fallback to primary gateway
  return `${IPFS_GATEWAYS[0]}${hashPath}`;
};

/**
 * Default placeholder image for NFTs
 */
export const NFT_PLACEHOLDER = '/placeholder-nft.png';
