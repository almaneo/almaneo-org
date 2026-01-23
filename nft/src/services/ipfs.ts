// IPFS Service using Pinata
// To use this service, you need to set VITE_PINATA_API_KEY and VITE_PINATA_SECRET in your .env file

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET || '';
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
}

export class IPFSService {
  private apiKey: string;
  private secretKey: string;
  private gateway: string;

  constructor() {
    this.apiKey = PINATA_API_KEY;
    this.secretKey = PINATA_SECRET;
    this.gateway = PINATA_GATEWAY;
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.secretKey);
  }

  async uploadFile(file: File): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured. Set VITE_PINATA_API_KEY and VITE_PINATA_SECRET in .env');
    }

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload file to IPFS: ${error}`);
    }

    const data: PinataResponse = await response.json();
    return `ipfs://${data.IpfsHash}`;
  }

  async uploadJSON(jsonData: object, name?: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured. Set VITE_PINATA_API_KEY and VITE_PINATA_SECRET in .env');
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey,
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataMetadata: {
          name: name || 'metadata.json',
        },
        pinataOptions: {
          cidVersion: 1,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload JSON to IPFS: ${error}`);
    }

    const data: PinataResponse = await response.json();
    return `ipfs://${data.IpfsHash}`;
  }

  async uploadNFTMetadata(
    name: string,
    description: string,
    imageFile: File,
    attributes?: Array<{ trait_type: string; value: string | number }>,
    externalUrl?: string,
    animationFile?: File
  ): Promise<{ metadataUri: string; imageUri: string; animationUri?: string }> {
    // Upload image first
    const imageUri = await this.uploadFile(imageFile);

    // Upload animation if provided
    let animationUri: string | undefined;
    if (animationFile) {
      animationUri = await this.uploadFile(animationFile);
    }

    // Create and upload metadata
    const metadata: NFTMetadata = {
      name,
      description,
      image: imageUri,
      attributes: attributes || [],
    };

    if (externalUrl) {
      metadata.external_url = externalUrl;
    }

    if (animationUri) {
      metadata.animation_url = animationUri;
    }

    const metadataUri = await this.uploadJSON(metadata, `${name}-metadata.json`);

    return {
      metadataUri,
      imageUri,
      animationUri,
    };
  }

  ipfsToHttp(ipfsUri: string): string {
    if (!ipfsUri) return '';
    if (ipfsUri.startsWith('ipfs://')) {
      const hash = ipfsUri.replace('ipfs://', '');
      return `${this.gateway}/ipfs/${hash}`;
    }
    return ipfsUri;
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        method: 'GET',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ipfsService = new IPFSService();
export default ipfsService;
