/**
 * Polygon Grant Proposal - Chinese (中文) Slide Data
 * AlmaNEO Polygon Village Grants Season 4 提案
 */

import type { Proposal, Slide } from './types';

// Slide image path helper
const img = (num: number) => `${String(num).padStart(3, '0')}.webp`;

export const polygonGrantSlidesZh: Slide[] = [
  // 幻灯片 1: 标题
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
      { text: '大家好，我们是AlmaNEO。', duration: 4071 },
      { text: '在冰冷的代码上，种下温暖的情。', duration: 4991 },
    ],
    autoAdvanceDelay: 10000,
  },

  // 幻灯片 2: 提问
  {
    id: 'question',
    slideNumber: 2,
    layout: 'content',
    image: img(2),
    imageAlt: 'AI时代的提问',
    title: 'AI时代，谁拥有智能？',
    script: [
      { text: '请允许我提一个问题。', duration: 3191 },
      { text: '在AI时代，到底谁拥有智能？', duration: 4191 },
      { text: 'AI已经能写文章、编程，甚至做出诊断。', duration: 5831 },
      { text: '但是，每个人都能使用这个强大的工具吗？', duration: 5391, highlight: true },
    ],
    autoAdvanceDelay: 19500,
  },

  // 幻灯片 3: 问题 - 数字殖民主义
  {
    id: 'digital-colonialism',
    slideNumber: 3,
    layout: 'stats',
    image: img(3),
    imageAlt: '21世纪数字殖民主义',
    title: '21世纪数字殖民主义',
    tableData: {
      headers: ['指标', '现状'],
      rows: [
        ['AI算力资源', '前1%的企业占有超过90%'],
        ['AI服务费用', '月费$20（发展中国家：收入的10~30%）'],
        ['AI训练数据', '超过90%是英语'],
      ],
      highlightColumn: 1,
    },
    script: [
      { text: '这就是21世纪的数字殖民主义。', duration: 4511 },
      { text: 'AI算力资源？前1%拿走了90%。', duration: 5871 },
      { text: 'ChatGPT每月20美元，在发展中国家相当于月收入的10到30%。', duration: 9751 },
      { text: '一边用AI做作业，另一边在给AI做数据标注的打工。', duration: 8431, highlight: true },
    ],
    autoAdvanceDelay: 29500,
  },

  // 幻灯片 4: 两个青年的一天
  {
    id: 'two-youths',
    slideNumber: 4,
    layout: 'comparison',
    image: img(4),
    imageAlt: '两个青年的一天',
    title: '两个青年的一天',
    tableData: {
      headers: ['时间', '🇺🇸 发达国家青年', '🌍 发展中国家青年'],
      rows: [
        ['早上', '用ChatGPT润色简历', '免费AI额度已用完'],
        ['下午', '用Copilot完成编程', '在慢速网络上只能做基本搜索'],
        ['晚上', '用AI导师学习新语言', '给AI公司做数据标注兼职'],
      ],
    },
    script: [
      { text: '有两个同样24岁、怀着同样梦想的青年。', duration: 5511 },
      { text: '一个用ChatGPT写简历，另一个免费额度已用完。', duration: 6031 },
      { text: '一个用Copilot编程，另一个只能在慢速网络上搜索。', duration: 5871 },
      { text: '一年后、五年后……这个差距会变成什么样？', duration: 6431, highlight: true },
    ],
    autoAdvanceDelay: 24500,
  },

  // 幻灯片 5: 问题的核心
  {
    id: 'core-problem',
    slideNumber: 5,
    layout: 'content',
    image: img(5),
    imageAlt: '问题的核心链条',
    title: '问题的核心链条',
    content: `
1. 资本垄断智能
       ↓
2. 智能不平等 → 机会不平等
       ↓
3. 机会不平等 → 希望的丧失
       ↓
4. 失去希望的青年增多 → 全人类的未来变得黯淡
    `,
    quote: '"当智能被货币化的那一刻，机会平等就成了神话。"',
    script: [
      { text: '让我来梳理一下问题的核心。', duration: 3591 },
      { text: '当资本垄断了智能，机会的不平等就产生了。', duration: 5271 },
      { text: '没有机会，就没有希望。', duration: 3351 },
      { text: '失去希望的青年越来越多，我们所有人的未来都会变得黯淡。', duration: 8191, highlight: true },
    ],
    autoAdvanceDelay: 21500,
  },

  // 幻灯片 6: 哲学 - 情
  {
    id: 'jeong',
    slideNumber: 6,
    layout: 'quote',
    image: img(6),
    imageAlt: '情：从韩国走向世界',
    title: '情',
    titleHighlight: '从韩国走向世界',
    quote: '情需要时间。情有时候并不高效。正因如此，情是AI无法替代的、人类独有的价值。',
    script: [
      { text: '在韩国，有一个叫"情"的概念。', duration: 3751 },
      { text: '它不只是简单的善意，而是需要时间积累才能形成的深厚纽带。', duration: 8191 },
      { text: 'AI可以优化一切，但情是无法被优化的。', duration: 6271 },
      { text: '这正是AI无法替代的人类价值。', duration: 6431, highlight: true },
    ],
    autoAdvanceDelay: 25500,
  },

  // 幻灯片 7: 三大原则
  {
    id: 'principles',
    slideNumber: 7,
    layout: 'content',
    image: img(7),
    imageAlt: 'AlmaNEO的三大原则',
    title: 'AlmaNEO的三大原则',
    content: `
### 1️⃣ 关注人而非政治
尼日利亚的青年、越南的青年、巴西的青年
每个人都有追逐同样梦想的资格。

### 2️⃣ 关注个体而非国家
GDP、失业率、增长率……统计数据看不到个人的生活。
AlmaNEO关注的是人，不是统计数据。

### 3️⃣ 技术是工具，人是主体
无论AI如何发展，最终的决定必须由人来做。
    `,
    script: [
      { text: '这是AlmaNEO坚守的三大原则。', duration: 3911 },
      { text: '第一，关注人而非政治。每个国家的青年都有资格追逐同样的梦想。', duration: 7911 },
      { text: '第二，关注个体而非国家。我们看的是人，不是GDP。', duration: 7231 },
      { text: '第三，技术只是工具。决定权在人类手中。', duration: 6831, highlight: true },
    ],
    autoAdvanceDelay: 26500,
  },

  // 幻灯片 8: 解决方案概述
  {
    id: 'solution-overview',
    slideNumber: 8,
    layout: 'content',
    image: img(8),
    imageAlt: 'The Ethical Bridge',
    title: 'The Ethical Bridge',
    subtitle: '我们不把大科技公司当作敌人，而是让他们成为资源的提供者。',
    tableData: {
      headers: ['组成部分', '角色'],
      rows: [
        ['GAII Dashboard', '道德杠杆（ESG压力）'],
        ['AI Hub', '资源交换与再分配'],
        ['Kindness Protocol', '人性证明与奖励'],
      ],
    },
    script: [
      { text: '现在来谈谈我们的解决方案——The Ethical Bridge。', duration: 4911 },
      { text: '我们不与大科技公司对抗，而是让他们成为资源的提供者。', duration: 6151 },
      { text: '用GAII制造ESG压力，用AI Hub进行资源交换。', duration: 7071 },
      { text: '用Kindness Protocol证明真实的人，并给予奖励。', duration: 7151, highlight: true },
    ],
    autoAdvanceDelay: 26500,
  },

  // 幻灯片 9: GAII Dashboard
  {
    id: 'gaii-dashboard',
    slideNumber: 9,
    layout: 'content',
    image: img(9),
    imageAlt: 'GAII Dashboard',
    title: 'GAII Dashboard',
    titleHighlight: 'Global AI Inequality Index',
    quote: '"无法衡量的问题，就无法解决。"',
    content: `
### 功能
• 各国AI不平等指数可视化
• AI企业"包容性评分"实时排名

### 战略效果
作为ESG标准，促使企业为提升形象而捐赠或低价供应资源

### 当前状态
✅ 50个国家数据收集完成
✅ 报告v1.0已准备就绪
    `,
    script: [
      { text: 'GAII Dashboard——全球AI不平等指数。', duration: 5031 },
      { text: '无法衡量的问题，就无法解决。所以我们来衡量。', duration: 6511 },
      { text: '按国家追踪AI差距，实时排名企业包容性。', duration: 5991 },
      { text: '已覆盖50个国家的数据，报告v1.0准备就绪。', duration: 9031, highlight: true },
    ],
    autoAdvanceDelay: 27500,
  },

  // 幻灯片 10: AI Hub & Kindness Protocol
  {
    id: 'exchange',
    slideNumber: 10,
    layout: 'comparison',
    image: img(10),
    imageAlt: 'The Great Exchange',
    title: 'The Great Exchange',
    comparisonData: {
      leftTitle: '我们提供',
      rightTitle: '大科技公司提供',
      leftItems: [
        '14种语言的多样性数据',
        '伦理反馈（RLHF）',
        '解决AI偏见的关键钥匙',
      ],
      rightItems: [
        '闲置时段GPU云计算',
        'API访问权限和积分',
        '',
      ],
      leftColor: 'warm',
      rightColor: 'cold',
    },
    script: [
      { text: '核心在于"交换"。', duration: 2951 },
      { text: '我们提供14种语言的数据和伦理反馈，', duration: 4631 },
      { text: '大科技公司提供GPU云计算和API积分。', duration: 5831 },
      { text: '然后我们优先将这些资源分配给做好事的人。', duration: 5991, highlight: true },
    ],
    autoAdvanceDelay: 20500,
  },

  // 幻灯片 11: 差异化
  {
    id: 'differentiation',
    slideNumber: 11,
    layout: 'comparison',
    image: img(11),
    imageAlt: '为什么我们不同',
    title: '为什么我们不同',
    tableData: {
      headers: ['', '现有DePIN', 'AlmaNEO'],
      rows: [
        ['方法', '聚合GPU与大科技公司竞争', 'RLHF数据 ↔ 资源交换'],
        ['结果', '在规模经济中败北', '双赢合作'],
        ['目标', '企业、开发者', '低收入青年'],
        ['核心资产', '硬件（GPU）', '伦理 + 数据'],
        ['使命', '分布式计算', 'AI民主化'],
      ],
      highlightColumn: 2,
    },
    script: [
      { text: '我们和其他DePIN项目有什么不同？', duration: 4191 },
      { text: '他们聚合GPU跟大科技公司竞争，在规模经济中注定失败。', duration: 8071 },
      { text: '我们不对抗。我们用数据交换资源，实现双赢。', duration: 5831 },
      { text: '我们的目标不是企业，而是无法获得AI的青年。', duration: 8191, highlight: true },
    ],
    autoAdvanceDelay: 27500,
  },

  // 幻灯片 12: Why Polygon
  {
    id: 'why-polygon',
    slideNumber: 12,
    layout: 'stats',
    image: img(12),
    imageAlt: 'Why Polygon',
    title: 'Why Polygon?',
    tableData: {
      headers: ['需求', 'Polygon的优势'],
      rows: [
        ['微交易', '高TPS，低Gas费，实时处理RLHF奖励'],
        ['数据验证', 'zkEVM确保数学级透明性'],
        ['跨链', 'AggLayer统一碎片化资源'],
        ['大规模采用', '星巴克、耐克等大企业合作实绩'],
      ],
    },
    quote: '"最适合企业合作的区块链"',
    script: [
      { text: '为什么选择Polygon？', duration: 2500 },
      { text: '可以低成本处理数百万笔微交易。', duration: 4351 },
      { text: 'zkEVM保证数据验证的透明性。', duration: 4511 },
      { text: '星巴克、耐克选择的链。最适合企业合作。', duration: 8431, highlight: true },
    ],
    autoAdvanceDelay: 20500,
  },

  // 幻灯片 13: 技术成熟度
  {
    id: 'tech-maturity',
    slideNumber: 13,
    layout: 'stats',
    image: img(13),
    imageAlt: '已在运行的产品',
    title: '已在运行的产品',
    tableData: {
      headers: ['服务', 'URL', '状态'],
      rows: [
        ['主网站', 'almaneo.org', '✅ 运行中'],
        ['NFT市场', 'nft.almaneo.org', '✅ 运行中'],
        ['世界文化旅行游戏', 'game.almaneo.org', '✅ 运行中'],
      ],
    },
    content: `
### 已部署的智能合约（Polygon Amoy）
**11个合约**已部署完成
ALMAN Token、JeongSBT、AmbassadorSBT、Staking、Governor（DAO）、Airdrop、NFT Marketplace + 4个NFT合约

### 大规模采用技术
✅ Web3Auth（社交登录）| ✅ Biconomy（零Gas费）| ✅ 14种语言
    `,
    script: [
      { text: '这不只是一个想法。', duration: 2751 },
      { text: '现在就可以体验。', duration: 2791 },
      { text: 'almaneo.org、nft.almaneo.org、game.almaneo.org——全部已上线。', duration: 9391 },
      { text: 'Polygon Amoy上已部署11个智能合约。', duration: 4831 },
      { text: 'Web3Auth实现社交登录，Biconomy实现零Gas费。支持14种语言。', duration: 11351, highlight: true },
    ],
    autoAdvanceDelay: 32000,
  },

  // 幻灯片 14: ALMAN代币
  {
    id: 'alman-token',
    slideNumber: 14,
    layout: 'stats',
    image: img(14),
    imageAlt: 'ALMAN代币',
    title: 'ALMAN代币',
    titleHighlight: '80亿代币，为了80亿人类',
    tableData: {
      headers: ['项目', '内容'],
      rows: [
        ['网络', 'Polygon'],
        ['标准', 'ERC-20'],
        ['总发行量', '8,000,000,000'],
      ],
    },
    content: `
### 代币分配
| 类别 | 比例 |
|:---|:---:|
| **社区与生态系统** | **40%** |
| 基金会储备 | 25% |
| 流动性与交易所 | 15% |
| 团队与顾问 | 10% |
| Kindness博览会与资助 | 10% |

**社区获得最大份额 | 团队4年锁定期**
    `,
    script: [
      { text: '介绍一下ALMAN代币。', duration: 3711 },
      { text: '80亿代币，为了80亿人类。', duration: 4431 },
      { text: 'Polygon网络，ERC-20标准。', duration: 3951 },
      { text: '社区获得40%的分配，用户获得最大份额。', duration: 6711 },
      { text: '团队4年锁定期，1年悬崖期。与长期愿景同行。', duration: 10031, highlight: true },
    ],
    autoAdvanceDelay: 30000,
  },

  // 幻灯片 15: 路线图与预算
  {
    id: 'roadmap-budget',
    slideNumber: 15,
    layout: 'stats',
    image: img(15),
    imageAlt: '路线图与Grant使用',
    title: '路线图与Grant使用',
    tableData: {
      headers: ['时期', '阶段', '状态'],
      rows: [
        ['2025', '基础设施建设、Amoy部署', '✅ 已完成'],
        ['2026 Q1', '安全审计、主网、TGE', '🔵 当前'],
        ['2026 Q2-Q3', 'AI Hub Beta、全球大使', '⬜ 即将开始'],
        ['2026 Q4', 'Kindness博览会、DAO去中心化', '⬜ 即将开始'],
      ],
    },
    content: `
### Grant使用（$30K ~ $50K）
| 项目 | 金额 |
|:---|:---:|
| 安全审计 | $10K ~ $15K |
| Paymaster Gas费 | $5K ~ $10K |
| 初始流动性 | $8K ~ $12K |
| 市场营销/社区 | $4K ~ $8K |
| 基础设施运营 | $3K ~ $5K |
    `,
    script: [
      { text: '这是我们的路线图。', duration: 2631 },
      { text: '2025年，基础设施建设和Amoy部署已完成。', duration: 6231 },
      { text: '现在是2026年第一季度，正在准备安全审计和主网部署。', duration: 8191 },
      { text: 'Grant的使用计划是：', duration: 2671 },
      { text: '安全审计、Paymaster Gas费、初始流动性、市场营销、基础设施——全部透明使用。', duration: 12631, highlight: true },
    ],
    autoAdvanceDelay: 33500,
  },

  // 幻灯片 16: 结语与CTA
  {
    id: 'conclusion',
    slideNumber: 16,
    layout: 'conclusion',
    image: img(16),
    imageAlt: '请加入我们',
    title: '请加入我们',
    quote: '"将AI的福祉带给80亿人类。"',
    subtitle: 'Polygon的"Value Layer for Everyone"与AlmaNEO的"AI民主化"完美共鸣。',
    script: [
      { text: '最后，我想说一件事。', duration: 2391 },
      { text: '大卫击败巨人歌利亚很酷，但在现实中太少见了。', duration: 5871 },
      { text: 'AlmaNEO选择了另一条路。', duration: 3751 },
      { text: '我们要成为智慧的所罗门，借用巨人的力量造福世界。', duration: 6471 },
      { text: '将AI的福祉带给80亿人类。', duration: 4991, highlight: true },
      { text: '这与Polygon的"Value Layer for Everyone"完美契合。', duration: 6071 },
      { text: 'Cold Code, Warm Soul。请加入我们。', duration: 5751, highlight: true },
    ],
    autoAdvanceDelay: 36500,
  },
];

// Polygon Grant Proposal - Chinese Version
export const polygonGrantProposalZh: Proposal = {
  meta: {
    id: 'polygon-grant',
    title: 'AlmaNEO - Polygon Grant Proposal',
    version: '1.0',
    date: '2026-01-29',
    language: 'zh',
    status: 'submitted',
    statusDate: '2026-01-29',
    targetOrg: 'Polygon Village Grants',
    targetProgram: 'Season 4 - AI & DePIN Track',
    requestedAmount: '$30,000 ~ $50,000',
    documentUrl: '/proposals/POLYGON_GRANT_PROPOSAL.md',
    pdfUrl: '/pdf/proposals/polygon-grant/Polygon_Grant_Proposal_en.pdf',
    availableLanguages: ['ko', 'en', 'zh'],
  },
  slides: polygonGrantSlidesZh,
};

export default polygonGrantProposalZh;
