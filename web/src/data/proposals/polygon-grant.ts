/**
 * Polygon Grant Proposal - Slide Data
 * AlmaNEO Polygon Village Grants Season 4 제안서
 */

import type { Proposal, Slide } from './types';

// 슬라이드 이미지 경로 헬퍼
const img = (num: number) => `${String(num).padStart(3, '0')}.webp`;

export const polygonGrantSlides: Slide[] = [
  // 슬라이드 1: 타이틀
  {
    id: 'title',
    slideNumber: 1,
    layout: 'title',
    image: img(1),
    imageAlt: 'AlmaNEO - Cold Code, Warm Soul',
    title: 'AlmaNEO',
    titleHighlight: 'Cold Code, Warm Soul',
    subtitle: 'Polygon Grant Season 4 | AI & DePIN Track',
    script: [
      { text: '안녕하세요, AlmaNEO입니다.', duration: 3031 },
      { text: '차가운 코드 위에 따뜻한 정을 심습니다.', duration: 4671 },
    ],
    autoAdvanceDelay: 9000,
  },

  // 슬라이드 2: 질문
  {
    id: 'question',
    slideNumber: 2,
    layout: 'content',
    image: img(2),
    imageAlt: 'AI 시대의 질문',
    title: 'AI 시대, 누가 지능을 소유하는가?',
    script: [
      { text: '여러분, 질문 하나 드리겠습니다.', duration: 3551 },
      { text: 'AI 시대, 과연 누가 지능을 소유하고 있을까요?', duration: 5071 },
      { text: 'AI는 이미 글을 쓰고, 코드를 짜고, 진단까지 내립니다.', duration: 5751 },
      { text: '그런데 이 강력한 도구, 모두가 쓸 수 있나요?', duration: 5751, highlight: true },
    ],
    autoAdvanceDelay: 21000,
  },

  // 슬라이드 3: 문제 - 디지털 식민주의
  {
    id: 'digital-colonialism',
    slideNumber: 3,
    layout: 'stats',
    image: img(3),
    imageAlt: '21세기 디지털 식민주의',
    title: '21세기 디지털 식민주의',
    tableData: {
      headers: ['지표', '현황'],
      rows: [
        ['AI 연산 자원', '상위 1% 기업이 90% 이상 점유'],
        ['AI 서비스 비용', '월 $20 (Global South: 생활비의 10~30%)'],
        ['AI 학습 데이터', '90% 이상이 영어'],
      ],
      highlightColumn: 1,
    },
    script: [
      { text: '이건 21세기 디지털 식민주의입니다.', duration: 4671 },
      { text: 'AI 연산 자원? 상위 1%가 90%를 가져갑니다.', duration: 6231 },
      { text: 'ChatGPT 월 20달러가 개발도상국에선 월급의 10~30%예요.', duration: 7311 },
      { text: '한 쪽은 AI로 과제하고, 한 쪽은 AI 데이터 레이블링 알바를 합니다.', duration: 7671, highlight: true },
    ],
    autoAdvanceDelay: 27000,
  },

  // 슬라이드 4: 두 청년의 하루
  {
    id: 'two-youths',
    slideNumber: 4,
    layout: 'comparison',
    image: img(4),
    imageAlt: '두 청년의 하루',
    title: '두 청년의 하루',
    tableData: {
      headers: ['시간', '🇺🇸 선진국 청년', '🌍 Global South 청년'],
      rows: [
        ['아침', 'ChatGPT로 이력서 다듬기', '무료 AI 일일 한도 초과'],
        ['오후', 'Copilot으로 코딩 완성', '느린 인터넷으로 기본 검색만'],
        ['저녁', 'AI 튜터로 새 언어 학습', 'AI 회사의 데이터 레이블러 부업'],
      ],
    },
    script: [
      { text: '똑같이 24살, 똑같은 꿈을 꾸는 두 청년이 있습니다.', duration: 5471 },
      { text: '한 명은 ChatGPT로 이력서 쓰고, 한 명은 무료 한도 끝.', duration: 5591 },
      { text: '한 명은 Copilot으로 코딩하고, 한 명은 느린 인터넷에서 검색만.', duration: 5831 },
      { text: '1년 뒤, 5년 뒤... 이 격차 어떻게 될까요?', duration: 5711, highlight: true },
    ],
    autoAdvanceDelay: 24000,
  },

  // 슬라이드 5: 문제의 핵심
  {
    id: 'core-problem',
    slideNumber: 5,
    layout: 'content',
    image: img(5),
    imageAlt: '문제의 핵심 연쇄',
    title: '문제의 핵심 연쇄',
    content: `
1. 자본이 지능을 독점한다
       ↓
2. 지능의 불평등 → 기회의 불평등
       ↓
3. 기회의 불평등 → 희망의 상실
       ↓
4. 희망 잃은 청년 증가 → 지구의 미래 암울
    `,
    quote: '"지능이 화폐화되는 순간, 기회의 평등은 신화가 됩니다."',
    script: [
      { text: '문제를 정리해볼게요.', duration: 2551 },
      { text: '자본이 지능을 독점하면, 기회의 불평등이 생깁니다.', duration: 5591 },
      { text: '기회가 없으면 희망도 없어요.', duration: 3351 },
      { text: '희망 잃은 청년이 늘면, 우리 모두의 미래가 어두워집니다.', duration: 6951, highlight: true },
    ],
    autoAdvanceDelay: 19000,
  },

  // 슬라이드 6: 철학 - 정(情)
  {
    id: 'jeong',
    slideNumber: 6,
    layout: 'quote',
    image: img(6),
    imageAlt: '정(情): 한국에서 세계로',
    title: '정 (情)',
    titleHighlight: '한국에서 세계로',
    quote: '정은 시간이 걸립니다. 정은 때때로 비효율적입니다. 그래서 정은 AI가 대체할 수 없는 인간 고유의 가치입니다.',
    script: [
      { text: '한국엔 "정"이라는 말이 있어요.', duration: 4031 },
      { text: '그냥 친절함이 아니라, 시간이 쌓여야 생기는 깊은 유대감이에요.', duration: 6311 },
      { text: 'AI가 모든 걸 최적화하지만, 정은 최적화할 수 없습니다.', duration: 5711 },
      { text: '이게 바로 AI가 대체 못하는 인간의 가치입니다.', duration: 5751, highlight: true },
    ],
    autoAdvanceDelay: 23000,
  },

  // 슬라이드 7: 3대 원칙
  {
    id: 'principles',
    slideNumber: 7,
    layout: 'content',
    image: img(7),
    imageAlt: 'AlmaNEO의 3대 원칙',
    title: 'AlmaNEO의 3대 원칙',
    content: `
### 1️⃣ 정치가 아닌 사람
나이지리아의 청년, 베트남의 청년, 브라질의 청년
모두 같은 꿈을 꿀 자격이 있습니다.

### 2️⃣ 국가가 아닌 개인
GDP, 실업률, 성장률... 통계에서 개인의 삶은 보이지 않습니다.
AlmaNEO는 통계가 아닌 개인을 봅니다.

### 3️⃣ 기술은 도구, 인간이 주체
AI가 아무리 발전해도, 최종 결정은 인간이 해야 합니다.
    `,
    script: [
      { text: 'AlmaNEO가 지키는 세 가지 원칙입니다.', duration: 4391 },
      { text: '첫째, 정치가 아닌 사람. 어느 나라든 청년은 같은 꿈을 꿀 자격이 있어요.', duration: 7591 },
      { text: '둘째, 통계가 아닌 개인. GDP 말고 사람을 봅니다.', duration: 6231 },
      { text: '셋째, 기술은 도구일 뿐. 결정은 인간이 합니다.', duration: 6511, highlight: true },
    ],
    autoAdvanceDelay: 26000,
  },

  // 슬라이드 8: 솔루션 개요
  {
    id: 'solution-overview',
    slideNumber: 8,
    layout: 'content',
    image: img(8),
    imageAlt: 'The Ethical Bridge',
    title: 'The Ethical Bridge',
    subtitle: '빅테크를 적으로 규정하지 않습니다. 그들을 자원 공급자로 참여시킵니다.',
    tableData: {
      headers: ['구성요소', '역할'],
      rows: [
        ['GAII Dashboard', '도덕적 레버리지 (ESG 압박)'],
        ['AI Hub', '자원 교환 & 재분배'],
        ['Kindness Protocol', '인간 증명 & 보상'],
      ],
    },
    script: [
      { text: '자, 이제 솔루션 얘기할게요. The Ethical Bridge.', duration: 5471 },
      { text: '우린 빅테크와 싸우지 않아요. 그들을 자원 공급자로 끌어들입니다.', duration: 6791 },
      { text: 'GAII로 ESG 압박을 만들고, AI Hub로 자원을 교환합니다.', duration: 6151 },
      { text: 'Kindness Protocol로 진짜 사람을 증명하고 보상해요.', duration: 6871, highlight: true },
    ],
    autoAdvanceDelay: 26000,
  },

  // 슬라이드 9: GAII Dashboard
  {
    id: 'gaii-dashboard',
    slideNumber: 9,
    layout: 'content',
    image: img(9),
    imageAlt: 'GAII Dashboard',
    title: 'GAII Dashboard',
    titleHighlight: 'Global AI Inequality Index',
    quote: '"측정되지 않는 문제는 해결될 수 없다."',
    content: `
### 기능
• 국가별 AI 불평등 지수 시각화
• AI 기업별 '포용성 점수' 실시간 랭킹

### 전략적 효과
ESG 표준으로 작용하여 기업들이 이미지 제고를 위해 자원을 기부/저가 공급하도록 유도

### 현재 상태
✅ 50개국 데이터 수집 완료
✅ Report v1.0 발행 준비 완료
    `,
    script: [
      { text: 'GAII Dashboard. 글로벌 AI 불평등 지수입니다.', duration: 5951 },
      { text: '측정 안 되면 해결도 안 됩니다. 그래서 측정합니다.', duration: 5871 },
      { text: '국가별 AI 격차, 기업별 포용성을 실시간 랭킹해요.', duration: 6791 },
      { text: '50개국 데이터 확보, 리포트 v1.0 준비 끝났습니다.', duration: 8151, highlight: true },
    ],
    autoAdvanceDelay: 28000,
  },

  // 슬라이드 10: AI Hub & Kindness Protocol
  {
    id: 'exchange',
    slideNumber: 10,
    layout: 'comparison',
    image: img(10),
    imageAlt: 'The Great Exchange',
    title: 'The Great Exchange',
    comparisonData: {
      leftTitle: '우리가 제공',
      rightTitle: 'Big Tech가 제공',
      leftItems: [
        '14개 언어권 다양성 데이터',
        '윤리적 피드백 (RLHF)',
        'AI 편향성 해결의 핵심 열쇠',
      ],
      rightItems: [
        '유휴 시간대 GPU 클라우드',
        'API 접근 권한 및 크레딧',
        '',
      ],
      leftColor: 'warm',
      rightColor: 'cold',
    },
    script: [
      { text: '핵심은 "교환"입니다.', duration: 3351 },
      { text: '우리가 14개 언어 데이터와 윤리적 피드백을 주면,', duration: 5551 },
      { text: '빅테크가 GPU 클라우드와 API 크레딧을 줍니다.', duration: 5471 },
      { text: '이걸 착한 일 한 사람들에게 우선 재분배합니다.', duration: 5751, highlight: true },
    ],
    autoAdvanceDelay: 21000,
  },

  // 슬라이드 11: 차별화
  {
    id: 'differentiation',
    slideNumber: 11,
    layout: 'comparison',
    image: img(11),
    imageAlt: '왜 우리가 다른가',
    title: '왜 우리가 다른가',
    tableData: {
      headers: ['', '기존 DePIN', 'AlmaNEO'],
      rows: [
        ['접근법', 'GPU 모아서 빅테크와 경쟁', 'RLHF 데이터 ↔ 자원 교환'],
        ['결과', '규모의 경제에서 패배', 'Win-Win 협력'],
        ['타겟', '기업, 개발자', '저소득 청년층'],
        ['핵심 자산', '하드웨어 (GPU)', '윤리 + 데이터'],
        ['미션', '분산 컴퓨팅', 'AI 민주화'],
      ],
      highlightColumn: 2,
    },
    script: [
      { text: '다른 DePIN 프로젝트와 뭐가 다르냐고요?', duration: 3631 },
      { text: '그들은 GPU 모아서 빅테크랑 싸웁니다. 규모의 경제에서 집니다.', duration: 6791 },
      { text: '우린 싸우지 않아요. 데이터로 자원을 교환해요. 윈윈이죠.', duration: 5991 },
      { text: '우리 타겟은 기업이 아니라, AI 접근 못 하는 청년들입니다.', duration: 7351, highlight: true },
    ],
    autoAdvanceDelay: 25000,
  },

  // 슬라이드 12: Why Polygon
  {
    id: 'why-polygon',
    slideNumber: 12,
    layout: 'stats',
    image: img(12),
    imageAlt: 'Why Polygon',
    title: 'Why Polygon?',
    tableData: {
      headers: ['요구사항', 'Polygon의 강점'],
      rows: [
        ['Micro-Transaction', '높은 TPS, 저렴한 가스비로 RLHF 보상 실시간 처리'],
        ['데이터 검증', 'zkEVM의 수학적 투명성 보장'],
        ['크로스체인', 'AggLayer로 파편화된 자원 통합'],
        ['Mass Adoption', 'Starbucks, Nike 등 대기업 협업 실적'],
      ],
    },
    quote: '"기업 협력 모델에 가장 친화적인 블록체인"',
    script: [
      { text: '왜 Polygon이냐고요?', duration: 2471 },
      { text: '수백만 건 마이크로 트랜잭션을 싸게 처리할 수 있어요.', duration: 5431 },
      { text: 'zkEVM으로 데이터 검증 투명하고요.', duration: 4551 },
      { text: '스타벅스, 나이키가 선택한 체인입니다. 기업 협력에 최적이에요.', duration: 7511, highlight: true },
    ],
    autoAdvanceDelay: 21000,
  },

  // 슬라이드 13: 기술적 성숙도
  {
    id: 'tech-maturity',
    slideNumber: 13,
    layout: 'stats',
    image: img(13),
    imageAlt: '이미 작동하는 프로덕트',
    title: '이미 작동하는 프로덕트',
    tableData: {
      headers: ['서비스', 'URL', '상태'],
      rows: [
        ['메인 웹사이트', 'almaneo.org', '✅ Live'],
        ['NFT 마켓플레이스', 'nft.almaneo.org', '✅ Live'],
        ['세계문화여행 게임', 'game.almaneo.org', '✅ Live'],
      ],
    },
    content: `
### 배포된 스마트 컨트랙트 (Polygon Amoy)
**11개 컨트랙트** 배포 완료
ALMAN Token, JeongSBT, AmbassadorSBT, Staking, Governor (DAO), Airdrop, NFT Marketplace + 4개 NFT 컨트랙트

### Mass Adoption 기술
✅ Web3Auth (소셜 로그인) | ✅ Biconomy (가스비 제거) | ✅ 14개 언어
    `,
    script: [
      { text: '아이디어만 있는 게 아닙니다.', duration: 2671 },
      { text: '지금 바로 체험하실 수 있어요.', duration: 3031 },
      { text: 'almaneo.org, nft.almaneo.org, game.almaneo.org 모두 라이브입니다.', duration: 10351 },
      { text: 'Polygon Amoy에 11개 컨트랙트 배포 완료.', duration: 4831 },
      { text: 'Web3Auth로 소셜 로그인, Biconomy로 가스비 제로. 14개 언어 지원해요.', duration: 9631, highlight: true },
    ],
    autoAdvanceDelay: 31000,
  },

  // 슬라이드 14: ALMAN 토큰
  {
    id: 'alman-token',
    slideNumber: 14,
    layout: 'stats',
    image: img(14),
    imageAlt: 'ALMAN 토큰',
    title: 'ALMAN 토큰',
    titleHighlight: '80억 토큰, 80억 인류를 위해',
    tableData: {
      headers: ['항목', '내용'],
      rows: [
        ['네트워크', 'Polygon'],
        ['표준', 'ERC-20'],
        ['총 발행량', '8,000,000,000'],
      ],
    },
    content: `
### 토큰 배분
| 항목 | 비율 |
|:---|:---:|
| **Community & Ecosystem** | **40%** |
| Foundation Reserve | 25% |
| Liquidity & Exchange | 15% |
| Team & Advisors | 10% |
| Kindness Expo & Grants | 10% |

**커뮤니티 최대 배분 | 팀 4년 베스팅**
    `,
    script: [
      { text: 'ALMAN 토큰을 소개합니다.', duration: 2631 },
      { text: '80억 토큰, 80억 인류를 위해.', duration: 4471 },
      { text: 'Polygon 네트워크, ERC-20 표준이에요.', duration: 4911 },
      { text: '커뮤니티에 40% 배분. 가장 큰 비율을 사용자가 가져갑니다.', duration: 7391 },
      { text: '팀은 4년 베스팅, 1년 클리프. 롱텀 비전으로 함께합니다.', duration: 8791, highlight: true },
    ],
    autoAdvanceDelay: 29000,
  },

  // 슬라이드 15: 로드맵 & 예산
  {
    id: 'roadmap-budget',
    slideNumber: 15,
    layout: 'stats',
    image: img(15),
    imageAlt: '로드맵 & Grant 활용',
    title: '로드맵 & Grant 활용',
    tableData: {
      headers: ['시기', '단계', '상태'],
      rows: [
        ['2025', '인프라 구축, Amoy 배포', '✅ 완료'],
        ['2026 Q1', '보안 감사, 메인넷, TGE', '🔵 현재'],
        ['2026 Q2-Q3', 'AI Hub Beta, 글로벌 앰배서더', '⬜ 예정'],
        ['2026 Q4', 'Kindness Expo, DAO 탈중앙화', '⬜ 예정'],
      ],
    },
    content: `
### Grant 활용 ($30K ~ $50K)
| 항목 | 금액 |
|:---|:---:|
| 보안 감사 | $10K ~ $15K |
| Paymaster 가스비 | $5K ~ $10K |
| 초기 유동성 | $8K ~ $12K |
| 마케팅/커뮤니티 | $4K ~ $8K |
| 인프라 운영 | $3K ~ $5K |
    `,
    script: [
      { text: '로드맵입니다.', duration: 1911 },
      { text: '2025년, 인프라 구축과 Amoy 배포 완료했어요.', duration: 5391 },
      { text: '지금은 2026년 Q1, 보안 감사와 메인넷 배포를 앞두고 있습니다.', duration: 7671 },
      { text: 'Grant 활용 계획은요,', duration: 2551 },
      { text: '보안 감사, Paymaster 가스비, 초기 유동성, 마케팅, 인프라에 투명하게 사용합니다.', duration: 10471, highlight: true },
    ],
    autoAdvanceDelay: 29000,
  },

  // 슬라이드 16: 맺음말 & CTA
  {
    id: 'conclusion',
    slideNumber: 16,
    layout: 'conclusion',
    image: img(16),
    imageAlt: '함께 해주세요',
    title: '함께 해주세요',
    quote: '"80억 인류에게 AI의 혜택을."',
    subtitle: 'Polygon의 "Value Layer for Everyone"과 AlmaNEO의 "AI 민주화"는 완벽하게 공명합니다.',
    script: [
      { text: '마지막으로 말씀드리고 싶은 게 있어요.', duration: 3711 },
      { text: '거대 자본과 싸워 이기는 다윗은 멋지죠. 하지만 현실에서는 드물어요.', duration: 7111 },
      { text: 'AlmaNEO는 다른 방법을 택했습니다.', duration: 4391 },
      { text: '골리앗의 힘을 이용해 세상을 이롭게 만드는, 지혜로운 솔로몬이 되고자 합니다.', duration: 6831 },
      { text: '80억 인류에게 AI의 혜택을.', duration: 5311, highlight: true },
      { text: 'Polygon의 "Value Layer for Everyone"과 완벽하게 맞닿아 있어요.', duration: 5911 },
      { text: 'Cold Code, Warm Soul. 함께 해주세요.', duration: 4991, highlight: true },
    ],
    autoAdvanceDelay: 36000,
  },
];

// Polygon Grant 제안서 전체
export const polygonGrantProposal: Proposal = {
  meta: {
    id: 'polygon-grant',
    title: 'AlmaNEO - Polygon Grant Proposal',
    version: '1.0',
    date: '2026-01-29',
    language: 'ko',
    status: 'submitted',
    statusDate: '2026-01-29',
    targetOrg: 'Polygon Village Grants',
    targetProgram: 'Season 4 - AI & DePIN Track',
    requestedAmount: '$30,000 ~ $50,000',
    documentUrl: '/proposals/POLYGON_GRANT_PROPOSAL.md',
    pdfUrl: '/pdf/proposals/polygon-grant/Polygon_Grant_Proposal_en.pdf',
    availableLanguages: ['ko', 'en', 'zh'],
  },
  slides: polygonGrantSlides,
};

export default polygonGrantProposal;
