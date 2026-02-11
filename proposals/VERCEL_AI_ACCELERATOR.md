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

**Request Flow**: User (14 languages) → Vercel Edge Function `/api/chat-ai` [Seoul `icn1`] → AI Model → Streaming Response → User

| Layer | Component | Details |
|:------|:----------|:--------|
| **AI Framework** | Vercel AI SDK v6 | `streamText()` + `toTextStreamResponse()` |
| **Mode Selection** | Auto-detected | `AI_GATEWAY_API_KEY` env → Gateway / Direct |
| **Gateway Models** | Google | Gemini 2.5 Flash Lite, Gemini 3 Flash, Gemini 2.5 Pro |
| | Anthropic | Claude Sonnet 4.5, Claude Haiku 4.5 |
| | OpenAI | GPT-4o Mini, GPT-4o |
| | Meta | Llama 3.3 70B |
| | DeepSeek | DeepSeek V3.2 |
| | Mistral | Mistral Large 3 |
| | xAI | Grok 3 |
| **Direct Models** | Google, Groq | Gemini 2.5 Flash Lite, Llama 3.3 70B |
| **Billing** | BYOK | Bring Your Own Key — zero markup |
| **Database** | Supabase (PostgreSQL) | Conversations, messages, daily quota (50/day), users |

| Endpoint | Purpose |
|:---------|:--------|
| `/api/chat-ai` | AI Hub main (Vercel AI SDK + Gateway) |
| `/api/chat` | Legacy SSE (backward compatible) |
| `/api/ambassador` | On-chain meetup verification (Polygon) |
| `/api/mining-claim` | Token distribution |

### Current Implementation Details

- **Runtime**: Vercel Edge Functions (`runtime: 'edge'`)
- **Region**: Seoul (`icn1`) for low latency to Asian users
- **AI SDK**: Vercel AI SDK v6 (`ai`, `@ai-sdk/google`, `@ai-sdk/groq`)
- **AI Gateway**: Vercel AI Gateway with BYOK support (11 models, 7 providers)
- **Streaming**: `streamText()` + `toTextStreamResponse()` (AI SDK v6 plain text stream)
- **Model Routing**: Dual-mode — Gateway (any provider) or Direct (self-hosted keys)
- **Frontend**: Vite 7 + React 19 + TypeScript + Tailwind CSS 3.x
- **Backend**: Supabase (PostgreSQL) with real-time subscriptions
- **Auth**: Web3Auth social login (Google, Facebook, Twitter) — zero friction
- **i18n**: 14 languages via react-i18next with HTTP backend

---

## What We've Already Built with Vercel AI

### ✅ Completed: Vercel AI SDK + Gateway Integration
- **Vercel AI SDK v6**: `streamText()` + `toTextStreamResponse()` for unified streaming
- **Vercel AI Gateway**: 11 models from 7 providers via single `gateway()` function
- **Dual-mode architecture**: Gateway mode (any provider) / Direct mode (self-hosted keys)
- **BYOK support**: Bring Your Own Key for zero markup — users' existing API keys routed through Gateway
- **Provider-grouped UI**: Dropdown with provider headers, tier badges (PRO/STD/FREE)
- **Model catalog**: Google (3), Anthropic (2), OpenAI (2), Meta (1), DeepSeek (1), Mistral (1), xAI (1)

### ✅ Completed: Legacy SSE Compatibility
- Original `/api/chat` endpoint preserved for backward compatibility
- New `/api/chat-ai` endpoint using Vercel AI SDK
- Frontend toggle to switch between Gateway and Direct modes

---

## What We'd Build in the Accelerator (6 Weeks)

### Week 1-2: Intelligent Model Routing & Optimization
- Language-aware model selection (e.g., DeepSeek for Chinese, Gemini for Korean)
- Cost-optimized routing: free-tier models for simple queries, premium for complex tasks
- User preference learning: track which models produce best results per language/task
- Gateway caching and fallback configuration

### Week 3-4: v0-Assisted UI Redesign
- Use v0 to redesign the AI Hub chat interface
- Mobile-first conversational UI
- Model comparison view (side-by-side responses from different providers)
- Streaming markdown rendering improvements
- Conversation branching (try same prompt with different models)

### Week 5: Production Hardening
- Rate limiting with Vercel KV
- Response caching for common queries via AI Gateway
- Analytics dashboard (model usage, language distribution, cost per query)
- Edge Middleware for geographic routing optimization

### Week 6: Scale & Community
- Expand model catalog (Cohere, AWS Bedrock models via Gateway)
- Community-contributed model benchmarks per language
- GAII Report integration — show AI access data alongside model availability
- Open-source the multi-model gateway architecture for other nonprofits

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
| AI models available | 11 (via Vercel AI Gateway, 7 providers) |
| AI SDK integration | Vercel AI SDK v6 + AI Gateway |
| Smart contracts deployed | 18 (Polygon Amoy, 8 verified on PolygonScan) |
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
| **AI Gateway credits** | Scale 11-model gateway for Global South users |
| **AWS credits** | Expanded backend capacity |
| **Mentorship** | AI Gateway optimization, caching strategies, cost management |

---

## Tech Stack (100% Vercel Native)

| Layer | Technology |
|:------|:-----------|
| Frontend | Vite 7 + React 19 + TypeScript |
| Styling | Tailwind CSS 3.x + class-variance-authority |
| AI Framework | Vercel AI SDK v6 (`ai`, `@ai-sdk/google`, `@ai-sdk/groq`) |
| AI Gateway | Vercel AI Gateway (11 models, 7 providers, BYOK) |
| API | Vercel Edge Functions (4 endpoints) |
| Streaming | `streamText()` + `toTextStreamResponse()` (AI SDK v6) |
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
