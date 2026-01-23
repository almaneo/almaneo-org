// Hero Settings Service - Stores featured NFTs for the hero section
// Using localStorage for persistence (can be migrated to backend/Firebase later)

export interface HeroNFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  image: string;
  collectionName?: string;
  order: number;
}

const STORAGE_KEY = 'mimig-hero-nfts';

export const getHeroNFTs = (): HeroNFT[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const nfts = JSON.parse(stored) as HeroNFT[];
      return nfts.sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.error('Error loading hero NFTs:', error);
  }
  return [];
};

export const saveHeroNFTs = (nfts: HeroNFT[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nfts));
  } catch (error) {
    console.error('Error saving hero NFTs:', error);
  }
};

export const addHeroNFT = (nft: Omit<HeroNFT, 'order'>): void => {
  const current = getHeroNFTs();
  const maxOrder = current.length > 0 ? Math.max(...current.map((n) => n.order)) : -1;

  // Check if NFT already exists
  const exists = current.some(
    (n) => n.tokenId === nft.tokenId && n.contractAddress === nft.contractAddress
  );

  if (!exists) {
    current.push({ ...nft, order: maxOrder + 1 });
    saveHeroNFTs(current);
  }
};

export const removeHeroNFT = (tokenId: string, contractAddress: string): void => {
  const current = getHeroNFTs();
  const filtered = current.filter(
    (n) => !(n.tokenId === tokenId && n.contractAddress === contractAddress)
  );
  // Re-order
  const reordered = filtered.map((n, index) => ({ ...n, order: index }));
  saveHeroNFTs(reordered);
};

export const reorderHeroNFTs = (tokenId: string, contractAddress: string, newOrder: number): void => {
  const current = getHeroNFTs();
  const nftIndex = current.findIndex(
    (n) => n.tokenId === tokenId && n.contractAddress === contractAddress
  );

  if (nftIndex === -1) return;

  const nft = current[nftIndex];
  current.splice(nftIndex, 1);
  current.splice(newOrder, 0, nft);

  const reordered = current.map((n, index) => ({ ...n, order: index }));
  saveHeroNFTs(reordered);
};

export const clearHeroNFTs = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
