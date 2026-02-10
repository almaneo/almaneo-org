# Gitcoin GG25: AlmaNEO — Free AI for 8 Billion People

## TL;DR

AlmaNEO measures global AI inequality (GAII Index, 50 countries) and provides free AI access (AI Hub, 14 languages). Everything is open source. We've shipped 670+ files, 178K+ lines of code, and 18 smart contracts on Polygon — all live today.

---

## What We Built (All Live)

### 1. GAII Dashboard — Measuring AI Inequality

The first composite index quantifying global AI inequality across four dimensions: Access, Affordability, Language, and Skill.

- 50 countries, 4 weighted indicators, 10 regions
- Interactive world map visualization with country-level drill-down
- Downloadable PDF report (GAII Report v1.0)
- Open data: **CC-BY-4.0** license
- Data sources: Microsoft Global AI Adoption Report, World Bank, ITU, UNESCO
- **Live**: [almaneo.org/gaii](https://almaneo.org/gaii)

### 2. AI Hub — Free Multi-Model AI Gateway

Free AI chat access designed for the Global South, where AI subscription costs can reach 10-30% of monthly income.

- **Gemini 2.5 Flash Lite** + **Llama 3.3 70B** (via Groq)
- 14 languages including Swahili, Khmer, Indonesian, Vietnamese, Thai
- 50 free queries per day per user — no paywall, no credit card
- Vercel Edge Functions with SSE streaming for fast responses
- Web3Auth social login (Google, Facebook, X) — no wallet required
- **Live**: [almaneo.org/ai-hub](https://almaneo.org/ai-hub)

### 3. World Culture Travel Game

An educational game that teaches global cultures through interactive quests, built to make cross-cultural learning accessible and fun.

- 8 regions, 20 countries, 58+ quests (4 quest types)
- Mobile-first design (portrait mode, 5-tab navigation)
- Available in Korean & English
- Supabase backend with content translation system
- Token mining integration (800M ALMAN mining pool)
- **Live**: [game.almaneo.org](https://game.almaneo.org)

### 4. NFT Marketplace

A community NFT marketplace with gasless transactions for users who have never used crypto before.

- ERC-721 + ERC-1155 support with ERC-4907/5006 rental extensions
- Gasless minting via Biconomy (ERC-2771 meta-transactions)
- Multi-token payments: POL, USDC, ALMAN
- Kindness Score-based fee discounts (up to 50%)
- **Live**: [nft.almaneo.org](https://nft.almaneo.org)

### 5. Kindness Protocol — Proof of Humanity

A community verification system where real-world meetups and acts of kindness earn on-chain reputation.

- Offline meetup verification with photo proof
- Ambassador SBT (Soulbound Token) with 4 tiers: Friend, Host, Ambassador, Guardian
- Activity-based scoring: meetups, mentoring, translation, volunteering
- On-chain reputation via AmbassadorSBT contract on Polygon
- Supabase-powered meetup creation, RSVP, and verification flow

### 6. Smart Contracts (18 Deployed on Polygon Amoy)

All contracts use UUPS Upgradeable pattern with OpenZeppelin 5.x:

| Contract | Purpose |
|:---------|:--------|
| ALMANToken | ERC-20Votes governance token (8B supply) |
| JeongSBT | Soulbound Token (non-transferable, 4 tiers) |
| AmbassadorSBT | Kindness reputation (meetup-based) |
| ALMANStaking | 4-tier staking (5-18% APY) |
| ALMANGovernor | DAO governance (4% quorum, 1-week voting) |
| ALMANTimelock | Execution delay (2 days) |
| KindnessAirdrop | Merkle proof airdrop (600M ALMAN) |
| TokenVesting | Team vesting (12-month cliff + 3 years) |
| MiningPool | Game mining pool (800M ALMAN) |
| AlmaNFT721 | ERC-721 NFT with rental |
| AlmaNFT1155 | ERC-1155 multi-token NFT |
| AlmaMarketplace | NFT trading (fixed/auction/rental) |
| AlmaPaymentManager | Multi-token payments |
| AlmaCollectionManager | Collection management |

9 of 18 contracts are verified on PolygonScan.

---

## Why This is a Public Good

- **MIT License** for all application code
- **CC-BY-4.0** for all GAII data and reports
- **Free AI access** — no paywall, no subscription, no credit card required
- **14 languages** — Global South languages prioritized (Swahili, Khmer, Vietnamese, Indonesian, Thai, Malay)
- **Open source**: [github.com/almaneo](https://github.com/almaneo)
- **Gasless onboarding** — Web3Auth social login + Biconomy meta-transactions means zero crypto knowledge needed
- **15-language whitepaper** — full project documentation accessible globally

---

## Impact Numbers

| What | Number |
|:-----|:-------|
| Countries with GAII data | 50 |
| Languages supported (UI) | 14 |
| Whitepaper languages | 15 |
| Source files shipped | 670+ |
| Lines of code | 178,000+ |
| Smart contracts deployed | 18 |
| Contracts verified (PolygonScan) | 9 |
| Live services | 3 (web, nft, game) |
| Game quests | 58+ across 20 countries |
| Token supply | 8B ALMAN |
| Community allocation | 40% (3.2B ALMAN) |
| TGE date | February 6, 2026 |

---

## How Funds Will Be Used

| Use | Priority |
|:----|:---------|
| Keep AI Hub free (Gemini + Groq API costs) | High |
| Expand GAII Index to 100 countries | High |
| Add more AI Hub languages (Hindi, Bengali, Amharic) | Medium |
| Community meetup support (Kindness Protocol) | Medium |
| Infrastructure costs (Vercel, Supabase) | Ongoing |

We are a bootstrapped team. Every dollar goes directly to keeping public goods running and expanding access.

---

## Tech Stack

- **Frontend**: Vite 7 + React 19 + TypeScript + Tailwind CSS 3
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **AI**: Google Gemini API + Groq API (Llama 3.3 70B)
- **Blockchain**: Polygon (Solidity 0.8.24, OpenZeppelin 5.x, Hardhat)
- **Gasless**: Biconomy SDK v4 (ERC-2771)
- **Auth**: Web3Auth (social login + wallet)
- **Hosting**: Vercel (web, nft, game)
- **i18n**: react-i18next (14 languages)

---

## Team

- **Ruca Lee** — Founder & Lead Developer. AI/Blockchain full-stack. Built the entire platform solo (670+ files). Drives the vision of AI democratization through the Korean concept of Jeong (deep emotional bonds).
- **Patrick Ma** — Co-Founder. Global community builder and multicultural communications specialist.
- **Lion Kim** — Co-Founder. Blockchain token business and payment systems specialist.

We are actively hiring: CTO, Head of Product, Community Lead, AI Researcher.

---

## Links

| Resource | URL |
|:---------|:----|
| Website | [almaneo.org](https://almaneo.org) |
| GAII Dashboard | [almaneo.org/gaii](https://almaneo.org/gaii) |
| AI Hub | [almaneo.org/ai-hub](https://almaneo.org/ai-hub) |
| Game | [game.almaneo.org](https://game.almaneo.org) |
| NFT | [nft.almaneo.org](https://nft.almaneo.org) |
| GitHub | [github.com/almaneo](https://github.com/almaneo) |
| Twitter | [x.com/almaneo_org](https://x.com/almaneo_org) |
| Discord | [discord.gg/JkRNuj7aYd](https://discord.gg/JkRNuj7aYd) |
| Blog | [medium.com/@news_15809](https://medium.com/@news_15809) |
| Pitch Deck | [almaneo.org/proposals/polygon-grant](https://almaneo.org/proposals/polygon-grant) |

---

*AlmaNEO — Cold Code, Warm Soul*
*We ship public goods.*
