# AlmaNEO Platform Development Quotation

**Project Name:** AlmaNEO - AI Democratization Platform
**Document Version:** 1.0
**Date:** January 22, 2026
**Prepared by:** AlmaNEO Development Team
**Confidentiality:** Strictly Confidential

---

## Executive Summary

AlmaNEO는 전 세계 80억 인류를 위한 AI 민주화 플랫폼입니다. 블록체인 기술과 Web3 인프라를 활용하여 AI 접근 불평등을 해소하고, "정(情)"의 철학을 기반으로 한 새로운 디지털 경제 생태계를 구축합니다.

본 견적서는 AlmaNEO 플랫폼의 전체 개발 범위, 일정, 투입 인력, 비용을 상세히 기술합니다.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Architecture](#2-technical-architecture)
3. [Development Scope](#3-development-scope)
4. [Work Breakdown Structure (WBS)](#4-work-breakdown-structure-wbs)
5. [Resource Allocation](#5-resource-allocation)
6. [Cost Estimation](#6-cost-estimation)
7. [Timeline & Milestones](#7-timeline--milestones)
8. [Risk Assessment](#8-risk-assessment)
9. [Terms & Conditions](#9-terms--conditions)
10. [Appendix](#10-appendix)

---

## 1. Project Overview

### 1.1 Project Vision
> "Cold Code, Warm Soul" - 차가운 코드로 따뜻한 영혼을 연결합니다.

### 1.2 Core Objectives
| 목표 | 설명 |
|------|------|
| **GAII 지표** | Global AI Inequality Index - AI 불평등 실시간 측정 |
| **AI Hub** | 무료 AI 접근 + 분산 컴퓨팅 네트워크 (DePIN) |
| **Kindness Protocol** | Proof of Humanity 기반 합의 메커니즘 |
| **ALMAN Token** | 80억 공급량 - 80억 인류를 위한 거버넌스 토큰 |

### 1.3 Target Platform
- **Domain:** almaneo.org
- **Network:** Polygon (Amoy Testnet → Mainnet)
- **Token:** ALMAN (ERC-20 + ERC-20Votes)

---

## 2. Technical Architecture

### 2.1 System Architecture
```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AlmaNEO Platform Architecture                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │   WEB SERVER   │  │   NFT SERVER   │  │  GAME SERVER   │             │
│  │   (Main Site)  │  │ (Marketplace)  │  │  (Kindness)    │             │
│  │                │  │                │  │                │             │
│  │ • Landing Page │  │ • NFT Minting  │  │ • Tap-to-Earn  │             │
│  │ • GAII Dashboard│ │ • Buy/Sell     │  │ • Quests       │             │
│  │ • Governance   │  │ • Auction      │  │ • Achievements │             │
│  │ • Staking      │  │ • Rental       │  │ • Leaderboard  │             │
│  │ • Airdrop      │  │ • Jeong-SBT    │  │ • Token Mining │             │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘             │
│          │                   │                   │                       │
│          └──────────────┬────┴───────────────────┘                       │
│                         ▼                                                │
│          ┌─────────────────────────────┐                                │
│          │  Unified Auth (Web3Auth)    │                                │
│          │  • Social Login (Google/FB) │                                │
│          │  • Wallet Connection        │                                │
│          │  • Session Sharing          │                                │
│          └─────────────┬───────────────┘                                │
│                        ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Firebase Backend                            │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐│    │
│  │  │    Auth     │ │  Firestore  │ │   Storage   │ │  Hosting   ││    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘│    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                        ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Polygon Blockchain                            │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│    │
│  │  │  ALMAN   │ │ Jeong-SBT│ │ Governor │ │ Staking  │ │  NFT   ││    │
│  │  │  Token   │ │          │ │          │ │          │ │Market  ││    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘│    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React | 19.x | UI Framework |
| | TypeScript | 5.x | Type Safety |
| | Vite | 7.x | Build Tool |
| | Tailwind CSS | 3.x | Styling |
| | react-i18next | 15.x | Internationalization |
| **Backend** | Firebase | 12.x | BaaS |
| | Next.js | 15.x | Game Server |
| **Blockchain** | Solidity | 0.8.24 | Smart Contracts |
| | Hardhat | 2.x | Development Framework |
| | OpenZeppelin | 5.x | Contract Libraries |
| | ethers.js | 6.x | Web3 Integration |
| **Auth** | Web3Auth | Latest | Social Login + Wallet |
| **Gasless** | Biconomy | 4.x | Meta Transactions |
| **Storage** | IPFS/Pinata | - | Decentralized Storage |

---

## 3. Development Scope

### 3.1 Web Server (Main Platform)

| Module | Features | Complexity | Status |
|--------|----------|------------|--------|
| **Landing Page** | Hero, Problem, Philosophy, Solution, Tokenomics, Ecosystem, Team, Partners, Roadmap, FAQ, CTA, Footer | High | ✅ Completed |
| **GAII Dashboard** | Interactive World Map, Country Data (~100), Regional Analysis, Real-time Stats | High | ✅ Completed |
| **Governance** | Proposal Creation, Voting, Delegation, Timelock Integration | High | ✅ Completed |
| **Staking** | 4-Tier System (5~18% APY), Claim Rewards, Unstake | Medium | ✅ Completed |
| **Airdrop** | Merkle Proof Distribution, Claim Interface | Medium | ✅ Completed |
| **Dashboard** | User Profile, Kindness Score, Activity History | Medium | ✅ Completed |
| **i18n** | 14 Languages Support, RTL (Arabic) | High | ✅ Completed |
| **Kindness Mode** | 30+ Term Glossary, Tooltip System | Medium | ✅ Completed |

### 3.2 NFT Server (Marketplace)

| Module | Features | Complexity | Status |
|--------|----------|------------|--------|
| **NFT Minting** | ERC-721, ERC-1155, Metadata Upload | High | ✅ Completed |
| **Marketplace** | Buy, Sell, Fixed Price, Auction | High | ✅ Completed |
| **Rental System** | ERC-4907 (721), ERC-5006 (1155) | High | ✅ Completed |
| **Collection Management** | Create, Edit, Royalty Settings | Medium | ✅ Completed |
| **Gasless Transactions** | Biconomy Integration, Meta Tx | High | ✅ Completed |
| **Payment Manager** | Multi-token (POL/USDC/ALMAN), Discounts | Medium | ✅ Completed |

### 3.3 Game Server (Kindness Game)

| Module | Features | Complexity | Status |
|--------|----------|------------|--------|
| **Tap-to-Earn** | Point Accumulation, Energy System | Medium | ✅ Completed |
| **Upgrade System** | Tap Power, Auto Farm, Energy Max, Combo | Medium | ✅ Completed |
| **Quest System** | Daily Quests, Kindness Activities | Medium | ✅ Completed |
| **Achievement System** | 정(情) Badges, Milestones | Medium | ✅ Completed |
| **Leaderboard** | Global Ranking, Regional Ranking | Low | ✅ Completed |
| **Token Mining** | 800M Pool, Halving Schedule | High | ✅ Completed |

### 3.4 Smart Contracts

| Contract | Standard | Features | Complexity | Status |
|----------|----------|----------|------------|--------|
| **ALMANToken** | ERC-20 + Votes | 8B Supply, Governance Voting | Medium | ✅ Deployed |
| **JeongSBT** | ERC-721 (Soulbound) | Non-transferable, 4 Tiers | High | ✅ Deployed |
| **ALMANStaking** | Custom | 4-Tier APY, Compound Interest | High | ✅ Deployed |
| **ALMANGovernor** | Governor | 4% Quorum, 1 Week Voting | High | ✅ Deployed |
| **ALMANTimelock** | Timelock | 2 Day Delay | Low | ✅ Deployed |
| **KindnessAirdrop** | Merkle Proof | Task-based Distribution | Medium | ✅ Deployed |
| **AlmaNFT721** | ERC-721 + 4907 | Rental, Gasless (ERC-2771) | High | ✅ Deployed |
| **AlmaNFT1155** | ERC-1155 + 5006 | Multi-token, Rental | High | ✅ Deployed |
| **AlmaMarketplace** | Custom | Auction, Rental, Multi-payment | Very High | ✅ Deployed |
| **AlmaPaymentManager** | Custom | Fee Discounts, Multi-token | Medium | ✅ Deployed |
| **AlmaCollectionManager** | Custom | Collection CRUD, Royalties | Medium | ✅ Deployed |

### 3.5 Infrastructure & DevOps

| Component | Service | Purpose | Status |
|-----------|---------|---------|--------|
| **Hosting** | Firebase Hosting | Static Site Deployment | ✅ Configured |
| **Database** | Firebase Firestore | User Data, Game State | ✅ Configured |
| **Storage** | Firebase Storage + IPFS | File Storage | ✅ Configured |
| **Auth** | Web3Auth + Firebase Auth | Unified Authentication | ✅ Configured |
| **Domain** | almaneo.org | Custom Domain | 🔲 Pending |
| **SSL** | Firebase SSL | HTTPS | ✅ Auto |
| **CI/CD** | GitHub Actions | Automated Deployment | 🔲 Pending |

---

## 4. Work Breakdown Structure (WBS)

### Phase 1: Foundation (2025 H1) ✅ COMPLETED

| Task ID | Task Name | Duration | Dependencies |
|---------|-----------|----------|--------------|
| 1.1 | Project Setup & Architecture Design | 2 weeks | - |
| 1.2 | Design System & Theme Development | 3 weeks | 1.1 |
| 1.3 | Landing Page Development | 4 weeks | 1.2 |
| 1.4 | Firebase Infrastructure Setup | 2 weeks | 1.1 |
| 1.5 | Web3Auth Integration | 2 weeks | 1.4 |
| 1.6 | Smart Contract Development | 6 weeks | 1.1 |
| 1.7 | Unit Testing & Code Review | 2 weeks | 1.3, 1.6 |

### Phase 2: Testnet & Community (2025 H2) ✅ COMPLETED

| Task ID | Task Name | Duration | Dependencies |
|---------|-----------|----------|--------------|
| 2.1 | Testnet Deployment (Polygon Amoy) | 1 week | 1.6 |
| 2.2 | NFT Marketplace Development | 6 weeks | 2.1 |
| 2.3 | Kindness Game Development | 5 weeks | 2.1 |
| 2.4 | GAII Dashboard Development | 3 weeks | 1.3 |
| 2.5 | Governance UI Development | 3 weeks | 2.1 |
| 2.6 | Staking UI Development | 2 weeks | 2.1 |
| 2.7 | Gasless Transaction Integration | 2 weeks | 2.2 |
| 2.8 | i18n Implementation (14 Languages) | 4 weeks | 1.3 |
| 2.9 | Integration Testing | 3 weeks | 2.2, 2.3, 2.4 |

### Phase 3: TGE & Mainnet (2026 Q1) 🔵 IN PROGRESS

| Task ID | Task Name | Duration | Dependencies |
|---------|-----------|----------|--------------|
| 3.1 | Security Audit (Smart Contracts) | 4 weeks | 2.9 |
| 3.2 | Mainnet Deployment | 1 week | 3.1 |
| 3.3 | Token Generation Event (TGE) | 2 weeks | 3.2 |
| 3.4 | CEX/DEX Listing Preparation | 4 weeks | 3.3 |
| 3.5 | Performance Optimization | 2 weeks | 3.2 |
| 3.6 | Custom Domain Setup | 1 week | 3.2 |

### Phase 4: Ecosystem Expansion (2026 Q2-Q3) ⬜ PLANNED

| Task ID | Task Name | Duration | Dependencies |
|---------|-----------|----------|--------------|
| 4.1 | AI Hub Development | 12 weeks | 3.2 |
| 4.2 | DePIN Integration | 8 weeks | 4.1 |
| 4.3 | Mobile App Development | 16 weeks | 3.2 |
| 4.4 | Advanced Analytics Dashboard | 4 weeks | 3.2 |
| 4.5 | Partnership Integrations | 8 weeks | 3.2 |

### Phase 5: Global Expansion (2026 Q4+) ⬜ PLANNED

| Task ID | Task Name | Duration | Dependencies |
|---------|-----------|----------|--------------|
| 5.1 | Kindness Expo Event System | 6 weeks | 4.1 |
| 5.2 | DAO Full Decentralization | 8 weeks | 4.1 |
| 5.3 | Multi-chain Expansion | 12 weeks | 5.2 |
| 5.4 | Enterprise Solutions | 16 weeks | 5.2 |

---

## 5. Resource Allocation

### 5.1 Team Composition

| Role | Headcount | Seniority | Responsibilities |
|------|-----------|-----------|------------------|
| **Project Manager** | 1 | Senior | Project planning, stakeholder communication, risk management |
| **Tech Lead** | 1 | Senior | Architecture design, code review, technical decisions |
| **Frontend Developer** | 3 | Mid-Senior | React, TypeScript, Web3 integration |
| **Backend Developer** | 2 | Mid-Senior | Firebase, Node.js, API development |
| **Blockchain Developer** | 2 | Senior | Solidity, Smart contract development & audit |
| **UI/UX Designer** | 1 | Mid | Design system, user experience |
| **QA Engineer** | 1 | Mid | Testing, quality assurance |
| **DevOps Engineer** | 1 | Mid | CI/CD, infrastructure management |

**Total: 12 FTE (Full-Time Equivalent)**

### 5.2 Monthly Resource Allocation

| Phase | Duration | PM | Tech Lead | Frontend | Backend | Blockchain | Designer | QA | DevOps |
|-------|----------|----|-----------|---------:|--------:|-----------:|---------:|---:|-------:|
| Phase 1 | 6 months | 1 | 1 | 2 | 1 | 2 | 1 | 0.5 | 0.5 |
| Phase 2 | 6 months | 1 | 1 | 3 | 2 | 1 | 1 | 1 | 1 |
| Phase 3 | 3 months | 1 | 1 | 2 | 1 | 2 | 0.5 | 1 | 1 |
| Phase 4 | 6 months | 1 | 1 | 3 | 2 | 1 | 1 | 1 | 1 |
| Phase 5 | 6+ months | 1 | 1 | 2 | 2 | 2 | 1 | 1 | 1 |

---

## 6. Cost Estimation

### 6.1 Development Costs (Human Resources)

| Role | Monthly Rate (KRW) | Monthly Rate (USD) |
|------|-------------------:|-------------------:|
| Project Manager | ₩12,000,000 | $8,500 |
| Tech Lead | ₩15,000,000 | $10,600 |
| Senior Frontend Developer | ₩10,000,000 | $7,100 |
| Mid Frontend Developer | ₩7,500,000 | $5,300 |
| Senior Backend Developer | ₩10,000,000 | $7,100 |
| Mid Backend Developer | ₩7,500,000 | $5,300 |
| Senior Blockchain Developer | ₩15,000,000 | $10,600 |
| UI/UX Designer | ₩8,000,000 | $5,700 |
| QA Engineer | ₩6,000,000 | $4,200 |
| DevOps Engineer | ₩9,000,000 | $6,400 |

### 6.2 Phase-wise Cost Breakdown

#### Phase 1: Foundation (6 months) ✅ COMPLETED
| Cost Category | Amount (KRW) | Amount (USD) |
|---------------|-------------:|-------------:|
| Human Resources | ₩432,000,000 | $305,000 |
| Infrastructure | ₩6,000,000 | $4,200 |
| Tools & Licenses | ₩3,000,000 | $2,100 |
| **Subtotal** | **₩441,000,000** | **$311,300** |

#### Phase 2: Testnet & Community (6 months) ✅ COMPLETED
| Cost Category | Amount (KRW) | Amount (USD) |
|---------------|-------------:|-------------:|
| Human Resources | ₩594,000,000 | $419,000 |
| Infrastructure | ₩12,000,000 | $8,500 |
| External Services (Biconomy, etc.) | ₩6,000,000 | $4,200 |
| **Subtotal** | **₩612,000,000** | **$431,700** |

#### Phase 3: TGE & Mainnet (3 months) 🔵 IN PROGRESS
| Cost Category | Amount (KRW) | Amount (USD) |
|---------------|-------------:|-------------:|
| Human Resources | ₩270,000,000 | $190,500 |
| Security Audit | ₩150,000,000 | $106,000 |
| Legal & Compliance | ₩50,000,000 | $35,300 |
| Exchange Listing Fee | ₩200,000,000 | $141,200 |
| Marketing & PR | ₩100,000,000 | $70,600 |
| **Subtotal** | **₩770,000,000** | **$543,600** |

#### Phase 4: Ecosystem Expansion (6 months)
| Cost Category | Amount (KRW) | Amount (USD) |
|---------------|-------------:|-------------:|
| Human Resources | ₩594,000,000 | $419,000 |
| AI/ML Infrastructure | ₩100,000,000 | $70,600 |
| DePIN Hardware | ₩200,000,000 | $141,200 |
| Mobile Development | ₩150,000,000 | $106,000 |
| **Subtotal** | **₩1,044,000,000** | **$736,800** |

#### Phase 5: Global Expansion (6+ months)
| Cost Category | Amount (KRW) | Amount (USD) |
|---------------|-------------:|-------------:|
| Human Resources | ₩660,000,000 | $466,000 |
| Multi-chain Integration | ₩100,000,000 | $70,600 |
| Enterprise Development | ₩200,000,000 | $141,200 |
| Global Marketing | ₩300,000,000 | $212,000 |
| Events (Kindness Expo) | ₩500,000,000 | $353,000 |
| **Subtotal** | **₩1,760,000,000** | **$1,242,800** |

### 6.3 Total Project Cost Summary

| Phase | Duration | Cost (KRW) | Cost (USD) | Status |
|-------|----------|------------:|------------:|--------|
| Phase 1 | 6 months | ₩441,000,000 | $311,300 | ✅ Completed |
| Phase 2 | 6 months | ₩612,000,000 | $431,700 | ✅ Completed |
| Phase 3 | 3 months | ₩770,000,000 | $543,600 | 🔵 In Progress |
| Phase 4 | 6 months | ₩1,044,000,000 | $736,800 | ⬜ Planned |
| Phase 5 | 6+ months | ₩1,760,000,000 | $1,242,800 | ⬜ Planned |
| **TOTAL** | **27+ months** | **₩4,627,000,000** | **$3,266,200** |

### 6.4 Completed Development Value

| Category | Cost (KRW) | Cost (USD) | Completion |
|----------|------------:|------------:|:----------:|
| Phase 1 + Phase 2 | ₩1,053,000,000 | $743,000 | 100% |
| Phase 3 (Current) | ₩385,000,000 | $272,000 | ~50% |
| **Total Completed** | **₩1,438,000,000** | **$1,015,000** | - |

---

## 7. Timeline & Milestones

### 7.1 Project Timeline (Gantt Chart Overview)

```
2025                                    2026                                    2027
Q1      Q2      Q3      Q4      Q1      Q2      Q3      Q4      Q1      Q2
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
[=== Phase 1: Foundation ===]
        [=== Phase 2: Testnet & Community ===]
                                [Phase 3]
                                        [=== Phase 4: Ecosystem ===]
                                                        [=== Phase 5: Global ===]
        ↑       ↑       ↑       ↑       ↑       ↑       ↑       ↑
        M1      M2      M3      M4      M5      M6      M7      M8
```

### 7.2 Key Milestones

| ID | Milestone | Target Date | Deliverables | Status |
|----|-----------|-------------|--------------|--------|
| M1 | Design System Complete | 2025.03 | Theme, Components, Style Guide | ✅ |
| M2 | MVP Launch (Testnet) | 2025.06 | Landing, Basic Features, Contracts | ✅ |
| M3 | NFT Marketplace Launch | 2025.09 | Full NFT Trading Platform | ✅ |
| M4 | i18n Complete | 2025.12 | 14 Languages Support | ✅ |
| M5 | TGE (Token Launch) | 2026.03 | Mainnet, Token Distribution | 🔵 |
| M6 | AI Hub Beta | 2026.06 | Free AI Access Platform | ⬜ |
| M7 | Mobile App Launch | 2026.09 | iOS/Android Apps | ⬜ |
| M8 | Kindness Expo #1 | 2026.12 | Global Event | ⬜ |

---

## 8. Risk Assessment

### 8.1 Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|:-----------:|:------:|---------------------|
| Smart Contract Vulnerability | Medium | Critical | Professional audit, Bug bounty program |
| Scalability Issues | Medium | High | Layer 2 optimization, CDN |
| Web3Auth Service Disruption | Low | High | Fallback wallet connection |
| Blockchain Network Congestion | Medium | Medium | Gas optimization, Batch transactions |

### 8.2 Business Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|:-----------:|:------:|---------------------|
| Regulatory Changes | High | Critical | Legal counsel, Multi-jurisdiction compliance |
| Market Volatility | High | High | Stable tokenomics, Treasury management |
| Competition | Medium | Medium | Unique value proposition (정 Philosophy) |
| User Adoption | Medium | High | Marketing, Community building |

### 8.3 Operational Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|:-----------:|:------:|---------------------|
| Key Personnel Departure | Medium | High | Documentation, Knowledge transfer |
| Third-party Service Failure | Low | Medium | Multiple provider strategy |
| Security Breach | Low | Critical | Security best practices, Insurance |

---

## 9. Terms & Conditions

### 9.1 Payment Terms

| Milestone | Payment % | Trigger |
|-----------|:---------:|---------|
| Contract Signing | 20% | Upon agreement execution |
| Phase Completion | 30% | Per phase delivery & acceptance |
| Final Delivery | 20% | All phases complete |
| Maintenance Retainer | 30% | Distributed over maintenance period |

### 9.2 Warranty & Support

- **Bug Fix Period:** 6 months post-launch (free)
- **Feature Enhancement:** Separate quotation
- **24/7 Support:** Available with SLA (99.5% uptime)
- **Documentation:** Full technical documentation included

### 9.3 Intellectual Property

- All developed code and assets become client property upon full payment
- Open-source libraries used under their respective licenses
- Smart contracts deployed on public blockchain (inherently open)

### 9.4 Confidentiality

- All project information treated as confidential
- NDA required for all team members
- No disclosure to third parties without written consent

---

## 10. Appendix

### A. Deployed Smart Contracts (Polygon Amoy Testnet)

#### Core Contracts
| Contract | Address |
|----------|---------|
| ALMANToken | `0x261d686c9ea66a8404fBAC978d270a47eFa764bA` |
| JeongSBT | `0x8d8eECb2072Df7547C22e12C898cB9e2326f827D` |
| ALMANStaking | `0x86777d1834c07E1B08E22FE3E8Ec0AD25a5451ce` |
| ALMANTimelock | `0xB73532c01CCCE4Ad6e8816fa4CB0E2aeDfe9C8C2` |
| ALMANGovernor | `0xA42A1386a84b146D36a8AF431D5E1d6e845268b8` |
| KindnessAirdrop | `0xadB3e6Ef342E3aDa2e31a2638d5D9566c26fb538` |

#### NFT Contracts
| Contract | Address |
|----------|---------|
| AlmaNFT721 | `0xbFbE2b1eDB0f7F0675D5E449E508adE3697B8dfa` |
| AlmaNFT1155 | `0x50FC5Ecaa9517CCD24b86874b0E87ab6225E9cfF` |
| AlmaPaymentManager | `0x2410Fa2958f2966DB85eF98aCbA4b9e360257E4e` |
| AlmaCollectionManager | `0x1Ad2176A1181CFF2d82289f5cc5d143d9B3AFE1D` |
| AlmaMarketplace | `0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b` |

### B. Supported Languages (i18n)

| Code | Language | Native Name | Direction |
|------|----------|-------------|-----------|
| ko | Korean | 한국어 | LTR |
| en | English | English | LTR |
| zh | Chinese | 中文 | LTR |
| ja | Japanese | 日本語 | LTR |
| es | Spanish | Español | LTR |
| fr | French | Français | LTR |
| ar | Arabic | العربية | RTL |
| pt | Portuguese | Português | LTR |
| id | Indonesian | Bahasa Indonesia | LTR |
| ms | Malay | Bahasa Melayu | LTR |
| th | Thai | ไทย | LTR |
| vi | Vietnamese | Tiếng Việt | LTR |
| km | Khmer | ភាសាខ្មែរ | LTR |
| sw | Swahili | Kiswahili | LTR |

### C. GAII Data Coverage

- **Countries:** ~100 countries with AI adoption data
- **Data Source:** Microsoft Global AI Adoption 2025 Report
- **Regions:** 10 regional classifications
- **Update Frequency:** Quarterly

### D. Token Economics (ALMAN)

| Allocation | Percentage | Amount |
|------------|:----------:|-------:|
| Community & Ecosystem | 40% | 3,200,000,000 |
| Foundation Reserve | 25% | 2,000,000,000 |
| Liquidity & Exchange | 15% | 1,200,000,000 |
| Team & Advisors | 10% | 800,000,000 |
| Kindness Expo & Grants | 10% | 800,000,000 |
| **Total Supply** | **100%** | **8,000,000,000** |

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Owner | | | |
| Technical Director | | | |
| Finance Director | | | |

---

**AlmaNEO Foundation**
📧 team@almaneo.org
🌐 https://almaneo.org
📍 Seoul, South Korea

*This document is confidential and intended solely for the use of the individual or entity to whom it is addressed.*

---

© 2026 AlmaNEO Foundation. All Rights Reserved.
