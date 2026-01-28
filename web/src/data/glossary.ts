/**
 * AlmaNEO 용어 사전 (Glossary)
 * 친절 모드에서 표시되는 용어 설명
 *
 * 텍스트는 i18n으로 관리 (common.json → glossary 섹션)
 * 이 파일은 구조 데이터(키, 카테고리)만 관리
 */

export type GlossaryCategory = 'blockchain' | 'token' | 'neos' | 'defi' | 'nft' | 'governance';

export interface GlossaryTerm {
  term: string;           // 표시되는 용어 (i18n에서 로드)
  simple: string;         // 쉬운 한 줄 설명 (i18n에서 로드)
  detailed?: string;      // 자세한 설명 (i18n에서 로드)
  example?: string;       // 예시 (i18n에서 로드)
  category: GlossaryCategory;
}

/** 용어 키 → 카테고리 매핑 (구조 데이터) */
export const glossaryKeys: Record<string, GlossaryCategory> = {
  // 블록체인 기본
  blockchain: 'blockchain',
  wallet: 'blockchain',
  gasPrice: 'blockchain',
  transaction: 'blockchain',
  smartContract: 'blockchain',
  polygon: 'blockchain',
  web3auth: 'blockchain',
  gasless: 'blockchain',

  // 토큰 관련
  token: 'token',
  alman: 'neos',
  neos: 'neos',
  totalSupply: 'token',
  tge: 'token',

  // DeFi 관련
  staking: 'defi',
  apy: 'defi',
  airdrop: 'defi',
  liquidity: 'defi',
  dex: 'defi',

  // NFT 관련
  nft: 'nft',
  sbt: 'nft',
  jeongSbt: 'neos',
  royalty: 'nft',

  // 거버넌스 관련
  governance: 'governance',
  dao: 'governance',
  proposal: 'governance',
  quorum: 'governance',

  // AlmaNEO 고유 개념
  jeong: 'neos',
  gaii: 'neos',
  kindnessScore: 'neos',
  kindnessProtocol: 'neos',
  globalSouth: 'neos',
  depin: 'neos',
};

/** 용어 키가 유효한지 확인 */
export function isValidTermKey(key: string): boolean {
  return key in glossaryKeys;
}

/** 용어의 카테고리 조회 */
export function getTermCategory(key: string): GlossaryCategory | undefined {
  return glossaryKeys[key];
}

/** 카테고리별 용어 키 목록 */
export function getKeysByCategory(category: GlossaryCategory): string[] {
  return Object.entries(glossaryKeys)
    .filter(([_, cat]) => cat === category)
    .map(([key]) => key);
}

export default glossaryKeys;
