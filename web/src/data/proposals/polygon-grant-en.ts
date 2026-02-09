/**
 * Polygon Grant Proposal - English Slide Data
 * AlmaNEO Polygon Village Grants Season 4 Proposal
 */

import type { Proposal, Slide } from './types';

// Slide image path helper
const img = (num: number) => `${String(num).padStart(3, '0')}.webp`;

export const polygonGrantSlidesEn: Slide[] = [
  // Slide 1: Title
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
      { text: 'Hello, this is AlmaNEO.', duration: 3300 },
      { text: 'We plant warm hearts on cold code.', duration: 3900 },
    ],
    autoAdvanceDelay: 7500,
  },

  // Slide 2: Question
  {
    id: 'question',
    slideNumber: 2,
    layout: 'content',
    image: img(2),
    imageAlt: 'A Question for the AI Era',
    title: 'In the Age of AI, Who Owns Intelligence?',
    script: [
      { text: "Let me ask you a question.", duration: 2600 },
      { text: 'In this AI era, who truly owns intelligence?', duration: 5400 },
      { text: 'AI already writes essays, codes, and makes diagnoses.', duration: 5600 },
      { text: 'But can everyone access this powerful tool?', duration: 5100, highlight: true },
    ],
    autoAdvanceDelay: 19000,
  },

  // Slide 3: Problem - Digital Colonialism
  {
    id: 'digital-colonialism',
    slideNumber: 3,
    layout: 'stats',
    image: img(3),
    imageAlt: '21st Century Digital Colonialism',
    title: '21st Century Digital Colonialism',
    tableData: {
      headers: ['Metric', 'Reality'],
      rows: [
        ['AI Computing Power', 'Top 1% owns over 90%'],
        ['AI Service Cost', '$20/month (10-30% of income in Global South)'],
        ['AI Training Data', 'Over 90% is English'],
      ],
      highlightColumn: 1,
    },
    script: [
      { text: "This is 21st century digital colonialism.", duration: 4600 },
      { text: 'AI computing power? The top 1% takes 90%.', duration: 5400 },
      { text: 'ChatGPT at $20/month equals 10-30% of monthly income in developing nations.', duration: 7800 },
      { text: "One side uses AI for homework, while the other labels AI data as a side job.", duration: 8900, highlight: true },
    ],
    autoAdvanceDelay: 27000,
  },

  // Slide 4: Two Youths' Day
  {
    id: 'two-youths',
    slideNumber: 4,
    layout: 'comparison',
    image: img(4),
    imageAlt: "A Day in Two Youths' Lives",
    title: "A Day in Two Youths' Lives",
    tableData: {
      headers: ['Time', 'Developed Country Youth', 'Global South Youth'],
      rows: [
        ['Morning', 'Polish resume with ChatGPT', 'Free AI quota exceeded'],
        ['Afternoon', 'Complete code with Copilot', 'Basic search on slow internet'],
        ['Evening', 'Learn new language with AI tutor', 'Data labeling side job for AI company'],
      ],
    },
    script: [
      { text: 'Two 24-year-olds with the same dreams.', duration: 4100 },
      { text: 'One writes resumes with ChatGPT, the other hits the free limit.', duration: 5200 },
      { text: 'One codes with Copilot, the other searches on slow internet.', duration: 5600 },
      { text: 'In 1 year, in 5 years... how wide will this gap be?', duration: 7100, highlight: true },
    ],
    autoAdvanceDelay: 22300,
  },

  // Slide 5: Core Problem
  {
    id: 'core-problem',
    slideNumber: 5,
    layout: 'content',
    image: img(5),
    imageAlt: 'The Chain of Problems',
    title: 'The Chain of Problems',
    content: `
1. Capital monopolizes intelligence
       ↓
2. Intelligence inequality → Opportunity inequality
       ↓
3. Opportunity inequality → Loss of hope
       ↓
4. More hopeless youth → Dark future for humanity
    `,
    quote: '"The moment intelligence becomes monetized, equal opportunity becomes a myth."',
    script: [
      { text: "Let me break down the problem.", duration: 2800 },
      { text: 'When capital monopolizes intelligence, opportunity inequality follows.', duration: 5600 },
      { text: 'Without opportunities, there is no hope.', duration: 4000 },
      { text: 'More hopeless youth means a darker future for all of us.', duration: 6600, highlight: true },
    ],
    autoAdvanceDelay: 19300,
  },

  // Slide 6: Philosophy - Jeong (情)
  {
    id: 'jeong',
    slideNumber: 6,
    layout: 'quote',
    image: img(6),
    imageAlt: 'Jeong (情): From Korea to the World',
    title: 'Jeong (情)',
    titleHighlight: 'From Korea to the World',
    quote: "Jeong takes time. Jeong is sometimes inefficient. That's why Jeong is a uniquely human value that AI cannot replace.",
    script: [
      { text: 'In Korea, there\'s a word called "Jeong."', duration: 4000 },
      { text: "It's not just kindness, but a deep bond that builds over time.", duration: 6000 },
      { text: 'AI optimizes everything, but Jeong cannot be optimized.', duration: 4900 },
      { text: "This is the human value that AI cannot replace.", duration: 6400, highlight: true },
    ],
    autoAdvanceDelay: 21600,
  },

  // Slide 7: Three Principles
  {
    id: 'principles',
    slideNumber: 7,
    layout: 'content',
    image: img(7),
    imageAlt: "AlmaNEO's Three Principles",
    title: "AlmaNEO's Three Principles",
    content: `
### 1. People over Politics
Youth in Nigeria, Vietnam, Brazil—
all deserve to dream the same dreams.

### 2. Individuals over Nations
GDP, unemployment rates, growth... statistics hide individual lives.
AlmaNEO sees people, not statistics.

### 3. Technology as Tool, Humans as Agents
No matter how advanced AI becomes, humans must make the final decisions.
    `,
    script: [
      { text: 'These are the three principles AlmaNEO upholds.', duration: 4000 },
      { text: 'First, people over politics. Youth everywhere deserve the same dreams.', duration: 6700 },
      { text: 'Second, individuals over nations. We see people, not GDP.', duration: 6000 },
      { text: 'Third, technology is just a tool. Humans make the decisions.', duration: 7500, highlight: true },
    ],
    autoAdvanceDelay: 24500,
  },

  // Slide 8: Solution Overview
  {
    id: 'solution-overview',
    slideNumber: 8,
    layout: 'content',
    image: img(8),
    imageAlt: 'The Ethical Bridge',
    title: 'The Ethical Bridge',
    subtitle: "We don't position Big Tech as the enemy. We engage them as resource providers.",
    tableData: {
      headers: ['Component', 'Role'],
      rows: [
        ['GAII Dashboard', 'Moral Leverage (ESG Pressure)'],
        ['AI Hub', 'Resource Exchange & Redistribution'],
        ['Kindness Protocol', 'Proof of Humanity & Rewards'],
      ],
    },
    script: [
      { text: "Now let's talk about the solution: The Ethical Bridge.", duration: 4700 },
      { text: "We don't fight Big Tech. We bring them in as resource providers.", duration: 5600 },
      { text: 'GAII creates ESG pressure, AI Hub exchanges resources.', duration: 6600 },
      { text: 'Kindness Protocol proves and rewards real humans.', duration: 6900, highlight: true },
    ],
    autoAdvanceDelay: 24100,
  },

  // Slide 9: GAII Dashboard
  {
    id: 'gaii-dashboard',
    slideNumber: 9,
    layout: 'content',
    image: img(9),
    imageAlt: 'GAII Dashboard',
    title: 'GAII Dashboard',
    titleHighlight: 'Global AI Inequality Index',
    quote: '"What gets measured, gets managed."',
    content: `
### Features
• Real-time visualization of AI inequality by country
• AI company "inclusivity score" rankings

### Strategic Effect
Acts as ESG standard, incentivizing companies to donate/provide resources at low cost for brand image

### Current Status
✅ 50 countries data collected
✅ Report v1.0 ready for publication
    `,
    script: [
      { text: 'GAII Dashboard. The Global AI Inequality Index.', duration: 6100 },
      { text: "If you can't measure it, you can't fix it. So we measure.", duration: 4900 },
      { text: "We track AI gaps by country and company inclusivity scores in real-time.", duration: 6200 },
      { text: '50 countries covered, Report v1.0 ready to launch.', duration: 7900, highlight: true },
    ],
    autoAdvanceDelay: 25400,
  },

  // Slide 10: AI Hub & Kindness Protocol
  {
    id: 'exchange',
    slideNumber: 10,
    layout: 'comparison',
    image: img(10),
    imageAlt: 'The Great Exchange',
    title: 'The Great Exchange',
    comparisonData: {
      leftTitle: 'We Provide',
      rightTitle: 'Big Tech Provides',
      leftItems: [
        'Diversity data from 14 language groups',
        'Ethical feedback (RLHF)',
        'Key to solving AI bias',
      ],
      rightItems: [
        'Off-peak GPU cloud access',
        'API access and credits',
        '',
      ],
      leftColor: 'warm',
      rightColor: 'cold',
    },
    script: [
      { text: 'The key is "exchange."', duration: 3000 },
      { text: 'We provide 14-language data and ethical feedback,', duration: 4900 },
      { text: 'Big Tech provides GPU cloud and API credits.', duration: 5300 },
      { text: 'We redistribute this to those who do good deeds first.', duration: 6800, highlight: true },
    ],
    autoAdvanceDelay: 20300,
  },

  // Slide 11: Differentiation
  {
    id: 'differentiation',
    slideNumber: 11,
    layout: 'comparison',
    image: img(11),
    imageAlt: 'Why We Are Different',
    title: 'Why We Are Different',
    tableData: {
      headers: ['', 'Existing DePIN', 'AlmaNEO'],
      rows: [
        ['Approach', 'Aggregate GPUs to compete with Big Tech', 'RLHF data ↔ resource exchange'],
        ['Outcome', 'Lose to economies of scale', 'Win-Win collaboration'],
        ['Target', 'Enterprises, developers', 'Low-income youth'],
        ['Core Asset', 'Hardware (GPU)', 'Ethics + Data'],
        ['Mission', 'Distributed computing', 'AI democratization'],
      ],
      highlightColumn: 2,
    },
    script: [
      { text: 'How are we different from other DePIN projects?', duration: 3700 },
      { text: 'They aggregate GPUs to fight Big Tech. They lose to economies of scale.', duration: 7000 },
      { text: "We don't fight. We exchange data for resources. It's win-win.", duration: 6000 },
      { text: "Our target isn't enterprises—it's youth who can't access AI.", duration: 7600, highlight: true },
    ],
    autoAdvanceDelay: 24600,
  },

  // Slide 12: Why Polygon
  {
    id: 'why-polygon',
    slideNumber: 12,
    layout: 'stats',
    image: img(12),
    imageAlt: 'Why Polygon',
    title: 'Why Polygon?',
    tableData: {
      headers: ['Requirement', "Polygon's Strength"],
      rows: [
        ['Micro-Transaction', 'High TPS, low gas for real-time RLHF rewards'],
        ['Data Verification', 'Mathematical transparency via zkEVM'],
        ['Cross-chain', 'AggLayer unifies fragmented resources'],
        ['Mass Adoption', 'Enterprise partnerships: Starbucks, Nike, etc.'],
      ],
    },
    quote: '"The blockchain most aligned with enterprise collaboration"',
    script: [
      { text: 'Why Polygon?', duration: 2000 },
      { text: 'We can process millions of micro-transactions cheaply.', duration: 5100 },
      { text: 'zkEVM ensures transparent data verification.', duration: 5300 },
      { text: "Starbucks and Nike chose this chain. It's optimal for enterprise collaboration.", duration: 9200, highlight: true },
    ],
    autoAdvanceDelay: 21900,
  },

  // Slide 13: Technical Maturity
  {
    id: 'tech-maturity',
    slideNumber: 13,
    layout: 'stats',
    image: img(13),
    imageAlt: 'Already Working Products',
    title: 'Already Working Products',
    tableData: {
      headers: ['Service', 'URL', 'Status'],
      rows: [
        ['Main Website', 'almaneo.org', '✅ Live'],
        ['NFT Marketplace', 'nft.almaneo.org', '✅ Live'],
        ['World Culture Travel Game', 'game.almaneo.org', '✅ Live'],
      ],
    },
    content: `
### Deployed Smart Contracts (Polygon Amoy)
**11 contracts** deployed
ALMAN Token, JeongSBT, AmbassadorSBT, Staking, Governor (DAO), Airdrop, NFT Marketplace + 4 NFT contracts

### Mass Adoption Tech
✅ Web3Auth (Social Login) | ✅ Biconomy (Zero Gas) | ✅ 14 Languages
    `,
    script: [
      { text: "It's not just an idea.", duration: 2800 },
      { text: 'You can experience it right now.', duration: 3400 },
      { text: 'almaneo.org, nft.almaneo.org, game.almaneo.org—all live.', duration: 7400 },
      { text: '11 contracts deployed on Polygon Amoy.', duration: 4100 },
      { text: 'Web3Auth for social login, Biconomy for zero gas. 14 languages supported.', duration: 9000, highlight: true },
    ],
    autoAdvanceDelay: 27000,
  },

  // Slide 14: ALMAN Token
  {
    id: 'alman-token',
    slideNumber: 14,
    layout: 'stats',
    image: img(14),
    imageAlt: 'ALMAN Token',
    title: 'ALMAN Token',
    titleHighlight: '8 Billion Tokens for 8 Billion Humans',
    tableData: {
      headers: ['Item', 'Details'],
      rows: [
        ['Network', 'Polygon'],
        ['Standard', 'ERC-20'],
        ['Total Supply', '8,000,000,000'],
      ],
    },
    content: `
### Token Distribution
| Category | Share |
|:---|:---:|
| **Community & Ecosystem** | **40%** |
| Foundation Reserve | 25% |
| Liquidity & Exchange | 15% |
| Team & Advisors | 10% |
| Kindness Expo & Grants | 10% |

**Maximum community allocation | Team: 4-year vesting**
    `,
    script: [
      { text: 'Introducing the ALMAN token.', duration: 3300 },
      { text: '8 billion tokens for 8 billion humans.', duration: 4300 },
      { text: 'Polygon network, ERC-20 standard.', duration: 4200 },
      { text: '40% goes to the community. Users get the largest share.', duration: 5800 },
      { text: 'Team has 4-year vesting with 1-year cliff. Long-term vision.', duration: 8100, highlight: true },
    ],
    autoAdvanceDelay: 26000,
  },

  // Slide 15: Roadmap & Budget
  {
    id: 'roadmap-budget',
    slideNumber: 15,
    layout: 'stats',
    image: img(15),
    imageAlt: 'Roadmap & Grant Usage',
    title: 'Roadmap & Grant Usage',
    tableData: {
      headers: ['Period', 'Phase', 'Status'],
      rows: [
        ['2025', 'Infrastructure, Amoy Deployment', '✅ Done'],
        ['2026 Q1', 'Security Audit, Mainnet, TGE', '🔵 Current'],
        ['2026 Q2-Q3', 'AI Hub Beta, Global Ambassadors', '⬜ Upcoming'],
        ['2026 Q4', 'Kindness Expo, DAO Decentralization', '⬜ Upcoming'],
      ],
    },
    content: `
### Grant Usage ($30K ~ $50K)
| Item | Amount |
|:---|:---:|
| Security Audit | $10K ~ $15K |
| Paymaster Gas | $5K ~ $10K |
| Initial Liquidity | $8K ~ $12K |
| Marketing/Community | $4K ~ $8K |
| Infrastructure | $3K ~ $5K |
    `,
    script: [
      { text: 'Here is our roadmap.', duration: 2600 },
      { text: '2025: Infrastructure and Amoy deployment—done.', duration: 5400 },
      { text: "We're now in 2026 Q1, preparing for security audit and mainnet.", duration: 6300 },
      { text: 'For grant usage:', duration: 2300 },
      { text: 'Security audit, Paymaster gas, liquidity, marketing, infrastructure—all transparent.', duration: 10900, highlight: true },
    ],
    autoAdvanceDelay: 27800,
  },

  // Slide 16: Conclusion & CTA
  {
    id: 'conclusion',
    slideNumber: 16,
    layout: 'conclusion',
    image: img(16),
    imageAlt: 'Join Us',
    title: 'Join Us',
    quote: '"Bringing AI benefits to 8 billion humans."',
    subtitle: 'Polygon\'s "Value Layer for Everyone" and AlmaNEO\'s "AI Democratization" resonate perfectly.',
    script: [
      { text: 'One last thing I want to share.', duration: 2600 },
      { text: 'David defeating Goliath is inspiring. But rare in reality.', duration: 6000 },
      { text: 'AlmaNEO chose a different path.', duration: 4000 },
      { text: "We aim to be a wise Solomon, using Goliath's strength to benefit the world.", duration: 6600 },
      { text: 'Bringing AI benefits to 8 billion humans.', duration: 5500, highlight: true },
      { text: 'Perfectly aligned with Polygon\'s "Value Layer for Everyone."', duration: 5100 },
      { text: 'Cold Code, Warm Soul. Join us.', duration: 6000, highlight: true },
    ],
    autoAdvanceDelay: 36100,
  },
];

// Polygon Grant Proposal - English Version
export const polygonGrantProposalEn: Proposal = {
  meta: {
    id: 'polygon-grant',
    title: 'AlmaNEO - Polygon Grant Proposal',
    version: '1.0',
    date: '2026-01-29',
    language: 'en',
    status: 'submitted',
    statusDate: '2026-01-29',
    targetOrg: 'Polygon Village Grants',
    targetProgram: 'Season 4 - AI & DePIN Track',
    requestedAmount: '$30,000 ~ $50,000',
    documentUrl: '/proposals/POLYGON_GRANT_PROPOSAL.md',
    pdfUrl: '/pdf/proposals/polygon-grant/Polygon_Grant_Proposal_en.pdf',
    availableLanguages: ['ko', 'en', 'zh'],
  },
  slides: polygonGrantSlidesEn,
};

export default polygonGrantProposalEn;
