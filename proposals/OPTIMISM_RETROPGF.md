# Optimism RetroPGF Application: AlmaNEO

**Project:** AlmaNEO — Open Source AI Democratization Platform
**Website:** https://almaneo.org
**GitHub:** https://github.com/almaneo
**Category:** Public Goods / Open Data / AI Access
**License:** MIT (code), CC-BY-4.0 (data)

---

## 1. Project Overview

AlmaNEO is an open-source platform that measures and addresses global AI inequality. We built the **Global AI Inequality Index (GAII)** — the first composite index quantifying AI access disparities across 50 countries — and provide **free AI access** through a multilingual AI Hub serving 14 languages. Our smart contract library of 18 verified Solidity contracts is fully open and reusable. Everything we build is open source, and our data is freely available under CC-BY-4.0.

Our philosophy is **"Cold Code, Warm Soul"** — technology should serve humanity, not divide it. This aligns directly with Optimism's **"Impact = Profit"** principle: we measure public goods impact, build public infrastructure, and distribute resources to those who need them most.

---

## 2. Public Goods Created

### 2.1 GAII (Global AI Inequality Index) — Open Dataset

The first-of-its-kind composite index measuring AI inequality globally.

| Detail | Value |
|:-------|:------|
| Countries covered | 50 (expanding to 100) |
| Indicators | 4 composite (16 sub-indicators) |
| Regions analyzed | 10 |
| License | CC-BY-4.0 (fully open) |
| Live dashboard | [almaneo.org/gaii](https://almaneo.org) |
| PDF report | Freely downloadable |

**4 Indicators:** Access (40%), Affordability (30%), Language (20%), Skill (10%)

GAII fills a gap that no institution — not the World Bank, not the UN, not any AI company — has addressed: a standardized, composite metric for how unequally AI is distributed. The data is open for anyone to use, cite, or build upon.

### 2.2 AI Hub — Free Public AI Infrastructure

A multi-model AI gateway providing free access with zero paywall.

| Detail | Value |
|:-------|:------|
| Models available | Gemini 2.5 Flash Lite + Llama 3.3 70B |
| Languages supported | 14 (including Global South languages) |
| Free daily quota | 50 queries/day per user |
| Authentication | Web3Auth (social login, no crypto knowledge needed) |
| Paywall | None for basic access |

**Languages:** Korean, English, Chinese, Japanese, Spanish, French, Arabic, Portuguese, Indonesian, Malay, Thai, Vietnamese, Khmer, Swahili

This serves users who cannot afford $20/month AI subscriptions — roughly 3.5 billion people globally.

### 2.3 Open Source Codebase

| Detail | Value |
|:-------|:------|
| Source files | 670+ |
| Lines of code | 178,000+ |
| License | MIT |
| Repository | [github.com/almaneo](https://github.com/almaneo) |
| Stack | Vite 7 + React 19 + TypeScript + Tailwind CSS |

### 2.4 Smart Contract Library — Reusable Public Infrastructure

18 Solidity contracts deployed on Polygon, all using UUPS Upgradeable pattern with OpenZeppelin 5.x. These are production-grade, verified, and reusable by any project.

| Contract | Standard | Purpose |
|:---------|:---------|:--------|
| ALMANToken | ERC-20Votes | Governance token (8B supply) |
| JeongSBT | ERC-721 Soulbound | Non-transferable soul token (4 tiers) |
| AmbassadorSBT | ERC-721 Soulbound | Activity-based auto-issuance |
| ALMANStaking | Custom | 4-tier staking (APY 5-18%) |
| ALMANGovernor | Governor | DAO governance (4% quorum) |
| ALMANTimelock | Timelock | 2-day execution delay |
| KindnessAirdrop | Merkle Proof | Activity-based distribution |
| TokenVesting | Custom | 12-month cliff + 3-year linear |
| MiningPool | Custom | Game mining with halving epochs |
| AlmaNFT721 | ERC-721 + ERC-4907 | NFT with rental support |
| AlmaNFT1155 | ERC-1155 + ERC-5006 | Multi-token with rental |
| AlmaMarketplace | Custom | Fixed/auction/rental trading |
| AlmaPaymentManager | Custom | Multi-token payments |
| AlmaCollectionManager | Custom | Collection management |

9 contracts verified on PolygonScan. All source code is MIT-licensed.

### 2.5 Multilingual Infrastructure

| Detail | Value |
|:-------|:------|
| UI languages | 14 |
| Whitepaper languages | 15 |
| Cultural education game | [game.almaneo.org](https://game.almaneo.org) (20 countries, 58 quests) |
| i18n keys | 1,000+ translation entries |

---

## 3. Measurable Impact Metrics

| Metric | Value |
|:-------|:------|
| Countries with GAII data | 50 |
| Languages supported (UI) | 14 |
| Whitepaper languages | 15 |
| Source files (open source) | 670+ |
| Lines of code (open source) | 178,000+ |
| Smart contracts deployed | 18 |
| Contracts verified (PolygonScan) | 9 |
| Live deployments | 3 (web, nft, game) |
| GAII indicators per country | 4 (16 sub-indicators) |
| Game quests (cultural education) | 58 across 20 countries |
| Token supply (community-first) | 8B ALMAN (40% community allocation) |
| Kindness Glossary terms | 30+ terms in 14 languages |

---

## 4. Alignment with Optimism's "Impact = Profit"

AlmaNEO was designed from day one as public goods infrastructure:

1. **Open Data as Public Good**: GAII is CC-BY-4.0 — anyone can use, remix, or build upon this dataset. No API key required, no rate limits on the data.

2. **Free Access as Public Infrastructure**: AI Hub provides 50 free queries/day with no premium tier for basic access. We don't monetize access — we democratize it.

3. **Open Source as Public Code**: 670+ files, 178K+ lines, MIT license. The smart contract library alone is a reusable public good for any Web3 project.

4. **Community Governance**: 40% of 8B ALMAN tokens allocated to community (mining, staking rewards, airdrop, DAO reserve). Kindness Protocol incentivizes real-world meetups and mentoring — not speculation.

5. **Impact Measurement**: GAII itself is an impact measurement tool. We don't just claim impact — we built the index to measure it globally.

> **We believe AI access is a public good, not a premium product.**

---

## 5. Technical Architecture

```
almaneo.org (Main Platform)
  ├─ GAII Dashboard (50 countries, interactive world map)
  ├─ AI Hub (multi-model, SSE streaming)
  ├─ Kindness Protocol (meetup verification, Ambassador SBT)
  ├─ Governance (on-chain DAO)
  ├─ Staking / Airdrop
  └─ Whitepaper (15 languages)

game.almaneo.org (Cultural Education)
  └─ World Culture Travel (20 countries, 58 quests, 2 languages)

nft.almaneo.org (NFT Marketplace)
  └─ Gasless minting via Biconomy

Backend: Supabase (PostgreSQL, Seoul region)
Hosting: Vercel (Edge Functions)
Blockchain: Polygon (18 contracts, UUPS Upgradeable)
```

---

## 6. How RetroPGF Funds Will Be Used

| Allocation | Purpose | Impact |
|:-----------|:--------|:-------|
| 40% | Expand GAII to 100 countries | Double the open dataset coverage |
| 25% | Sustain free AI Hub operations | Keep AI access free for Global South users |
| 20% | Community meetup support | Fund real-world Kindness Protocol events |
| 15% | Translation/localization | Add 5+ new Global South languages |

All outputs remain open source and freely available.

---

## 7. Team

| Role | Name | Focus |
|:-----|:-----|:------|
| Co-Founder | Ruca Lee | Vision, AI/Blockchain Architecture |
| Co-Founder | Patrick Ma | Global Community Building |
| Co-Founder | Lion Kim | Token Business, Payment Systems |

3 full-time co-founders. Actively hiring: CTO, Head of Product, Community Lead, AI Researcher.

---

## 8. Links

| Resource | URL |
|:---------|:----|
| Website | https://almaneo.org |
| GAII Dashboard | https://almaneo.org (Platform > GAII) |
| AI Hub | https://almaneo.org (Platform > AI Hub) |
| Game | https://game.almaneo.org |
| NFT Marketplace | https://nft.almaneo.org |
| GitHub | https://github.com/almaneo |
| Twitter/X | https://x.com/almaneo_org |
| Discord | https://discord.gg/JkRNuj7aYd |
| Blog | https://medium.com/@news_15809 |

---

*AlmaNEO — Cold Code, Warm Soul*
*Making AI a public good for 8 billion people.*
*Impact = Profit. Open source. Free forever.*
