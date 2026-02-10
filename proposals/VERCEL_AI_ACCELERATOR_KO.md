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

```
사용자 요청 (14개 언어 지원)
  │
  ▼
Vercel Edge Function (/api/chat)  [서울 리전: icn1]
  │
  ├─ 모델 라우터 (사용자 선택 기반)
  │   ├─ Gemini 2.5 Flash Lite  (Google — 빠르고 효율적)
  │   └─ Llama 3.3 70B          (Groq — 강력, 다국어 우수)
  │
  ├─ SSE 스트리밍 응답 (TransformStream API)
  │
  ▼
Supabase (PostgreSQL)
  ├─ 대화 기록
  ├─ 메시지 저장
  ├─ 일일 쿼터 추적 (50쿼리/일/사용자)
  └─ 사용자 관리

추가 Edge Functions:
  ├─ /api/ambassador  — 온체인 밋업 검증 (Polygon)
  └─ /api/mining-claim — 토큰 분배
```

### 현재 구현 세부사항

- **런타임**: Vercel Edge Functions (`runtime: 'edge'`)
- **리전**: 서울 (`icn1`) — 아시아 사용자 저지연 대응
- **스트리밍**: `TransformStream` 기반 커스텀 SSE 구현
- **모델 라우팅**: 제공자 무관 핸들러 패턴 (Gemini vs OpenAI 호환 API)
- **프론트엔드**: Vite 7 + React 19 + TypeScript + Tailwind CSS 3.x
- **백엔드**: Supabase (PostgreSQL) 실시간 구독
- **인증**: Web3Auth 소셜 로그인 (Google, Facebook, Twitter) — 마찰 제로
- **다국어**: react-i18next + HTTP 백엔드 14개 언어

---

## 가속기에서 만들 것 (6주)

### 1-2주차: Vercel AI SDK 마이그레이션
- 커스텀 SSE 구현을 `@vercel/ai` SDK로 교체
- `streamText()`, `generateText()`를 활용한 통합 스트리밍
- **Claude 3.5 Sonnet**, **Mistral Large** 모델 추가 (AI SDK 프로바이더)
- 에러 바운더리 및 재시도 로직 구현

### 3-4주차: 지능형 모델 라우팅
- 언어 인식 모델 선택 (예: 베트남어/태국어 → Qwen, 한국어 → Gemini)
- 비용 최적화 라우팅: 단순 쿼리 → 경량 모델, 복잡 작업 → 고성능 모델
- 사용자 선호 학습: 언어/작업별 최적 모델 추적
- Vercel AI Gateway 통합으로 통합 API 관리

### 5주차: v0 기반 UI 리디자인
- v0를 활용한 AI Hub 채팅 인터페이스 리디자인
- 모바일 퍼스트 대화형 UI
- 모델 비교 뷰 (나란히 응답 비교)
- 스트리밍 마크다운 렌더링 개선

### 6주차: 프로덕션 안정화
- Vercel KV를 활용한 레이트 리미팅
- 자주 묻는 질문에 대한 응답 캐싱
- 분석 대시보드 (모델 사용량, 언어 분포, 응답 품질)
- Edge Middleware를 활용한 지리적 라우팅 최적화

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
| 배포된 스마트 컨트랙트 | 18개 (Polygon Amoy, 9개 PolygonScan Verified) |
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
| **AI 플랫폼 크레딧** | Claude, Mistral 모델 게이트웨이 추가 |
| **AWS 크레딧** | 백엔드 용량 확장 |
| **멘토링** | Edge Functions 스케일링, AI SDK 모범 사례 |

---

## 기술 스택 (100% Vercel 네이티브)

| 레이어 | 기술 |
|:------|:------|
| 프론트엔드 | Vite 7 + React 19 + TypeScript |
| 스타일링 | Tailwind CSS 3.x + class-variance-authority |
| API | Vercel Edge Functions (3개 엔드포인트) |
| 스트리밍 | Edge Runtime TransformStream SSE |
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
