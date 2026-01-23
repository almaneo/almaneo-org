/**
 * AlmaNEO 용어 사전 (Glossary)
 * 친절 모드에서 표시되는 용어 설명
 *
 * 각 용어는 다국어 지원을 위해 key로 관리하고,
 * 추후 i18n 적용 시 번역 파일로 분리 가능
 */

export interface GlossaryTerm {
  term: string;           // 표시되는 용어
  simple: string;         // 쉬운 한 줄 설명
  detailed?: string;      // 자세한 설명 (선택)
  example?: string;       // 예시 (선택)
  category: 'blockchain' | 'token' | 'neos' | 'defi' | 'nft' | 'governance';
}

export const glossary: Record<string, GlossaryTerm> = {
  // ===== 블록체인 기본 =====
  blockchain: {
    term: '블록체인',
    simple: '여러 컴퓨터가 함께 기록하는 디지털 장부예요.',
    detailed: '한 번 기록되면 수정이 어려워서 투명하고 안전해요.',
    example: '은행 없이도 거래 기록을 모두가 검증할 수 있어요.',
    category: 'blockchain',
  },
  wallet: {
    term: '지갑',
    simple: '디지털 자산을 보관하는 계정이에요.',
    detailed: '은행 계좌처럼 토큰을 보관하고 보내고 받을 수 있어요.',
    example: 'Web3Auth로 로그인하면 자동으로 지갑이 생성돼요.',
    category: 'blockchain',
  },
  gasPrice: {
    term: '가스비',
    simple: '블록체인에 기록할 때 내는 수수료예요.',
    detailed: '네트워크 사용료로, 트랜잭션을 처리하는 컴퓨터에게 지급돼요.',
    example: 'AlmaNEO는 가스비를 대신 내줘서 무료로 사용할 수 있어요!',
    category: 'blockchain',
  },
  transaction: {
    term: '트랜잭션',
    simple: '블록체인에 기록되는 하나의 작업이에요.',
    detailed: '토큰 전송, NFT 구매 등 모든 행동이 트랜잭션으로 기록돼요.',
    category: 'blockchain',
  },
  smartContract: {
    term: '스마트 컨트랙트',
    simple: '자동으로 실행되는 디지털 계약서예요.',
    detailed: '조건이 맞으면 자동으로 실행되어 중개인이 필요 없어요.',
    example: '스테이킹 보상이 자동으로 지급되는 것도 스마트 컨트랙트 덕분이에요.',
    category: 'blockchain',
  },
  polygon: {
    term: 'Polygon',
    simple: '빠르고 저렴한 블록체인 네트워크예요.',
    detailed: '이더리움과 호환되면서도 가스비가 매우 저렴해요.',
    example: 'AlmaNEO가 Polygon을 선택한 이유는 모두가 부담 없이 쓸 수 있어서예요.',
    category: 'blockchain',
  },

  // ===== 토큰 관련 =====
  token: {
    term: '토큰',
    simple: '블록체인 위의 디지털 화폐 또는 자산이에요.',
    detailed: '게임 코인처럼 특정 플랫폼에서 사용할 수 있어요.',
    category: 'token',
  },
  alman: {
    term: 'ALMAN 토큰',
    simple: 'AlmaNEO 플랫폼의 기본 토큰이에요.',
    detailed: '스테이킹, 거버넌스 투표, NFT 구매 등에 사용돼요.',
    example: '친절 활동을 하면 ALMAN 토큰을 보상으로 받을 수 있어요.',
    category: 'neos',
  },
  // Legacy alias for backward compatibility
  neos: {
    term: 'ALMAN 토큰',
    simple: 'AlmaNEO 플랫폼의 기본 토큰이에요.',
    detailed: '스테이킹, 거버넌스 투표, NFT 구매 등에 사용돼요.',
    example: '친절 활동을 하면 ALMAN 토큰을 보상으로 받을 수 있어요.',
    category: 'neos',
  },
  totalSupply: {
    term: '총 공급량',
    simple: '발행될 토큰의 전체 개수예요.',
    detailed: 'ALMAN은 80억 개로, 지구 인구 80억 명을 상징해요.',
    category: 'token',
  },

  // ===== DeFi 관련 =====
  staking: {
    term: '스테이킹',
    simple: '토큰을 맡기고 이자를 받는 거예요.',
    detailed: '은행 예금처럼 토큰을 예치하면 보상을 받을 수 있어요.',
    example: 'ALMAN을 스테이킹하면 연 5~18%의 보상을 받아요.',
    category: 'defi',
  },
  apy: {
    term: 'APY',
    simple: '연간 수익률이에요.',
    detailed: 'Annual Percentage Yield의 약자로, 1년간 예상 수익을 %로 표시해요.',
    example: 'APY 10%면 100 ALMAN을 스테이킹하면 1년 후 110 ALMAN이 돼요.',
    category: 'defi',
  },
  airdrop: {
    term: '에어드롭',
    simple: '토큰을 무료로 나눠주는 이벤트예요.',
    detailed: '새로운 프로젝트를 알리거나 커뮤니티에 보상하기 위해 진행해요.',
    example: 'AlmaNEO는 친절 활동을 한 사람들에게 에어드롭을 진행해요.',
    category: 'defi',
  },
  liquidity: {
    term: '유동성',
    simple: '거래가 얼마나 쉽게 이루어지는지를 나타내요.',
    detailed: '유동성이 높으면 원하는 가격에 빠르게 사고팔 수 있어요.',
    category: 'defi',
  },
  dex: {
    term: 'DEX',
    simple: '중개인 없이 토큰을 교환하는 거래소예요.',
    detailed: 'Decentralized Exchange의 약자로, 스마트 컨트랙트로 자동 거래돼요.',
    example: 'Uniswap, QuickSwap 같은 곳에서 ALMAN을 거래할 수 있어요.',
    category: 'defi',
  },

  // ===== NFT 관련 =====
  nft: {
    term: 'NFT',
    simple: '세상에 하나뿐인 디지털 소유권 증명서예요.',
    detailed: 'Non-Fungible Token의 약자로, 디지털 아트나 아이템의 소유권을 증명해요.',
    category: 'nft',
  },
  sbt: {
    term: 'SBT',
    simple: '양도할 수 없는 특별한 NFT예요.',
    detailed: 'Soulbound Token의 약자로, 한 번 받으면 팔거나 옮길 수 없어요.',
    example: 'Jeong-SBT는 당신의 친절 점수를 영원히 기록해요.',
    category: 'nft',
  },
  jeongSbt: {
    term: 'Jeong-SBT',
    simple: '당신의 친절을 증명하는 영혼의 토큰이에요.',
    detailed: '친절 점수가 쌓이면 티어가 올라가고 더 많은 혜택을 받아요.',
    example: 'Forest 티어가 되면 NFT 수수료 50% 할인!',
    category: 'neos',
  },
  royalty: {
    term: '로열티',
    simple: 'NFT가 재판매될 때 원작자가 받는 수익이에요.',
    detailed: '창작자가 계속 보상받을 수 있는 Web3의 멋진 기능이에요.',
    category: 'nft',
  },

  // ===== 거버넌스 관련 =====
  governance: {
    term: '거버넌스',
    simple: '프로젝트의 방향을 함께 결정하는 거예요.',
    detailed: '토큰 보유자들이 투표로 중요한 결정에 참여할 수 있어요.',
    example: '새로운 기능 추가, 파트너십 결정 등을 투표로 정해요.',
    category: 'governance',
  },
  dao: {
    term: 'DAO',
    simple: '투표로 운영되는 디지털 조직이에요.',
    detailed: 'Decentralized Autonomous Organization의 약자로, 중앙 관리자 없이 운영돼요.',
    example: 'AlmaNEO DAO는 커뮤니티가 직접 프로젝트를 이끌어가요.',
    category: 'governance',
  },
  proposal: {
    term: '제안',
    simple: '거버넌스에서 투표에 부치는 안건이에요.',
    detailed: '누구나 제안을 올릴 수 있고, 토큰 보유자들이 투표해요.',
    category: 'governance',
  },
  quorum: {
    term: '쿼럼',
    simple: '투표가 유효하려면 필요한 최소 참여율이에요.',
    detailed: 'AlmaNEO는 4% 쿼럼으로, 전체 토큰의 4%가 투표해야 통과돼요.',
    category: 'governance',
  },

  // ===== AlmaNEO 고유 개념 =====
  jeong: {
    term: '정(情)',
    simple: '오랜 시간 함께하며 쌓이는 깊은 마음의 유대예요.',
    detailed: '한국 고유의 개념으로, 단순한 친절을 넘어선 깊은 인간적 연결이에요.',
    example: 'AlmaNEO는 이 따뜻한 가치를 블록체인에 담고 있어요.',
    category: 'neos',
  },
  gaii: {
    term: 'GAII',
    simple: 'AI 불평등 정도를 측정하는 지수예요.',
    detailed: 'Global AI Inequality Index의 약자로, 국가별 AI 접근성을 수치화해요.',
    example: '점수가 높을수록 AI 접근이 어려운 지역이에요.',
    category: 'neos',
  },
  kindnessScore: {
    term: 'Kindness Score',
    simple: '당신의 친절 활동 점수예요.',
    detailed: '친절한 행동을 할수록 점수가 올라가고 혜택이 늘어나요.',
    example: '점수가 높으면 Jeong-SBT 티어가 올라가요!',
    category: 'neos',
  },
  kindnessProtocol: {
    term: 'Kindness Protocol',
    simple: '친절을 증명하고 보상하는 시스템이에요.',
    detailed: 'Proof of Humanity - 사람다움을 증명하는 새로운 방식이에요.',
    category: 'neos',
  },
  globalSouth: {
    term: 'Global South',
    simple: '개발도상국 또는 신흥국을 뜻해요.',
    detailed: '주로 아프리카, 남아시아, 동남아시아, 중남미 지역을 말해요.',
    example: 'AlmaNEO는 Global South의 AI 접근성 향상을 목표로 해요.',
    category: 'neos',
  },
  depin: {
    term: 'DePIN',
    simple: '탈중앙화된 물리적 인프라 네트워크예요.',
    detailed: 'Decentralized Physical Infrastructure Network의 약자예요.',
    example: '개인 컴퓨터를 연결해 AI 연산력을 공유하는 방식이에요.',
    category: 'neos',
  },
  tge: {
    term: 'TGE',
    simple: '토큰이 처음 발행되는 이벤트예요.',
    detailed: 'Token Generation Event의 약자로, 토큰이 공식 출시되는 순간이에요.',
    category: 'token',
  },
  web3auth: {
    term: 'Web3Auth',
    simple: '소셜 계정으로 블록체인에 로그인하는 서비스예요.',
    detailed: '복잡한 지갑 설정 없이 Google, Facebook 등으로 바로 시작할 수 있어요.',
    example: 'AlmaNEO는 Web3Auth로 누구나 쉽게 시작할 수 있어요!',
    category: 'blockchain',
  },
  gasless: {
    term: '가스리스',
    simple: '가스비를 내지 않아도 되는 거래예요.',
    detailed: '플랫폼이 대신 가스비를 내줘서 사용자는 무료로 이용해요.',
    example: 'AlmaNEO에서는 대부분의 트랜잭션이 가스리스예요!',
    category: 'blockchain',
  },
};

// 카테고리별 그룹화
export const glossaryByCategory = {
  blockchain: Object.entries(glossary).filter(([_, v]) => v.category === 'blockchain'),
  token: Object.entries(glossary).filter(([_, v]) => v.category === 'token'),
  defi: Object.entries(glossary).filter(([_, v]) => v.category === 'defi'),
  nft: Object.entries(glossary).filter(([_, v]) => v.category === 'nft'),
  governance: Object.entries(glossary).filter(([_, v]) => v.category === 'governance'),
  neos: Object.entries(glossary).filter(([_, v]) => v.category === 'neos'),
};

// 용어 검색 함수
export function findTerm(key: string): GlossaryTerm | undefined {
  return glossary[key];
}

export default glossary;
