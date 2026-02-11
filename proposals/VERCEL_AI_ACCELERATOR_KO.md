# Vercel AI Accelerator 지원서: AlmaNEO AI Hub

**프로젝트명:** AlmaNEO AI Hub
**웹사이트:** https://almaneo.org
**팀:** 공동 창업자 3명 (풀타임)
**카테고리:** AI 인프라 / 멀티모델 게이트웨이

---

## 무엇을 만들고 있나

**AlmaNEO AI Hub**는 개발도상국 사용자에게 무료 AI 접근을 제공하는 멀티모델 AI 게이트웨이입니다. 이미 [almaneo.org/ai-hub](https://almaneo.org)에서 라이브 운영 중이며, Vercel 위에서 완전히 구축되었습니다.

전 세계 35억 명이 월 $20의 AI 구독료를 감당할 수 없습니다. 30억 명 이상이 AI 지원이 부족한 언어를 사용합니다. 무료, 다국어, 멀티모델 AI 게이트웨이로 두 문제를 모두 해결합니다.

---

## 이미 Vercel에서 운영 중 (3개 프로젝트)

| 서비스 | URL | 기술 스택 | 상태 |
|:--------|:----|:------|:------:|
| **메인 플랫폼** | [almaneo.org](https://almaneo.org) | Vite 7 + React 19 + TypeScript | 운영 중 |
| **NFT 마켓플레이스** | [nft.almaneo.org](https://nft.almaneo.org) | Vite + React 19 | 운영 중 |
| **세계문화여행 게임** | [game.almaneo.org](https://game.almaneo.org) | Next.js 14 + TypeScript | 운영 중 |

---

## 기술 아키텍처

**요청 흐름**: 사용자 (14개 언어) → Vercel Edge Function `/api/chat-ai` [서울 `icn1`] → AI 모델 → 스트리밍 응답 → 사용자

| 레이어 | 구성 요소 | 세부사항 |
|:------|:----------|:--------|
| **AI 프레임워크** | Vercel AI SDK v6 | `streamText()` + `toTextStreamResponse()` |
| **모드 선택** | 자동 감지 | `AI_GATEWAY_API_KEY` 환경변수 → Gateway / Direct |
| **Gateway 모델** | Google | Gemini 2.5 Flash Lite, Gemini 3 Flash, Gemini 2.5 Pro |
| | Anthropic | Claude Sonnet 4.5, Claude Haiku 4.5 |
| | OpenAI | GPT-4o Mini, GPT-4o |
| | Meta | Llama 3.3 70B |
| | DeepSeek | DeepSeek V3.2 |
| | Mistral | Mistral Large 3 |
| | xAI | Grok 3 |
| **Direct 모델** | Google, Groq | Gemini 2.5 Flash Lite, Llama 3.3 70B |
| **과금** | BYOK | Bring Your Own Key — 마크업 제로 |
| **데이터베이스** | Supabase (PostgreSQL) | 대화, 메시지, 일일 쿼터 (50/일), 사용자 |

| 엔드포인트 | 용도 |
|:---------|:--------|
| `/api/chat-ai` | AI Hub 메인 (Vercel AI SDK + Gateway) |
| `/api/chat` | 레거시 SSE (하위 호환) |
| `/api/ambassador` | 온체인 밋업 검증 (Polygon) |
| `/api/mining-claim` | 토큰 분배 |

### 현재 구현 세부사항

- **런타임**: Vercel Edge Functions (`runtime: 'edge'`)
- **리전**: 서울 (`icn1`) — 아시아 사용자 저지연 대응
- **AI SDK**: Vercel AI SDK v6 (`ai`, `@ai-sdk/google`, `@ai-sdk/groq`)
- **AI Gateway**: Vercel AI Gateway + BYOK 지원 (11개 모델, 7개 프로바이더)
- **스트리밍**: `streamText()` + `toTextStreamResponse()` (AI SDK v6 plain text 스트림)
- **모델 라우팅**: 듀얼 모드 — Gateway (모든 프로바이더) / Direct (자체 API 키)
- **프론트엔드**: Vite 7 + React 19 + TypeScript + Tailwind CSS 3.x
- **백엔드**: Supabase (PostgreSQL) 실시간 구독
- **인증**: Web3Auth 소셜 로그인 (Google, Facebook, Twitter) — 마찰 제로
- **다국어**: react-i18next + HTTP 백엔드 14개 언어

---

## Vercel AI로 이미 구현한 것

### ✅ 완료: Vercel AI SDK + Gateway 연동
- **Vercel AI SDK v6**: `streamText()` + `toTextStreamResponse()` 통합 스트리밍
- **Vercel AI Gateway**: `gateway()` 함수 하나로 7개 프로바이더의 11개 모델 접근
- **듀얼 모드 아키텍처**: Gateway 모드 (모든 프로바이더) / Direct 모드 (자체 키)
- **BYOK 지원**: 기존 API 키를 Gateway 경유 → 마크업 제로 과금
- **프로바이더별 그룹 UI**: 드롭다운에 프로바이더 헤더, 티어 배지 (PRO/STD/FREE)
- **모델 카탈로그**: Google (3), Anthropic (2), OpenAI (2), Meta (1), DeepSeek (1), Mistral (1), xAI (1)

### ✅ 완료: 레거시 SSE 호환
- 기존 `/api/chat` 엔드포인트 100% 보존 (하위 호환)
- 신규 `/api/chat-ai` 엔드포인트에서 Vercel AI SDK 사용
- 프론트엔드에서 Gateway ↔ Direct 모드 토글 전환

---

## 가속기에서 만들 것 (6주)

### 1-2주차: 지능형 모델 라우팅 & 최적화
- 언어 인식 모델 선택 (예: DeepSeek → 중국어, Gemini → 한국어)
- 비용 최적화 라우팅: 단순 쿼리 → 무료 모델, 복잡 작업 → 프리미엄 모델
- 사용자 선호 학습: 언어/작업별 최적 모델 추적
- Gateway 캐싱 및 폴백 설정

### 3-4주차: v0 기반 UI 리디자인
- v0를 활용한 AI Hub 채팅 인터페이스 리디자인
- 모바일 퍼스트 대화형 UI
- 모델 비교 뷰 (여러 프로바이더 응답 나란히 비교)
- 스트리밍 마크다운 렌더링 개선
- 대화 분기 (같은 프롬프트로 다른 모델 시도)

### 5주차: 프로덕션 안정화
- Vercel KV를 활용한 레이트 리미팅
- AI Gateway를 통한 자주 묻는 질문 응답 캐싱
- 분석 대시보드 (모델 사용량, 언어 분포, 쿼리당 비용)
- Edge Middleware를 활용한 지리적 라우팅 최적화

### 6주차: 확장 & 커뮤니티
- 모델 카탈로그 확장 (Cohere, AWS Bedrock 모델 Gateway 경유)
- 커뮤니티 기여 언어별 모델 벤치마크
- GAII 리포트 연동 — AI 접근 데이터와 모델 가용성 함께 표시
- 멀티모델 게이트웨이 아키텍처 오픈소스화 (다른 비영리 단체 활용)

---

## 왜 이것이 중요한가

### 문제

| 지표 | 데이터 |
|:------|:-------|
| AI 서비스 월 비용 | $20 USD |
| 방글라데시 월 소득 대비 비율 | 28% |
| 파키스탄 월 소득 대비 비율 | 25% |
| 영어 기반 AI 학습 데이터 | 90% 이상 |
| GAII 추적 대상 국가 | 50개국 |

### 우리의 접근

AI 회사들과 경쟁하지 않습니다 — 그들의 리소스를 모아 소외된 인구에게 재분배합니다. **GAII (Global AI Inequality Index)**로 50개국의 AI 접근 불평등을 4개 지표로 측정합니다:

```
GAII = 100 - (0.4 × Access + 0.3 × Affordability + 0.2 × Language + 0.1 × Skill)
```

이 데이터는 AI 제공자와의 파트너십에서 ESG 레버리지를 만들어, 무료 또는 대폭 할인된 AI 접근을 가능하게 합니다.

---

## 트랙션 & 증거

| 지표 | 수치 |
|:------|:------|
| Vercel 배포 | 3개 (web, nft, game) |
| 소스 파일 | 670+ |
| 코드 라인 | 178,000+ |
| 사용 가능 AI 모델 | 11개 (Vercel AI Gateway 경유, 7개 프로바이더) |
| AI SDK 연동 | Vercel AI SDK v6 + AI Gateway |
| 배포된 스마트 컨트랙트 | 18개 (Polygon Amoy, 8개 PolygonScan Verified) |
| 지원 언어 | 14개 |
| GAII 데이터셋 국가 | 50개국 |
| 배포된 토큰 | 80억 ALMAN (TGE 2026-02-06) |
| 오픈소스 | [github.com/almaneo](https://github.com/almaneo) |

---

## Vercel에서 필요한 것

| 리소스 | 용도 |
|:-------|:-----|
| **Vercel Pro 크레딧** | 3개 프로젝트 Hobby 한도 초과 확장 |
| **v0 크레딧** | AI Hub 채팅 인터페이스 리디자인 |
| **AI Gateway 크레딧** | Global South 사용자 대상 11개 모델 게이트웨이 확장 |
| **AWS 크레딧** | 백엔드 용량 확장 |
| **멘토링** | AI Gateway 최적화, 캐싱 전략, 비용 관리 |

---

## 기술 스택 (100% Vercel 네이티브)

| 레이어 | 기술 |
|:------|:------|
| 프론트엔드 | Vite 7 + React 19 + TypeScript |
| 스타일링 | Tailwind CSS 3.x + class-variance-authority |
| AI 프레임워크 | Vercel AI SDK v6 (`ai`, `@ai-sdk/google`, `@ai-sdk/groq`) |
| AI 게이트웨이 | Vercel AI Gateway (11개 모델, 7개 프로바이더, BYOK) |
| API | Vercel Edge Functions (4개 엔드포인트) |
| 스트리밍 | `streamText()` + `toTextStreamResponse()` (AI SDK v6) |
| 백엔드 | Supabase (PostgreSQL + Realtime + Storage) |
| 인증 | Web3Auth (소셜 로그인 — Google/Facebook/Twitter) |
| 블록체인 | Polygon (ethers.js — 온체인 검증) |
| 다국어 | react-i18next (14개 언어, HTTP 백엔드) |
| CDN | Vercel Edge Network |
| 게임 서버 | Next.js 14 (game.almaneo.org) |

---

## 팀

| 역할 | 담당 |
|:-----|:------|
| **Ruca Lee** — 창업자 & 리드 개발자 | AI/블록체인 풀스택, 18개 스마트 컨트랙트, 시스템 아키텍처 |
| **Patrick Ma** — 공동 창업자 | 글로벌 커뮤니티 빌딩, 다문화 파트너십 |
| **Lion Kim** — 공동 창업자 | 토큰 비즈니스 전략, 결제 시스템 |

---

## 링크

- **웹사이트**: https://almaneo.org
- **AI Hub**: https://almaneo.org (Platform > AlmaNEO AI Hub)
- **게임**: https://game.almaneo.org
- **NFT**: https://nft.almaneo.org
- **GitHub**: https://github.com/almaneo
- **Twitter**: https://x.com/almaneo_org
- **Discord**: https://discord.gg/JkRNuj7aYd

---

*AlmaNEO — Cold Code, Warm Soul*
*80억 인류에게 AI 접근을, Edge Function 하나씩.*
