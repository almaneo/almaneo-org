# AlmaNEO Project - Claude Memory

> **게임 업데이트 작업은 `.claude/GAME_UPDATE.md`에서 별도 관리합니다.**
> 게임 관련 작업 시 GAME_UPDATE.md를 참조하세요. 완료 후 이 파일에 요약 기록합니다.

## Project Overview
- **Name**: AlmaNEO (이전: NEO-SAPIENS)
- **Token**: ALMAN (이전: NEOS)
- **Domain**: almaneo.org
- **Type**: Web3 Landing Page / DApp
- **Stack**: Vite 7.x + React 19 + TypeScript + Tailwind CSS 3.x + Supabase
- **Theme**: "Cold Code, Warm Soul" - AI democratization platform

## Key Concepts
- **정(情)**: Korean concept of deep emotional bonds - core philosophy
- **GAII**: Global AI Inequality Index
- **Kindness Protocol**: Proof of Humanity consensus mechanism
- **ALMAN Token**: 8B supply for 8 billion humans

## Project Structure (Updated)
```
c:\DEV\ALMANEO\
├── web/                           # Main web application
│   ├── src/
│   │   ├── contexts/              # 🆕 Context Providers
│   │   │   ├── Web3AuthProvider.tsx  # Web3Auth 통합 인증
│   │   │   ├── web3authConfig.ts     # Web3Auth 설정
│   │   │   ├── KindnessModeContext.tsx # ✅ 친절 모드 상태 관리
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/                 # ✅ Custom Hooks
│   │   │   ├── useUserData.ts     # Supabase 사용자 데이터
│   │   │   ├── useStaking.ts      # 스테이킹 컨트랙트 연동
│   │   │   ├── useGovernance.ts   # 거버넌스 컨트랙트 연동
│   │   │   ├── useMeetups.ts      # 🆕 밋업 데이터 관리
│   │   │   ├── useKindness.ts     # 🆕 Kindness 데이터 관리
│   │   │   ├── useAmbassadorSBT.ts # 🆕 온체인 Ambassador 데이터 (Session 27)
│   │   │   └── index.ts
│   │   │
│   │   ├── services/              # 🆕 서비스 레이어 (Session 22-23)
│   │   │   ├── meetup.ts          # 밋업 CRUD, 참가/인증
│   │   │   ├── kindness.ts        # Kindness 활동, 점수, 리더보드
│   │   │   ├── storage.ts         # Supabase Storage 이미지 업로드
│   │   │   └── index.ts
│   │   │
│   │   ├── contracts/             # ✅ 컨트랙트 연동
│   │   │   ├── addresses.ts       # 컨트랙트 주소 관리
│   │   │   ├── abis/
│   │   │   │   ├── NEOSToken.ts   # ERC-20 ABI
│   │   │   │   ├── NEOSStaking.ts # 스테이킹 ABI
│   │   │   │   ├── NEOSGovernor.ts# 거버넌스 ABI
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── theme/                 # Design System Tokens
│   │   │   ├── tokens/
│   │   │   │   ├── colors.ts      # Cold/Warm 색상 스펙트럼
│   │   │   │   ├── typography.ts  # 폰트 설정
│   │   │   │   ├── spacing.ts     # 간격 스케일
│   │   │   │   └── index.ts
│   │   │   ├── animations/
│   │   │   │   ├── keyframes.ts   # 애니메이션 정의
│   │   │   │   └── index.ts
│   │   │   ├── gradients.ts       # 그라디언트 정의
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts              # 클래스명 병합 유틸리티
│   │   │   └── index.ts
│   │   │
│   │   ├── data/                  # 🆕 데이터 모듈
│   │   │   ├── gaii/              # GAII 데이터
│   │   │   │   ├── schema.ts      # 타입 정의 및 계산 함수 (4개 지표)
│   │   │   │   ├── countries.ts   # ~120개국 레거시 데이터
│   │   │   │   ├── countries-v1.ts # ✅ 50개국 핵심 데이터 (v1.0)
│   │   │   │   ├── report.ts      # ✅ GAII Report v1.0 생성
│   │   │   │   ├── aggregation.ts # 집계 함수
│   │   │   │   └── index.ts
│   │   │   ├── whitepaper/        # 🆕 화이트페이퍼 데이터
│   │   │   │   ├── almaneo_whitepaper.db  # SQLite DB (원본)
│   │   │   │   └── whitepaper.json        # JSON 변환 (15개 언어 × 13개 섹션)
│   │   │   └── glossary.ts        # ✅ 친절 모드 용어 사전 (30+ 용어)
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                # UI 컴포넌트 라이브러리
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/          # GlassCard
│   │   │   │   ├── SectionHeader/
│   │   │   │   ├── GradientText/
│   │   │   │   ├── AnimatedCounter.tsx
│   │   │   │   ├── HeartbeatLine.tsx
│   │   │   │   ├── KindnessRipple.tsx
│   │   │   │   ├── KindnessTerm.tsx   # ✅ 친절 모드 툴팁 컴포넌트
│   │   │   │   ├── WorldMap/       # 🆕 세계지도 컴포넌트
│   │   │   │   │   └── WorldMap.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── layout/            # 레이아웃 컴포넌트
│   │   │   │   ├── Header.tsx     # 🆕 Web3Auth 연동 헤더
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── Section/
│   │   │   │   ├── Container/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── pdf/               # 🆕 PDF 생성 컴포넌트
│   │   │   │   ├── GAIIReportPDF.tsx  # ✅ GAII Report PDF (8페이지)
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── sections/          # 페이지 섹션 (모듈화)
│   │   │   │   ├── landing/
│   │   │   │   │   ├── ProblemSection.tsx
│   │   │   │   │   ├── PhilosophySection.tsx
│   │   │   │   │   ├── SolutionSection.tsx
│   │   │   │   │   ├── TokenomicsSection.tsx
│   │   │   │   │   ├── EcosystemSection.tsx  # ✅ 생태계 (Staking, Airdrop, NFT, Game)
│   │   │   │   │   ├── Web3AuthSection.tsx   # ✅ 소셜 로그인 소개
│   │   │   │   │   ├── TeamSection.tsx       # ✅ 팀 소개
│   │   │   │   │   ├── PartnersSection.tsx   # ✅ 파트너 & 기술
│   │   │   │   │   ├── RoadmapSection.tsx    # ✅ 로드맵 타임라인
│   │   │   │   │   ├── FAQSection.tsx        # ✅ FAQ 아코디언
│   │   │   │   │   ├── CTASection.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── HeroSection.tsx
│   │   │   │
│   │   │   └── NEOSLanding.tsx    # 리팩토링됨 (493줄 → 66줄)
│   │   │
│   │   ├── pages/                 # 라우트 페이지
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx      # ✅ Supabase 연동
│   │   │   ├── GAII.tsx           # ✅ GAII Dashboard (세계지도)
│   │   │   ├── GAIIReport.tsx     # ✅ GAII Report v1.0 페이지
│   │   │   ├── Governance.tsx     # ✅ 컨트랙트 연동
│   │   │   ├── Staking.tsx        # ✅ 컨트랙트 연동
│   │   │   ├── Airdrop.tsx
│   │   │   ├── Kindness.tsx       # 🆕 Kindness 대시보드 (/kindness)
│   │   │   ├── MeetupList.tsx     # 🆕 밋업 목록 (/meetup)
│   │   │   ├── MeetupDetail.tsx   # 🆕 밋업 상세 (/meetup/:id)
│   │   │   ├── MeetupCreate.tsx   # 🆕 밋업 생성 (/meetup/new)
│   │   │   └── index.ts
│   │   │
│   │   ├── i18n/                  # ✅ 다국어 지원 (14개 언어)
│   │   │   └── index.ts           # i18next 설정 및 언어 목록
│   │   │
│   │   ├── polyfills.ts           # ✅ Buffer polyfill (Web3Auth용)
│   │   ├── global.d.ts            # TypeScript 타입 선언
│   │   │
│   │   ├── App.tsx                # Web3AuthProvider 래핑
│   │   ├── main.tsx               # i18n 초기화 포함
│   │   ├── supabase.ts            # Supabase 초기화
│   │   └── index.css              # Tailwind 유틸리티 클래스
│   │
│   ├── public/
│   │   └── locales/               # ✅ 번역 파일 (14개 언어)
│   │       ├── ko/                # 한국어
│   │       │   ├── common.json
│   │       │   └── landing.json
│   │       ├── en/                # English
│   │       ├── zh/                # 中文
│   │       ├── ja/                # 日本語
│   │       ├── es/                # Español
│   │       ├── fr/                # Français
│   │       ├── ar/                # العربية (RTL)
│   │       ├── pt/                # Português
│   │       ├── id/                # Bahasa Indonesia
│   │       ├── ms/                # Bahasa Melayu
│   │       ├── th/                # ไทย
│   │       ├── vi/                # Tiếng Việt
│   │       ├── km/                # ភាសាខ្មែរ
│   │       └── sw/                # Kiswahili
│   │
│   ├── index.html                 # 폰트 preload 추가
│   ├── tailwind.config.js         # 확장된 테마 설정
│   ├── postcss.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── shared/                        # 공유 모듈
│   ├── auth/web3auth.config.ts
│   ├── supabase/config.ts
│   ├── contracts/addresses.ts
│   └── types/user.ts, game.ts, contracts.ts
│
├── reference/
│   └── UXUI/
│       └── 시각화컨셉.md          # 디자인 컨셉 문서
│
└── NEOS_Landing_Page.jsx          # Original design reference
```

## Design System

### Color Palette (Cold/Warm Philosophy)
```
Cold (기술/AI):
- Deep Navy: #0A0F1A ~ #1e293b (배경)
- Electric Blue: #0052FF (neos-blue, 주요 브랜드)
- Cyan: #06b6d4 (기술 하이라이트)

Warm (인간/정):
- Terracotta Orange: #FF6B00 (jeong-orange, 주요 따뜻함)
- Sand Gold: #d4a574 (프리미엄)
- Soft Beige: #d4c4b0 (인간적 따뜻함)

Semantic:
- Success: #4ade80
- Warning: #facc15
- Error: #f87171
- Info: #60a5fa
```

### Typography
- **Montserrat**: 영문 헤드라인 (sans-serif, 기술적)
- **Pretendard**: 한글 본문 (sans-serif, 가독성)
- **Serif**: 철학적 텍스트용 (Georgia)

### Animations
- `heartbeat`: 정(情) 상징 - 심장박동 애니메이션
- `glow` / `glow-blue`: 따뜻함/차가움 글로우 효과
- `ripple`: 클릭 피드백 (Kindness Ripple)
- `float`: 부유 효과
- `dash`: SVG 경로 애니메이션 (HeartbeatLine)
- `pulse-slow`: 은은한 펄스
- `fade-in-up`: 등장 애니메이션

### CSS Utility Classes (index.css)
```css
/* Glass Morphism */
.glass, .glass-strong, .glass-nav

/* Gradient Text */
.gradient-text, .gradient-text-cold, .gradient-text-warm

/* Buttons */
.btn-primary, .btn-secondary, .btn-cold, .btn-ghost

/* Cards */
.card, .card-hover, .card-warm, .card-cold

/* Sections */
.section, .section-sm, .section-overlay-warm, .section-overlay-cold

/* Stats */
.stat-card, .stat-value, .stat-label
```

### Icon System
- **Library**: Lucide React
- **Style**: strokeWidth 1.5, opacity 0.7~0.8
- **Philosophy**: 아이콘이 콘텐츠보다 부각되지 않도록

## Dependencies
```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.12.0",
  "tailwindcss": "^3.4.19",
  "lucide-react": "^0.562.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "class-variance-authority": "^0.7.1",
  "@supabase/supabase-js": "^2.x",
  "@web3auth/modal": "latest",
  "@web3auth/base": "latest",
  "ethers": "^6.x",
  "react-simple-maps": "^3.0.0",
  "d3-geo": "^3.x",
  "prop-types": "^15.x",
  "react-i18next": "^15.x",
  "i18next": "^24.x",
  "i18next-browser-languagedetector": "^8.x",
  "i18next-http-backend": "^3.x",
  "@react-pdf/renderer": "^4.x"
}
```

## Development Progress

### ✅ Completed (Phase 1: Theme & Component Architecture)
1. Theme token system created (colors, typography, animations)
2. Tailwind config extended with Cold/Warm color spectrum
3. CSS utility classes in index.css (glass, gradient-text, buttons, etc.)
4. UI components: Button, GlassCard, SectionHeader, GradientText
5. Layout components: Section, Container
6. Landing page sections modularized (Problem, Philosophy, Solution, Tokenomics, CTA, Footer)
7. NEOSLanding.tsx refactored (493 lines → 66 lines)
8. Lucide React icons integrated (replacing emojis)
9. Fonts loaded via index.html (Montserrat, Pretendard)
10. Gradient text fix (-webkit-background-clip)

### ✅ Completed (Phase 2-A: 인프라 구축)
1. shared/ 폴더 구조 생성
   - auth/web3auth.config.ts (Web3Auth 설정)
   - supabase/config.ts (Supabase 초기화 및 유틸리티)
   - contracts/addresses.ts (컨트랙트 주소 관리)
   - types/user.ts, game.ts, contracts.ts (공통 타입 정의)
2. 환경 변수 설정 (.env, .env.example)
   - Web3Auth Client ID 설정 완료
   - Supabase 프로젝트 연동 완료
   - Polygon Amoy 테스트넷 설정
3. React Router 설정
   - react-router-dom 설치
   - 페이지 컴포넌트 생성: Home, Dashboard, Governance, Staking, Airdrop
   - 통합 Header 컴포넌트 (기존 Navigation 제거)
   - MainLayout 래퍼 컴포넌트

### ✅ Completed (Phase 2-B: Web 서버 확장 - Part 1)
1. Web3Auth Provider 컴포넌트 생성
   - contexts/Web3AuthProvider.tsx
   - contexts/web3authConfig.ts
   - @web3auth/modal, @web3auth/base, ethers@6 설치
2. 지갑 연결 기능 구현
   - Header.tsx에 지갑 연결/해제 버튼
   - 사용자 정보 드롭다운 메뉴
   - 주소 복사, Explorer 링크
3. 대시보드 실제 데이터 연동
   - hooks/useUserData.ts (Supabase 연동)
   - Dashboard.tsx 리팩토링 (Web3Auth + Supabase)
   - 실시간 사용자 데이터 구독

### ✅ Completed (Phase 2-B: Web 서버 확장 - Part 2)
1. Buffer Polyfill 설정 (Vite 7 + Web3Auth 호환)
   - polyfills.ts 생성 (buffer 패키지 전역 설정)
   - vite.config.ts 수정 (global 객체 정의)
   - global.d.ts 타입 선언

2. 스테이킹 UI 컨트랙트 연동
   - contracts/addresses.ts (컨트랙트 주소 관리)
   - contracts/abis/NEOSStaking.ts (스테이킹 ABI)
   - contracts/abis/NEOSToken.ts (토큰 ABI)
   - hooks/useStaking.ts (stake, unstake, claimReward)
   - pages/Staking.tsx 리팩토링 (컨트랙트 연동)

3. 거버넌스 UI 컨트랙트 연동
   - contracts/abis/NEOSGovernor.ts (거버넌스 ABI)
   - hooks/useGovernance.ts (castVote, delegate, propose)
   - pages/Governance.tsx 리팩토링 (컨트랙트 연동)

4. UI 특징:
   - 컨트랙트 미배포 시 미리보기 모드 표시
   - 지갑 미연결 시 연결 안내 UI
   - 로딩/에러 상태 처리
   - 실시간 데이터 새로고침

### ✅ Completed (Phase 2-E: 스마트 컨트랙트 개발)
1. Hardhat 프로젝트 설정 (blockchain/ 폴더)
   - Solidity 0.8.24, OpenZeppelin 5.x
   - Polygon Amoy / Mainnet 네트워크 설정
   - UUPS Upgradeable 패턴 적용 (모든 컨트랙트 업그레이드 가능)

2. 핵심 컨트랙트 작성 완료:
   - **NEOSToken.sol**: ERC-20Votes + Upgradeable (8B 공급량)
   - **JeongSBT.sol**: ERC-721 Soulbound Token (양도 불가, 4티어)
   - **NEOSStaking.sol**: 4티어 스테이킹 (APY 5~18%)
   - **NEOSGovernor.sol**: DAO 거버넌스 (4% 쿼럼, 1주 투표)
   - **NEOSTimelock.sol**: 실행 지연 (2일)
   - **KindnessAirdrop.sol**: Merkle Proof 에어드롭

3. 배포 스크립트: scripts/deploy.js
   - 로컬 테스트 완료
   - ✅ Polygon Amoy 배포 완료 (2026-01-18)

4. **배포된 컨트랙트 주소 (Polygon Amoy)**:
   ```
   NEOSToken:        0x9266a7b9D5c202817d8845f94813A1b6a2bb55Ca
   JeongSBT:         0x999BA757A0B13F9446374887830b602A08d870AE
   NEOSStaking:      0x6dDFD7350Eb1820e21b57e90A97c439e5Df7c186
   NEOSTimelock:     0x875EDD1032A6e64752A2107b711F57D41577Da3a
   NEOSGovernor:     0x6C563768e77Cbe7f1E7C0D5F8D3961eA74A18E94
   KindnessAirdrop:  0x535F8be97B9A74Ad78b00831b565891CEbe47a9b
   ```

### ✅ Completed (Phase 2-C: NFT 스마트 컨트랙트 개발) - 2026-01-19
1. **NFT 컨트랙트 개발 완료** (ERC-2771 가스비 대납 지원)
   - `contracts/nft/NEOSNFT721.sol`: ERC-721 + ERC-4907(렌탈) + Gasless
   - `contracts/nft/NEOSNFT1155.sol`: ERC-1155 + ERC-5006(렌탈) + Gasless
   - `contracts/nft/interfaces/IERC5006.sol`: ERC-5006 인터페이스
   - `contracts/nft/extensions/ERC5006Upgradeable.sol`: ERC-1155 렌탈 확장

2. **마켓플레이스 컨트랙트 개발 완료**
   - `contracts/marketplace/NEOSMarketplace.sol`: 고정가/경매/렌탈 거래
   - `contracts/marketplace/NEOSPaymentManager.sol`: 멀티토큰 결제 (POL/USDC/NEOS)
   - `contracts/marketplace/NEOSCollectionManager.sol`: 컬렉션 관리

3. **핵심 기능:**
   - **ERC-2771 가스비 대납**: Web3Auth 사용자는 가스비 없이 거래
   - **Jeong-SBT 연동**: Kindness Score에 따른 수수료 할인 (최대 50%)
   - **NEOS 토큰 결제 할인**: NEOS로 결제 시 추가 5% 할인
   - **ERC-2981 로열티**: 창작자 로열티 자동 분배
   - **UUPS Upgradeable**: 모든 컨트랙트 업그레이드 가능

4. **배포 스크립트**: `scripts/deploy-nft.js`
   - Hardhat config에 `viaIR: true` 설정 (Stack too deep 해결)
   - 컴파일 성공 (101 Solidity files)

5. **사용자 유형:**
   - 일반 사용자: Web3Auth (소셜 로그인, 가스비 대납)
   - Admin: MetaMask (직접 지갑 연결)

### ✅ Completed (Phase 2-C: NFT 컨트랙트 Amoy 배포) - 2026-01-19
- NFT 컨트랙트 5개 Polygon Amoy 배포 완료
- Marketplace에 PaymentManager OPERATOR_ROLE 부여
- NFT 컨트랙트 Marketplace 승인 완료
- USDC, NEOS 결제 토큰 등록 완료

### ✅ Completed (Phase 2-C: NFT 서버 프론트엔드 연동) - 2026-01-19
1. **프론트엔드 컨트랙트 연동 완료**
   - nft/src/contracts/addresses.ts - 배포된 컨트랙트 주소 설정
   - nft/src/contracts/abis/ - ABI 파일 복사 완료
   - nft/src/hooks/useContracts.ts - 모든 컨트랙트 훅 구현

2. **Trusted Forwarder 설정 완료** (가스비 대납 활성화)
   - Biconomy Trusted Forwarder 주소 설정
   - Polygon Amoy: `0xd240234dacd7ffdca7e4effcf6c7190885d7e2f0`
   - NFT 컨트랙트 5개 재배포 완료

3. **Biconomy Gasless SDK 연동 완료** (2026-01-19)
   - Biconomy SDK v4 (@biconomy/account@4.5.7) 설치
   - BiconomyContext.tsx - Smart Account 관리
   - useGaslessTransaction.ts - 가스리스 트랜잭션 훅
   - MintNFT.tsx - 가스리스 민팅 UI 옵션 추가
   - Biconomy API Key: `mee_5EddzoFySPNrJByX2Cihag`
   - Project ID: `cfc5c6f8-12ec-4330-ae43-ea4de27a55c7`

### ✅ Completed (Phase 2-D: Game 서버 구현) - 2026-01-19
1. **MiMiG game 복제 및 NEOS 브랜딩 변경**
   - Carbon Farm → Kindness Game
   - MiMiG → NEOS
   - 환경 영향 → GAII 지수

2. **토큰 채굴 시스템 수정**
   - 채굴 풀: 10M MiMiG → 800M NEOS (전체 8B의 10%)
   - 반감기 라벨: 정(情) 테마 적용

3. **스토리/컨텐츠 변경**
   - 스토리: 친환경 농업 → AI 민주화
   - 티어 명칭: Jeong-SBT 티어와 일치

4. **세계문화여행 업그레이드 (Session 32~48)** - 2026-01-26~28
   - Kindness Game → World Culture Travel 전면 업그레이드
   - 20개국 ~58 퀘스트 (4종류 퀘스트 타입)
   - 모바일 세로모드 UI 리디자인 + Gold 테마 통일
   - Game i18n (ko/en), Supabase DB 마이그레이션
   - 배포: https://game.almaneo.org (Vercel)
   - 상세 기록: `.claude/GAME_UPDATE.md`, Session 32~48 참조

### ✅ Completed (Phase 2-F: Web UI 업그레이드) - 2026-01-20
1. GAII Dashboard 세계지도 시각화 ✅
2. 랜딩 페이지 신규 섹션 6개 추가 ✅
3. Header 2단계 네비게이션 구조 ✅
4. 친절 모드 (Kindness Mode) 기능 ✅
5. 14개 언어 지원 UI ✅

### ✅ Completed (Phase 2-G: i18n 다국어 번역 구현) - 2026-01-21
1. **react-i18next 패키지 설치**
   - react-i18next, i18next, i18next-browser-languagedetector, i18next-http-backend
   - `--legacy-peer-deps` 플래그 사용 (react-simple-maps와 React 19 호환성)

2. **i18n 설정 파일 생성** (`src/i18n/index.ts`)
   - 14개 언어 설정 (Header.tsx 메뉴와 동일)
   - HttpBackend로 JSON 번역 파일 로드
   - LanguageDetector로 브라우저 언어 자동 감지
   - localStorage 저장 키: `almaneo-language`

3. **번역 파일 생성** (14개 언어 × 2개 네임스페이스)
   - `public/locales/{lang}/common.json`: 공통 UI (nav, wallet, footer 등)
   - `public/locales/{lang}/landing.json`: 랜딩 페이지 전체 (hero, problem, philosophy, solution, tokenomics, ecosystem, web3auth, team, partners, roadmap, faq, cta)
   - 각 언어별 문화적 특성을 고려한 번역

4. **Header.tsx i18n 연동**
   - useTranslation 훅 통합
   - 언어 선택기에서 i18n.changeLanguage() 호출
   - RTL 지원 (아랍어): document.documentElement.dir 자동 설정

5. **지원 언어 목록** (Header.tsx 메뉴 기준)
   | 코드 | 언어 | 네이티브 표기 | 방향 |
   |------|------|--------------|------|
   | ko | 한국어 | 한국어 | LTR |
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

### 🔲 Pending (Phase 2-H ~ I)
- [x] 컴포넌트에 t() 함수 적용 (실제 번역 표시) ✅ Session 9 완료
- [x] 나머지 섹션에 t() 함수 확장 (Team, Partners, Roadmap, FAQ) ✅ Session 10 완료
- [ ] 이미지/미디어 추가
- [ ] 접근성 기능 (고대비, 큰 글씨 등)
- [x] Game 서버 배포 ✅ game.almaneo.org (Vercel)
- [x] 반응형 최적화 ✅ Session 49 완료 (5그룹, ~20개 파일)
- [ ] 메인넷 배포

## Commands

### Web 서버
```bash
cd c:\DEV\ALMANEO\web
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

### NFT 서버
```bash
cd c:\DEV\ALMANEO\nft
npm run dev      # 개발 서버 (포트 5174)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

### Game 서버
```bash
cd c:\DEV\ALMANEO\game
npm run dev      # 개발 서버 (포트 3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
```

### Blockchain
```bash
cd c:\DEV\ALMANEO\blockchain
npx hardhat compile                           # 컨트랙트 컴파일
npx hardhat run scripts/deploy.js --network hardhat  # 로컬 테스트
npx hardhat run scripts/deploy.js --network amoy     # Polygon Amoy 배포
npx hardhat run scripts/deploy-nft.js --network amoy # NFT 컨트랙트 배포
```

## Notes
- Tailwind CSS 3.x 사용 (4.x 호환성 문제)
- Vite 7에서 buffer 모듈이 외부화됨 → polyfills.ts로 수동 설정 필요
- Web3Auth IProvider.request() 타입: `as string[] | null` 캐스팅 사용
- 모든 인라인 스타일이 CSS 클래스로 이동됨
- 컴포넌트는 class-variance-authority로 variant 관리
- cn() 유틸리티로 조건부 클래스 병합

---

# Phase 2: 통합 플랫폼 개발 계획

## 시스템 아키텍처

### 3개 서버 구조
```
┌─────────────────────────────────────────────────────────────────┐
│                    NEOS Platform Architecture                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   WEB 서버   │  │  NFT 서버    │  │  GAME 서버   │          │
│  │  (메인사이트) │  │ (마켓플레이스)│  │ (Kindness)  │          │
│  │              │  │              │  │              │          │
│  │ - 랜딩페이지  │  │ - NFT 민팅   │  │ - Tap-to-Earn│          │
│  │ - GAII 대시보드│ │ - 구매/판매  │  │ - 퀘스트     │          │
│  │ - 거버넌스    │  │ - 경매/렌탈  │  │ - 성취       │          │
│  │ - 스테이킹    │  │ - Jeong-SBT │  │ - 리더보드   │          │
│  │ - 에어드롭    │  │              │  │ - 토큰 채굴  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └────────────┬────┴────────────────┘                   │
│                      ▼                                          │
│         ┌─────────────────────────┐                            │
│         │   통합 인증 (Web3Auth)   │                            │
│         │  - Google/Facebook/X    │                            │
│         │  - MetaMask/지갑 연결   │                            │
│         │  - 세션 공유 (동일 ID)  │                            │
│         └───────────┬─────────────┘                            │
│                     ▼                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Supabase Backend                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │   │
│  │  │   Auth      │ │  Database   │ │  Storage    │        │   │
│  │  │ (사용자)    │ │ (Postgres)  │ │ (파일)      │        │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                     ▼                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Polygon Blockchain                       │   │
│  │  NEOS Token │ Jeong-SBT │ Governance │ Staking │ NFT    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 폴더 구조 (확장)
```
c:\DEV\ALMANEO\
├── web/                    # 메인 웹사이트 (Vite + React)
│   └── src/
│       ├── contexts/       # 🆕 Web3Auth, Theme
│       ├── hooks/          # 🆕 Web3 훅 (복제)
│       └── ...
│
├── nft/                    # 🆕 NFT 마켓플레이스 (Vite + React)
│   └── (NFTMARKET 복제 후 커스터마이징)
│
├── game/                   # 🆕 Kindness 게임 (Next.js)
│   └── (game 복제 후 컨셉 변경)
│
├── blockchain/             # ✅ 스마트 컨트랙트 (Hardhat) - 완료
│   ├── contracts/
│   │   ├── NEOSToken.sol       # ERC-20Votes + UUPS (8B 공급량)
│   │   ├── JeongSBT.sol        # ERC-721 Soulbound + UUPS (양도불가)
│   │   ├── NEOSStaking.sol     # 4티어 스테이킹 + UUPS
│   │   ├── NEOSGovernor.sol    # DAO 거버넌스 + UUPS
│   │   ├── NEOSTimelock.sol    # 실행 지연 + UUPS
│   │   └── KindnessAirdrop.sol # Merkle Proof 에어드롭 + UUPS
│   ├── scripts/
│   │   └── deploy.js           # 전체 배포 스크립트
│   ├── deployments/            # 배포 결과 저장
│   ├── hardhat.config.js       # Solidity 0.8.24, cancun EVM
│   └── .env                    # PRIVATE_KEY 설정 필요
│
├── shared/                 # 🆕 공유 모듈
│   ├── auth/               # Web3Auth 통합 설정
│   ├── supabase/           # Supabase 설정
│   ├── contracts/          # ABI + 주소
│   └── types/              # 공통 타입
│
└── reference/
    └── WhitePaper/         # 화이트페이퍼 13개 섹션
```

## 통합 인증 시스템

### Web3Auth 설정 (단일 Client ID)
```typescript
// shared/auth/web3auth.config.ts
export const WEB3AUTH_CONFIG = {
  clientId: process.env.WEB3AUTH_CLIENT_ID,
  chainConfig: {
    chainNamespace: 'eip155',
    chainId: '0x89',           // Polygon Mainnet (137)
    // chainId: '0x13882',     // Polygon Amoy Testnet (80002)
    rpcTarget: 'https://polygon-rpc.com',
  },
  uiConfig: {
    appName: 'NEOS',
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook', 'twitter'],
    defaultLanguage: 'ko',
  }
};
```

### 세션 공유 메커니즘
```
사용자 로그인 플로우:
1. 어느 서버에서든 Web3Auth 로그인
2. 동일한 Client ID → 동일한 지갑 주소 생성
3. Supabase Auth에 Custom Token으로 인증
4. Supabase DB에서 사용자 데이터 조회/생성
5. 다른 서버 방문 시 → 이미 로그인 상태 (세션 공유)
```

### Supabase 테이블 구조
```
tables/
├── users/{walletAddress}/
│   ├── profile: { nickname, avatar, createdAt }
│   ├── kindnessScore: number
│   ├── totalPoints: number
│   ├── level: number
│   └── settings: { language, notifications }
│
├── gameStates/{walletAddress}/
│   ├── points, energy, maxEnergy
│   ├── upgrades: { tapPower, autoFarm, ... }
│   ├── dailyQuests: []
│   ├── achievements: []
│   └── lastSaved: timestamp
│
├── leaderboard/{walletAddress}/
│   ├── nickname, totalPoints, level
│   └── updatedAt: timestamp
│
├── kindnessActivities/{activityId}/
│   ├── userId, type, description
│   ├── points, verified
│   └── createdAt: timestamp
│
└── nftListings/{listingId}/
    ├── tokenId, seller, price
    ├── status: 'active' | 'sold' | 'cancelled'
    └── createdAt: timestamp
```

## 복제 대상 및 수정 사항

### 1. Web3Auth Provider (frontend → web, nft, game)
```
소스: c:\DEV\mimig\frontend\contexts\Web3AuthProvider.tsx
수정:
- Client ID를 NEOS 전용으로 변경
- 체인을 Polygon Mainnet으로 설정
- 로그인 UI에 NEOS 브랜딩 적용
```

### 2. NFT 마켓플레이스 (NFTMARKET → nft)
```
소스: c:\DEV\mimig\NFTMARKET\
수정:
- 브랜딩 (MiMiG → NEOS)
- 색상 테마 (Cold/Warm 적용)
- NFT 카테고리 (Jeong-SBT, Kindness Badge, AI Contribution)
- 결제 토큰 (POL, USDC, NEOS)
```

### 3. Kindness 게임 (game → game)
```
소스: c:\DEV\mimig\game\
컨셉 변경:
- Carbon Farm → Kindness Farm
- CO2 감소 → AI 불평등 개선
- 환경 영향 → GAII 지수
- 교육 콘텐츠 → AI 민주화 교육

메커니즘 유지:
- Tap-to-Earn 시스템
- 4가지 업그레이드
- 일일 퀘스트 (Kindness 활동)
- 성취 시스템 (정(情) 뱃지)
- 토큰 채굴 (8B NEOS, 반감기)
```

### 4. 스마트 컨트랙트 (blockchain → blockchain)
```
소스: c:\DEV\mimig\blockchain\
수정:
- 토큰명: AEC1 → NEOS
- 총 공급량: 1M → 8B (8,000,000,000)
- 거버넌스: Kindness Score 가중치 추가
- 새 컨트랙트: JeongSBT, KindnessRegistry
```

### 5. 다국어 (locales → shared)
```
소스: c:\DEV\mimig\frontend\locales\
언어: en, ko, zh, ja, th, id, km, vi (8개)
추가 예정: hi (힌디어), sw (스와힐리어), pt (포르투갈어)
→ Global South 언어 확대
```

## 환경 변수 통합

### .env (공통)
```env
# Web3Auth
VITE_WEB3AUTH_CLIENT_ID=your_client_id

# Supabase
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Blockchain (Polygon)
VITE_CHAIN_ID=137
VITE_RPC_URL=https://polygon-rpc.com
VITE_BLOCK_EXPLORER=https://polygonscan.com

# Contract Addresses (배포 후 업데이트)
VITE_NEOS_TOKEN_ADDRESS=
VITE_JEONG_SBT_ADDRESS=
VITE_KINDNESS_REGISTRY_ADDRESS=
VITE_GOVERNOR_ADDRESS=
VITE_STAKING_ADDRESS=
VITE_NFT_MARKETPLACE_ADDRESS=
```

## 스마트 컨트랙트 배포 계획

### 컨트랙트 목록
| 컨트랙트 | 표준 | 용도 |
|---------|------|------|
| NEOSToken | ERC-20Votes | 거버넌스 토큰 (8B) |
| JeongSBT | ERC-5484 | 양도불가 영혼 토큰 |
| KindnessRegistry | Custom | 친절 활동 기록/검증 |
| NEOSGovernor | Governor | DAO 제안/투표 |
| NEOSTimelock | Timelock | 실행 지연 (2일) |
| NEOSStaking | Custom | 다중 계층 스테이킹 |
| KindnessAirdrop | Custom | 작업 기반 에어드롭 |
| NEOSNFT721 | ERC-721 | 일반 NFT |
| NEOSNFT1155 | ERC-1155 | 멀티토큰 NFT |
| NFTMarketplace | Custom | NFT 거래소 |

### 배포 순서
```
1. NEOSToken (기본 토큰)
2. NEOSTimelock (거버넌스 전제)
3. NEOSGovernor (DAO)
4. NEOSStaking (토큰 활용)
5. KindnessRegistry (핵심 기능)
6. JeongSBT (영혼 토큰)
7. KindnessAirdrop (분배)
8. NFT 관련 (마켓플레이스)
```

## 개발 우선순위

### ✅ Phase 2-A: 인프라 (완료)
- [x] shared/ 폴더 구조 생성
- [x] Web3Auth 통합 설정
- [x] Firebase 프로젝트 설정
- [x] 환경 변수 구성

### ✅ Phase 2-B: Web 서버 확장 (완료)
- [x] React Router 설정
- [x] Web3Auth 연동
- [x] 대시보드 페이지 (Firebase 연동)
- [x] 거버넌스 UI (컨트랙트 연동 완료)
- [x] 스테이킹 UI (컨트랙트 연동 완료)

### 🔲 Phase 2-C: NFT 서버
- [ ] NFTMARKET 복제
- [ ] 브랜딩 변경
- [ ] Jeong-SBT 연동

### 🔲 Phase 2-D: Game 서버
- [ ] game 복제
- [ ] 컨셉 변경 (Carbon → Kindness)
- [ ] GAII 지수 연동
- [ ] 토큰 채굴 수정 (8B)

### ✅ Phase 2-E: 스마트 컨트랙트 (Amoy 배포 완료)
- [x] 컨트랙트 개발 (6개 UUPS 패턴)
- [x] 로컬 테스트 배포 성공
- [x] 테스트넷 배포 (Amoy) - 2026-01-18 완료
- [ ] 테스트 및 감사
- [ ] 메인넷 배포

## 참조 프로젝트

### MiMiG 프로젝트 (c:\DEV\mimig\)
```
frontend/     → Web3Auth, 거버넌스 UI, 스테이킹 UI
NFTMARKET/    → NFT 마켓플레이스 전체
game/         → Kindness 게임 전체
blockchain/   → 스마트 컨트랙트 템플릿
```

### 배포된 컨트랙트 (참조용 - Polygon Amoy)
```
MiMiGToken:       0xfaf8Edc1a61F7e29BDea7c8D7aC98445689b1176
DynamicStaking:   0xD9B396776bA9AfaBcfe9e7722a892A1aA2c93bbA
TaskBasedAirdrop: 0x6Ed52d65c9512aCbB943D586DB1dd18Dc3127192
MiMiGGovernor:    0xFEc7aEF11e8A76822f4ed2d33fad4D0a07A8465b
NFTMarketplace:   0x4BF0c57277091aBb8cf524b5c9b81Be902628128
```

## 화이트페이퍼 핵심 요약

### 문제 인식
- AI 연산 자원 90%가 상위 1%에 독점
- AI 구독료가 Global South에서 월 생활비의 10-30%
- AI 학습 데이터 90%가 영어

### 3가지 솔루션
1. **GAII**: AI 불평등 실시간 측정 지표
2. **NEOS AI Hub**: 무료 AI 접근 + DePIN
3. **Kindness Protocol**: Proof of Humanity

### 토큰 경제 (8B NEOS)
```
40% - Community & Ecosystem
25% - Foundation Reserve
15% - Liquidity & Exchange
10% - Team & Advisors
10% - Kindness Expo & Grants
```

---

## 프로젝트 설정 정보

### Firebase 프로젝트
```
Project ID: neos-p
Auth Domain: neos-p.firebaseapp.com
Storage: neos-p.firebasestorage.app
```

### Web3Auth
```
Client ID: BI8Q1xvlSCu52eYqU2lhkxuvIghBW6LSkXvQXZmbEvTv4PVZe97eUdML0mzudO1agu88KoOmAWmv9FspuFb84ns
Network: Sapphire Mainnet
```

### 지갑 주소 (Polygon)
```
Main Wallet (Foundation): 0x7BD8194c22b79B0BBa6B2AFDfe36c658707024FE
Gasless Relayer (가스비 대납): 0x15a52D1D7e3093bb225379add7146A412cE39Cf0
```

### 현재 네트워크
```
개발: Polygon Amoy Testnet (Chain ID: 80002)
프로덕션: Polygon Mainnet (Chain ID: 137)
```

---

## 다음 세션 작업 가이드

### ✅ 완료된 작업 (2026-01-19 - Session 2)
1. **NFT 프론트엔드 컨트랙트 연동** - ABI 복사, 주소 설정, useContracts.ts 완료
2. **Trusted Forwarder 설정** - Biconomy 가스비 대납 활성화, NFT 컨트랙트 재배포 완료
3. **Game 서버 구현** - MiMiG game 복제, NEOS 브랜딩으로 변경 완료
4. **Web 서버 Firebase 배포** - https://almaneo.org 배포 완료

### ✅ 완료된 작업 (2026-01-19 - Session 3)
1. **Biconomy Gasless SDK 연동**
   - Biconomy SDK v4 (@biconomy/account@4.5.7) 설치
   - BiconomyContext.tsx - Smart Account 관리
   - useGaslessTransaction.ts - 가스리스 트랜잭션 훅
   - MintNFT.tsx - 가스리스/일반 민팅 토글 UI 추가
   - Biconomy API Key: `mee_5EddzoFySPNrJByX2Cihag`
   - Project ID: `cfc5c6f8-12ec-4330-ae43-ea4de27a55c7`

2. **NFT 서버 Firebase 배포**
   - Firebase 프로젝트: almaneo-nft
   - 배포 URL: https://nft.almaneo.org
   - .firebaserc 및 .env 업데이트 완료

### ✅ 완료된 작업 (2026-01-20 - Session 4)
1. **GAII Dashboard 세계지도 시각화 구현**
   - `react-simple-maps`, `d3-geo`, `prop-types` 패키지 설치
   - Microsoft Global AI Adoption 2025 Report 기반 데이터 구조 설계
   - GAII 점수 계산: `100 - (adoptionRate / 66.7) * 100`

2. **GAII 데이터 모듈 생성** (`web/src/data/gaii/`)
   - `schema.ts`: GAII 타입 정의 (CountryGAIIData, RegionGAIIData, GlobalGAIIData)
   - `countries.ts`: ~100개국 GAII 데이터 (MS Report 기반)
   - `aggregation.ts`: 지역별/글로벌 집계 함수
   - `index.ts`: 모듈 export

3. **WorldMap 컴포넌트 완전 재작성** (`web/src/components/ui/WorldMap/`)
   - `react-simple-maps` 사용한 인터랙티브 세계지도
   - 국가별 GAII 점수에 따른 색상 표시 (녹색~빨간색)
   - 호버 시 툴팁 표시 (국가명, GAII 점수, AI 채택률)
   - 데이터 없는 국가는 회색(#1e293b)으로 표시
   - 범례 추가 (Low/Moderate/High/Critical + No Data)
   - world-atlas TopoJSON 사용 (110m 해상도)

4. **GAII Dashboard 페이지 업데이트** (`web/src/pages/GAII.tsx`)
   - 국가별 데이터 기반으로 전환 (기존 지역 기반에서 변경)
   - Global GAII Score 원형 게이지
   - Top 5 / Bottom 5 국가 표시
   - 지역별 분석 카드 (확장 가능)
   - Regional Comparison 바 차트
   - MS Global AI Adoption 2025 Report 데이터 소스 표시

5. **지역 코드 체계** (10개 지역)
   - NA: North America (북미)
   - EU: Europe (유럽)
   - EA: East Asia (동아시아)
   - SA: South Asia (남아시아)
   - SEA: Southeast Asia (동남아시아)
   - LA: Latin America (중남미)
   - ME: Middle East (중동)
   - SSA: Sub-Saharan Africa (사하라 이남 아프리카)
   - OC: Oceania (오세아니아)
   - CA: Central Asia (중앙아시아)

### ✅ 완료된 작업 (2026-01-20 - Session 5)
1. **랜딩 페이지 신규 섹션 6개 추가** (`web/src/components/sections/landing/`)
   - `EcosystemSection.tsx`: Staking, Airdrop, NFT Marketplace, Kindness Game 카드
   - `Web3AuthSection.tsx`: 소셜 로그인, 가스리스 트랜잭션, 보안 기능 소개
   - `TeamSection.tsx`: Core Team 4명 + Advisors 2명 프로필
   - `PartnersSection.tsx`: Technology Partners + ERC Standards 로고
   - `RoadmapSection.tsx`: 2025~2027+ 타임라인 (화이트페이퍼 기반)
   - `FAQSection.tsx`: 10개 FAQ 아코디언

2. **로드맵 타임라인 업데이트** (화이트페이퍼 section10_roadmap.md 기반)
   - 2025 상반기: 기반 구축 ✅ completed
   - 2025 하반기: 테스트넷 & 커뮤니티 ✅ completed
   - 2026 Q1: TGE & 메인넷 🔵 in-progress (현재)
   - 2026 Q2-Q3: 생태계 확장 ⬜ upcoming
   - 2026 Q4: 제1회 Kindness Expo ⬜ upcoming
   - 2027+: 글로벌 확장 & DAO ⬜ upcoming

3. **Header 2단계 네비게이션 구조 변경** (`web/src/components/layout/Header.tsx`)
   - **Platform**: GAII Dashboard, NEOS AI Hub, Kindness Protocol
   - **Ecosystem**: Staking, Airdrop, NFT Marketplace, Kindness Game, Governance
   - **Community**: Docs, Discord, Twitter, GitHub (외부 링크)
   - **Dashboard**: 1차 메뉴로 노출
   - 로고 클릭 = Home

4. **14개 언어 지원 UI** (Global South 언어 포함)
   - ko (한국어), en (English), zh (中文), ja (日本語)
   - th (ไทย), vi (Tiếng Việt), id (Indonesia), km (ភាសាខ្មែរ)
   - hi (हिन्दी), bn (বাংলা), sw (Kiswahili), pt (Português)
   - es (Español), ar (العربية)

5. **친절 모드 (Kindness Mode) 기능 구현**
   - `contexts/KindnessModeContext.tsx`: 상태 관리 (localStorage 저장)
   - `data/glossary.ts`: 30+ 용어 정의 (blockchain, token, defi, nft, governance, neos 카테고리)
   - `components/ui/KindnessTerm.tsx`: 툴팁 컴포넌트 (호버/클릭)
   - `index.css`: 툴팁 스타일 추가
   - Header에 친절 모드 토글 버튼 (HeartHandshake 아이콘)
   - 기본값: ON (초보자 친화적)

6. **KindnessTerm 적용된 섹션**
   - `SolutionSection.tsx`: GAII, Kindness Protocol, Jeong-SBT, blockchain 등
   - `TokenomicsSection.tsx`: NEOS, Polygon, ERC-20, totalSupply, liquidity 등
   - `EcosystemSection.tsx`: staking, apy, kindnessScore, airdrop, nft, gasless, royalty, web3auth 등

### ✅ 완료된 작업 (2026-01-20 - Session 6: 브랜딩 변경)
**중요: NEO-SAPIENS → AlmaNEO, NEOS → ALMAN 브랜딩 변경 완료**

1. **Web 서버 브랜딩 변경** ✅
   - index.html 메타 태그 업데이트
   - Footer, CTASection 텍스트 변경
   - Airdrop, Governance, Staking 페이지 토큰명 변경
   - glossary.ts 용어 업데이트 (NEOS → ALMAN)
   - EcosystemSection 외부 링크 업데이트

2. **NFT 서버 브랜딩 변경** ✅
   - index.html, package.json 업데이트
   - Header, Footer 컴포넌트 변경
   - Home, Explore, Collections 페이지 변경
   - Web3Context, ThemeContext 앱명 변경
   - WalletModal 토큰명 변경 (NEOS → ALMAN)
   - localStorage 키 변경 (neos-nft-theme → almaneo-nft-theme)

3. **Game 서버 브랜딩 변경** ✅
   - package.json, app/layout.tsx 메타데이터 변경
   - manifest.json PWA 설정 변경
   - tokenMining.ts, tokenReward.ts 토큰명 변경
   - storyContent.ts 스토리 텍스트 변경
   - Header, StartScreen, TokenClaimModal 컴포넌트 변경
   - 테마 색상 변경 (#1a472a → #0A0F1A NEOS 테마)

### ✅ 완료된 작업 (2026-01-20 - Session 7: 스마트 컨트랙트 재배포)
1. **스마트 컨트랙트 브랜딩 변경** ✅
   - NEOSToken.sol → ALMANToken.sol ("AlmaNEO"/"ALMAN")
   - NEOSStaking.sol → ALMANStaking.sol
   - NEOSGovernor.sol → ALMANGovernor.sol
   - NEOSTimelock.sol → ALMANTimelock.sol
   - NEOSNFT721.sol → AlmaNFT721.sol
   - NEOSNFT1155.sol → AlmaNFT1155.sol
   - NEOSMarketplace.sol → AlmaMarketplace.sol
   - NEOSPaymentManager.sol → AlmaPaymentManager.sol
   - NEOSCollectionManager.sol → AlmaCollectionManager.sol

2. **11개 컨트랙트 Polygon Amoy 재배포** ✅
   - Core 6개: ALMANToken, JeongSBT, ALMANStaking, ALMANTimelock, ALMANGovernor, KindnessAirdrop
   - NFT 5개: AlmaNFT721, AlmaNFT1155, AlmaPaymentManager, AlmaCollectionManager, AlmaMarketplace

3. **프론트엔드 컨트랙트 주소 업데이트** ✅
   - shared/contracts/addresses.ts
   - web/src/contracts/addresses.ts
   - nft/src/contracts/addresses.ts
   - game/.env.local

### ✅ 완료된 작업 (2026-01-21 - Session 8: i18n 다국어 번역 구현)
1. **react-i18next 패키지 설치**
   - `npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend --legacy-peer-deps`
   - React 19와 react-simple-maps 호환성을 위해 `--legacy-peer-deps` 필수

2. **i18n 설정 파일 생성** (`web/src/i18n/index.ts`)
   ```typescript
   export const languages = {
     ko: { name: '한국어', nativeName: '한국어', dir: 'ltr', flag: '🇰🇷' },
     en: { name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇺🇸' },
     // ... 14개 언어
   } as const;
   ```

3. **번역 파일 28개 생성** (14개 언어 × 2개 네임스페이스)
   - `public/locales/{ko,en,zh,ja,es,fr,ar,pt,id,ms,th,vi,km,sw}/common.json`
   - `public/locales/{ko,en,zh,ja,es,fr,ar,pt,id,ms,th,vi,km,sw}/landing.json`
   - 각 언어별 문화적 특성을 고려한 전문 번역

4. **Header.tsx i18n 연동**
   - `useTranslation` 훅 통합
   - 언어 목록을 i18n 설정에서 import
   - RTL 지원: 아랍어 선택 시 `document.documentElement.dir = 'rtl'`

5. **main.tsx 업데이트**
   - `import './i18n'` 추가하여 앱 시작 시 i18n 초기화

6. **빌드 테스트 성공**
   - TypeScript 컴파일 성공
   - 프로덕션 빌드 성공

### ✅ 완료된 작업 (2026-01-21 - Session 9: 컴포넌트에 t() 함수 적용)
1. **랜딩 페이지 섹션 컴포넌트에 useTranslation 훅 적용**
   - `HeroSection.tsx`: hero.subtitle, hero.cta.*, hero.stats.* 번역 키 적용
   - `ProblemSection.tsx`: problem.title, problem.subtitle, problem.description 적용
   - `PhilosophySection.tsx`: philosophy.title, philosophy.subtitle, philosophy.description, philosophy.jeong 적용
   - `SolutionSection.tsx`: solution.title, solution.subtitle, solution.description 적용
   - `TokenomicsSection.tsx`: tokenomics.subtitle, tokenomics.distribution.title 적용
   - `EcosystemSection.tsx`: ecosystem.title, ecosystem.subtitle 적용
   - `Web3AuthSection.tsx`: web3auth.title, web3auth.subtitle 적용
   - `CTASection.tsx`: cta.title, cta.description, cta.button 적용
   - `Footer.tsx`: footer.contracts, footer.tagline, footer.copyright 적용 (common 네임스페이스)

2. **번역 파일 키 추가 및 수정** (ko/en)
   - `common.json`: footer.contracts 키 추가
   - `landing.json`: philosophy.jeong을 객체에서 문자열로 변경
   - `landing.json`: philosophy.description, solution.description 키 추가

3. **사용 패턴**
   ```tsx
   import { useTranslation } from 'react-i18next';

   function Component() {
     const { t } = useTranslation('landing'); // 또는 'common'
     return <h1>{t('section.key')}</h1>;
   }
   ```

4. **빌드 테스트 성공** (26.46초)

### ✅ 완료된 작업 (2026-01-21 - Session 10: 컴포넌트 번역 확장)
1. **TeamSection 번역 적용**
   - `useTranslation('landing')` 훅 추가
   - 팀원 데이터를 ID 기반 구조로 변경 (`teamMemberIds`, `advisorIds`)
   - 역할명을 `team.roles.*` 키로 매핑
   - 팀원 정보를 `team.members.{id}.name/description` 키로 매핑

2. **PartnersSection 번역 적용**
   - 파트너 데이터를 ID 기반 구조로 변경 (`partnersData`)
   - 파트너 정보를 `partners.partners.{id}.*` 키로 매핑
   - 표준 설명을 `partners.standards.*` 키로 매핑

3. **RoadmapSection 번역 적용**
   - 로드맵 데이터를 ID/키 기반 구조로 변경 (`phasesData`)
   - 각 단계 제목/기간을 `roadmap.phases.{id}.title/period` 키로 매핑
   - 각 항목을 `roadmap.phases.{id}.items.{itemKey}` 키로 매핑
   - 범례를 `roadmap.legend.*` 키로 매핑

4. **FAQSection 번역 적용**
   - FAQ 데이터를 ID 기반 배열로 변경 (`faqItemIds`)
   - 각 질문/답변을 `faq.items.{id}.question/answer/category` 키로 매핑
   - 카테고리 필터를 `faq.categories.*` 키로 매핑

5. **Header 네비게이션 번역 적용**
   - NavItem 인터페이스 변경: `name` → `nameKey`, `badge` → `badgeKey`
   - Dropdown, MobileAccordion 컴포넌트에 `useTranslation()` 훅 추가
   - 메뉴 라벨을 `nav.*` 키로 매핑
   - 친절 모드 텍스트를 `kindnessMode.*` 키로 매핑
   - 지갑 버튼 텍스트를 `wallet.*` 키로 매핑

6. **landing.json 번역 키 대폭 확장** (ko/en)
   - `team`: members, roles, coreTeam, advisors, joinCta, contactMessage 등
   - `partners`: partners.{id}, standards, partnershipCta, blockchainStandards 등
   - `roadmap`: phases.{id}.items, legend 등
   - `faq`: items.{id}, categories, categoryLabel, contactCta 등

7. **빌드 테스트 성공** (25.37초)

### ✅ 완료된 작업 (2026-01-22 - Session 11: i18n 번역 시스템 디버깅)
1. **i18n 번역 로딩 문제 해결**
   - 문제: 번역 파일은 로드되지만 `t()` 함수가 키 값을 그대로 반환
   - 원인: `getResourceBundle`이 `undefined` 반환 - i18n 인스턴스 불일치
   - 해결: `I18nextProvider`를 App.tsx에 명시적으로 추가

2. **i18n 설정 수정** (`web/src/i18n/index.ts`)
   ```typescript
   export const initPromise = i18n
     .use(HttpBackend)
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({...});
   ```
   - `initPromise` export하여 초기화 완료 대기 가능

3. **main.tsx 수정**
   ```typescript
   import { initPromise } from './i18n'

   const root = createRoot(document.getElementById('root')!)

   initPromise.then(() => {
     root.render(<StrictMode><App /></StrictMode>)
   })
   ```
   - i18n 초기화 완료 후 앱 렌더링

4. **App.tsx 수정**
   ```typescript
   import { I18nextProvider } from 'react-i18next';
   import i18n from './i18n';

   function App() {
     return (
       <I18nextProvider i18n={i18n}>
         <Suspense fallback={<LoadingFallback />}>
           ...
         </Suspense>
       </I18nextProvider>
     );
   }
   ```

5. **네임스페이스 정리**
   - `ns: ['common', 'landing']` (dashboard, governance 등 제거)
   - 존재하지 않는 네임스페이스 로드 에러 해결

6. **번역 시스템 작동 확인**
   - Header 네비게이션: ✅ 번역 작동
   - EcosystemSection: ✅ 번역 작동
   - Web3AuthSection: ✅ 번역 작동 (일부)
   - 기타 섹션들: 하드코딩된 한글 텍스트 존재

7. **번역 적용 필요한 섹션 분석 완료**
   - ProblemSection: 하드코딩된 한글 (dayActivities, statistics 배열)
   - PhilosophySection: 하드코딩된 한글 (principles 배열)
   - SolutionSection: 하드코딩된 한글 (solutions 배열)
   - TokenomicsSection: 타이틀 버그 ("80억 8 80억 Tokens"), 하드코딩
   - Web3AuthSection: 일부 하드코딩

### ✅ 완료된 작업 (2026-01-22 - Session 12: 컴포넌트 번역 완료)
1. **5개 섹션에 t() 함수 적용 완료**
   - `ProblemSection.tsx`: cards, activities, timeLabels, statistics 모두 번역 적용
   - `PhilosophySection.tsx`: jeongCard, principles 배열 번역 적용
   - `SolutionSection.tsx`: solutions (gaii, aiHub, kindness) + items 배열 번역 적용
   - `TokenomicsSection.tsx`: forHumansCount, tokenInfo, distribution 번역 적용
   - `Web3AuthSection.tsx`: loginDemo, benefits, stats 번역 적용

2. **ko/en landing.json 구조 완전히 업데이트**
   - 새 키 구조: problem.cards, problem.activities, problem.statistics
   - 새 키 구조: philosophy.jeongCard.description1/2, philosophy.principles
   - 새 키 구조: solution.solutions.{id}.items
   - 새 키 구조: tokenomics.forHumansCount, tokenomics.tokenInfo
   - 새 키 구조: web3auth.loginDemo, web3auth.benefits, web3auth.stats

3. **zh (중국어) landing.json 업데이트 완료**
   - 새 구조에 맞게 전체 번역 업데이트

4. **빌드 테스트 성공** (29.96초)

### ✅ 완료된 작업 (2026-01-23 - Session 13: i18n 번역 버그 수정)
1. **Philosophy 섹션 `philosophy.jeong` 값 수정** (6개 언어)
   - 문제: id, th, ms, vi, km, sw에서 `jeong` 값에 긴 설명 문장이 들어가 있음
   - 원인: 컴포넌트가 `{t('philosophy.jeong')} {t('philosophy.subtitle')}` 형태로 출력
   - 해결: 6개 언어의 `jeong` 값을 단어만 남기도록 수정
   - 수정된 언어: id→"Jeong (情)", th→"จอง (情)", ms→"Jeong (情)", vi→"Jeong (情)", km→"ជង (情)", sw→"Jeong (情)"

2. **Tokenomics 섹션 숫자 중복 문제 수정** (6개 언어)
   - 문제: "8,000,000,000 8 tỷ người, 8,000,000,000 8 tỷ token" 중복 표시
   - 원인: `forHumans` 값에 이미 숫자가 포함되어 있는데, 컴포넌트가 `forHumansCount`를 앞에 추가
   - 해결: `forHumans`를 "Người, Token" 형태로 수정 (숫자 제거)
   - 수정된 언어: vi, ms, id, th, sw, km

3. **Tokenomics 섹션 distribution 객체 에러 수정** (6개 언어)
   - 문제: "key returned an object instead of string" 에러
   - 원인: distribution.community 등이 객체(`{label, percentage, description}`)인데 컴포넌트는 문자열 기대
   - 해결: 객체를 문자열로 변경 (ko/en 구조와 동일하게)
   - 수정된 언어: vi, ms, id, sw, km (th는 이미 수정됨)

### ✅ 완료된 작업 (2026-01-23 - Session 14: 화이트페이퍼 페이지 생성)
1. **화이트페이퍼 데이터베이스 → JSON 변환**
   - `reference/whitepaper/almaneo_whitepaper.db` → `web/src/data/whitepaper/whitepaper.json`
   - 13개 섹션: abstract, problem, philosophy, solution, technical, tokenomics, expansion, expo, governance, roadmap, team, risk, conclusion
   - 15개 언어 지원: en, ko, ar, es, fr, id, ja, km, ms, pt, sw, th, vi, zh + original

2. **화이트페이퍼 페이지 컴포넌트** (`/whitepaper`)
   - `web/src/pages/Whitepaper.tsx` 생성
   - 좌측 사이드바: TOC 네비게이션 + 언어 선택기
   - 중앙: react-markdown으로 마크다운 렌더링
   - URL 파라미터 지원: `?section=abstract&lang=ko`
   - 섹션 간 이전/다음 네비게이션

3. **마크다운 스타일링**
   - `@tailwindcss/typography` 플러그인 설치
   - `tailwind.config.js`에 커스텀 typography 테마 추가
   - `index.css`에 `.whitepaper-content` 클래스 추가
   - 다크 테마에 맞는 헤딩, 코드블록, 테이블, 인용문 스타일

4. **스크롤바 다크 테마 적용**
   - Webkit: `::-webkit-scrollbar` 스타일
   - Firefox: `scrollbar-color` 속성
   - 색상: `#334155` (thumb), `#0f172a` (track)

5. **한국어 번역 수정**
   - 문제: JSON에 `ko` 키 없음 (한국어가 `original`에 저장)
   - 해결: `original` 콘텐츠를 `ko` 키로 복사

6. **이미지 비활성화**
   - ReactMarkdown `components={{ img: () => null }}` 적용
   - 깨진 이미지 참조 숨김

7. **HeroSection 버튼 기능 구현**
   - "함께하기" 버튼 → SNS 링크 팝업 모달
   - "백서 읽기" 버튼 → `/whitepaper` 페이지 이동
   - SNS 5개: Twitter/X, Telegram, Discord, YouTube, TikTok
   - 임시 URL: `https://{platform}.com/almaneo` (나중에 수정)
   - 브랜드 아이콘 SVG 직접 구현

8. **Header에 Whitepaper 링크 추가**
   - Community 드롭다운에 "Whitepaper" 메뉴 추가
   - 14개 언어 번역 파일에 `nav.whitepaper` 키 추가

### ✅ 완료된 작업 (2026-01-23 - Session 15: Google 정책 위반 대응 & GitHub 배포)

#### 🔴 이슈: Google Cloud Policy Violation (피싱 오탐)
- **문제**: almaneo.org, nft.almaneo.org가 피싱 사이트로 오탐되어 Firebase Hosting 중단
- **원인**: Web3 지갑 연결, 소셜 로그인, 암호화폐 용어 등이 자동 감지 시스템에 의해 피싱으로 오인
- **해결**: 법적 페이지 추가, Appeal 문서 작성, Google Search Console 등록

#### 1. **법적 페이지 추가 (Web 서버)**
   - `web/src/pages/PrivacyPolicy.tsx` - 개인정보처리방침 (`/privacy`)
   - `web/src/pages/TermsOfService.tsx` - 이용약관 (`/terms`)
   - `web/src/components/sections/landing/Footer.tsx` - 법적 링크 + Disclaimer 추가
   - `web/src/App.tsx` - 라우트 추가
   - `web/src/pages/index.ts` - export 추가

#### 2. **법적 페이지 추가 (NFT 서버)**
   - `nft/src/pages/PrivacyPolicy.tsx` - 개인정보처리방침
   - `nft/src/pages/TermsOfService.tsx` - 이용약관
   - `nft/src/components/layout/Footer.tsx` - 법적 링크 + Disclaimer 추가
   - `nft/src/App.tsx` - 라우트 추가

#### 3. **Google Appeal 문서 작성**
   - `reference/GOOGLE_APPEAL_DOCUMENT.md` - 이의제기용 상세 문서
   - 프로젝트 개요, 스마트 컨트랙트 주소, 보안 조치 등 포함
   - Short Appeal Text 포함 (폼 제출용)

#### 4. **.gitignore 설정 (민감한 파일 보호)**
   - `/.gitignore` - 루트 (전체 프로젝트 공통)
   - `/web/.gitignore` - Web 서버
   - `/nft/.gitignore` - NFT 서버
   - `/game/.gitignore` - Game 서버
   - `/blockchain/.gitignore` - 스마트 컨트랙트 (개인키 보호!)

   **무시되는 민감한 파일:**
   - `/.env` - Web3Auth, Firebase 키
   - `/blockchain/.env` - **개인키 (PRIVATE_KEY)** ⚠️
   - `/web/.env`, `/nft/.env`, `/game/.env.local`
   - `node_modules/`, `dist/`, `.next/`, `artifacts/`, `cache/`

#### 5. **GitHub 저장소 설정**
   - **SSH 키 생성**: `~/.ssh/id_ed25519_almaneo`
   - **SSH Config 추가**: `Host github-almaneo` → `IdentityFile id_ed25519_almaneo`
   - **저장소**: https://github.com/almaneo/almaneo-org
   - **첫 커밋**: 670 files, 178,064 lines
   - **브랜치**: main

#### 6. **Google Search Console 등록 완료**
   - 도메인: almaneo.org
   - 인증 방식: DNS TXT 레코드 (Namecheap)

### ✅ 완료된 작업 (2026-01-23 - Session 16: 반응형 최적화 & 팀 섹션 업데이트)

#### 1. **미커밋 파일 정리**
   - NFT 서버 법적 페이지에서 unused `useTheme` import 제거
   - 커밋: `c377324`

#### 2. **친절모드 툴팁 화면 밖으로 나가는 문제 해결**
   - `KindnessTerm.tsx`: 좌우 경계 감지 로직 추가
   - 화면 왼쪽 가장자리: 툴팁을 오른쪽으로 정렬
   - 화면 오른쪽 가장자리: 툴팁을 왼쪽으로 정렬
   - 화살표 위치도 동적으로 조정
   - `index.css`: 고정 위치 스타일 제거, `max-width: calc(100vw - 24px)` 추가

#### 3. **버튼 반응형 개선**
   - `HeroSection.tsx`: 모바일에서 버튼 전체 너비 (`w-full sm:w-auto`)
   - `CTASection.tsx`: 반응형 텍스트 크기 (`text-lg sm:text-xl`), 모바일 전체 너비
   - 커밋: `db581ce`

#### 4. **Team 섹션 실제 Co-Founders로 업데이트**
   - 기존 가상 팀원 제거, 실제 Co-Founders 3명으로 변경:
     - **Ruca Lee**: AI 민주화와 정(情)의 가치를 세계에 전파하는 비전리더, AI/Blockchain Contract
     - **Patrick Ma**: 글로벌 커뮤니티 빌더, 다문화 커뮤니케이션 전문가
     - **Lion Kim**: 블록체인 토큰 비즈니스, 결제 시스템 스페셜리스트
   - "함께할 친절한 사람들을 찾고 있습니다" 섹션 추가
   - 채용 중인 역할 카드 4개 추가: CTO, Head of Product, Community Lead, AI Researcher
   - ko/en 번역 파일 업데이트
   - 커밋: `d72ef5a`

### ✅ 완료된 작업 (2026-01-24 - Session 17: Kindness Protocol 설계 토론)

#### 1. **FAQ 섹션 카테고리 필터 버그 수정**
   - `FAQSection.tsx`: 카테고리 버튼이 `<span>`에서 `<button>`으로 변경
   - `selectedCategory` state 추가
   - 필터 토글 기능 구현 (같은 카테고리 클릭 시 해제)

#### 2. **화이트페이퍼 도메인 변경**
   - `reference/whitepaper/` 전체 언어: `almaneo.foundation` → `almaneo.org`
   - 총 28개 파일 (14개 언어 × 2개 섹션)

#### 3. **화이트페이퍼 SNS 계정 추가**
   - Twitter: `@almaneo_org` (28개 파일)
   - Discord: `@almaneo` (28개 파일)

#### 4. **Kindness Protocol 설계 토론 완료** (아래 상세 내용)

### ✅ 완료된 작업 (2026-01-24 - Session 18: NEOS AI Hub 설계 토론)

#### 1. **NEOS AI Hub 전략 수립**
   - 기존 DePIN 자체 호스팅 → GAII 기반 파트너십 모델로 전환
   - AI 회사들과의 Win-Win 구조 설계
   - 파트너십 우선순위 결정: Google, Anthropic (Tier 1)

#### 2. **DePIN 노드 아키텍처 설계**
   - 노드 요구사항: RTX 3060급 (8GB VRAM)
   - 검증 방식: 신뢰 기반 (평판 + 슬래싱)
   - P2P 구조: 하이브리드 (코디네이터 + 분산 노드)
   - 노드 티어 4단계: Seedling, Sprout, Tree, Forest

#### 3. **AI 모델 호스팅 전략**
   - 호스팅: vLLM (PagedAttention)
   - 모델 배포: CDN + BitTorrent 하이브리드
   - 모델 티어 3단계: 무료, 프리미엄, 특수

#### 4. **GAII 리포트 활용 전략**
   - GAII Index 확장 계획 (4개 지표: Access, Affordability, Language, Skill)
   - 발행 로드맵: Q1 v1.0 → Q2 v1.5 → Q4 연간 리포트

#### 5. **AI Hub MVP 계획 수립**
   - 6주 개발 일정
   - 기술 스택: React + Firebase Cloud Functions + Firestore
   - 비용 예측: $100~$700/월

#### 6. **CLAUDE.md 토론 내용 문서화**
   - NEOS AI Hub 설계 섹션 추가 완료
   - 다음 세션 작업 목록 업데이트

---

## Kindness Protocol 설계 (Session 17)

### 핵심 철학

> "좋은 사람들이 만나 삶에 대해 이야기하고, 좋은 친구를 만드는 것 자체가 가치다"
>
> Proof of Humanity ≠ 단순한 봇 방지
> Proof of Humanity = 진정한 인간적 연결의 증명

### 검증 방식
- **Phase 1 (TGE ~ 6개월)**: 팀 직접 검증 (중앙화)
- **Phase 2 (6개월 ~ 1년)**: 하이브리드 (자동 + 팀)
- **Phase 3 (1년 이후)**: DAO 전환 (커뮤니티 투표)

### 점수 체계 (확정)

#### 밋업 활동 ⭐ (핵심)
| 활동 | 점수 |
|------|------|
| 첫 밋업 참가 | +50점 |
| 밋업 참가 | +30점 |
| 밋업 주최 | +80점 |
| 밋업 주최 (10명+) | +120점 |
| 월간 최다 주최 | +150점 |

#### 교육/멘토링 🎓
| 활동 | 점수 |
|------|------|
| 신규 사용자 온보딩 | +30점 |
| 1:1 멘토링 세션 | +40점 |
| 교육 콘텐츠 제작 | +50점 |
| 워크샵/세미나 진행 | +100점 |

#### 번역/로컬라이징 🌍
| 활동 | 점수 |
|------|------|
| 번역 기여 (1건) | +20점 |
| 지역 커뮤니티 리더 | +50점/월 |
| 새 언어 커뮤니티 개설 | +100점 |

#### 기부/봉사 💝
| 활동 | 점수 |
|------|------|
| 봉사 활동 인증 | +40점 |
| ALMAN 기부 | +20점 (상한선) |
| 자선 이벤트 주최 | +80점 |

#### 온라인/온체인/게임
- Twitter 공유: +5점/일
- Discord 도움: +10점
- 거버넌스 투표: +10점
- 스테이킹 유지: +1점/주
- 게임 퀘스트: +5~50점

### Ambassador SBT 티어

| 등급 | 조건 | 자동 발급 |
|------|------|----------|
| **Kindness Friend** | 첫 밋업 참가 | ✅ |
| **Kindness Host** | 밋업 3회 주최 | ✅ |
| **Kindness Ambassador** | 500점 달성 | ✅ |
| **Kindness Guardian** | 1,000점 + 추천인 10명 | ✅ |

### 밋업 인증 플로우

```
1. 밋업 생성 (호스트)
   → 일시, 장소, 주제, 최대 인원

2. 참가 신청 (참가자)
   → 지갑 주소 연결

3. 밋업 진행
   → 오프라인 만남!

4. 인증 제출 (24시간 내)
   → 단체 사진 업로드 (3명 이상)
   → 참가자 태그

5. 검증 (팀, Phase 1)
   → 사진 + 메타데이터 확인
   → 승인 시 점수 지급

6. 점수 지급
   → 호스트: +80점
   → 참가자: +30점
   → 첫 참가: +50점 (보너스)
```

### 기술 아키텍처

```
almaneo.org (Web 서버)
├─ /kindness (대시보드)
├─ /meetup (밋업 목록/생성)
├─ /meetup/[id] (밋업 상세)
├─ /ambassador (Ambassador 목록)
└─ /profile (내 Kindness Score)

Firebase
├─ Auth: Web3Auth 연동
├─ Firestore:
│   ├─ users/{address}/kindnessScore
│   ├─ meetups/{id}
│   ├─ meetupParticipants/{meetupId}/users
│   └─ ambassadors/{address}
└─ Storage: 밋업 사진

Blockchain (Polygon)
├─ JeongSBT (기존)
├─ AmbassadorSBT (신규)
└─ KindnessRegistry (수정)
```

### 별도 서비스: Kinfri P2P (향후)

> "세계의 친절한 친구들과 신뢰 기반 P2P 거래"

- Kindness + Friend = **Kinfri**
- ALMAN 토큰 결제 시 Kindness Score 획득
- Jeong-SBT 기반 신뢰도 시스템
- P2P 거래 완료 시 상호 평가 → 점수 획득

### MVP 구현 범위

**포함:**
- 오프라인 밋업 인증 시스템
- Ambassador SBT (점수 기반 자동)
- 확장된 점수 체계
- Web 서버 통합 (`/kindness`, `/meetup`)
- Firebase 인프라 (Firestore + Storage)

**제외 (Phase 2+):**
- 커뮤니티 검증 시스템
- 에어드롭 연동
- Kinfri P2P 무역

### 타입 정의 (shared/types/user.ts 추가)

```typescript
// Ambassador 티어
type AmbassadorTier = 'friend' | 'host' | 'ambassador' | 'guardian';

// 밋업 상태
type MeetupStatus = 'upcoming' | 'completed' | 'cancelled';

// 밋업 정보
interface Meetup {
  id: string;
  title: string;
  description: string;
  hostAddress: string;
  date: Timestamp;
  location: string;
  maxParticipants: number;
  status: MeetupStatus;
  photoUrl?: string;
  // ...
}

// 친절 활동 타입 (확장)
type KindnessActivityType =
  | 'meetup_attend' | 'meetup_host' | 'first_meetup'
  | 'mentoring' | 'onboarding' | 'education_content'
  | 'translation' | 'community_leader'
  | 'volunteer' | 'donation' | 'charity_event'
  | 'twitter_share' | 'discord_help' | 'referral'
  | 'governance_vote' | 'staking_weekly'
  | 'daily_quest' | 'weekly_mission' | 'monthly_challenge';
```

---

## NEOS AI Hub 설계 (Session 18)

### 핵심 전략 변경

#### 기존 계획 (DePIN 자체 호스팅)
- 시민들의 GPU 자원을 모아 분산형 AI 인프라 구축
- 높은 인프라 비용 ($50K+/월)
- 오픈소스 모델 품질 제한

#### 새로운 전략 (GAII Partnership Model)
- **기존 AI 회사들과 파트너십**을 통한 서비스 제공
- **GAII 데이터**를 협상 레버리지로 활용
- 이전 세대 모델(GPT-3.5, Claude Haiku 등) 기부/스왑 확보
- **하이브리드 접근**: 파트너 API (Primary) + DePIN (Fallback)

> **핵심 인사이트**: "높은 비용의 호스팅 대신, GAII를 활용하여 AI 회사들에게 한두 단계 낮은 모델을 기부받거나 ALMAN 토큰과 스왑하면, 더 좋은 서비스를 낮은 비용으로 제공할 수 있다"

### AI 파트너십 전략

#### Win-Win 구조
```
AI 회사 (OpenAI, Anthropic, Google 등)
  제공: 이전 세대 모델 API 크레딧

  ↕ Win-Win ↕

AlmaNEO
  제공:
  - ALMAN 토큰 (스왑)
  - GAII 데이터 & 리포트 (ESG 활용)
  - "AI 민주화 기여 기업" 인증
  - Kindness Expo 파트너 자격
```

#### 파트너십 우선순위
| 우선순위 | 회사 | 이유 |
|---------|------|------|
| **Tier 1** | Google | google.org 비영리 프로그램, Gemma 오픈소스 |
| **Tier 1** | Anthropic | Responsible AI 미션, Claude for Good |
| **Tier 2** | Mistral AI | 유럽 오픈소스 철학, Apache 2.0 |
| **Tier 2** | Cohere | Cohere For AI 비영리, 다국어 강점 |
| **Tier 3** | OpenAI | 대규모 조직, 높은 브랜드 인지도 |
| **Tier 3** | Meta AI | Llama 오픈소스 (자체 호스팅 필요) |

#### 접근 로드맵
- **Month 1-2**: GAII 리포트 v1.0 발행, Partnership Deck 제작
- **Month 3-4**: Google, Anthropic 접촉
- **Month 5-6**: Mistral, Cohere 확장
- **Month 7+**: 1차 파트너 결과 바탕으로 OpenAI 접근

### DePIN 노드 아키텍처 (백업용)

#### 선택된 사양
- **노드 요구사항**: 중간 수준 (8GB+ VRAM, RTX 3060급 권장)
- **검증 방식**: 신뢰 기반 (평판 시스템 + 스테이킹 슬래싱)
- **P2P 구조**: 하이브리드 (중앙 코디네이터 + 분산 컴퓨팅 노드)
- **보상 주기**: 매일 (일괄 보상)

#### 노드 티어 및 스테이킹
| 티어 | 스테이킹 양 | 작업 우선순위 | 보상 배율 |
|------|-----------|-------------|----------|
| Seedling (새싹) | 1,000 ALMAN | 낮음 | 1.0x |
| Sprout (싹) | 10,000 ALMAN | 중간 | 1.2x |
| Tree (나무) | 50,000 ALMAN | 높음 | 1.5x |
| Forest (숲) | 100,000 ALMAN | 최우선 | 2.0x |

#### 슬래싱 조건
- 응답 지연 (5x 초과): 스테이킹 1% 몰수
- 잘못된 응답 (검증 실패): 스테이킹 5% 몰수
- 악의적 행동: 스테이킹 전액 몰수

#### 일일 보상 공식
```
노드 일일 보상 = (노드 기여도 / 전체 기여도) × 일일 풀 × 품질 계수
품질 계수 = (평균 응답 품질 / 100) × (1 + 평판 보너스)
평판 보너스 = min(reputation / 1000, 0.2)  // 최대 20%
```

### AI 모델 호스팅 전략

#### 선택된 기술
- **호스팅**: vLLM (PagedAttention, 고성능 추론)
- **모델 배포**: CDN + BitTorrent (하이브리드)

#### 모델 티어
| 티어 | 모델 | 용도 | 접근 |
|------|------|------|------|
| **Tier 1 (무료)** | Llama 3.1 8B, Gemma 2 9B, Phi-3 | 기본 대화 | 모든 사용자 |
| **Tier 2 (프리미엄)** | Llama 3.1 70B, Qwen 2.5 72B | 고품질 | ALMAN 결제 |
| **Tier 3 (특수)** | CodeLlama, Stable Diffusion | 전문 용도 | ALMAN 프리미엄 |

#### 다국어 전략
- 동남아시아 (베트남어, 태국어): Qwen 2.5 권장
- 남아시아 (힌디어, 벵골어): Llama 3.1 + LoRA
- 아프리카 (스와힐리어): Gemma 2 + 커뮤니티 파인튜닝

### GAII 리포트 활용 전략

#### GAII가 핵심 자산인 이유
1. **유일무이한 데이터**: AI 불평등을 정량화한 유일한 지표
2. **협상력 (Leverage)**: AI 회사들에게 "문제의 증거" 제공
3. **파트너십 대가 (Currency)**: GAII 리포트 공동 발행권 제공

#### GAII Index 확장 계획 ✅ (Session 19에서 구현 완료)
```
GAII = 100 - (0.4×Access + 0.3×Affordability + 0.2×Language + 0.1×Skill)

- Access (40%): AI 서비스 보급률, 인프라 품질
- Affordability (30%): 구독료/소득 비율, 무료 서비스 가용성
- Language (20%): 현지 언어 AI 품질, 번역 정확도
- Skill (10%): AI 리터러시, STEM 교육 수준

구현 파일:
- web/src/data/gaii/schema.ts - GAIIIndicators 인터페이스
- web/src/data/gaii/countries-v1.ts - 50개국 데이터
- web/src/data/gaii/report.ts - 리포트 생성 로직
- web/src/pages/GAIIReport.tsx - 리포트 UI (/gaii-report)
```

#### 발행 로드맵
- **Q1 2026**: ✅ GAII Report v1.0 (50개국, 파트너십 협상용) - Session 19 구현 완료
- **Q2 2026**: GAII Report v1.5 (100개국, 첫 파트너 공동 발행)
- **Q4 2026**: GAII Report 2026 (150개국, Kindness Expo 발표)
- **2027+**: World Bank, UNDP 협력, SDG 지표 연계

### NEOS AI Hub MVP 계획

#### MVP 범위
**포함 (Must Have)**:
- 웹 기반 AI 채팅 인터페이스
- Web3Auth 로그인 (소셜 + 지갑)
- 일일 무료 쿼터 (50회/일)
- 1개 AI 모델 (파트너 API 또는 Llama 3.1 8B)
- 기본 다국어 UI (한국어, 영어, 베트남어)
- GAII 대시보드 연동

**제외 (Phase 2)**:
- ALMAN 토큰 결제
- DePIN 노드 네트워크
- 추가 모델 (코딩, 이미지)
- 모바일 앱

#### 기술 스택
- **Frontend**: React + Vite + TypeScript (기존 web/ 통합)
- **Backend**: Firebase Cloud Functions
- **DB**: Firestore
- **AI Primary**: Partner API (협상 결과에 따라)
- **AI Fallback**: Ollama + Llama 3.1

#### 개발 일정 (6주)
- **Week 1-2**: Firebase 설정, API 엔드포인트, AI 연동
- **Week 3-4**: 프론트엔드 UI, 채팅 컴포넌트
- **Week 5**: 통합, 다국어, 테스트
- **Week 6**: 배포, 베타 테스터 모집

#### 비용 예측
| 항목 | 월 비용 |
|------|--------|
| Firebase | $25~50 |
| Cloud Functions | ~$50 |
| 파트너 API | $0 (기부) ~ $500 |
| 자체 호스팅 (백업) | ~$100 |
| **총계** | **$100~$700** |

### DePIN 스마트 컨트랙트 (신규)

#### 새로 필요한 컨트랙트
1. **NodeRegistry.sol**: 노드 등록, 스테이킹, 평판 관리
2. **RewardDistributor.sol**: 일일 보상 배분
3. **SlashingManager.sol**: 페널티 집행

#### NodeRegistry 주요 기능
```solidity
struct Node {
    address owner;
    uint256 stakedAmount;
    uint256 reputation;        // 0-1000
    string hardwareSpec;
    string region;
    bool isActive;
}

function registerNode(hardwareSpec, region) external payable;
function deactivateNode() external;
function updateReputation(node, delta) external onlyCoordinator;
```

### 핵심 결정 사항 요약

| 항목 | 결정 | 이유 |
|------|------|------|
| **AI 서비스 방식** | 하이브리드 (파트너 + DePIN) | 비용 절감 + 품질 보장 |
| **주요 전략** | GAII 기반 파트너십 | 유일무이한 데이터 레버리지 |
| **노드 요구사항** | 중간 (RTX 3060급) | 접근성과 성능 균형 |
| **검증 방식** | 신뢰 기반 (평판 + 슬래싱) | 낮은 오버헤드 |
| **P2P 구조** | 하이브리드 (코디네이터 + 노드) | 초기 안정성 |
| **보상 주기** | 매일 | 사용자 참여 유도 |
| **호스팅** | vLLM | 고성능, 배치 처리 |
| **모델 배포** | CDN + BitTorrent | 빠른 초기 + P2P 확산 |
| **우선 파트너** | Google, Anthropic | CSR 관심, 기술 적합성 |

---

### ✅ 완료된 작업 (2026-01-24 - Session 19: GAII Report v1.0 구현)

#### 1. **GAII 스키마 확장 (4개 지표)**
   - `web/src/data/gaii/schema.ts` - `GAIIIndicators` 인터페이스 추가
   - **Access (40%)**: AI 채택률, 인터넷 보급률, 모바일 연결성, 인프라 품질
   - **Affordability (30%)**: AI 비용/소득 비율, 무료 서비스 접근성, 구매력
   - **Language (20%)**: 현지 언어 지원, 번역 품질, 콘텐츠 가용성
   - **Skill (10%)**: AI 리터러시, STEM 교육, 디지털 역량
   - 새 GAII 공식: `GAII = 100 - (0.4×Access + 0.3×Affordability + 0.2×Language + 0.1×Skill)`

#### 2. **50개국 핵심 데이터**
   - `web/src/data/gaii/countries-v1.ts` - 50개국 상세 데이터
   - 지역별 분포: 북미(3), 유럽(12), 동아시아(5), 남아시아(4), 동남아(8), 중남미(6), 중동(6), 아프리카(4), 오세아니아(2)
   - 각 국가별 4개 지표 + 세부 항목 데이터 포함

#### 3. **GAII Report 데이터 구조**
   - `web/src/data/gaii/report.ts` - 리포트 생성 로직
   - Executive Summary, Regional Analysis, Country Rankings
   - Key Insights (5개), Policy Recommendations (6개)
   - Methodology, Data Sources 정보

#### 4. **GAII Report 페이지**
   - `web/src/pages/GAIIReport.tsx` - 리포트 UI 컴포넌트
   - 라우트: `/gaii-report`
   - 컴포넌트: StatCard, CountryRankingTable, RegionCard, InsightCard, RecommendationCard

#### 5. **네비게이션 연동**
   - Header Platform 메뉴에 "GAII Report v1.0" 링크 추가 (New 뱃지)
   - ko/en common.json에 `nav.gaiiReport`, `common.new` 키 추가
   - `nav.aiHub`를 "AlmaNEO AI Hub"로 변경 (NEOS → AlmaNEO)

---

### ✅ 완료된 작업 (2026-01-24 - Session 20: GAII Report PDF 다운로드 기능)

#### 1. **GAII Report Data Sources 공식 웹 링크 추가**
   - `web/src/data/gaii/report.ts` - 4개 데이터 소스에 URL 추가
   - Microsoft Global AI Adoption Report: https://www.microsoft.com/en-us/corporate-responsibility/topics/ai-economy-institute/reports/global-ai-adoption-2025/
   - World Bank Development Indicators: https://databank.worldbank.org/source/world-development-indicators
   - ITU ICT Statistics: https://datahub.itu.int/
   - UNESCO Education Data: https://uis.unesco.org/

   - `web/src/pages/GAIIReport.tsx` - Data Sources 섹션 UI 개선
   - `<div>` → `<a>` 태그로 변경 (클릭 가능)
   - 외부 링크 아이콘 추가
   - 호버 효과 추가

#### 2. **GAII Report PDF 다운로드 기능 구현**
   - `@react-pdf/renderer` 패키지 설치
   - `web/src/components/pdf/GAIIReportPDF.tsx` - PDF 문서 컴포넌트 (8페이지)
     - Cover Page (타이틀, 버전, 발행일)
     - Executive Summary (글로벌 통계, Key Findings)
     - Country Rankings (1-25, 26-50)
     - Regional Analysis (10개 지역)
     - Key Insights (5개 인사이트)
     - Policy Recommendations (6개 권고)
     - Methodology & Data Sources
   - `web/src/components/pdf/index.ts` - Export 파일
   - `web/src/pages/GAIIReport.tsx` - PDFDownloadLink 연동
     - Lazy loading으로 성능 최적화
     - 로딩 상태 UI (스피너 + 텍스트)
     - 파일명: `GAII-Report-v1.0.pdf`

#### 3. **PDF Regional Analysis 텍스트 겹침 버그 수정**
   - `regionCard`: padding 증가, minHeight 추가
   - `regionName`: maxWidth 70% 제한
   - 각 요소 사이 margin 증가
   - `wrap={false}` 추가 (페이지 경계에서 끊김 방지)

---

### ✅ 완료된 작업 (2026-01-24 - Session 21: Firebase → Supabase 마이그레이션)

#### 1. **Firebase Hosting → Vercel 마이그레이션**
   - Google 계정 차단으로 인해 Firebase에서 Vercel로 전환
   - `web/vercel.json`, `nft/vercel.json` 생성 (SPA 라우팅 설정)
   - `.npmrc` 추가 (`legacy-peer-deps=true` - React 19 호환)
   - GitHub 자동 배포 설정 완료

#### 2. **Firebase → Supabase 백엔드 마이그레이션**
   - Supabase 프로젝트 생성 (Seoul 리전)
   - Supabase CLI로 DB 스키마 마이그레이션 실행
   - `@supabase/supabase-js` 패키지 설치
   - `firebase` 패키지 제거

#### 3. **DB 스키마 생성** (`supabase/migrations/`)
   - `users`: 사용자 정보 (wallet_address, nickname, kindness_score 등)
   - `game_states`: 게임 상태 (points, energy, upgrades 등)
   - `kindness_activities`: 친절 활동 기록
   - `meetups`: 밋업 정보
   - `meetup_participants`: 밋업 참가자
   - `nft_listings`: NFT 리스팅
   - `leaderboard`: 리더보드 뷰
   - RLS 정책 및 인덱스 설정

#### 4. **코드 마이그레이션**
   - `web/src/firebase.ts` 삭제
   - `web/src/supabase.ts` 생성 (클라이언트 + 타입 정의)
   - `web/src/hooks/useUserData.ts` Supabase 버전으로 재작성
   - Supabase Realtime 구독 연동

#### 5. **배포 완료**
   - Web: https://almaneo.org (Vercel) ✅
   - NFT: https://nft.almaneo.org (Vercel) ✅

---

### ✅ 완료된 작업 (2026-01-24 - Session 22: Kindness Protocol MVP 구현)

#### 1. **서비스 레이어 생성** (`web/src/services/`)
   - `meetup.ts` - 밋업 CRUD, 참가/탈퇴, 검증 로직
     - `createMeetup`, `getMeetups`, `getMeetupById`, `updateMeetup`, `deleteMeetup`
     - `joinMeetup`, `leaveMeetup`, `getMeetupParticipants`
     - `submitMeetupVerification`, `verifyMeetup` (Admin용)
     - `MEETUP_POINTS` 상수 (host: 80, attend: 30, firstTime: 50)
   - `kindness.ts` - Kindness 활동, 점수 계산, 리더보드
     - `addKindnessActivity`, `getUserKindnessActivities`
     - `getUserKindnessScore`, `calculateAmbassadorTier`
     - `getKindnessLeaderboard`, `getActivityStats`
     - `ACTIVITY_POINTS`, `AMBASSADOR_TIERS` 상수
   - `index.ts` - Export 파일

#### 2. **커스텀 훅 생성** (`web/src/hooks/`)
   - `useMeetups.ts` - 밋업 데이터 관리
     - Returns: `meetups`, `myHostedMeetups`, `currentMeetup`, `isParticipating`, `participants`, `actions`
     - Actions: `create`, `update`, `delete`, `join`, `leave`, `submitVerification`, `verify`
   - `useKindness.ts` - Kindness 데이터 관리
     - Returns: `kindnessStats`, `activities`, `activityStats`, `leaderboard`, `actions`
     - Helper: `getTierColor`, `getTierBgColor`, `getTierIcon`

#### 3. **페이지 컴포넌트 생성** (`web/src/pages/`)
   - `Kindness.tsx` - 대시보드 (`/kindness`)
     - Kindness Score 원형 게이지
     - Ambassador 티어 배지
     - 최근 활동 내역
     - 내가 주최한 밋업
     - 리더보드 Top 10
   - `MeetupList.tsx` - 밋업 목록 (`/meetup`)
     - 검색 및 상태 필터 (전체/예정/완료)
     - 밋업 카드 그리드
     - 새 밋업 만들기 버튼
   - `MeetupDetail.tsx` - 밋업 상세 (`/meetup/:id`)
     - 밋업 정보 표시
     - 참가/탈퇴 버튼
     - 참가자 목록
     - 호스트용 검증 제출 (사진 업로드 + 참가자 태그)
   - `MeetupCreate.tsx` - 밋업 생성 (`/meetup/new`)
     - 폼 유효성 검사
     - 날짜/시간 선택
     - 위치, 최대 인원 설정

#### 4. **라우팅 및 네비게이션 업데이트**
   - `App.tsx` - 4개 라우트 추가
     ```
     /kindness → Kindness.tsx
     /meetup → MeetupList.tsx
     /meetup/new → MeetupCreate.tsx
     /meetup/:id → MeetupDetail.tsx
     ```
   - `Header.tsx` - Platform 메뉴 업데이트
     - Kindness Protocol: "Coming Soon" 뱃지 제거, `/kindness` 링크
     - Meetups: 새 메뉴 추가 (`/meetup`, "New" 뱃지)

#### 5. **타입 정의 수정**
   - `shared/types/user.ts` - Firebase 의존성 제거
     - `Timestamp` → `string` (ISO 8601) 변경
     - Supabase 호환 타입으로 전환

#### 6. **i18n 번역 추가**
   - `ko/common.json`: `"meetups": "밋업"`
   - `en/common.json`: `"meetups": "Meetups"`

#### 7. **빌드 성공**
   - TypeScript 컴파일 완료
   - 모든 unused import 정리
   - type-only import 문법 적용

---

### ✅ 완료된 작업 (2026-01-24 - Session 23: Supabase Storage 설정)

#### 1. **Supabase Storage 마이그레이션 생성**
   - `supabase/migrations/20260124100000_storage_setup.sql`
   - `meetup-photos` 버킷 생성 (공개, 5MB 제한)
   - 허용 파일 형식: JPEG, PNG, WebP, GIF
   - Storage RLS 정책 (읽기/업로드/수정/삭제)
   - `meetups` 테이블에 검증 컬럼 추가 (`verified`, `verified_at`, `verified_by`, `verification_notes`)

#### 2. **Storage 서비스 구현**
   - `web/src/services/storage.ts` 생성
   - `uploadPhotoToStorage()` - Storage 업로드
   - `deleteMeetupPhoto()` - 사진 삭제
   - `getMeetupPhotos()` - 밋업 사진 목록
   - `validateImageFile()` - 파일 유효성 검사 (크기, 형식)
   - `createPreviewUrl()` / `revokePreviewUrl()` - 미리보기 관리

#### 3. **MeetupDetail.tsx 이미지 업로드 개선**
   - 이미지 유효성 검사 (크기, 형식)
   - 업로드 전 미리보기 표시
   - 에러 메시지 표시
   - 파일 크기 표시

#### 4. **Supabase 마이그레이션 적용**
   - `npx supabase db push` 실행
   - meetup-photos 버킷 및 RLS 정책 적용 완료

#### 5. **Git 커밋 & 푸시**
   - 커밋: `393b141` - feat(web): Implement Kindness Protocol MVP with meetup system
   - 20개 파일, +3,192줄 변경

---

### ✅ 완료된 작업 (2026-01-25 - Session 24: AI Hub MVP 구현)

#### 1. **DB 스키마 생성**
   - `supabase/migrations/20260124200000_ai_hub_setup.sql`
   - `ai_hub_conversations` - 대화 테이블
   - `ai_hub_messages` - 메시지 테이블
   - `ai_hub_quota` - 일일 쿼터 테이블
   - RLS 정책 및 트리거 설정
   - `check_and_increment_quota()` RPC 함수

#### 2. **서비스 레이어 구현**
   - `web/src/services/aiHub.ts` - AI Hub 서비스
   - 대화 CRUD: `getConversations`, `createConversation`, `deleteConversation`
   - 메시지 관리: `addMessage`, `getMessages`
   - 쿼터 관리: `checkAndIncrementQuota`, `getQuotaStatus`
   - Supabase 타입 추가: `DbConversation`, `DbMessage`, `DbQuota`

#### 3. **API 엔드포인트 생성**
   - `web/api/chat.ts` - Vercel Edge Function
   - Google Gemini API 연동 (gemini-2.0-flash 모델)
   - SSE 스트리밍 응답 지원
   - 시스템 프롬프트 (다국어 응답)

#### 4. **커스텀 훅 구현**
   - `web/src/hooks/useAIHub.ts`
   - 대화/메시지/쿼터 상태 관리
   - 스트리밍 응답 처리
   - 중단 기능 (AbortController)

#### 5. **UI 컴포넌트 구현**
   - `web/src/components/aihub/` 폴더 생성
   - `ChatMessage.tsx` - 메시지 표시
   - `ChatInput.tsx` - 입력창 + 전송 버튼
   - `ConversationList.tsx` - 대화 목록 사이드바
   - `QuotaBar.tsx` - 일일 쿼터 표시
   - `WelcomeScreen.tsx` - 환영 화면
   - `web/src/pages/AIHub.tsx` - 메인 페이지

#### 6. **라우팅 및 네비게이션**
   - `/ai-hub` 라우트 추가
   - Header에서 "Coming Soon" → "New" 뱃지로 변경

#### 7. **i18n 번역**
   - ko/en landing.json에 `aiHub` 섹션 추가
   - 60+ 번역 키 (quota, welcome, features, suggestions, errors 등)

#### 8. **환경변수**
   - `GEMINI_API_KEY` - Vercel 환경변수 설정 필요

---

### ✅ 완료된 작업 (2026-01-25 - Session 25: AI Hub 배포 및 버그 수정)

#### 1. **AI Hub 배포 준비**
   - Supabase 마이그레이션 확인 (이미 적용됨)
   - 빌드 테스트 성공 (33초)
   - Vercel 환경변수 설정 완료 (`GEMINI_API_KEY`)

#### 2. **외래키 제약 버그 수정**
   - 문제: 새 사용자가 AI Hub 접근 시 `users` 테이블에 레코드 없어서 외래키 제약 위반
   - 해결: `ensureUserExists()` 함수 추가 - 사용자 자동 생성
   - `createConversation`, `incrementQuotaManually`에서 호출
   - 커밋: `a435090`

#### 3. **Supabase 406 에러 수정** (미커밋)
   - 문제: `.single()` 사용 시 행이 없으면 406 에러 발생
   - 해결: `.single()` → `.maybeSingle()` 변경
   - 수정 파일: `web/src/services/aiHub.ts`
     - `ensureUserExists()`: `.maybeSingle()`
     - `getQuota()`: `.maybeSingle()`

#### 4. **Gemini 모델 변경** (미커밋)
   - 문제: `gemini-2.0-flash` 모델이 존재하지 않아 429 에러
   - 해결: `gemini-2.5-flash-lite`로 변경 (RPM 10, 가장 높은 요청 제한)
   - 수정 파일:
     - `web/api/chat.ts`: `GEMINI_MODEL = 'gemini-2.5-flash-lite'`
     - `web/src/services/aiHub.ts`: `DEFAULT_MODEL = 'gemini-2.5-flash-lite'`

#### 5. **Google AI Studio 모델 정보** (참고)
   | 모델 | RPM | TPM | RPD |
   |------|-----|-----|-----|
   | gemini-2.5-flash-lite | 10 | 250K | 20 |
   | gemini-2.5-flash | 5 | 250K | 20 |
   | gemini-3-flash | 5 | 250K | 20 |

---

### ✅ 완료된 작업 (2026-01-25 - Session 26: AmbassadorSBT 컨트랙트 개발)

#### 1. **AmbassadorSBT 스마트 컨트랙트 개발**
   - `blockchain/contracts/AmbassadorSBT.sol` 작성
   - ERC-721 Soulbound Token (양도 불가)
   - UUPS Upgradeable 패턴
   - 4개 티어: Friend, Host, Ambassador, Guardian
   - 활동 기반 자동 발급 (밋업 참가, 주최, 점수, 추천인)

#### 2. **티어 조건**
   | 티어 | 조건 |
   |------|------|
   | Friend | 첫 밋업 참가 (1회) |
   | Host | 밋업 3회 주최 |
   | Ambassador | Kindness Score 500점 |
   | Guardian | 1,000점 + 추천인 10명 |

#### 3. **주요 기능**
   - `recordMeetupAttendance()`: 밋업 참가 기록 (SBT 없으면 자동 발급)
   - `recordMeetupHosted()`: 밋업 주최 기록
   - `updateKindnessScore()`: Kindness Score 업데이트
   - `recordReferral()`: 추천인 기록
   - `getNextTierRequirements()`: 다음 티어 달성 조건 조회

#### 4. **Polygon Amoy 배포**
   - 컨트랙트 주소: `0xf368d239a0b756533ff5688021A04Bc62Ab3c27B`
   - 배포 스크립트: `blockchain/scripts/deploy-ambassador.js`

#### 5. **프론트엔드 연동**
   - `web/src/contracts/addresses.ts`: AmbassadorSBT 주소 추가
   - `web/src/contracts/abis/AmbassadorSBT.ts`: ABI + 타입 정의
   - `shared/contracts/addresses.ts`: 주소 추가
   - `shared/types/contracts.ts`: ContractAddresses 인터페이스 업데이트

#### 6. **빌드 테스트 성공** (32.82초)

---

### ✅ 완료된 작업 (2026-01-25 - Session 27: useAmbassadorSBT 훅 & SNS URL 업데이트)

#### 1. **useAmbassadorSBT 훅 개발 완료**
   - `web/src/hooks/useAmbassadorSBT.ts` 생성
   - 온체인 Ambassador 데이터 조회 (티어, 밋업 통계, Kindness Score, 추천인)
   - 다음 티어 요구사항 조회 (`getNextTierRequirements`)
   - 컨트랙트 상수 조회 (티어별 조건, 총 발급량)
   - 티어별 색상/배경/아이콘 헬퍼 함수
   - `hooks/index.ts`에 export 추가

#### 2. **Kindness 페이지 온체인 Ambassador 정보 표시**
   - `web/src/pages/Kindness.tsx` 업데이트
   - Ambassador SBT 카드 섹션 추가 (On-chain 뱃지)
   - 온체인 통계 표시 (밋업 참가/주최, Kindness Score, 추천인)
   - 다음 티어 진행률 및 요구사항 표시
   - Explorer 링크 연동
   - 컨트랙트 총 발급량 표시

#### 3. **SNS URL 실제 주소로 업데이트**
   | 플랫폼 | URL | 위치 |
   |--------|-----|------|
   | Twitter/X | https://x.com/almaneo_org | Hero, Header, CTA |
   | Discord | https://discord.gg/JkRNuj7aYd | Hero, Header, CTA |
   | TikTok | https://www.tiktok.com/@almaneo | Hero, CTA |
   | GitHub | https://github.com/almaneo | Header, CTA |
   | Blog (Medium) | https://medium.com/@news_15809 | Header |

   - **숨김 처리**: Telegram, YouTube (미정)
   - **Header 메뉴 변경**: "문서(Docs)" → "블로그(Blog)"
   - **번역 파일**: `nav.blog` 키 추가 (ko/en)

#### 4. **SNS 아이콘 통일**
   - Hero 섹션 팝업과 CTA 섹션의 아이콘을 동일한 커스텀 SVG로 통일
   - TwitterXIcon, DiscordIcon, TiktokIcon, GithubIcon

#### 5. **Git 커밋 & 푸시**
   - 커밋: `e36585b` - feat(web): Add useAmbassadorSBT hook and update SNS links
   - 8개 파일, +551줄 변경

---

### ✅ 완료된 작업 (2026-01-25 - Session 28: AI Hub 멀티모델 지원)

#### 1. **Groq + Llama 3.3 70B 모델 추가**
   - `web/api/chat.ts` - Groq API 핸들러 추가 (OpenAI 호환 형식)
   - `web/src/services/aiHub.ts` - AI_MODELS 상수, AIModelId 타입 추가
   - `web/src/hooks/useAIHub.ts` - 모델 선택 상태 관리 (currentModel, setModel)
   - `web/src/pages/AIHub.tsx` - 모델 선택 드롭다운 UI 구현

#### 2. **지원 모델**
   | 모델 | 제공자 | 특징 |
   |------|--------|------|
   | ✨ Gemini 2.5 Flash Lite | Google | 빠르고 효율적 |
   | 🦙 Llama 3.3 70B | Groq | 강력한 오픈소스, 다국어 우수 |

#### 3. **환경변수 추가**
   - `GROQ_API_KEY` - Groq API 키
   - Vercel 환경변수 설정 필요

#### 4. **Git 커밋 & 푸시**
   - 커밋: `7a12363` - feat(web): Add Groq Llama 3.3 70B model to AI Hub
   - 4개 파일, +439줄 변경

---

### ✅ 완료된 작업 (2026-01-25 - Session 29: Kindness Protocol 백엔드 연동)

#### 1. **Ambassador API Route 생성**
   - `web/api/ambassador.ts` - Vercel Serverless Function
   - AmbassadorSBT 컨트랙트 연동 (ethers.js)
   - 지원 액션:
     - `recordMeetupVerification`: 밋업 검증 완료 시 참가자/호스트 기록
     - `updateKindnessScore`: Kindness Score 업데이트
     - `recordReferral`: 추천인 기록

#### 2. **meetup.ts 온체인 연동**
   - `submitMeetupVerification()` 함수에 API 호출 추가
   - 밋업 검증 완료 시 자동으로 AmbassadorSBT 컨트랙트 호출
   - 오프체인 처리 성공 후 온체인 기록 (실패해도 오프체인은 유지)

#### 3. **Verifier 전용 지갑 생성 (보안 강화)**
   - 별도 Verifier 지갑 생성하여 역할 분리
   - `blockchain/scripts/grant-verifier-role.js` 스크립트 작성
   - VERIFIER_ROLE 부여 완료 (tx: `0x6093c7e7...`, block #32838625)

   **지갑 구조:**
   | 지갑 | 주소 | 역할 |
   |------|------|------|
   | Foundation | `0x7BD8194c22b79B0BBa6B2AFDfe36c658707024FE` | DEFAULT_ADMIN, MINTER, UPGRADER |
   | Verifier | `0x30073c2f47D41539dA6147324bb9257E0638144E` | VERIFIER_ROLE만 |

#### 4. **환경변수 설정**
   ```
   VERIFIER_PRIVATE_KEY=<Verifier 지갑 개인키>
   CHAIN_ID=80002 (Polygon Amoy, 기본값)
   ```

#### 5. **빌드 테스트 성공** (39.55초)

#### 6. **Git 커밋**
   - 커밋: `d5466ac` - feat(web): Add Ambassador API for on-chain meetup verification
   - 5개 파일, +408줄 변경

---

### ✅ 완료된 작업 (2026-01-25 - Session 30: 웹사이트 점검 및 작업 정리)

#### 1. **전체 웹사이트 점검 완료**
   - Landing, GAII, AI Hub, Kindness, Meetup, Whitepaper: ✅ 정상 작동
   - Dashboard: ⚠️ 토큰 잔액 하드코딩 ('0')
   - Staking/Governance: ⚠️ 컨트랙트 연동됨, Mock 데이터 혼재
   - Airdrop: ❌ 컨트랙트 연동 없음 (useAirdrop 훅 필요)
   - Game 서버: ❌ 미배포 (Firebase 의존성)

#### 2. **Vercel 환경변수 설정 완료** (사용자 수동)
   - `VERIFIER_PRIVATE_KEY` 설정 완료
   - `GROQ_API_KEY` 설정 완료
   - Verifier 지갑에 POL 토큰 전송 완료

---

### ✅ 완료된 작업 (2026-01-25 - Session 31: Dashboard & Airdrop 컨트랙트 연동)

#### 1. **Dashboard 토큰 잔액 조회 구현**
   - `web/src/hooks/useTokenBalance.ts` 훅 생성
   - ALMANToken.balanceOf() 온체인 조회
   - Dashboard.tsx에서 실제 잔액 표시 (하드코딩 '0' → 온체인 데이터)
   - NEOS → ALMAN 브랜딩 업데이트

#### 2. **Airdrop 컨트랙트 연동**
   - `web/src/contracts/abis/KindnessAirdrop.ts` ABI 파일 생성
   - `web/src/hooks/useAirdrop.ts` 훅 생성
     - 캠페인 목록 조회 (`getCampaignInfo`)
     - 사용자 클레임 정보 (`getUserInfo`)
     - 클레임 여부 확인 (`hasClaimed`)
     - Merkle Proof 클레임 (`claim`)
   - `web/src/pages/Airdrop.tsx` 컨트랙트 연동
     - 온체인 캠페인 목록 표시
     - 사용자 클레임 통계 (Total Claimed, Daily Claimed, Remaining Limit)
     - 활성/종료/예정 캠페인 상태 표시
     - 오프체인 태스크 카테고리 (추후 연동용)

#### 3. **Git 커밋**
   - 커밋: `8f19ae8` - feat(web): Add token balance and airdrop contract integration
   - 7개 파일, +799줄, -137줄

---

### ✅ 완료된 작업 (2026-01-26~28 - Session 32~48: 게임 세계문화여행 업그레이드)

> 상세 기록: `.claude/GAME_UPDATE.md` 참조

#### 1. **Kindness Game → 세계문화여행 게임 업그레이드** ✅
   - 기존 Tap-to-Earn Kindness Game을 세계문화여행(World Culture Travel) 게임으로 전면 업그레이드
   - 기술 스택: Next.js 14 + TypeScript + MUI + Framer Motion + Zustand + Supabase
   - 배포: https://game.almaneo.org (Vercel)

#### 2. **세계문화여행 시스템 (20개국, ~58 퀘스트)** ✅
   - 8개 지역: 동아시아, 동남아시아, 남아시아, 중동, 유럽, 아프리카, 아메리카, 오세아니아
   - 20개국: KR, JP, CN, TH, VN, ID, IN, NP, TR, AE, FR, GB, DE, IT, ZA, KE, US, CA, BR, MX, AU, NZ
   - 4종 퀘스트: Cultural Scenario, Trivia Quiz, History Lesson, Cultural Practice
   - 별 시스템: 국가당 3별 (50% 완료, 100% 완료, 올 퍼펙트)
   - 지역 언락: 브라우저 locale 기반 시작 지역 + 별 달성 시 다음 지역 해금

#### 3. **모바일 UI 전면 리디자인** ✅
   - 가로모드 강제 → 세로모드(Portrait) 지원으로 전환
   - 5탭 이모지 네비바: 🏠 Home | 🌍 Travel | 📋 Quest | ⬆️ Upgrade | ☰ More
   - More 바텀시트 메뉴 (MUI Drawer): Achievement, Ranking, Token Mining, Story 등
   - 상단 HUD 간결화: 포인트 | 에너지 | 레벨 | 지갑만 표시
   - 360x740 모바일 뷰포트 최적화 (Samsung 기준)
   - Blue(`#0052FF`) → Gold(`#FFD700`) 테마 통일 (전체 컴포넌트)

#### 4. **스토리 팝업 & 타이틀 이미지** ✅
   - StoryIntro: 카드형 모달 (480px, 1:1 이미지 + 하단 타이핑 텍스트)
   - 새 5장 스토리 (AI 민주화 테마, .webp 이미지)
   - StartScreen/LoadingScreen: `almaneo-title.webp` 타이틀 이미지 적용

#### 5. **기존 시스템 연동** ✅
   - travel 업적 10개 + 일일 퀘스트 4개 (tap/points/upgrade/travel)
   - useGameStore ↔ useTravelStore 크로스 연동 (저장/로드/통계 동기화)
   - Supabase: `travel_state` JSONB 컬럼 추가 (game_states 테이블)
   - kindnessData.ts: 국가 데이터에서 cultural_scenario 동적 추출

#### 6. **퀘스트 콘텐츠 DB 마이그레이션** ✅
   - 하드코딩 데이터 → Supabase DB (regions, countries, quests, content_translations)
   - contentService.ts: 5개 병렬 쿼리 + 메모리/localStorage 캐시 (1시간 TTL)
   - 영어/한국어 번역 시드 완료 (170개 content_translations 레코드)
   - 콘텐츠 어필 시스템 (AppealButton + AppealHistory)

#### 7. **Game i18n (한국어/영어)** ✅
   - react-i18next 연동 (~200 번역 키)
   - ~25개 컴포넌트에 t() 함수 적용
   - 데이터 파일 키 기반 변환 (constants, quests, achievements, story 등)
   - MoreMenu에서 🌐 Language 토글 (한국어 ↔ English)

#### 8. **모바일 레이아웃 버그 수정** ✅
   - 하단 네비바 가시성: `100vh` → `100dvh` + flex 레이아웃 전환
   - 홈 화면 시나리오 카드 오른쪽 잘림: `absolute+transform` → flexbox 중앙 정렬 + body safe-area 패딩 제거
   - 퀘스트 결과 팝업 중앙 정렬: 12회 시도 끝 해결 (CSS containment 이슈)

#### 9. **주요 커밋**
   - `9f36567` - feat(game): World Culture Travel upgrade with UI fixes
   - `9b8de21` - fix(game): Make bottom navbar always visible on mobile
   - `a3621e5` - feat(game): Add Korean quest translations for 58 quests
   - `4dfefff` - fix(game): Fix quest language binding and lift result popup
   - `5cb8d9e` - fix(game): Use fullScreen Dialog for popup centering
   - `6e748bc` - fix(game): Fix home screen scenario card right-side cutoff on mobile

---

### ✅ 완료된 작업 (2026-01-28 - Session 49: 모바일 반응형 최적화 & UX 수정)

#### 1. **모바일 반응형 최적화 (5그룹, ~20개 파일)**
   - **Group 1 - Global CSS Foundation**: `index.css` 섹션 패딩/폰트 반응형, `GlassCard.tsx` padding variants 반응형
   - **Group 2 - Link & Button Fixes**: HeroSection 게임 버튼 수정, Whitepaper PDF 링크, Governance disabled 버튼
   - **Group 3 - Landing Section Responsive**: TokenomicsSection, ProblemSection, EcosystemSection, FAQSection, TeamSection, PartnersSection, RoadmapSection, SolutionSection, PhilosophySection gap/spacing 축소
   - **Group 4 - Page-Level Fixes**: GAII.tsx, GAIIReport.tsx, Whitepaper.tsx 반응형 grid/spacing
   - **Group 5 - Footer & Header**: Footer ContractLink 모바일 레이아웃, Header 언어선택기 `<select>` 드롭다운, 로고 `max-w-[35vw]`

#### 2. **Partners Section: Firebase → Supabase/Vercel 교체**
   - `PartnersSection.tsx`: firebase → supabase + vercel 데이터 교체
   - 14개 언어 번역 파일 (ko, en, zh, ja, es, fr, ar, pt, id, ms, th, vi, km, sw) 업데이트

#### 3. **배경 글로우 효과 모바일 축소**
   - `NEOSLanding.tsx`: ambient glow w-96→w-48/sm:w-72/md:w-96
   - `HeroSection.tsx`: radial glow 동일 패턴
   - `PhilosophySection.tsx`: card glow w-64→w-32/sm:w-48/md:w-64
   - `Web3AuthSection.tsx`: blur glow w-40→w-24/sm:w-32/md:w-40
   - `index.css`: `@media (max-width: 639px)` glow-mobile 키프레임 추가

#### 4. **KindnessTerm 클릭 우선순위 수정**
   - 문제: EcosystemSection에서 KindnessTerm이 Link 안에 있어 클릭 시 네비게이션 발생
   - 해결: `KindnessTerm.tsx` onClick/onKeyDown에 `stopPropagation()` + `preventDefault()` 추가
   - 모바일에서 친절 모드 툴팁이 하이퍼링크보다 우선 작동

#### 5. **CTA 버튼 → 지갑 연결 기능**
   - `CTASection.tsx`: `useWallet()` 훅 연동
   - 버튼 클릭 시 `connect()` 호출 (지갑 연결 팝업)
   - 이미 로그인된 경우 (`isConnected && address`) 버튼 숨김
   - 연결 중 로딩 스피너 표시 (`loading` prop)

#### 6. **Web3Auth 팝업 언어 i18n 연동**
   - 문제: `defaultLanguage: 'ko'` 하드코딩 → 사이트 언어 변경해도 팝업은 항상 한국어
   - 해결: `i18n.language`에서 현재 사이트 언어를 읽어 Web3Auth 지원 언어로 매핑
   - 수정 파일: `WalletContext.tsx`, `Web3AuthProvider.tsx`
   - Web3Auth 지원 언어: en, de, ja, ko, zh, es, fr, pt, nl, tr
   - 미지원 언어 (ar, id, ms, th, vi, km, sw) → en 폴백
   - 참고: 싱글톤이므로 언어 변경 후 새로고침 필요

### ✅ 완료된 작업 (2026-01-28 - Session 50: 화이트페이퍼 마크다운 테이블 렌더링 수정)

#### 1. **화이트페이퍼 마크다운 테이블 렌더링 버그 수정**
   - 문제: 일부 언어에서 마크다운 표가 렌더링되지 않고 원문 그대로 표시
   - 영향 언어: ja, fr, ar, pt, id, th, vi (+ zh, es, sw 추가 발견)
   - 총 ~3,100건 수정 (14개 언어 × 13개 섹션)

#### 2. **수정된 이슈 유형**
   | 이슈 | 영향 언어 | 수정 건수 |
   |------|----------|----------|
   | 표 행 사이 빈 줄 (header↔separator↔data) | zh, fr, ar, pt, id, th, vi, sw | ~2,500 |
   | 데이터 행 끝 `\|` 누락 | ja | 217 |
   | 데이터/구분자 행 시작 `\|` 누락 | ar, th, fr, es, id, vi, sw, km | ~200 |
   | JA 헤더 행 열 구분 `\|` 누락 (열 이름 합쳐짐) | ja | 61 |
   | 헤더+구분자 행 병합 (한 줄에 합쳐짐) | 다수 언어 (expansion, expo 등) | ~40 |
   | 구분자 열 수 불일치 | sw, km, es | ~15 |

#### 3. **일본어(JA) 헤더 재구성**
   - 한국어 헤더를 참조하여 ko→ja 사전 매핑 (50+ 용어)
   - 예: `|コンポーネント説明|` → `| コンポーネント | 説明 |`
   - 한국어 잔재 5건 추가 수정 (problem, philosophy, technical, expansion, governance)

#### 4. **DB 동기화**
   - `almaneo_whitepaper.db`에 수정사항 역동기화 (131개 번역 레코드 업데이트)
   - JSON ↔ DB 전체 일치 검증 완료

#### 5. **빌드 & 푸시**
   - 빌드 성공 (35.21초)
   - 커밋: `a9c5d63` - fix(web): Fix markdown table rendering in whitepaper for 14 languages
   - 수정 파일: `whitepaper.json`, `almaneo_whitepaper.db`

### ✅ 완료된 작업 (2026-01-28 - Session 51: 친절 모드 다국어 지원)

#### 1. **친절 모드 (Kindness Mode) i18n 다국어 지원 구현**
   - 기존: 용어 설명 (glossary) 30+ 용어가 한국어로만 하드코딩
   - 변경: 14개 언어로 번역, i18n 시스템 연동

#### 2. **glossary.ts 구조 변경**
   - `web/src/data/glossary.ts` 전면 리팩토링
   - 기존: 한국어 텍스트(term, simple, detailed, example) + 카테고리 함께 관리
   - 변경: 구조 데이터(키, 카테고리)만 관리, 텍스트는 i18n으로 이동
   - 기존 `findTerm()` 제거 → `isValidTermKey()`, `getTermCategory()`, `getKeysByCategory()` 추가
   - `glossaryKeys: Record<string, GlossaryCategory>` 매핑 export

#### 3. **KindnessTerm.tsx i18n 연동**
   - `web/src/components/ui/KindnessTerm.tsx` 업데이트
   - `useTranslation('common')` 훅 추가
   - 용어 텍스트: `t('glossary.{termKey}.term/simple/detailed/example')` 로드
   - 카테고리 라벨: `t('glossary.categories.{category}')` 로드
   - 예시 라벨: `t('glossary.exampleLabel')` 로드
   - 기존 `getCategoryLabel()` 함수 제거 (i18n으로 대체)

#### 4. **14개 언어 glossary 번역 추가** (`common.json`)
   - 각 언어 `common.json`에 `glossary` 섹션 추가
   - 30+ 용어 × 14개 언어 = 420+ 번역 항목
   - 각 용어: `term`, `simple`, `detailed` (선택), `example` (선택)
   - 6개 카테고리 라벨: blockchain, token, defi, nft, governance, neos
   - `exampleLabel` (예시 라벨) 각 언어별 번역

   | 언어 | 파일 | 상태 |
   |------|------|------|
   | ko | `public/locales/ko/common.json` | ✅ |
   | en | `public/locales/en/common.json` | ✅ |
   | zh | `public/locales/zh/common.json` | ✅ |
   | ja | `public/locales/ja/common.json` | ✅ |
   | es | `public/locales/es/common.json` | ✅ |
   | fr | `public/locales/fr/common.json` | ✅ |
   | ar | `public/locales/ar/common.json` | ✅ |
   | pt | `public/locales/pt/common.json` | ✅ |
   | id | `public/locales/id/common.json` | ✅ |
   | ms | `public/locales/ms/common.json` | ✅ |
   | th | `public/locales/th/common.json` | ✅ |
   | vi | `public/locales/vi/common.json` | ✅ |
   | km | `public/locales/km/common.json` | ✅ |
   | sw | `public/locales/sw/common.json` | ✅ |

#### 5. **빌드 테스트 성공** (34.61초)

---

### ✅ 완료된 작업 (2026-01-29 - Session 52: FAQ 섹션 다국어 번역 완료)

#### 1. **FAQ 섹션 번역 누락 문제 확인**
   - 문제: 6개 언어(id, ms, th, vi, km, sw)의 FAQ가 부분적으로 영어로 표시
   - 원인: FAQ 구조가 FAQSection.tsx 컴포넌트와 불일치
     - 메타데이터 키 누락: `tag`, `titlePrefix`, `titleHighlight`, `subtitleFull`, `contactMessage`
     - 카테고리 불일치: `all`, `general`, `token`, `technical` → 5개 카테고리 필요
     - FAQ 항목 ID 불일치: `whatIs`, `whatIsGAII` 등 → 10개 항목 필요

#### 2. **6개 언어 FAQ 구조 수정 완료**
   - 수정 언어: Indonesian (id), Malay (ms), Thai (th), Vietnamese (vi), Khmer (km), Swahili (sw)
   - 각 언어별 작은 단위로 수정 (메타데이터 → 카테고리 → 각 항목)

#### 3. **FAQ 메타데이터 추가**
   ```json
   {
     "tag": "FAQ",
     "titlePrefix": "Frequently",
     "titleHighlight": "Asked Questions",
     "subtitleFull": "Frequently asked questions about AlmaNEO and culture of kindness",
     "categoryLabel": "Category",
     "contactCta": "Have more questions?",
     "contactMessage": "Contact us at support@almaneo.org"
   }
   ```

#### 4. **카테고리 변경** (4개 → 5개)
   | 기존 | 변경 |
   |------|------|
   | `all`, `general`, `token`, `technical` | `general`, `token`, `technology`, `nft`, `participation` |

#### 5. **FAQ 항목 ID 통일** (10개 항목)
   | 기존 항목 | 변경 항목 | 비고 |
   |----------|----------|------|
   | whatIs | whatIsAlmaNEO | 이름 변경 |
   | whatIsJeong | whatIsJeong | ✅ 유지 |
   | whatIsGAII | totalSupply | 교체 |
   | tokenUtility | howToGetToken | 교체 |
   | howToBuy | (삭제) | - |
   | howToStart | whichBlockchain | 교체 |
   | isSafe | noWallet | 교체 |
   | whatIsJeongSBT | whatIsJeongSBT | ✅ 유지 |
   | supportedLanguages | nftMarketplaceFeatures | 교체 |
   | howToContribute | howStakingWorks | 교체 |
   | (신규) | whatIsKindnessGame | 추가 |

#### 6. **Khmer 텍스트 오류 수정**
   - `org ទួល` → `ដើម្បីទទួល` (to receive)
   - `ផ org ល់` → `ផ្តល់` (provide)

#### 7. **빌드 테스트 성공** (34.66초)
   - 모든 14개 언어가 동일한 FAQ 구조 사용
   - FAQSection.tsx 컴포넌트와 완벽히 일치

---

### ✅ 완료된 작업 (2026-01-29 - Session 53: GAII Dashboard/Report i18n 다국어 지원)

#### 1. **platform.json 네임스페이스 신설**
   - 기존 landing.json, common.json과 분리하여 GAII 전용 번역 파일 생성
   - `web/public/locales/ko/platform.json` - 한국어 번역
   - `web/public/locales/en/platform.json` - 영어 번역
   - i18n 설정에 'platform' 네임스페이스 추가 (`ns: ['common', 'landing', 'platform']`)

#### 2. **GAII Dashboard i18n 적용** (`web/src/pages/GAII.tsx`)
   - 대시보드 전체 UI 번역 키 적용
   - 국가명/지역명 다국어 표시: `i18n.language === 'ko'` 조건으로 분기
   - 번역 키 구조:
     - `gaii.dashboard.*`: 타이틀, 로딩, 에러 메시지
     - `gaii.grades.*`: 등급 라벨 (Low, Moderate, High, Critical)
     - `gaii.metrics.*`: 지표 카드 (adoptionRate, inequalityGap, countriesTracked, totalPopulation)
     - `gaii.worldMap.*`, `gaii.topCountries.*`, `gaii.bottomCountries.*`: 세계지도, 순위
     - `gaii.regional.*`: 지역별 분석 (정렬 옵션, 통계 라벨)

#### 3. **GAII Report i18n 적용** (`web/src/pages/GAIIReport.tsx`)
   - 리포트 전체 콘텐츠 번역
   - Key Findings 동적 값 보간: `{{score}}`, `{{north}}`, `{{south}}`, `{{ratio}}`
   - Key Mapping 패턴 구현:
     ```typescript
     const insightKeyMap: Record<string, string> = {
       'The Global AI Divide is Widening': 'globalDivide',
       'AI Costs Burden Low-Income Countries': 'affordabilityCosts',
       // ...
     };
     ```
   - 번역 키 구조:
     - `gaiiReport.header.*`: 헤더 정보
     - `gaiiReport.keyFindings.*`: 핵심 발견 (4개 항목)
     - `gaiiReport.insights.*`: 주요 인사이트 (5개 항목, title/description/recommendation)
     - `gaiiReport.recommendations.*`: 정책 권고 (6개 항목, title/description/impact)
     - `gaiiReport.regionalInsights.*`: 10개 지역별 분석 (NA, EU, EA, SA, SEA, LA, ME, SSA, OC, CA)
     - `gaiiReport.sections.*`: 섹션 제목/부제
     - `gaiiReport.methodology.*`: 방법론 (공식, 가중치, 등급 기준)
     - `gaiiReport.cta.*`: 액션 버튼 (PDF 다운로드 등)

#### 4. **커밋 정보**
   - 커밋: `1d5439e` - feat(web): Add i18n support for GAII Dashboard and Report pages
   - 5개 파일, +755줄, -146줄 변경

---

### 🔲 다음 세션 작업 (Session 54+)

#### 🔴 높은 우선순위 (핵심 기능 완성)

1. **GAII 페이지 i18n 완성**
   - 나머지 12개 언어에 `platform.json` 번역 파일 추가
   - 대상 언어: zh, ja, es, fr, ar, pt, id, ms, th, vi, km, sw

2. **Governance 실제 제안 로드**
   - ProposalCreated 이벤트 조회
   - Mock 데이터 제거, 온체인 데이터로 교체

3. **Staking 페이지 테스트**
   - 실제 스테이킹 트랜잭션 테스트
   - UI 오류 수정

4. **모바일 실기기 QA 테스트**
   - Chrome DevTools 320px, 375px, 390px, 428px 뷰포트 확인
   - 수평 스크롤바 없음 확인
   - 모든 터치 타겟 44px 이상 확인

#### 🟡 중간 우선순위

5. **i18n 번역 확장**
   - 나머지 12개 언어에 `aiHub` 섹션 추가
   - Kindness/Meetup 페이지 번역 키 생성
   - `blog` 키 추가 (12개 언어)

5. **Game 추가 개선**
   - 오세아니아 국가 데이터 완성 (호주, 뉴질랜드 퀘스트 확장)
   - 추가 언어 퀘스트 번역 (zh, ja, th, vi 등)
   - 실제 디바이스 QA 테스트

#### 🟢 낮은 우선순위

6. **Grant 프로그램 신청**
   - Google for Nonprofits 신청
   - Polygon Grants 신청
   - Vercel Pro (오픈소스) 신청

7. **메인넷 배포 준비**
   - 스마트 컨트랙트 감사 검토
   - 메인넷 배포 스크립트 준비

---

### 📊 페이지별 상태 요약 (Session 53 기준)

| 페이지 | 상태 | 비고 |
|--------|------|------|
| Landing | ✅ | 완료 |
| GAII Dashboard | ✅ | 세계지도 + 50개국 + i18n (ko/en) |
| GAII Report | ✅ | PDF 다운로드 + i18n (ko/en) |
| AI Hub | ✅ | Gemini + Groq |
| Kindness | ✅ | Supabase + Ambassador |
| Meetup | ✅ | 생성/참가/검증 |
| Whitepaper | ✅ | 15개 언어 |
| Dashboard | ✅ | 토큰 잔액 온체인 조회 |
| Staking | ⚠️ | 테스트 미진행 |
| Governance | ⚠️ | Mock 데이터 |
| Airdrop | ✅ | 컨트랙트 연동 완료 |
| NFT (외부) | ✅ | nft.almaneo.org |
| Game (외부) | ✅ | game.almaneo.org (세계문화여행) |

---

### 🎯 Grant 프로그램 후보

| 프로그램 | 대상 | 혜택 | 상태 |
|---------|------|------|------|
| Google for Nonprofits | 비영리 | Cloud $10K/년 | 미신청 |
| Polygon Grants | Web3 | $5K~$50K | 미신청 |
| Anthropic Credits | AI | API 크레딧 | 미신청 |
| Vercel Pro | 오픈소스 | Pro 무료 | 미신청 |
| Supabase Startups | 스타트업 | 1년 Pro | 미신청 |

### i18n 핵심 해결 방법 (참고용)
```
문제: t() 함수가 번역 키를 그대로 반환
원인: react-i18next가 잘못된 i18n 인스턴스 사용
해결:
1. i18n.init()의 Promise를 export (initPromise)
2. main.tsx에서 initPromise.then()으로 렌더링 지연
3. App.tsx에서 I18nextProvider로 올바른 i18n 인스턴스 제공
```

### landing.json 새 키 구조 (Session 12 완료 기준)
```json
{
  "problem": {
    "title", "subtitle", "description",
    "cards": { "developed": { "title", "subtitle", "result" }, "globalSouth": {...} },
    "activities": { "developed": { "morning", "afternoon", "evening" }, "globalSouth": {...} },
    "timeLabels": { "morning", "afternoon", "evening" },
    "statistics": { "stat1": { "value", "label" }, "stat2", "stat3", "stat4" }
  },
  "philosophy": {
    "title", "subtitle", "description", "jeong",
    "jeongCard": { "title", "description1", "description2", "footer", "footerHighlight", "footerEnd" },
    "principles": { "people": { "title", "description" }, "individual", "human" }
  },
  "solution": {
    "title", "subtitle", "description",
    "solutions": {
      "gaii": { "title", "subtitle", "description", "items": { "item1", "item2", "item3" } },
      "aiHub": {...},
      "kindness": {...}
    }
  },
  "tokenomics": {
    "title", "subtitle", "totalSupply", "forHumans", "forHumansCount",
    "tokenInfo": { "token", "network", "standard", "supply", "forAll", "forAllValue" },
    "distribution": { "title", "community", "foundation", "liquidity", "team", "grants" }
  },
  "web3auth": {
    "title", "subtitle",
    "loginDemo": { "title", "description", "or", "connectWallet" },
    "benefits": { "social": { "title", "description" }, "secure", "gasless" },
    "stats": { "loginTime": { "value", "label" }, "gasFee", "ownership" }
  }
}
```

### GitHub 저장소
```
Repository: https://github.com/almaneo/almaneo-org
Branch: main
SSH Remote: git@github-almaneo:almaneo/almaneo-org.git
User: AlmaNEO <mjy.almaneo@gmail.com>
SSH Key: ~/.ssh/id_ed25519_almaneo
```

### SNS 계정 (Session 27 업데이트)
```
Twitter/X:  https://x.com/almaneo_org
Discord:    https://discord.gg/JkRNuj7aYd
TikTok:     https://www.tiktok.com/@almaneo
GitHub:     https://github.com/almaneo
Blog:       https://medium.com/@news_15809
Telegram:   미정 (숨김)
YouTube:    미정 (숨김)
```

### 배포된 URL (Vercel)
```
Web:  https://almaneo.org (Vercel) ✅ 배포 완료
NFT:  https://nft.almaneo.org (Vercel) ✅ 배포 완료
Game: https://game.almaneo.org (Vercel) ✅ 배포 완료 (세계문화여행)
```

### Supabase 프로젝트 정보
```
Project URL: https://euchaicondbmdkomnilr.supabase.co
Region: Northeast Asia (Seoul)
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Y2hhaWNvbmRibWRrb21uaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMjE2ODYsImV4cCI6MjA4NDc5NzY4Nn0.HX0kk4u9iy7G_DX1zEgLH33jTxhzsw75YKHPdFBaNYA
```

### Vercel 환경변수
```bash
VITE_SUPABASE_URL=https://euchaicondbmdkomnilr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_WEB3AUTH_CLIENT_ID=BI8Q1xvlSCu52eYqU2lhkxuvIghBW6LSkXvQXZmbEvTv4PVZe97eUdML0mzudO1agu88KoOmAWmv9FspuFb84ns
```

### 현재 완료된 배포

**Polygon Amoy Testnet - Core (2026-01-25 업데이트 - AmbassadorSBT 추가):**
```
ALMANToken:       0x261d686c9ea66a8404fBAC978d270a47eFa764bA
JeongSBT:         0x8d8eECb2072Df7547C22e12C898cB9e2326f827D
AmbassadorSBT:    0xf368d239a0b756533ff5688021A04Bc62Ab3c27B  # 🆕 Session 26
ALMANStaking:     0x86777d1834c07E1B08E22FE3E8Ec0AD25a5451ce
ALMANTimelock:    0xB73532c01CCCE4Ad6e8816fa4CB0E2aeDfe9C8C2
ALMANGovernor:    0xA42A1386a84b146D36a8AF431D5E1d6e845268b8
KindnessAirdrop:  0xadB3e6Ef342E3aDa2e31a2638d5D9566c26fb538
```

**Polygon Amoy Testnet - NFT (2026-01-20 재배포 - AlmaNEO 브랜딩):**
```
AlmaNFT721:           0xbFbE2b1eDB0f7F0675D5E449E508adE3697B8dfa
AlmaNFT1155:          0x50FC5Ecaa9517CCD24b86874b0E87ab6225E9cfF
AlmaPaymentManager:   0x2410Fa2958f2966DB85eF98aCbA4b9e360257E4e
AlmaCollectionManager:0x1Ad2176A1181CFF2d82289f5cc5d143d9B3AFE1D
AlmaMarketplace:      0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b
TrustedForwarder:     0xd240234dacd7ffdca7e4effcf6c7190885d7e2f0 (Biconomy)
```

### 주요 해결된 이슈 (참고용)
- OpenZeppelin 5.x는 Solidity 0.8.24 + evmVersion "cancun" 필요
- Web3Auth Network: `SAPPHIRE_DEVNET` (Client ID가 devnet으로 생성됨)
- Vite 7 polyfill: buffer, process 객체 수동 정의 필요
- Firebase Analytics import: `import { type Analytics }` 사용
- **Stack too deep 에러**: `hardhat.config.js`에 `viaIR: true` 설정으로 해결
- **NFT 서버 end-of-stream 에러**: `process.nextTick`을 실제 함수로 정의하여 `bind` 메서드 제공
- **Game 서버 ox 모듈 누락**: `npm install ox` 로 해결

### 컨트랙트 ABI 위치
컴파일 후 ABI 파일:
```
# Core 컨트랙트
blockchain/artifacts/contracts/ALMANToken.sol/ALMANToken.json
blockchain/artifacts/contracts/JeongSBT.sol/JeongSBT.json
blockchain/artifacts/contracts/ALMANStaking.sol/ALMANStaking.json
blockchain/artifacts/contracts/ALMANGovernor.sol/ALMANGovernor.json
blockchain/artifacts/contracts/ALMANTimelock.sol/ALMANTimelock.json
blockchain/artifacts/contracts/KindnessAirdrop.sol/KindnessAirdrop.json

# NFT 컨트랙트 (✅ 개발 완료)
blockchain/artifacts/contracts/nft/AlmaNFT721.sol/AlmaNFT721.json
blockchain/artifacts/contracts/nft/AlmaNFT1155.sol/AlmaNFT1155.json
blockchain/artifacts/contracts/marketplace/AlmaMarketplace.sol/AlmaMarketplace.json
blockchain/artifacts/contracts/marketplace/AlmaPaymentManager.sol/AlmaPaymentManager.json
blockchain/artifacts/contracts/marketplace/AlmaCollectionManager.sol/AlmaCollectionManager.json
```

### 개발 서버 실행 방법
```bash
# 각 터미널에서 실행
cd c:\DEV\ALMANEO\web && npm run dev      # Web (포트 5173)
cd c:\DEV\ALMANEO\nft && npm run dev      # NFT (포트 5174)
cd c:\DEV\ALMANEO\game && npm run dev     # Game (포트 3000)
```

### Game 서버 주요 변경사항
- **토큰명**: MiMiG → ALMAN (NEOS에서 추가 변경)
- **채굴 풀**: 10M → 800M ALMAN (전체 8B의 10%)
- **반감기 라벨**: 정(情) 테마 적용
  - Genesis Era (정의 시작)
  - First Halving (따뜻함의 확산)
  - Second Halving (연결의 시대)
  - Final Halving (정(情)의 완성)
- **티어명**: Jeong-SBT 티어와 일치
  - Seed of Kindness (친절의 씨앗)
  - Sprout of Jeong (정의 싹)
  - Tree of Warmth (따뜻함의 나무)
  - Forest of Humanity (인류의 숲)
- **스토리**: 친환경 농업 → AI 민주화
- **세계문화여행 (Session 32~48)**: Kindness Game → World Culture Travel 전면 업그레이드
  - 8개 지역, 20개국, ~58 퀘스트 (4종류)
  - 모바일 세로모드 5탭 네비바 (Home | Travel | Quest | Upgrade | More)
  - Gold(`#FFD700`) 테마 통일
  - Game i18n (ko/en, ~200 키)
  - Supabase DB 콘텐츠 시스템 (regions, countries, quests, content_translations)
  - 상세: `.claude/GAME_UPDATE.md`

### 친절 모드 (Kindness Mode) 가이드
친절 모드는 Web3/블록체인 초보자를 위한 용어 설명 기능입니다. (14개 언어 지원, Session 51)

**파일 구조:**
- `contexts/KindnessModeContext.tsx`: 전역 상태 관리
- `data/glossary.ts`: 용어 키/카테고리 구조 데이터 (텍스트 없음)
- `components/ui/KindnessTerm.tsx`: 툴팁 컴포넌트 (i18n 연동)
- `public/locales/{lang}/common.json` → `glossary` 섹션: 번역 텍스트

**사용 방법:**
```tsx
import { KindnessTerm } from '../ui';

// 텍스트에 툴팁 적용 (children은 표시 텍스트, termKey는 glossary 키)
<KindnessTerm termKey="staking">스테이킹</KindnessTerm>
```

**용어 카테고리:**
- `blockchain`: 블록체인, 스마트 컨트랙트, 가스비 등
- `token`: ERC-20, 토큰, 총 공급량 등
- `defi`: 스테이킹, APY, 유동성 등
- `nft`: NFT, 로열티, 민팅 등
- `governance`: DAO, 제안, 투표, 쿼럼 등
- `neos`: AlmaNEO 고유 개념 (정, Kindness Score, Jeong-SBT 등)

**신규 용어 추가 (2단계):**
```typescript
// 1단계: data/glossary.ts에 키+카테고리 추가
export const glossaryKeys: Record<string, GlossaryCategory> = {
  newTerm: 'blockchain', // 카테고리만 지정
};

// 2단계: 14개 언어 common.json에 번역 추가
// public/locales/{ko,en,...}/common.json → glossary 섹션
{
  "glossary": {
    "newTerm": {
      "term": "새 용어",
      "simple": "간단한 설명 (1줄)",
      "detailed": "자세한 설명 (선택)",
      "example": "실제 사용 예시 (선택)"
    }
  }
}
```

### Header 네비게이션 구조
```
로고 (Home) | Dashboard | Platform ▼ | Ecosystem ▼ | Community ▼ | 언어 | 친절모드 | 지갑

Platform:
├── GAII Dashboard (/gaii)
├── NEOS AI Hub (외부)
└── Kindness Protocol (외부)

Ecosystem:
├── Staking (/staking)
├── Airdrop (/airdrop)
├── NFT Marketplace (외부)
├── Kindness Game (외부)
└── Governance (/governance)

Community:
├── Docs (외부)
├── Discord (외부)
├── Twitter (외부)
└── GitHub (외부)
```

### 14개 지원 언어 (Header.tsx 메뉴 기준)
| 코드 | 언어 | 네이티브 표기 | 지역 | 방향 |
|------|------|--------------|------|------|
| ko | Korean | 한국어 | 동아시아 | LTR |
| en | English | English | 글로벌 | LTR |
| zh | Chinese | 中文 | 동아시아 | LTR |
| ja | Japanese | 日本語 | 동아시아 | LTR |
| es | Spanish | Español | 남미 | LTR |
| fr | French | Français | 유럽/아프리카 | LTR |
| ar | Arabic | العربية | 중동 | RTL |
| pt | Portuguese | Português | 남미/아프리카 | LTR |
| id | Indonesian | Bahasa Indonesia | 동남아시아 | LTR |
| ms | Malay | Bahasa Melayu | 동남아시아 | LTR |
| th | Thai | ไทย | 동남아시아 | LTR |
| vi | Vietnamese | Tiếng Việt | 동남아시아 | LTR |
| km | Khmer | ភាសាខ្មែរ | 동남아시아 | LTR |
| sw | Swahili | Kiswahili | 아프리카 | LTR |

### i18n 사용 가이드
```typescript
// 컴포넌트에서 번역 사용
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('landing'); // 네임스페이스 지정

  return (
    <h1>{t('hero.title')}</h1>
    <p>{t('hero.description')}</p>
  );
}

// 언어 변경
import { useTranslation } from 'react-i18next';

function LanguageSwitch() {
  const { i18n } = useTranslation();

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    // RTL 언어 지원
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  };

  return <button onClick={() => changeLanguage('ko')}>한국어</button>;
}
```

### 번역 파일 구조
```
public/locales/
├── ko/
│   ├── common.json    # nav, wallet, footer, kindnessMode, language
│   └── landing.json   # hero, problem, philosophy, solution, tokenomics,
│                      # ecosystem, web3auth, team, partners, roadmap, faq, cta
├── en/
│   ├── common.json
│   └── landing.json
└── ... (12개 추가 언어)
```
