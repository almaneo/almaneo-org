# Project Notes

## Current Status
- Landing page implemented and running at http://localhost:5173/
- Design matches original NEOS_Landing_Page.jsx reference

## Tech Stack Details

### Frontend
- **Vite 7.3.1**: Build tool and dev server
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 3.x**: Utility-first CSS (downgraded from 4.x for compatibility)

### Configuration Files
- `tailwind.config.js`: Custom colors, fonts, and animations
- `postcss.config.js`: tailwindcss + autoprefixer plugins
- `vite.config.ts`: Vite configuration with React plugin

## Resolved Issues
1. Tailwind 4.x incompatibility with tailwind.config.js
   - Solution: Downgraded to Tailwind 3.x
2. PostCSS plugin configuration for Tailwind 4.x
   - Solution: Changed to standard tailwindcss plugin

## Component Architecture

### NEOSLanding.tsx
- Main landing page with all sections
- Includes inline CSS for animations
- Sub-components:
  - KindnessRipple: Interactive click effect
  - AnimatedCounter: Number animation for stats
  - HeartbeatLine: SVG animation

### Sections
1. Navigation (fixed glass header)
2. Hero (Cold Code, Warm Soul)
3. Problem (AI inequality comparison)
4. Philosophy (정의 가치)
5. Solution (Three pillars: GAII, AI Hub, Kindness Protocol)
6. Tokenomics (80억 tokens for 80억 humans)
7. CTA (Join the Movement)
8. Footer

---

## GAII (Global AI Inequality Index) API - 추후 개발 논의 필요

### 현재 상태
- **프론트엔드**: GAII Dashboard 구현 완료 (`web/src/pages/GAII.tsx`)
- **데이터**: 시뮬레이션 (mock) 데이터 사용 중
- **실제 API**: 미구현 - 데이터 소스 및 수집 방법 논의 필요

### 측정 지표 (현재 정의)
1. **Compute Concentration** (연산 집중도)
   - 상위 1%가 보유한 AI 연산 자원 비율

2. **Affordability Ratio** (경제성 비율)
   - AI 서비스 구독료 / 월 평균 소득 비율 (Global South 기준)

3. **Language Coverage** (언어 지원률)
   - 주요 AI 서비스가 지원하는 언어 비율 (전 세계 ~7,000개 언어 대비)

4. **Population Affected** (영향 인구)
   - AI 접근이 제한된 인구 수

### 데이터 수집 방법 아이디어 (논의 필요)

#### Option A: 외부 데이터 소스 활용
- **World Bank API**: GDP, 인구, 소득 데이터
- **ITU (International Telecommunication Union)**: 인터넷 접근률, 디지털 인프라
- **Stanford AI Index Report**: 연간 AI 발전 지표 (수동 업데이트)
- **OECD AI Policy Observatory**: 국가별 AI 정책 데이터
- **Our World in Data**: 글로벌 통계 데이터

#### Option B: 자체 데이터 수집
- **AI 서비스 가격 모니터링**: 주요 AI 서비스 (OpenAI, Claude, Gemini 등) 가격 크롤링
- **언어 지원 현황 추적**: 각 서비스의 지원 언어 목록 모니터링
- **커뮤니티 리포트**: NEOS 사용자들의 지역별 AI 접근성 보고

#### Option C: 하이브리드 접근
- 공공 데이터 (World Bank, ITU) + 자체 수집 데이터 결합
- 주기적 업데이트 (월간/분기별)

### 기술적 고려사항

#### 백엔드 구조
```
Option 1: Firebase Functions
- Firestore에 GAII 데이터 저장
- 주기적 Cloud Functions로 데이터 갱신
- 프론트엔드에서 직접 Firestore 구독

Option 2: 별도 API 서버
- Node.js/Python 백엔드
- 스케줄러로 외부 API 데이터 수집
- REST/GraphQL API 제공

Option 3: Decentralized (Web3 Native)
- Chainlink/Band Protocol 오라클 활용
- 온체인에 GAII 데이터 기록
- 투명성 및 검증 가능성 확보
```

#### 데이터 갱신 주기
- **실시간**: 불필요 (GAII는 급격히 변하지 않음)
- **일간**: 가격 데이터
- **주간/월간**: 통계 지표
- **분기/연간**: 구조적 변화 (언어 지원, 인프라)

### 논의가 필요한 질문들

1. **데이터 신뢰성**: 어떻게 데이터의 정확성을 보장할 것인가?
2. **투명성**: GAII 계산 방법론을 어떻게 공개할 것인가?
3. **탈중앙화**: 데이터 수집/검증을 커뮤니티에 위임할 수 있는가?
4. **비용**: 외부 API 호출, 서버 운영 비용은?
5. **법적 이슈**: 데이터 크롤링, 재배포 관련 라이선스
6. **업데이트 주기**: 얼마나 자주 갱신해야 하는가?

### 참고 자료
- [AI Index Report](https://aiindex.stanford.edu/)
- [World Bank Open Data](https://data.worldbank.org/)
- [ITU Statistics](https://www.itu.int/en/ITU-D/Statistics/)
- [OECD AI Policy Observatory](https://oecd.ai/)

### 다음 단계
1. 데이터 소스 우선순위 결정
2. MVP 범위 정의 (어느 지표부터?)
3. 백엔드 아키텍처 선택
4. 프로토타입 API 구현
