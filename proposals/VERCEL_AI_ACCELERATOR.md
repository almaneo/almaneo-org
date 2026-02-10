# Vercel AI Accelerator Application: AlmaNEO AI Hub

**Project Name:** AlmaNEO AI Hub
**Website:** https://almaneo.org
**Team:** 3 Co-Founders (Full-time)
**Category:** AI Infrastructure / Multi-Model Gateway

---

## What We're Building

**AlmaNEO AI Hub** is a multi-model AI gateway that provides free AI access to users in developing countries. It's already live at [almaneo.org/ai-hub](https://almaneo.org) — built entirely on Vercel.

3.5 billion people can't afford $20/month AI subscriptions. 3+ billion speak languages with poor AI support. We solve both problems with a free, multilingual, multi-model AI gateway.

---

## Already Running on Vercel (3 Projects)

| Service | URL | Stack | Status |
|:--------|:----|:------|:------:|
| **Main Platform** | [almaneo.org](https://almaneo.org) | Vite 7 + React 19 + TypeScript | Live |
| **NFT Marketplace** | [nft.almaneo.org](https://nft.almaneo.org) | Vite + React 19 | Live |
| **World Culture Travel Game** | [game.almaneo.org](https://game.almaneo.org) | Next.js 14 + TypeScript | Live |

---

## Technical Architecture

```
User Request (14 languages)
  │
  ▼
Vercel Edge Function (/api/chat)  [Seoul Region: icn1]
  │
  ├─ Model Router (by user selection)
  │   ├─ Gemini 2.5 Flash Lite  (Google — fast, efficient)
  │   └─ Llama 3.3 70B          (Groq — powerful, multilingual)
  │
  ├─ SSE Streaming Response (TransformStream API)
  │
  ▼
Supabase (PostgreSQL)
  ├─ Conversation history
  ├─ Message storage
  ├─ Daily quota tracking (50 queries/day per user)
  └─ User management

Additional Edge Functions:
  ├─ /api/ambassador  — On-chain verification (Polygon)
  └─ /api/mining-claim — Token distribution
```

### Current Implementation Details

- **Runtime**: Vercel Edge Functions (`runtime: 'edge'`)
- **Region**: Seoul (`icn1`) for low latency to Asian users
- **Streaming**: Custom SSE implementation via `TransformStream`
- **Model Routing**: Provider-agnostic handler pattern (Gemini vs OpenAI-compatible APIs)
- **Frontend**: Vite 7 + React 19 + TypeScript + Tailwind CSS 3.x
- **Backend**: Supabase (PostgreSQL) with real-time subscriptions
- **Auth**: Web3Auth social login (Google, Facebook, Twitter) — zero friction
- **i18n**: 14 languages via react-i18next with HTTP backend

---

## What We'd Build in the Accelerator (6 Weeks)

### Week 1-2: Vercel AI SDK Migration
- Replace custom SSE implementation with `@vercel/ai` SDK
- Unified streaming with `streamText()` and `generateText()`
- Add **Claude 3.5 Sonnet** and **Mistral Large** models via AI SDK providers
- Implement proper error boundaries and retry logic

### Week 3-4: Intelligent Model Routing
- Language-aware model selection (e.g., Qwen for Vietnamese/Thai, Gemini for Korean)
- Cost-optimized routing: lightweight models for simple queries, powerful models for complex tasks
- User preference learning: track which models produce best results per language/task
- Vercel AI Gateway integration for unified API management

### Week 5: v0-Assisted UI Redesign
- Use v0 to redesign the AI Hub chat interface
- Mobile-first conversational UI
- Model comparison view (side-by-side responses)
- Streaming markdown rendering improvements

### Week 6: Production Hardening
- Rate limiting with Vercel KV
- Response caching for common queries
- Analytics dashboard (model usage, language distribution, response quality)
- Edge Middleware for geographic routing optimization

---

## Why This Matters

### The Problem

| Indicator | Data |
|:----------|:-----|
| AI service monthly cost | $20 USD |
| Same cost as % of income in Bangladesh | 28% of monthly income |
| Same cost as % of income in Pakistan | 25% of monthly income |
| AI training data in English | 90%+ |
| Countries we currently track (GAII) | 50 |

### Our Approach

We don't compete with AI companies — we aggregate their resources and redistribute to underserved populations. Our **GAII (Global AI Inequality Index)** measures AI access inequality across 50 countries using 4 indicators:

```
GAII = 100 - (0.4 × Access + 0.3 × Affordability + 0.2 × Language + 0.1 × Skill)
```

This data creates ESG leverage for partnerships with AI providers, enabling us to offer free or heavily subsidized AI access.

---

## Traction & Evidence

| Metric | Value |
|:-------|:------|
| Vercel deployments | 3 (web, nft, game) |
| Source files | 670+ |
| Lines of code | 178,000+ |
| Smart contracts deployed | 18 (Polygon Amoy, 9 verified on PolygonScan) |
| Languages supported | 14 |
| Countries in GAII dataset | 50 |
| Token supply deployed | 8 billion ALMAN (TGE Feb 6, 2026) |
| Open source | [github.com/almaneo](https://github.com/almaneo) |

---

## What We Need from Vercel

| Resource | Purpose |
|:---------|:--------|
| **Vercel Pro credits** | Scale 3 projects beyond hobby limits |
| **v0 credits** | Redesign AI Hub chat interface |
| **AI platform credits** | Add Claude, Mistral to model gateway |
| **AWS credits** | Expanded backend capacity |
| **Mentorship** | Scaling Edge Functions, AI SDK best practices |

---

## Tech Stack (100% Vercel Native)

| Layer | Technology |
|:------|:-----------|
| Frontend | Vite 7 + React 19 + TypeScript |
| Styling | Tailwind CSS 3.x + class-variance-authority |
| API | Vercel Edge Functions (3 endpoints) |
| Streaming | SSE via Edge Runtime TransformStream |
| Backend | Supabase (PostgreSQL + Realtime + Storage) |
| Auth | Web3Auth (social login — Google/Facebook/Twitter) |
| Blockchain | Polygon (ethers.js — on-chain verification) |
| i18n | react-i18next (14 languages, HTTP backend) |
| CDN | Vercel Edge Network |
| Game Server | Next.js 14 (game.almaneo.org) |

---

## Team

| Role | Focus |
|:-----|:------|
| **Ruca Lee** — Founder & Lead Developer | AI/Blockchain full-stack, 18 smart contracts, system architecture |
| **Patrick Ma** — Co-Founder | Global community building, multicultural partnerships |
| **Lion Kim** — Co-Founder | Token business strategy, payment systems |

---

## Links

- **Website**: https://almaneo.org
- **AI Hub**: https://almaneo.org (Platform > AlmaNEO AI Hub)
- **Game**: https://game.almaneo.org
- **NFT**: https://nft.almaneo.org
- **GitHub**: https://github.com/almaneo
- **Twitter**: https://x.com/almaneo_org
- **Discord**: https://discord.gg/JkRNuj7aYd

---

*AlmaNEO — Cold Code, Warm Soul*
*Making AI accessible to 8 billion people, one Edge Function at a time.*
