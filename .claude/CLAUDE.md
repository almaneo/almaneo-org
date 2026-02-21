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
│   │   │   ├── proposals/         # 🆕 피치덱 데이터 (Session 55)
│   │   │   │   ├── types.ts       # Slide, Proposal 타입 정의
│   │   │   │   ├── polygon-grant.ts  # 16개 슬라이드 데이터
│   │   │   │   └── index.ts
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
│   │   │   ├── proposal/          # 🆕 피치덱 뷰어 (Session 55)
│   │   │   │   ├── SlideViewer.tsx    # 메인 컨테이너 (풀스크린)
│   │   │   │   ├── SlideRenderer.tsx  # 레이아웃별 라우팅
│   │   │   │   ├── SlideSubtitle.tsx  # 타이핑 자막
│   │   │   │   ├── SlideControls.tsx  # 하단 컨트롤바
│   │   │   │   ├── SlideProgress.tsx  # 진행바
│   │   │   │   ├── ProposalHeader.tsx # 상단 헤더 (PDF 다운로드)
│   │   │   │   ├── layouts/           # 6가지 슬라이드 레이아웃
│   │   │   │   │   ├── TitleSlide.tsx
│   │   │   │   │   ├── ContentSlide.tsx
│   │   │   │   │   ├── StatsSlide.tsx
│   │   │   │   │   ├── ComparisonSlide.tsx
│   │   │   │   │   ├── QuoteSlide.tsx
│   │   │   │   │   └── ConclusionSlide.tsx
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
│   │   │   ├── Proposal.tsx       # 🆕 피치덱 뷰어 (/proposals/:id)
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

### ✅ 완료된 작업 (2026-01-29 - Session 54: NFT & Web SEO 최적화)

#### 1. **NFT 사이트 SEO 최적화** ([nft/index.html](nft/index.html))
   - **Favicon & Apple Touch Icons**: 32px ~ 512px 사이즈 아이콘 연결
   - **SEO Meta Tags**: title, description, keywords, robots, author
   - **Open Graph**: og:type, og:url, og:title, og:description, og:image, og:site_name, og:locale
   - **Twitter Cards**: summary_large_image, @almaneo_org 핸들
   - **PWA 지원**: manifest.json 링크, theme-color (#0A0F1A)
   - **Canonical URL**: https://nft.almaneo.org/

#### 2. **Web 사이트 SEO 개선** ([web/index.html](web/index.html))
   - 동일한 SEO 구조 적용 (favicon, apple-touch-icon, manifest, theme-color)
   - **URL 수정**: almaneo.foundation → almaneo.org (전체)
   - Twitter @almaneo_org 핸들 추가
   - Canonical URL, og:site_name, og:locale 추가

#### 3. **PWA 매니페스트 생성**
   - `nft/public/manifest.json` - NFT 마켓플레이스용
   - `web/public/manifest.json` - 메인 사이트용
   - 아이콘: 32px, 57px, 128px, 192px, 256px, 512px (maskable 포함)
   - 테마 색상: background #0A0F1A, theme #0052FF

#### 4. **SEO 파일 생성**
   | 파일 | NFT | Web | 설명 |
   |------|-----|-----|------|
   | robots.txt | ✅ | ✅ | 크롤러 가이드, sitemap 링크 |
   | sitemap.xml | ✅ (6 pages) | ✅ (13 pages) | 페이지별 priority, changefreq 설정 |
   | manifest.json | ✅ | ✅ | PWA 지원 |

#### 5. **NFT 이미지 파일 추가**
   - favicon.png, icon-57.png, icon-128.png, icon-192.png, icon-256.png, icon-512.png
   - logo.png, og-image.webp
   - web/public에서 nft/public으로 복사됨

#### 6. **커밋 정보**
   - 커밋: `12ad752` - feat(web,nft): Add SEO optimization, favicons, and PWA manifest
   - 16개 파일, +335줄 변경 (이미지 포함)

---

### ✅ 완료된 작업 (2026-01-30 - Session 55: Polygon Grant 피치덱 뷰어)

#### 1. **슬라이드형 피치덱 뷰어 구현**
   - `web/src/components/proposal/` 폴더 전체 구현
   - 16개 슬라이드 풀스크린 프레젠테이션 뷰어
   - 자동 진행 + 타이핑 자막 효과
   - 키보드/터치 네비게이션 지원

#### 2. **슬라이드 레이아웃 컴포넌트** (6종)
   | 레이아웃 | 용도 | 파일 |
   |----------|------|------|
   | TitleSlide | 타이틀 (풀스크린 이미지 + 중앙 텍스트) | `layouts/TitleSlide.tsx` |
   | ContentSlide | 콘텐츠 (이미지 + 마크다운) | `layouts/ContentSlide.tsx` |
   | StatsSlide | 통계/테이블 | `layouts/StatsSlide.tsx` |
   | ComparisonSlide | 좌우 비교 카드/테이블 | `layouts/ComparisonSlide.tsx` |
   | QuoteSlide | 인용문 중심 | `layouts/QuoteSlide.tsx` |
   | ConclusionSlide | 맺음말/CTA | `layouts/ConclusionSlide.tsx` |

#### 3. **핵심 컴포넌트**
   - `SlideViewer.tsx`: 메인 컨테이너 (풀스크린, 키보드 이벤트)
   - `SlideRenderer.tsx`: 레이아웃별 라우팅
   - `SlideSubtitle.tsx`: 타이핑 효과 자막
   - `SlideControls.tsx`: 하단 컨트롤바 (재생/일시정지, 이전/다음)
   - `SlideProgress.tsx`: 진행바 + 슬라이드 번호
   - `ProposalHeader.tsx`: 상단 정보바 (상태 배지, PDF 다운로드)

#### 4. **Polygon Grant 제안서 데이터**
   - `web/src/data/proposals/types.ts`: 타입 정의
   - `web/src/data/proposals/polygon-grant.ts`: 16개 슬라이드 데이터
   - 이미지: `web/src/assets/images/proposal/001.webp` ~ `016.webp`

#### 5. **슬라이드 비주얼 최적화**
   - 모든 슬라이드 콘텐츠 화면 중앙 정렬 (`slide-content-overlay`)
   - 테이블 배경 통일 (`bg-black/40 backdrop-blur-sm`)
   - 비교 카드 투명도 개선 (`/20` → `/40`)
   - 슬라이드 6: titleHighlight 흰색으로 변경
   - 슬라이드 16: 불필요한 컨텐츠 제거

#### 6. **PDF 다운로드 기능**
   - `types.ts`에 `pdfUrl` 필드 추가
   - `ProposalHeader.tsx`: PDF 다운로드 버튼 (Download 아이콘)
   - PDF 위치: `public/pdf/proposals/polygon-grant/Polygon_Grant_Proposal_en.pdf`

#### 7. **라우팅**
   - `/proposals/polygon-grant` → 피치덱 뷰어 페이지
   - `web/src/pages/Proposal.tsx` 페이지 컴포넌트

#### 8. **CSS 추가** (`index.css`)
   ```css
   .slide-fullscreen-bg { 풀스크린 배경 }
   .slide-content-overlay { 중앙 정렬 오버레이 }
   .slide-title, .slide-subtitle { 타이틀 스타일 }
   .proposal-header { 상단 헤더 바 }
   .slide-controls { 하단 컨트롤 바 }
   ```

---

### ✅ 완료된 작업 (2026-01-30 - Session 56: 피치덱 음성 지원 & 영어 버전)

#### 1. **피치덱 영어 버전 구현**
   - `web/src/data/proposals/polygon-grant-en.ts` 생성 (16개 슬라이드)
   - 영어 자막 스크립트 작성 (`SCRIPT_EN.md`)
   - 언어 선택 UI 추가 (한국어/English 토글)

#### 2. **피치덱 음성 지원 구현**
   - Google Gemini TTS API 연동 (Fenrir 보이스)
   - 영어 음성 62개 파일 생성 (`public/audio/proposals/polygon-grant/en/`)
   - 한국어 음성 폴더 생성 (영어 음성 복사, 추후 업데이트 예정)
   - 음성 재생 토글 UI (Volume2/VolumeX 아이콘)
   - 자막 변경 시 음성 자동 재생

#### 3. **음성 duration 값 정확도 개선**
   - WAV 파일 크기 기반 duration 자동 계산
   - 공식: `(file_size - 44) / 48000 * 1000 + 500ms`
   - 16개 슬라이드 62개 자막 duration 값 업데이트

#### 4. **Footer에 Pitch Deck 링크 추가**
   - Legal Links 섹션에 "Pitch Deck" 링크 추가
   - `/proposals/polygon-grant` 경로

#### 5. **커밋**
   - 커밋: `1d01117` - feat(web): Add Polygon Grant pitch deck with audio support
   - 185개 파일, +4,971줄 변경

---

### ✅ 완료된 작업 (2026-01-31 - Session 57: 피치덱 한국어 음성 생성)

#### 1. **한국어 TTS 음성 생성 완료**
   - Google Gemini TTS API 연동 (gemini-2.5-flash-preview-tts)
   - **Voice**: Aoede (신뢰감 있는 여성 목소리, 사용자 요청)
   - **68개 음성 파일** 생성: `web/public/audio/proposals/polygon-grant/ko/`
   - 총 용량: 15.94 MB
   - TTS 스크립트: `web/scripts/generate-voice-ko.ts`

#### 2. **Duration 값 업데이트**
   - 실제 WAV 파일 크기 기반 정확한 duration 계산
   - 공식: `(file_size - 44) / 48 + 500` ms
   - 16개 슬라이드 68개 자막 duration 모두 업데이트

#### 3. **iOS 오디오 호환성 수정**
   - `SlideViewer.tsx` iOS Safari 지원 개선
   - 단일 Audio 요소 재사용 (iOS 요구사항)
   - `audio.load()` 호출 추가 (iOS 필수)
   - 첫 인터랙션 시 무음 재생으로 오디오 잠금 해제

#### 4. **커밋**
   - `9afc9dc` - feat(web): Generate Korean TTS audio for pitch deck
   - `6c94378` - fix(web): Add iOS audio compatibility for pitch deck

---

### 🔲 다음 세션 작업 (Session 58+)

#### 🔴 높은 우선순위

1. **GAII 페이지 i18n 완성**
   - 나머지 12개 언어에 `platform.json` 번역 파일 추가
   - 대상 언어: zh, ja, es, fr, ar, pt, id, ms, th, vi, km, sw

2. **피치덱 UX 개선**
   - 볼륨 조절 슬라이더
   - 재생 속도 조절 (0.75x, 1x, 1.25x)
   - 자막 크기 조절

#### 🟡 중간 우선순위

3. **Governance 실제 제안 로드**
   - ProposalCreated 이벤트 조회
   - Mock 데이터 제거, 온체인 데이터로 교체

4. **Staking 페이지 테스트**
   - 실제 스테이킹 트랜잭션 테스트
   - UI 오류 수정

5. **모바일 실기기 QA 테스트**
   - Chrome DevTools 320px, 375px, 390px, 428px 뷰포트 확인
   - 수평 스크롤바 없음 확인
   - 모든 터치 타겟 44px 이상 확인

#### 🟢 낮은 우선순위

6. **Grant 프로그램 신청**
   - Google for Nonprofits 신청
   - Polygon Grants 신청
   - Vercel Pro (오픈소스) 신청

7. **메인넷 배포 준비**
   - 스마트 컨트랙트 감사 검토
   - 메인넷 배포 스크립트 준비

---

### 📊 페이지별 상태 요약 (Session 128 기준)

| 페이지 | 상태 | 비고 |
|--------|------|------|
| Landing | ✅ | 완료 + SEO + AlmaChat 섹션 (Session 120) |
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
| **Proposal** | ✅ | 피치덱 뷰어 (한국어/영어 음성 TTS, iOS 호환, PDF 다운로드) |
| **Partners** | ✅ | 지도/목록 토글, 바우처 QR, 15개 언어, PartnerSBT 인증 배지 (Session 121-127) |
| **Admin** | ✅ | Partner SBT 관리, 밋업 검증, 유저 관리 (Session 128) |
| NFT (외부) | ✅ | nft.almaneo.org + SEO/PWA |
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

**Polygon Amoy Testnet - Core TGE (2026-02-06 TGE 배포 - 8B ALMAN):**
```
ALMANToken:       0x2B52bD2daFd82683Dcf0A994eb24427afb9C1c63  # 8B Total Supply
JeongSBT:         0x41588D71373A6cf9E6f848250Ff7322d67Bb393c
AmbassadorSBT:    0xf368d239a0b756533ff5688021A04Bc62Ab3c27B  # Session 26 (별도)
PartnerSBT:       0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08  # Session 127 (별도)
ALMANStaking:     0xB691a0DF657A06209A3a4EF1A06a139B843b945B  # 1B ALMAN 보유
ALMANTimelock:    0x464bca66C5B53b2163A89088213B1f832F0dF7c0
ALMANGovernor:    0x30E0FDEb1A730B517bF8851b7485107D7bc9dE33
KindnessAirdrop:  0xfb89843F5a36A5E7E48A727225334E7b68fE22ac  # 600M ALMAN 보유
TokenVesting:     0x02fB6851B6cDc6B9176B42065bC9e0E0F6cf8F0E  # 800M ALMAN (Team, 12개월 cliff + 3년)
MiningPool:       0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9  # 800M ALMAN (게임 마이닝)
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

---

## ALMAN 토큰 PolygonScan 등록 (Session 58)

### 컨트랙트 검증 상태
- **ALMANToken**: ✅ Verified (Polygon Amoy)
- **주소**: `0x261d686c9ea66a8404fBAC978d270a47eFa764bA`
- **Explorer**: https://amoy.polygonscan.com/address/0x261d686c9ea66a8404fBAC978d270a47eFa764bA

### 토큰 설명 (확정)
```
ALMAN is the governance token of AlmaNEO, an AI democratization platform bridging technology and humanity.
```
(98자, 영문)

### 토큰 로고 디자인 (Option C 선택)

**컨셉**: 하트 + 네트워크 융합 (정(情) + 블록체인)

**AI 이미지 생성 프롬프트:**
```
Design a cryptocurrency token logo for "ALMAN" token.

Requirements:
- Size: 256x256 pixels, perfect square
- Background: Transparent or solid dark navy (#0A0F1A)
- Style: Modern, minimalist, professional crypto token design

Design Concept - "Heart + Network Fusion":
- Central element: A stylized heart shape
- The heart is formed by interconnected blockchain/network nodes and lines
- Left side of heart: Electric blue (#0052FF) representing technology/AI (Cold Code)
- Right side of heart: Terracotta orange (#FF6B00) representing humanity/warmth (Warm Soul)
- The two colors meet and blend in the center, symbolizing the fusion of technology and humanity
- Small dots/nodes at connection points suggesting blockchain network
- A subtle heartbeat/pulse line running through the center
- Clean, vector-style design that scales well at small sizes

Color Palette:
- Primary Blue: #0052FF (Electric Blue - technology)
- Primary Orange: #FF6B00 (Terracotta - humanity/Jeong 情)
- Accent Cyan: #06b6d4 (highlights)
- Background: Transparent or #0A0F1A (Deep Navy)

Do NOT include:
- Any text or letters
- Complex gradients that don't scale well
- Thin lines that disappear at small sizes
- Generic coin/currency symbols

The logo should embody the philosophy "Cold Code, Warm Soul" - where AI technology meets human connection through the Korean concept of Jeong (情, deep emotional bonds).
```

### 등록 필요 정보 (메인넷 배포 시)

| 항목 | 값 | 상태 |
|------|-----|------|
| Token Name | AlmaNEO | ✅ |
| Symbol | ALMAN | ✅ |
| Decimals | 18 | ✅ |
| Description | (위 영문 설명) | ✅ |
| Logo | 256x256 PNG | 🔲 디자인 필요 |
| Website | https://almaneo.org | ✅ |
| Email | contact@almaneo.org | ✅ |
| Twitter | https://x.com/almaneo_org | ✅ |
| Discord | https://discord.gg/JkRNuj7aYd | ✅ |
| GitHub | https://github.com/almaneo | ✅ |

### 메인넷 등록 플랫폼 (우선순위)

| 플랫폼 | 용도 | 우선순위 | 상태 |
|--------|------|----------|------|
| PolygonScan | 블록 익스플로러 | 🔴 필수 | 🔲 메인넷 후 |
| CoinGecko | 가격 추적 | 🟡 높음 | 🔲 메인넷 후 |
| CoinMarketCap | 가격 추적 | 🟡 높음 | 🔲 메인넷 후 |
| DeFiLlama | TVL 추적 | 🟢 중간 | 🔲 TVL 발생 후 |
| Token Lists | DEX 연동 | 🟢 중간 | 🔲 메인넷 후 |

---

## 토큰 발행 전략 (Session 58 확정)

### 핵심 결정사항

1. **전량 발행 + 락업 (Option C)**: TGE 시점에 8B 전량 민팅 후 카테고리별 분배
2. **게임 마이닝 하이브리드 (방법 3)**: MiningPool 컨트랙트에 800M 사전 민팅, 클레임 시 transfer
3. **Vesting**: Team & Advisors 12개월 cliff + 3년 선형 베스팅
4. **Community 배분**: Mining 0.8B / Staking 1.0B / Airdrop 0.6B / DAO Reserve 0.8B
5. **Multi-sig**: Gnosis Safe 2-of-3 (Co-Founder 3명, 메인넷 전용)

### 토크노믹스 최종 배분 (8B ALMAN)

| 카테고리 | 수량 | 비율 | 수신처 | 락업 |
|----------|------|------|--------|------|
| Foundation Reserve | 2.0B | 25% | Foundation Multi-sig | 없음 |
| Community - Mining | 0.8B | 10% | MiningPool 컨트랙트 | 게임 클레임 시 해제 |
| Community - Staking | 1.0B | 12.5% | ALMANStaking 컨트랙트 | 보상으로 해제 |
| Community - Airdrop | 0.6B | 7.5% | KindnessAirdrop 컨트랙트 | 활동 기반 클레임 |
| Community - DAO Reserve | 0.8B | 10% | DAO Multi-sig | 거버넌스 투표 |
| Liquidity & Exchange | 1.2B | 15% | DEX LP + CEX | 없음 |
| Team & Advisors | 0.8B | 10% | TokenVesting 컨트랙트 | 12개월 cliff + 3년 |
| Kindness Grants | 0.8B | 10% | Grants Multi-sig | 없음 |

### 신규 컨트랙트

| 컨트랙트 | 용도 | 상태 |
|----------|------|------|
| `TokenVesting.sol` | Team 0.8B 락업 (12개월 cliff + 3년) | ✅ 개발 완료 |
| `MiningPool.sol` | 게임 마이닝 800M 풀 | ✅ 개발 완료 |

### 배포 스크립트
- `blockchain/scripts/deploy-mainnet.js` - TGE 전체 배포 (8B 민팅 + 분배)
- ✅ 로컬 Hardhat 테스트 성공 (8B 민팅, 8개 컨트랙트 배포, 분배 검증)
- Amoy 테스트 시 Multi-sig 대신 단일 지갑 시뮬레이션

### PolygonScan API Key
- **API Key**: 설정 완료 (`blockchain/.env`)
- **발급 사이트**: https://polygonscan.com/myapikey

---

### ✅ 완료된 작업 (2026-02-06 - Session 58: 토큰 발행 전략 & TGE 준비)

#### 1. **PolygonScan 등록 준비**
   - ALMANToken 컨트랙트 Verify 상태 확인 (✅ 이미 완료)
   - PolygonScan API Key 발급 및 `.env` 설정
   - 토큰 설명 확정 (영문 98자)
   - 토큰 로고 프롬프트 작성 (Option C: 하트 + 네트워크 융합)

#### 2. **토큰 발행 전략 확정**
   - **전량 발행 + 락업** (Option C): TGE 시점에 8B 전량 민팅
   - **게임 마이닝 하이브리드** (방법 3): MiningPool 컨트랙트에 사전 민팅
   - **Vesting**: 12개월 cliff + 3년 선형 베스팅
   - **Community 배분**: Mining 0.8B / Staking 1.0B / Airdrop 0.6B / DAO 0.8B
   - **Multi-sig**: Gnosis Safe 2-of-3 (메인넷 전용)

#### 3. **TokenVesting.sol 컨트랙트 개발**
   - UUPS Upgradeable + AccessControl + ReentrancyGuard
   - 수혜자별 개별 베스팅 스케줄
   - `release()`, `vestedAmount()`, `releasableAmount()`, `vestingProgress()`
   - `revokeVesting()` - 미귀속 토큰 회수

#### 4. **MiningPool.sol 컨트랙트 개발**
   - 800M ALMAN 보관 + CLAIMER_ROLE 기반 전송
   - 4단계 반감기 에포크 온체인 추적
   - 일일 클레임 한도 (전체 500K, 사용자별 1K)
   - `claimForUser()`, `getCurrentEpoch()`, `remainingPool()`, `miningProgress()`

#### 5. **deploy-mainnet.js TGE 배포 스크립트 작성**
   - 5단계 배포: 컨트랙트 → 민팅 → 분배 → 역할 → 검증
   - 8개 컨트랙트 배포 (기존 6 + TokenVesting + MiningPool)
   - 로컬 Hardhat 테스트 ✅ 성공 (8B 민팅, 카테고리별 한도 소진 확인)

#### 6. **컴파일 성공**
   - TokenVesting.sol + MiningPool.sol 컴파일 완료
   - Solidity 0.8.24, OpenZeppelin 5.x 호환

---

### ✅ 완료된 작업 (2026-02-06 - Session 59: Amoy TGE 배포 & Verify)

#### 1. **Amoy 테스트넷 TGE 배포 완료**
   - `deploy-mainnet.js`로 8개 UUPS Proxy 컨트랙트 배포
   - **Total Supply: 8,000,000,000 ALMAN** (8B) 확인
   - Team 카테고리 수동 민팅 보정 (스크립트 await 이슈)
   - 배포 결과: `blockchain/deployments/amoy-tge-deployment.json`

#### 2. **토큰 분배 완료**
   | 카테고리 | 수량 | 수신처 | 상태 |
   |----------|------|--------|------|
   | Foundation | 2.0B | deployer (테스트넷) | ✅ |
   | Mining | 0.8B | MiningPool 컨트랙트 | ✅ |
   | Staking | 1.0B | ALMANStaking 컨트랙트 | ✅ |
   | Airdrop | 0.6B | KindnessAirdrop 컨트랙트 | ✅ |
   | DAO Reserve | 0.8B | deployer (테스트넷) | ✅ |
   | Liquidity | 1.2B | deployer (테스트넷) | ✅ |
   | Team | 0.8B | TokenVesting 컨트랙트 | ✅ |
   | Grants | 0.8B | deployer (테스트넷) | ✅ |

#### 3. **프론트엔드 주소 업데이트**
   - `web/src/contracts/addresses.ts` - TGE 주소 반영 + TokenVesting, MiningPool 추가
   - `shared/contracts/addresses.ts` - 동일 업데이트
   - `shared/types/contracts.ts` - ContractAddresses에 TokenVesting, MiningPool 추가
   - TypeScript 빌드 확인 ✅

#### 4. **PolygonScan 컨트랙트 Verify (7/8)**
   | 컨트랙트 | 상태 | 비고 |
   |----------|------|------|
   | ALMANToken | ✅ Verified | |
   | JeongSBT | ✅ Verified | |
   | ALMANStaking | ✅ Verified | |
   | ALMANTimelock | ✅ Verified | |
   | ALMANGovernor | ⚠️ Failed | viaIR 바이트코드 불일치 |
   | KindnessAirdrop | ✅ Verified | |
   | TokenVesting | ✅ Verified | |
   | MiningPool | ✅ Verified | |

#### 5. **Hardhat Config 업데이트**
   - Etherscan V1 → V2 API 마이그레이션
   - `apiKey`를 단일 문자열로 변경
   - `customChains` 네트워크명 `polygonAmoy` → `amoy`로 통일

#### 6. **Hero 섹션 리디자인 ("8B 인류" 오해 방지)**
   - 문제: "8B tokens for 8B humans" 통계가 1인 1토큰 배분으로 오해될 수 있음
   - 해결: 숫자 기반 통계 → 동사형 미션 필라로 변경
   - **Measure** (측정) | **Connect** (연결) | **Democratize** (민주화)
   - AnimatedCounter 제거, Lucide 아이콘 + 동사 헤딩 + 설명 추가
   - `hero.mission` 번역 키 14개 언어 추가

#### 7. **Tokenomics 섹션 리디자인**
   - 타이틀: `"80억 인류, 80억 Tokens"` → `"8B ALMAN — AI 평등의 화폐"` (다국어)
   - Token Info: "For All" 필드 제거, 그리드 5열 → 4열로 변경
   - `tokenomics.titleMission` 번역 키 14개 언어 추가

#### 8. **Footer 컨트랙트 주소 업데이트**
   - Core Contracts 6개 → 9개로 확장 (AmbassadorSBT, TokenVesting, MiningPool 추가)
   - 모든 주소를 TGE 배포 주소로 업데이트
   - 커밋: `18dcb9d` (28개 파일, +1,884줄)

---

### ✅ 완료된 작업 (2026-02-06 - Session 60~61: 페이지 i18n 적용 완료)

#### 목표: 하드코딩된 한글/영문 페이지를 i18n으로 전환 (ko/en 우선, 12개 추가 언어는 나중에)

#### 1. **완료된 페이지 (Session 60)**
   - `Dashboard.tsx`: ~18 translation keys (dashboard.*)
   - `Staking.tsx`: ~35 keys (staking.*), `formatTimeRemaining(date, t)` 패턴
   - `Governance.tsx`: ~30 keys (governance.*), `formatDuration(seconds, t)` 패턴
   - `Airdrop.tsx`: ~40 keys (airdrop.*), `taskCategoryDefs` nameKey/titleKey 패턴
   - `Kindness.tsx`: ~55 keys (kindness.*), 19개 활동 타입 라벨

#### 2. **완료된 페이지 (Session 61)** ✅
   - `MeetupCreate.tsx`: 폼 라벨, 유효성 검증 메시지, 팁 등 (~30 keys)
   - `MeetupList.tsx`: 검색, 필터, 상태 라벨, 날짜 locale
   - `MeetupDetail.tsx`: 참가/검증 UI, 알림 메시지, 점수 표시
   - `AIHub.tsx`: selectModel 키 추가 (기존 fallback 패턴 유지)
   - `meetup` 번역 섹션 신설 (ko/en common.json, ~80 keys)
   - 빌드 테스트 성공 (33.81초)
   - 커밋: `6ec39ce`

#### 3. **남은 페이지** (낮은 우선순위)
   | 페이지 | 상태 | 비고 |
   |--------|------|------|
   | PrivacyPolicy.tsx | 🔲 | 영어 하드코딩 법적 텍스트 (번역 불필요) |
   | TermsOfService.tsx | 🔲 | 영어 하드코딩 법적 텍스트 (번역 불필요) |

#### 4. **i18n 적용 패턴 요약** (일관성을 위해)
   - 네임스페이스: `common` (모든 페이지)
   - 번역 키 구조: `{pageName}.{elementName}` (예: `kindness.title`)
   - 날짜 locale: `i18n.language` 직접 사용 (toLocaleDateString이 2자리 코드 지원)
   - 데이터 배열: ID 기반 + `t('section.items.{id}')` 패턴
   - 헬퍼 함수: `t` 파라미터 전달 (예: `formatDuration(sec, t)`)
   - 단위 표시: `{{count}}회`, `{{count}}점` 등 interpolation 사용

---

### ✅ 완료된 작업 (2026-02-10 - Session 62: Grant 다중 제안서 생성)

#### 1. **5개 Grant 프로그램 제안서 작성 (영어 + 한국어, 11개 파일)**
   - 커밋: `9343283` - docs: Add 5 grant proposals (EN+KO) and grant tracker
   - 11개 파일, +2,648줄

#### 2. **생성된 제안서 목록**

   | 프로그램 | 영어 | 한국어 | 금액 | 마감 |
   |:---------|:-----|:-------|:-----|:-----|
   | Vercel AI Accelerator | `VERCEL_AI_ACCELERATOR.md` | `_KO.md` | $100K+ 크레딧 | **2026-02-16** |
   | Anthropic Economic Futures | `ANTHROPIC_ECONOMIC_FUTURES.md` | `_KO.md` | $35K + API | Rolling |
   | Mozilla Democracy x AI | `MOZILLA_DEMOCRACY_AI.md` | `_KO.md` | $50K~$250K | Early 2026 |
   | Optimism RetroPGF | `OPTIMISM_RETROPGF.md` | `_KO.md` | OP 토큰 | 상시 |
   | Gitcoin GG25 | `GITCOIN_GG25.md` | `_KO.md` | QF 매칭 | Q2 2026 |

#### 3. **GRANT_TRACKER.md 생성**
   - 9개 프로그램 전체 현황 관리 (제출됨, 작성완료, 모니터링)
   - 프로그램별 강조점 가이드 (톤/어휘 매트릭스)
   - 다음 액션 체크리스트 (긴급도별 분류)

#### 4. **프로그램별 프레이밍 전략**
   | 프로그램 | AlmaNEO 호칭 | 강조 | 최소화 |
   |:---------|:------------|:-----|:------|
   | Vercel | AI 프로덕트 | Edge Functions, AI SDK | 블록체인, 토큰 |
   | Anthropic | 연구 도구 | 학술 방법론, GAII 데이터 | 블록체인, 토큰 |
   | Mozilla | 시민 기술 | 민주적 거버넌스, 커뮤니티 | 암호화폐 용어 |
   | Optimism | 공공재 | 오픈소스, 임팩트 메트릭 | 토큰 경제 |
   | Gitcoin | 오픈소스 도구 | 이미 만든 것, 커뮤니티 | 미래 계획 |

---

### ✅ 완료된 작업 (2026-02-10 - Session 63: Vercel AI SDK 연동)

#### 1. **Vercel AI SDK 라이브러리 연동 완료**
   - `web/api/chat-ai.ts` 신규 생성 (Vercel AI SDK 엔드포인트)
   - `streamText` + `toDataStreamResponse`로 Vercel AI Data Stream 프로토콜 구현
   - 지원 모델: Gemini 2.5 Flash Lite (`@ai-sdk/google`), Llama 3.3 70B (`@ai-sdk/groq`)

#### 2. **듀얼 모드 아키텍처**
   - 기존 `/api/chat` (커스텀 SSE) 100% 보존
   - 신규 `/api/chat-ai` (Vercel AI SDK) 별도 엔드포인트
   - `useAIHub.ts`에 `useVercelAI` 토글 + 듀얼 스트림 파싱 분기
   - `AIHub.tsx`에 Zap 아이콘 토글 버튼 (AI SDK ON/OFF)

#### 3. **패키지 추가**
   - `ai@^6.0.78`, `@ai-sdk/google@^3.0.23`, `@ai-sdk/groq@^3.0.22`, `@ai-sdk/react@^3.0.80`

#### 4. **Vercel AI SDK vs Gateway 구분 확인**
   - **이번 세션**: AI SDK (오픈소스 라이브러리, Vercel 키 불필요) ✅
   - **다음 세션**: AI Gateway (Vercel 플랫폼 서비스, API 키 필요, 프록시/캐싱/사용량추적)
   - 사용자 Vercel Pro 계정, AI Gateway $5.00 Free Credit 확인됨

#### 5. **커밋**: `66ede5a` - feat(web): Add Vercel AI SDK integration alongside existing SSE

---

### ✅ 완료된 작업 (2026-02-10 - Session 64: Vercel AI Gateway 멀티모델 연동)

#### 1. **AI Gateway 듀얼 모드 구현** (`web/api/chat-ai.ts`)
   - `AI_GATEWAY_API_KEY` 환경변수로 Gateway/Direct 모드 자동 감지
   - Gateway 모드: `gateway('provider/model')` → Vercel 프록시 경유, BYOK 지원
   - Direct 모드: `google()`, `groq()` → 직접 API 호출 (기존 동작 유지)
   - AI SDK v6 변경 반영: `maxTokens` → `maxOutputTokens`, `toTextStreamResponse()`

#### 2. **멀티모델 카탈로그** (`web/src/services/aiHub.ts`)
   - `DIRECT_MODELS` (2개): Gemini 2.5 Flash Lite, Llama 3.3 70B
   - `GATEWAY_MODELS` (11개, 7 프로바이더):

   | Provider | Models | Tier |
   |----------|--------|------|
   | Google | Gemini 2.5 Flash Lite, Gemini 3 Flash, Gemini 2.5 Pro | free/free/standard |
   | Anthropic | Claude Sonnet 4.5, Claude Haiku 4.5 | premium/standard |
   | OpenAI | GPT-4o Mini, GPT-4o | free/premium |
   | Meta | Llama 3.3 70B | free |
   | DeepSeek | DeepSeek V3.2 | free |
   | Mistral | Mistral Large 3 | standard |
   | xAI | Grok 3 | standard |

#### 3. **듀얼 모델 리스트 전환** (`web/src/hooks/useAIHub.ts`)
   - Gateway 토글 시 `GATEWAY_MODELS` ↔ `DIRECT_MODELS` 자동 전환
   - 모드 전환 시 기본 모델 자동 리셋 (Gateway: `google/gemini-2.5-flash-lite`, Direct: `gemini-2.5-flash-lite`)
   - Plain text stream 파싱 (Vercel AI SDK v6: `toTextStreamResponse()`)

#### 4. **프로바이더별 그룹 드롭다운** (`web/src/pages/AIHub.tsx`)
   - Gateway 모드: 프로바이더별 그룹 헤더 + 모델 수 표시
   - 티어 배지: PRO (premium, 금색), STD (standard, 파란색)
   - 스크롤 가능한 드롭다운 (max-h-70vh)

#### 5. **환경변수 설정**
   - `AI_GATEWAY_API_KEY` → 로컬 `.env`에 설정 완료
   - Vercel 프로덕션에는 아직 미설정 (다음 세션에서 설정)

#### 6. **커밋**: `65dc180` - feat(web): Add Vercel AI Gateway with multi-model support

---

### 🔲 다음 세션 작업 (Session 65+)

#### 🔴 최우선

1. **Gateway 실기기 테스트** ⭐
   - 로컬 dev 서버에서 Gateway 토글 ON → 각 모델 응답 확인
   - Vercel 프로덕션 환경변수 `AI_GATEWAY_API_KEY` 설정
   - Gateway 모델 확장 검토 (Vercel 문서에 더 많은 모델 지원)

2. **Vercel AI Accelerator 온라인 지원서 제출** (마감 **2/16**)
   - 지원 URL: https://vercel.com/ai-accelerator
   - 제안서: `VERCEL_AI_ACCELERATOR.md` 내용 기반

3. **Anthropic Economic Futures 온라인 지원서 제출** (Rolling)
   - 지원 URL: https://www.anthropic.com/economic-futures
   - 제안서: `ANTHROPIC_ECONOMIC_FUTURES.md` 내용 기반

#### 🟠 높은 우선순위

4. **게임 서버 MiningPool 연동**
   - `web/api/mining-claim.ts` 엔드포인트 생성
   - MiningPool.claimForUser() 호출 로직

5. **토크노믹스 대시보드**
   - 온체인 잔액 실시간 표시 UI
   - Vesting 진행률, Mining 소진율

6. **GAII 페이지 i18n 완성**
   - 나머지 12개 언어에 `platform.json` 번역 파일 추가

#### 🟡 중간 우선순위

7. **토큰 로고 AI 생성**
8. **Governance 실제 제안 로드**
9. **모바일 실기기 QA 테스트**

#### 🟢 낮은 우선순위

10. **메인넷 배포 준비** (Multi-sig 설정, 감사)

---

### ✅ 완료된 작업 (2026-02-17 - Session 97: Stream 401 수정 & V0.3 계획)

#### 1. **Stream Chat 401 네트워크 끊김 근본 수정** ✅
   - **근본 원인**: `connectUser(user, token)` 사용 → 토큰이 `static`으로 저장 → SDK가 401 시 토큰 갱신 불가
   - **수정**: `connectUserWithProvider(user, tokenProvider)` 로 전환
     - SDK 내부 `isStatic = false` → 401/토큰만료 시 자동 `tokenProvider` 호출
     - WebSocket 재연결 + HTTP API 재시도 모두 자동 토큰 갱신
   - **서버 토큰 24시간 만료 추가**: `chat/lib/stream-client.ts`
     ```typescript
     const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
     return sc.createToken(userId, exp);
     ```
   - **전체 재연결 폴백**: `wsConnectionStatusStream` 감시 → SDK 재연결 포기 시 `_attemptFullReconnect()` 호출

#### 2. **온보딩 슬라이드 A24 반응형 대응** ✅
   - `MediaQuery.of(context).size.height < 700` → compact 모드 자동 전환
   - compact 모드 사이즈 조정:
     | 요소 | 일반 | compact |
     |------|------|---------|
     | 로고 | 80dp | 56dp |
     | 타이틀 폰트 | 30sp | 24sp |
     | 슬라이드 높이 | 200dp | 160dp |
     | 슬라이드 이미지 | 72dp | 52dp |
     | 슬라이드 타이틀 | 20sp | 17sp |
     | 슬라이드 설명 | 15sp | 13sp |
     | 버튼 높이 | 52dp | 46dp |

#### 3. **푸시 알림 테스트 가이드** ✅
   - Stream Chat Dashboard → Push Notifications → Firebase 설정 필수
   - Push Provider Name: `almachat` (코드와 일치)
   - 6가지 테스트 시나리오 정리 (포그라운드/백그라운드/종료/알림탭 등)

#### 4. **V0.3 계획 수립** ✅
   - `chat-app/V0.3_PLAN.md` 생성
   - Phase 1: 안정성 강화 (✅ 완료)
   - Phase 2: 초대 링크 시스템
   - Phase 3: 밋업 녹음 & 데이터 수집
   - Phase 4: Kindness AI 분석 MVP (Gemini Audio API → STT → 요약 → 점수)
   - Phase 5: 폴리싱 & 확장

#### 5. **커밋**
   - `890a196` - fix(chat-app): Fix Stream 401 disconnect and responsive onboarding
   - 4개 파일, +297줄, -40줄

### ✅ 완료된 작업 (2026-02-17 - Session 98: 프로필 이미지 & 로그인 버그 수정)

#### 1. **Android 뒤로가기 앱 종료 방지** ✅
   - `_MainShell`에 `PopScope` 위젯 추가
   - 채팅 탭이 아니면 채팅 탭으로 이동
   - 채팅 탭에서 2초 내 두 번 누르면 앱 종료
   - 15개 언어 `app.pressBackToExit` 번역 추가

#### 2. **Web3Auth 로그인 후 홈 화면 전환 안 되는 문제 수정** ✅
   - **근본 원인**: `_completeRedirectLogin`이 `void`여서 `widget.onSocialLogin`을 await하지 않음 → 예외 발생 시 `setState(_isConnected = true)` 미실행
   - **수정**: `_completeRedirectLogin`을 `Future<void> async`로 변경 + `await widget.onSocialLogin()`
   - `_handleSocialLogin`, `_handleGuestLogin`에 try-catch 추가 → Stream 연결 실패해도 홈 화면 진입

#### 3. **프로필 이미지 캐시 문제 수정** ✅ (부분)
   - **캐시 버스팅**: 업로드 URL에 `?v=${timestamp}` 추가 → `Image.network` 캐시 무효화
   - **하단 네비 프로필 아이콘**: `currentUserStream` 구독으로 `_MainShellState` 자동 rebuild
   - **AuthService 동기화**: `setProfileImage()` 메서드 추가, 업로드/복원 시 AuthService에도 동기화
   - **Stream 서버 백업**: 세션 복원 시 SessionStorage 이미지가 Stream에 없으면 push

#### 4. **소셜 아바타 덮어쓰기 방지** ✅ (부분)
   - **근본 원인**: `connectUserWithProvider(User(image: googleAvatar))`가 소셜 로그인 시 Google 아바타를 Stream 서버에 보내 기존 커스텀 이미지 덮어씀
   - **수정**: `connectUserWithProvider`에 `image` 미전달 → Stream 서버 기존 이미지 보존
   - 서버에 이미지 없을 때만 (최초 로그인) `partialUpdateUser`로 소셜 아바타 설정
   - `_attemptFullReconnect`에서도 동일 패턴 적용

#### 5. **Backend `upsertStreamUser` 수정** ✅
   - `chat/lib/stream-client.ts`: undefined 필드를 포함하지 않도록 변경
   - 토큰 갱신 시 image가 undefined로 전달되어 기존 이미지 덮어쓰는 문제 해결

#### 6. **커밋**
   - `f064d29` - fix(chat-app): Prevent back-button exit, preserve profile image on restart
   - `6d12bcc` - fix(chat-app): Ensure login screen transitions to home after Web3Auth
   - `d63e547` - fix(chat-app): Fix profile image persistence and bottom nav reactivity
   - `5cb1047` - fix(chat-app): Prevent social avatar from overwriting custom profile image

#### 7. **미해결 이슈: 프로필 이미지 로그아웃 후 재로그인 시 소실** 🔴
   - **증상**: 커스텀 프로필 이미지 업로드 후, 로그아웃 → 재로그인하면 프로필 이미지가 보이지 않음
   - **현재까지 시도한 수정**:
     - Backend `upsertStreamUser`에서 undefined 필드 제외 ✅
     - `connectUserWithProvider`에 image 미전달 ✅
     - 서버에 이미지 없을 때만 소셜 아바타 설정 ✅
     - `_syncProfileImageFromServer()` 호출로 서버 이미지 → SessionStorage 동기화 ✅
   - **다음 세션에서 조사할 사항**:
     - `connectUserWithProvider`가 image 없이 호출될 때 Stream SDK가 서버의 기존 이미지를 정말 보존하는지 확인 (SDK가 `image: null`을 보내면 서버가 기울 수 있음)
     - `partialUpdateUser`의 반환값에서 서버의 실제 이미지 URL 확인 (디버그 로그 추가)
     - Stream Dashboard에서 직접 사용자의 image 필드 확인
     - 로그아웃 → 재로그인 직후 `client.state.currentUser?.image` 값 디버그 출력
     - `_getStreamToken` API 호출 시 서버의 `upsertStreamUser`가 image를 건드리지 않는지 Vercel 로그 확인
   - **파일 참조**:
     - `chat-app/lib/main.dart`: `_handleSocialLogin`, `_checkExistingSession`, `_syncProfileImageFromServer`
     - `chat-app/lib/screens/profile_screen.dart`: `_pickAndUploadPhoto`
     - `chat-app/lib/services/auth_service.dart`: `setProfileImage`, `loginWithSocial`
     - `chat/lib/stream-client.ts`: `upsertStreamUser`
     - `chat/api/stream-token.ts`: API 엔드포인트

### ✅ 완료된 작업 (2026-02-17 - Session 99: 프로필 이미지 영속 복원 시스템)

#### 1. **프로필 이미지 로그아웃 후 소실 문제 근본 수정** ✅
   - **근본 원인 분석**:
     - `SessionStorage.clear()` (로그아웃 시) → profileImage 포함 모든 세션 데이터 삭제
     - 재로그인 시 커스텀 이미지 URL 복원 불가 (소셜 아바타만 남음)
     - `connectUserWithProvider(User(id, name))` → image 미전달 시 서버가 기존 이미지를 보존할 수도, 덮어쓸 수도 있음

   - **해결: 영속 프로필 이미지 저장소 추가**
     - `SessionStorage.savePersistentImage(userId, url)`: 별도 키 `persistent_profile_image_{userId}`에 저장
     - `SessionStorage.getPersistentImage(userId)`: 로그아웃 후에도 조회 가능
     - `SessionStorage.clearPersistentImage(userId)`: 사용자가 사진 직접 삭제 시
     - 키가 `clear()` 메서드의 삭제 범위에 포함되지 않아 로그아웃 후에도 유지

   - **이미지 복원 로직 중앙화: `_ensureProfileImage()`**
     - 기존 분산된 복원 로직 (`_syncProfileImageFromServer`, 세션 복원 코드, 소셜 아바타 설정 코드) 통합
     - 복원 우선순위: **서버 이미지 > 영속 저장소 > 소셜 아바타**
     - `_checkExistingSession`, `_handleSocialLogin` 모두 동일 메서드 호출

   - **프로필 업로드/삭제 시 영속 저장소 동기화**
     - `_pickAndUploadPhoto`: 업로드 성공 시 `savePersistentImage()` 호출
     - `_removePhoto`: 삭제 시 `clearPersistentImage()` 호출

   - **디버그 로깅 추가** (진단용)
     - `[ProfileImage]`: 이미지 복원 플로우 추적
     - `[Session]`: 세션 복원 시점 이미지 상태
     - `[SocialLogin]`: 소셜 로그인 시점 이미지 상태

#### 2. **수정 파일 3개**
   | 파일 | 변경 |
   |------|------|
   | `session_storage.dart` | 영속 이미지 메서드 3개 추가 |
   | `profile_screen.dart` | 업로드/삭제 시 영속 키 동기화 |
   | `main.dart` | `_ensureProfileImage()` 중앙화, 디버그 로깅 |

#### 3. **커밋**
   - `2d478f5` - fix(chat-app): Persist profile image across logout/re-login cycles
   - 3개 파일, +89줄, -27줄

---

### ✅ 완료된 작업 (2026-02-17 - Session 100: DB 기반 프로필 이미지 관리 시스템)

#### 1. **다기기 프로필 이미지 소실 버그 발견 및 분석** ✅
   - **증상**: 기기1에서 프로필 이미지 설정 후, 기기2에서 **다른 계정**으로 로그인하면 기기1의 프로필 이미지가 사라짐
   - **근본 원인**: `connectUserWithProvider(User(id, name))` 호출 시 `image` 필드 미전달 → Stream SDK가 서버에 `image: null`을 보냄 → 서버가 기존 이미지를 삭제 → `user.updated` 이벤트가 다른 디바이스로 전파
   - **초기 접근 (커밋 `9dc6d22`)**: 서버에서 기존 유저 이미지를 조회하여 토큰 응답에 포함 → Flutter에서 `connectUserWithProvider(User(image: serverImage))`로 보존
   - **사용자 피드백**: "같은 계정이 아니다. 서로 다른 계정으로 로그인한다" → DB 기반 단순화 접근으로 전환

#### 2. **Supabase DB 기반 Single Source of Truth 시스템 구축** ✅
   - **핵심 전략**: 기존 4개 저장소 (Stream Server, SharedPreferences persistent, SessionStorage, AuthService 메모리) → **Supabase `chat_profiles` 테이블 1개**로 단순화
   - **마이그레이션**: `supabase/migrations/20260217_chat_profiles.sql`
     ```sql
     CREATE TABLE chat_profiles (
       user_id TEXT PRIMARY KEY,
       profile_image_url TEXT,
       display_name TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```
   - **RLS 정책**: 누구나 읽기, 누구나 upsert/update 가능

#### 3. **ProfileService 생성** ✅
   - `chat-app/lib/services/profile_service.dart` (신규)
   - `getProfileImage(userId)`: DB에서 URL 조회
   - `saveProfileImage(userId, url)`: DB에 upsert
   - `removeProfileImage(userId)`: DB에서 삭제

#### 4. **프로필 업로드/삭제 수정** ✅
   - `profile_screen.dart`: SessionStorage 호출 제거 → `ProfileService.saveProfileImage()` / `removeProfileImage()` 사용
   - Stream `partialUpdateUser`는 채널 리스트 아바타용으로 유지

#### 5. **이미지 복원 로직 단순화** ✅
   - `main.dart`: 45줄 `_ensureProfileImage()` → 20줄 `_syncProfileImageFromDB()`로 교체
   - 복원 우선순위: **DB 이미지 > 소셜 아바타**
   - `connectUserWithProvider`에서 `image` 파라미터 완전 제거 (4곳)

#### 6. **레거시 코드 정리** ✅
   | 파일 | 제거 대상 |
   |------|----------|
   | `session_storage.dart` | `savePersistentImage`, `getPersistentImage`, `clearPersistentImage` |
   | `auth_service.dart` | `_serverImage` 필드, `serverImage` getter |
   | `stream-token.ts` | `queryStreamUserImage` 호출, 응답의 `image` 필드 |
   | `stream-client.ts` | `queryStreamUserImage()` 함수 전체 |

#### 7. **커밋 (2개)**
   - `9dc6d22` - fix(chat-app): Preserve profile image across multi-device login (초기 접근)
   - `07ca22e` - refactor(chat-app): Use Supabase DB as single source of truth for profile images (최종 해결)
   - 총 8개 파일 수정, 복잡도 대폭 감소 (-85줄 순감)

---

### ✅ 완료된 작업 (2026-02-17 - Session 101: V0.3 Phase 2 초대 링크 시스템)

#### 1. **Supabase `invite_links` 테이블 생성** ✅
   - `supabase/migrations/20260217100000_invite_links.sql` (신규)
   - 컬럼: id (UUID PK), code (UNIQUE), channel_id, channel_type, created_by, expires_at, max_uses, use_count
   - 인덱스: code, channel_id, created_by
   - RLS: 누구나 읽기/쓰기/수정 가능
   - ⚠️ **Supabase Dashboard에서 SQL 직접 실행 필요** (마이그레이션 히스토리 충돌로 push 실패)

#### 2. **create-invite API** ✅
   - `chat/api/create-invite.ts` (신규)
   - POST `/api/create-invite` → `{ userId, channelId, channelType? }`
   - 6자리 초대 코드 생성 (문자셋: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` — I/O/0/1 제외)
   - 7일 만료, 기존 유효 코드 재사용
   - 반환: `{ success, code, inviteUrl, expiresAt }`

#### 3. **join-invite API** ✅
   - `chat/api/join-invite.ts` (신규)
   - POST `/api/join-invite` → `{ userId, code }`
   - 코드 검증 (만료, max_uses), 대소문자 무관
   - Stream Chat `channel.addMembers([userId])` 서버사이드 실행
   - use_count 증가
   - 에러 타입: `invalid_code`, `expired_code`, `max_uses_reached`

#### 4. **chat_screen.dart 수정** ✅
   - `_shareInviteLink()`: 동기 → 비동기 전환, `/api/create-invite` API 호출
   - 로딩 다이얼로그 표시
   - `_showInviteBottomSheet()`: 초대 코드 강조 표시 (28px 모노스페이스, letter-spacing 6)
   - 에러 처리 (`invite.createFailed` 번역 키)

#### 5. **channel_list_screen.dart 수정** ✅
   - `_showChannelOptions()` 바텀시트에 "코드로 참여" 옵션 추가
   - 아이콘: `Icons.vpn_key_outlined`, 색상: `AlmaTheme.sandGold`
   - `_showJoinByCodeDialog()`: 6자리 텍스트 필드 (대문자, 모노스페이스)
   - `/api/join-invite` API 호출 → 성공 시 채널로 이동
   - `StatefulBuilder` 패턴으로 다이얼로그 내 로딩 상태 관리

#### 6. **15개 언어 번역 추가** ✅
   - `app_strings.dart`에 150개 새 번역 항목 (15개 언어 × 10개 키)
   - 새 키: `invite.joinByCode`, `invite.joinByCodeDesc`, `invite.codeLabel`, `invite.join`, `invite.invalidCode`, `invite.expiredCode`, `invite.joinSuccess`, `invite.joinFailed`, `invite.creating`, `invite.createFailed`

#### 7. **커밋**
   - `e4acd13` - feat(chat): Implement invite link system (V0.3 Phase 2)
   - 6개 파일, +750줄, -18줄

#### 8. **실기기 테스트 전 필요 작업**
   - Supabase Dashboard에서 `invite_links` 테이블 SQL 직접 실행
   - Vercel 배포 (chat 백엔드 신규 API)
   - Vercel 환경변수 `SUPABASE_SERVICE_KEY` 확인

---

### ✅ 완료된 작업 (2026-02-17 - Session 102: V0.3 Phase 3 밋업 녹음 & 데이터 수집)

#### 1. **DB 마이그레이션** ✅
   - `supabase/migrations/20260218100000_meetup_recordings.sql` (신규)
   - `meetups.status` CHECK 확장: `'upcoming', 'in_progress', 'ended', 'completed', 'cancelled'`
   - `meetups` 테이블에 `started_at`, `ended_at` TIMESTAMPTZ 컬럼 추가
   - `meetup_recordings` 테이블 생성 (id, meetup_id, recorder_id, storage_path, public_url, duration_seconds, file_size_bytes, format, status, created_at)
   - `meetup-recordings` Storage 버킷 (150MB 제한, audio MIME types)
   - RLS 정책 + 인덱스 설정
   - Supabase migration history repair (`20260217` orphan entry) 후 push 성공

#### 2. **패키지 + 플랫폼 권한** ✅
   - `pubspec.yaml`: `record: ^5.2.0`, `path_provider: ^2.1.5` 추가
   - `dependency_overrides`: `record_linux: ^1.1.0` (→ 1.3.0 resolved, record_platform_interface 호환)
   - `AndroidManifest.xml`: `RECORD_AUDIO`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MICROPHONE` 권한
   - `Info.plist`: `NSMicrophoneUsageDescription`, `UIBackgroundModes` > `audio`

#### 3. **RecordingService 생성** ✅
   - `chat-app/lib/services/recording_service.dart` (신규)
   - 기존 static 메서드 패턴 (ProfileService/MeetupService와 동일)
   - 기능: `hasPermission()`, `startRecording(meetupId)`, `stopRecording()`, `isRecording()`, `getElapsedSeconds()`
   - 업로드: `uploadRecording()` — Supabase Storage 업로드 + DB 레코드 생성
   - 조회: `getRecordings(meetupId)` — 밋업의 녹음 파일 목록
   - AAC 128kbps, 44100Hz, 모노, 최대 2시간 자동 중지 (7200초)
   - Storage 경로: `recordings/{meetupId}/{filename}`

#### 4. **MeetupService 라이프사이클 확장** ✅
   - `startMeetup(meetupId)`: upcoming → in_progress, started_at 기록
   - `endMeetup(meetupId)`: in_progress → ended, ended_at 기록
   - `completeMeetup(meetupId)`: ended → completed
   - `getUpcomingMeetups()` 수정: `['upcoming', 'in_progress']` 필터

#### 5. **i18n 번역 키 추가** ✅
   - 18개 키 × 15개 언어 = 270 항목
   - 키: `home.inProgress`, `home.ended`, `home.startMeetup`, `home.endMeetup`, `home.endMeetupConfirm`
   - 키: `recording.start/stop/recording/uploading/uploaded/failed/permissionDenied/permissionDesc/maxDuration/duration/recordings/noRecordings/processing`

#### 6. **RecordingIndicator 위젯** ✅
   - `chat-app/lib/widgets/recording_indicator.dart` (신규)
   - 빨간 점 펄스 애니메이션 (0.4~1.0 opacity) + "REC" + HH:MM:SS
   - `LiveRecordingIndicator`: Timer 기반 자동 업데이트 래퍼
   - 정지 버튼, AlmaTheme.error 색상

#### 7. **MeetupDetailScreen UI 확장** ✅
   - 녹음 상태 관리: `_isRecording`, `_isUploading`, `_recordingTimer`, `_recordingElapsed`, `_recordings`
   - 호스트 감지: `_isHost => _userId == _hostAddress`
   - **상태별 UI 분기:**
     | 상태 | 호스트 UI | 참가자 UI |
     |------|----------|----------|
     | upcoming | "밋업 시작" 버튼 + 참가/탈퇴 | 참가/탈퇴 |
     | in_progress | 녹음 시작/중지 + RecordingIndicator + "밋업 종료" | "진행 중" 배지 |
     | ended | 녹음 파일 목록 + "완료" 버튼 | "종료됨" 배지 |
     | completed | 녹음 목록 | 녹음 목록 |
   - 밋업 종료 시 녹음 자동 중지 + 업로드
   - 확인 다이얼로그 (시작/종료)

#### 8. **HomeScreen 업데이트** ✅
   - 필터 탭에 `in_progress` 추가 (upcoming | in_progress | completed | all)
   - `_statusBadge`에 `in_progress` (terracottaOrange), `ended` (warning) 케이스 추가
   - 밋업 카드 border highlight: `isUpcoming` → `isActive` (upcoming + in_progress)

#### 9. **APK 빌드 성공** ✅
   - `flutter build apk --release` → 75.6MB
   - `record_linux` 호환 이슈: `dependency_overrides`로 `record_linux: ^1.1.0` 적용하여 해결

#### 10. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `supabase/migrations/20260218100000_meetup_recordings.sql` | **신규** |
   | `chat-app/lib/services/recording_service.dart` | **신규** |
   | `chat-app/lib/widgets/recording_indicator.dart` | **신규** |
   | `chat-app/pubspec.yaml` | 수정 (패키지 2개 + dependency_overrides) |
   | `chat-app/pubspec.lock` | 수정 (의존성 해결) |
   | `chat-app/android/app/src/main/AndroidManifest.xml` | 수정 (권한 3개) |
   | `chat-app/ios/Runner/Info.plist` | 수정 (마이크, 백그라운드 오디오) |
   | `chat-app/lib/services/meetup_service.dart` | 수정 (메서드 3개 + 필터 수정) |
   | `chat-app/lib/l10n/app_strings.dart` | 수정 (270 번역 항목) |
   | `chat-app/lib/screens/meetup_detail_screen.dart` | 수정 (대규모 UI 확장) |
   | `chat-app/lib/screens/home_screen.dart` | 수정 (필터 탭 + 배지) |
   - **총 11개 파일** (신규 3개, 수정 8개), +807줄

---

### ✅ 완료된 작업 (2026-02-18 - Session 103: 밋업 그룹 채팅 자동 생성)

#### 1. **DB 마이그레이션** ✅
   - `supabase/migrations/20260218200000_meetup_channel_id.sql` (신규)
   - `meetups` 테이블에 `channel_id TEXT` 컬럼 추가
   - `idx_meetups_channel_id` 인덱스 생성
   - ⚠️ **Supabase Dashboard에서 SQL 직접 실행 필요**

#### 2. **stream-client.ts 확장** ✅
   - `createMeetupChannel()` 함수에 `channel.addMembers([hostUserId])` 추가
   - 메타데이터 저장: `meetup_date`, `meetup_location`, `meetup_description`

#### 3. **API 엔드포인트 생성** ✅
   - `chat/api/create-meetup-channel.ts` (신규) — POST `/api/create-meetup-channel`
     - Request: `{ meetupId, hostUserId, meetupTitle, meetupDate?, meetupLocation?, meetupDescription? }`
     - Response: `{ success, channelId }`
   - `chat/api/leave-channel.ts` (신규) — POST `/api/leave-channel`
     - Request: `{ userId, channelId, channelType? }`
     - Response: `{ success }`

#### 4. **MeetupService 채널 연동** ✅
   - `createMeetup()`: 밋업 생성 후 `/api/create-meetup-channel` 호출 → `channel_id` 저장
   - `joinMeetup()`: 참가 후 `/api/join-channel`로 Stream 채널 멤버 추가
   - `leaveMeetup()`: 탈퇴 후 `/api/leave-channel`로 Stream 채널 멤버 제거
   - Best-effort 패턴: 채널 작업 실패해도 DB 작업은 성공 유지

#### 5. **chat_widgets.dart 공유 위젯 추출** ✅
   - `chat-app/lib/widgets/chat_widgets.dart` (신규)
   - 4개 위젯 추출: `ConnectionBanner`, `TypingIndicator`, `TypingDots`, `MemberCountBadge`
   - private → public 클래스로 변환

#### 6. **chat_screen.dart 리팩토링** ✅
   - 4개 private 위젯 클래스 제거 (~225줄 삭감)
   - `chat_widgets.dart` import로 전환
   - 파일 크기: 535줄 → ~310줄

#### 7. **meetup_chat_screen.dart 생성** ✅
   - `chat-app/lib/screens/meetup_chat_screen.dart` (신규)
   - `MeetupChatScreen`: ConsumerStatefulWidget
   - AppBar: 밋업 제목 + 번역 언어 표시 + info 토글 + MemberCountBadge
   - 접기/펼치기 가능한 `_MeetupInfoHeader` (AnimatedCrossFade)
     - 상태 배지 (upcoming/in_progress/ended/completed)
     - 날짜 (calendar 아이콘)
     - 장소 (location 아이콘)
   - StreamMessageListView + TranslatedMessage + TypingIndicator + StreamMessageInput

#### 8. **meetup_detail_screen.dart 채팅 FAB 추가** ✅
   - `FloatingActionButton.extended` (chat_bubble 아이콘 + "채팅" 라벨)
   - `_openMeetupChat()`: channel.watch() → StreamChannel 래핑 → MeetupChatScreen 네비게이션
   - 채널 ID: DB의 `channel_id` 우선, 없으면 `meetup-{meetupId}` 폴백

#### 9. **i18n 15개 언어 번역** ✅
   - 3개 키 × 15개 언어 = 45 항목 추가
   - `meetupChat.openChat`: "채팅" / "Chat"
   - `meetupChat.openFailed`: "밋업 채팅을 열 수 없습니다" / "Failed to open meetup chat"
   - `meetupChat.toggleInfo`: "밋업 정보" / "Meetup Info"

#### 10. **APK 빌드 성공** ✅
   - `flutter build apk --release` → 75.6MB

#### 11. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `supabase/migrations/20260218200000_meetup_channel_id.sql` | **신규** |
   | `chat/api/create-meetup-channel.ts` | **신규** |
   | `chat/api/leave-channel.ts` | **신규** |
   | `chat-app/lib/widgets/chat_widgets.dart` | **신규** |
   | `chat-app/lib/screens/meetup_chat_screen.dart` | **신규** |
   | `chat/lib/stream-client.ts` | 수정 (addMembers + 메타데이터) |
   | `chat-app/lib/services/meetup_service.dart` | 수정 (채널 연동 3개 메서드) |
   | `chat-app/lib/screens/chat_screen.dart` | 수정 (공유 위젯 import 전환, -225줄) |
   | `chat-app/lib/screens/meetup_detail_screen.dart` | 수정 (FAB + _openMeetupChat) |
   | `chat-app/lib/screens/home_screen.dart` | 수정 (meetup_chat_screen status 배지) |
   | `chat-app/lib/l10n/app_strings.dart` | 수정 (45 번역 항목) |
   - **총 11개 파일** (신규 5개, 수정 6개), +379줄, -242줄

---

### ✅ 완료된 작업 (2026-02-18 - Session 104: 배포 준비 & 코드 리뷰 버그 수정)

#### 1. **Supabase 마이그레이션 적용** ✅
   - `meetups.channel_id` TEXT 컬럼 + 인덱스 추가 (`20260218200000`)
   - `chat_profiles` 테이블 확인 (이미 존재, skip)
   - 마이그레이션 히스토리 복구 (`20260217` orphan → reverted)
   - `supabase db push --include-all` 성공

#### 2. **Vercel 백엔드 배포 확인** ✅
   - 14개 API 엔드포인트 모두 배포 완료 (chat.almaneo.org)
   - 새 API 4개 응답 확인: `create-meetup-channel`, `leave-channel`, `create-invite`, `join-invite`

#### 3. **코드 리뷰 버그 10개 발견 & 수정** ✅
   - 3개 백그라운드 에이전트로 병렬 코드 리뷰 수행
   - 커밋: `708322e` - fix(chat-app,chat): Fix 10 bugs from code review
   - 7개 파일, +86줄, -51줄

   **백엔드 수정 (3개 파일):**
   | 파일 | 수정 |
   |------|------|
   | `join-channel.ts` | 채널 메타데이터 덮어쓰기 방지 + `getStreamClient()` 사용 |
   | `leave-channel.ts` | `getStreamClient()` 사용 통일 |
   | `join-invite.ts` | `getStreamClient()` import + 사용 |

   **Flutter 수정 (4개 파일):**
   | 파일 | 수정 |
   |------|------|
   | `meetup_detail_screen.dart` | ghost channel 방지 (channel_id null 체크), `didChangeDependencies` 패턴, 녹음 종료 순서 변경 (확인 후 중지) |
   | `chat_screen.dart` | `dialogDismissed` 플래그로 double `Navigator.pop()` 방지 |
   | `channel_list_screen.dart` | async 갭 전 `StreamChat.of(context).client` 캡처 |
   | `recording_service.dart` | `_isStopping` 가드 (동시 stop 방지), lazy `AudioRecorder` 재생성, 업로드 실패 시 DB 레코드 `failed` 마킹, `onAutoStop` 콜백 |

#### 4. **APK 빌드** ✅
   - 최종 빌드: `app-release.apk` (75.6MB)
   - 실기기 테스트 미진행 (다음 세션)

#### 5. **git push 완료** ✅
   - `d49ef67..708322e main -> main`

---

### ✅ 완료된 작업 (2026-02-18 - Session 105: 밋업 기능 개선 & V0.3 완료 & V0.4 계획)

#### 1. **밋업 채팅 버튼 fallback 수정** ✅
   - `meetup_detail_screen.dart`: `_openMeetupChat()` channel_id null 체크 + `meetup-{meetupId}` fallback 패턴
   - APK 빌드 성공 (75.9MB)

#### 2. **밋업 8개 기능 개선** ✅
   - 밋업 생성 시 제목/설명/장소/날짜/인원 입력
   - 밋업 카드에 참가자 수, 장소, 날짜 표시
   - 밋업 상세에서 참가/탈퇴, 호스트 녹음/종료
   - 밋업 채팅 FAB (channel_id 연동)

#### 3. **V0.3 완료 정리** ✅
   - `V0.3_PLAN.md` 최종 상태 업데이트
   - Phase 1-3: ✅ 완료
   - Phase 4 (Kindness AI): ❌ V0.5+로 연기 (사용자 결정)
   - 추가 완료: 프로필 영속, 밋업 채팅, 코드 리뷰 버그 수정 등

#### 4. **V0.4 계획 수립** ✅
   - `V0.4_PLAN.md` 생성
   - **Phase A**: Theme Infrastructure — AlmaColors ThemeExtension, ThemeProvider, context.alma 확장
   - **Phase B**: High-Impact Screen Migration (6파일, ~600 변경)
   - **Phase C**: Remaining Screen Migration (5파일, ~250 변경)
   - **Phase D**: Widget Migration (8파일, ~200 변경)
   - **Phase E**: App Guide / Onboarding Redesign (6 슬라이드, 첫실행 플래그)
   - **Light Theme 색상**: Warm Cream (#F5F0EB) 배경, 베이지 톤 통일
   - 총 ~21파일, ~1,750라인 변경 예상, 6~9 세션

---

### ✅ 완료된 작업 (2026-02-18 - Session 106: V0.4 Phase B - High-Impact Screen Migration)

#### 1. **Phase B: 6개 고영향 화면 색상 마이그레이션 완료** ✅
   - 하드코딩된 색상 → 시맨틱 `context.alma.*` 토큰으로 전환
   - 총 ~315개 색상 변경, ~600줄 수정
   - 브랜드 색상 보존 (electricBlue, terracottaOrange, success, error)

#### 2. **settings_screen.dart 전면 리라이팅** ✅
   - 테마 선택 UI 추가 (System / Light / Dark)
   - Notifications와 Language 사이에 새 섹션 배치
   - 3개 옵션 카드 (선택 시 electricBlue 강조)
   - themeProvider 연동, alma 색상 토큰 적용

#### 3. **15개 언어 테마 번역 추가** ✅
   - `app_strings.dart`: 4개 키 × 15개 언어 = 60 항목
   - 키: `settings.theme`, `settings.themeSystem`, `settings.themeLight`, `settings.themeDark`
   - 지원 언어: ko, en, zh, ja, es, fr, ar, vi, th, pt, id, hi, de, ru, tr

#### 4. **channel_list_screen.dart 마이그레이션** ✅ (Task agent)
   - ~80개 색상 변경
   - Settings 버튼, 검색 필드, 빈 상태, 초대 코드 다이얼로그
   - 필터 칩, 채널 타일 텍스트 색상
   - `_chip()` 메서드에 BuildContext 파라미터 추가

#### 5. **chat_screen.dart 마이그레이션** ✅
   - ~30개 색상 변경
   - 로딩 다이얼로그, 초대 링크 바텀시트
   - Builder 클로저 에러 수정: `final alma = context.alma;` 다이얼로그 전에 캡처
   - 다이얼로그/바텀시트 패턴 확립

#### 6. **home_screen.dart 마이그레이션** ✅ (Task agent)
   - ~40개 색상 변경
   - 필터 칩, 밋업 카드, 생성 바텀시트
   - `_filterChip()` 메서드에 alma 파라미터 추가

#### 7. **profile_screen.dart 마이그레이션** ✅ (Task agent)
   - 대형 파일 (1230줄), ~70개 색상 변경
   - 6개 메서드에 `final alma = context.alma;` 추가
   - 7개 헬퍼 메서드에 `AlmaColors alma` 파라미터 추가
   - 모든 호출부 업데이트 (alma 전달)

#### 8. **login_screen.dart 마이그레이션** ✅ (Task agent)
   - ~25개 색상 변경
   - 의도적 브랜딩 보존 (그라디언트 배경, 소셜 버튼 색상)
   - 언어 선택기, 입력 필드, 구분선, 슬라이드 텍스트 색상 마이그레이션

#### 9. **APK 빌드 성공** ✅
   - `flutter build apk --release` → 76.0MB
   - 테마 인프라 추가로 75.6MB → 76.0MB 증가
   - 빌드 시간: 226.3초 (~3.8분)

#### 10. **커밋 연기** (사용자 요청)
   - 사용자 명시: "커밋은 다음세션에서 하도록 한다"
   - 다음 세션에서 Phase C와 함께 커밋 예정

#### 11. **마이그레이션 패턴 확립**
   | 기존 색상 | 시맨틱 토큰 | 용도 |
   |----------|------------|------|
   | `AlmaTheme.slateGray` | `alma.cardBg` | 카드/컨테이너 배경 |
   | `AlmaTheme.deepNavy` | `alma.inputBg` | 입력 필드 배경 |
   | `Colors.white` (텍스트) | `alma.textPrimary` | 주요 텍스트 |
   | `Colors.white70` / `.withValues(0.5-0.6)` | `alma.textSecondary` | 부차 텍스트 |
   | `Colors.white24` / `.withValues(0.2-0.4)` | `alma.textTertiary` | 3차 텍스트 (아이콘 등) |
   | `.withValues(alpha: 0.1)` | `alma.divider` | 구분선 |
   | `.withValues(alpha: 0.08-0.12)` | `alma.chipBg` | 칩/뱃지 배경 |

---

### ✅ 완료된 작업 (2026-02-18 - Session 107: V0.4 Phase B+C 커밋 & Phase C 완료)

#### 1. **Session 105 지연 커밋** ✅
   - `31b1833` - feat(chat-app): Add meetup chat fallback, complete V0.3, and plan V0.4
   - 밋업 채팅 channel_id fallback (`meetup-{id}`), V0.3_PLAN.md 완료, V0.4_PLAN.md 생성

#### 2. **Session 106 지연 커밋 (Phase B)** ✅
   - `7a7b5ab` - feat(chat-app): V0.4 Phase B - Migrate 6 high-impact screens to semantic colors
   - theme.dart, theme_provider.dart, main.dart, app_strings.dart
   - settings, channel_list, chat, home, profile, login_screen

#### 3. **V0.4 Phase C 완료** ✅
   - `eb9b66d` - feat(chat-app): V0.4 Phase C - Migrate remaining 5 screens to semantic colors

   | 파일 | 변경 수 |
   |------|--------|
   | `meetup_detail_screen.dart` | ~85개 |
   | `meetup_chat_screen.dart` | 8개 |
   | `browse_channels_screen.dart` | 11개 |
   | `create_channel_screen.dart` | ~10개 |
   | `find_friends_screen.dart` | ~15개 |

   - APK: 76.0MB ✅, GitHub 푸시 완료

#### 4. **마이그레이션 패턴 (확정)**
   | 기존 색상 | 시맨틱 토큰 | 용도 |
   |----------|------------|------|
   | `AlmaTheme.slateGray` | `alma.cardBg` / `alma.inputBg` | 카드/입력 배경 |
   | `AlmaTheme.deepNavy` (border) | `alma.scaffold` | 온라인 표시 테두리 |
   | `Colors.white` (텍스트) | `alma.textPrimary` | 주요 텍스트 |
   | `Colors.white70/54` | `alma.textSecondary` | 부차 텍스트 |
   | `Colors.white24/38` | `alma.textTertiary` | 3차 텍스트/아이콘 |
   | `.withValues(alpha: 0.1)` | `alma.divider` | 구분선 |
   | `.withValues(alpha: 0.08-0.12)` | `alma.chipBg` | 칩/뱃지 배경 |

---

### ✅ 완료된 작업 (2026-02-18 - Session 108: V0.4 Phase D 후속 버그 수정 & 라이트 모드 완성)

#### 1. **V0.4 Phase D 후속 4개 버그 수정** ✅
   - 커밋: `c2bc208` - fix(chat-app): V0.4 Phase D - Fix 4 light theme issues after migration

   | 이슈 | 파일 | 수정 내용 |
   |------|------|----------|
   | **#1 채팅 말풍선 글자색** | `translated_message.dart` | `alma.textPrimary` → `widget.isMyMessage ? Colors.white : alma.textPrimary` |
   | **#2 입력창 테두리** | `theme.dart` | 라이트 모드 `StreamMessageInputThemeData` 추가 (idle/active 투명 border, 흰색 배경) |
   | **#3 설정 미션 섹션 + 버전** | `settings_screen.dart` | `_buildSettingsTile(trailing: Flexible(...))` → `Container + Row + Expanded(Column)` 재설계; 버전 `v0.1.0` → `v0.4.0` |
   | **#4 AppBar 스크롤 회색** | `theme.dart` | `scrolledUnderElevation: 0`, `surfaceTintColor: Colors.transparent` 추가 |

#### 2. **로그인 화면 라이트 모드 배경 수정** ✅
   - 커밋: `a060d23` - fix(chat-app): Fix login screen background for light mode
   - 문제: `Scaffold.body` Container가 항상 `deepNavy` 다크 그라디언트로 하드코딩
   - 수정: `isDark` 분기 추가
     - 다크: `deepNavy → #1A1A2E → #0D1520` (기존 브랜드 유지)
     - 라이트: `alma.scaffold → alma.surfaceVariant → alma.surface` (Warm Cream)

#### 3. **StreamMessageInput 테두리 완전 제거** ✅ (2단계)
   - 1차 커밋 `93b385d`: `idleBorderGradient` 삭제 → Stream SDK 기본값 폴백으로 여전히 테두리 표시
   - 2차 커밋 `b027730`: 양쪽 gradient를 명시적으로 `Colors.transparent`로 설정 → 완전 제거
   - `inputBackgroundColor: colors.surface` (흰색)으로 배경 대비로 구분

#### 4. **커밋 목록**
   | 커밋 | 내용 |
   |------|------|
   | `c2bc208` | fix: V0.4 Phase D 4개 버그 수정 |
   | `a060d23` | fix: 로그인 화면 라이트 모드 배경 |
   | `93b385d` | fix: StreamMessageInput idle border 제거 (1차) |
   | `b027730` | fix: StreamMessageInput border 완전 제거 (투명 gradient) |

---

### ✅ 완료된 작업 (2026-02-18 - Session 109: V0.4 Phase E 완료 & 온보딩 버그 수정)

#### 1. **V0.4 Phase E — App Guide / Onboarding Redesign 완료** ✅
   - 커밋: `3e8deb8` - feat(chat-app): V0.4 Phase E - App Guide & 6-slide onboarding

   | 파일 | 변경 |
   |------|------|
   | `app_strings.dart` | 슬라이드 4~6 제목/설명 + `settings.appGuide` — 15개 언어 |
   | `app_guide_screen.dart` | **신규** — 6슬라이드 독립 화면, X닫기 + 완료 버튼, 4초 자동전환 |
   | `login_screen.dart` | 3→6 슬라이드 확장, `onboarding_completed` 첫 실행 플래그 |
   | `settings_screen.dart` | "앱 가이드" 타일 추가 (Language ~ About 사이, cyan 아이콘) |

   **슬라이드 구성 (6개):**
   | # | 이미지 | 제목 | 폴백 아이콘 |
   |---|--------|------|-------------|
   | 1 | Auto_Translation.webp | Auto Translation | translate |
   | 2 | Global_Community.webp | Global Community | public |
   | 3 | Kindness_First.webp | Kindness First | favorite |
   | 4 | Meetup_Together.webp | Meetup Together | event |
   | 5 | Small_Heart.webp | Kindness Score | favorite_border |
   | 6 | Get_Started.webp | Ready to Connect? | rocket_launch |

   **동작:**
   - 첫 실행 시 6슬라이드 표시 → "Get Started" 클릭 시 `onboarding_completed = true` 저장
   - 이후 실행 시 슬라이드 건너뛰고 로그인 화면 직접 표시
   - 설정 → "앱 가이드" 타일 → `AppGuideScreen` 다시 표시 (플래그 영향 없음)
   - 4초마다 자동 전진, 슬라이드 6에서 정지
   - 화면 높이 < 700px: compact 모드 (이미지/폰트 크기 축소)

#### 2. **온보딩 플래그 Google 백업 문제 수정** ✅
   - 커밋: `9ebc7f3` - fix(chat-app): Disable Android backup to prevent onboarding flag restore
   - **원인**: `android:allowBackup` 기본값 `true` → 삭제+재설치 시 Google Drive에서 SharedPreferences 자동 복원 → `onboarding_completed = true` 유지
   - **수정**: `AndroidManifest.xml`에 `android:allowBackup="false"` 추가
   - **효과**: 재설치 시 항상 온보딩 슬라이드 표시

   **진단 방법 (참고):**
   ```bash
   # 앱 데이터 확인
   adb shell run-as org.almaneo.alma_chat \
     cat /data/data/org.almaneo.alma_chat/shared_prefs/FlutterSharedPreferences.xml

   # 앱 데이터 완전 삭제 (재설치 없이 초기화)
   adb shell pm clear org.almaneo.alma_chat
   ```

   또는: **Android 설정 → 앱 → AlmaChat → 저장공간 → 데이터 삭제**

#### 3. **실기기 확인** ✅
   - 재설치 후 슬라이드 정상 표시 확인 (스크린샷 검증)
   - APK: 76.1MB

---

### ✅ 완료된 작업 (2026-02-18 - Session 110: 온보딩 슬라이드 이미지 풀 와이드 리디자인)

#### 1. **6개 슬라이드 이미지 AI 생성 프롬프트 작성**
   - 각 슬라이드별 테마, 색상, 구도, 스타일 상세 프롬프트 작성
   - 권장 사이즈: 1200×800 (3:2), 실제 생성: 16:9

   | # | 파일명 | 테마 | 색상 |
   |---|--------|------|------|
   | 1 | `Auto_Translation.webp` | 자동 번역 | 일렉트릭 블루 |
   | 2 | `Global_Community.webp` | 글로벌 커뮤니티 | 시안/블루 |
   | 3 | `Kindness_First.webp` | 친절 우선 / 정(情) | 테라코타 오렌지 |
   | 4 | `Meetup_Together.webp` | 오프라인 밋업 | 테라코타 오렌지 |
   | 5 | `Small_Heart.webp` | Kindness Score | 핑크/로즈 |
   | 6 | `Get_Started.webp` | 시작하기 | 일렉트릭 블루 |

#### 2. **`_buildSlide()` 완전 재설계** (`login_screen.dart`, `app_guide_screen.dart`)
   - 기존: `SizedBox(52~72dp)` 정사각형 아이콘 크기 이미지
   - 변경: `AspectRatio(16/9)` 풀 와이드 이미지 (`BoxFit.cover`)
   - 이미지 아래 남은 공간 `Expanded` → title + desc 수직 중앙 정렬

#### 3. **레이아웃 구조 변경** (두 파일 공통)
   - 기존: `SizedBox(height: 160~200)` 고정 높이 PageView
   - 변경: `Expanded(child: PageView(...))` → 화면 여백을 모두 채움
   - 기존: 큰 로고(56~80dp) + 태그라인 + Spacer 상단 섹션
   - 변경: compact 행 (로고 24~32dp + 앱명) → 상단 패딩만 사용

#### 4. **빌드 결과**
   - APK: **76.3MB** ✅ (이전: 76.1MB)
   - 커밋: `4f6b5fc` - feat(chat-app): Full-width 16:9 onboarding slide images

---

### ✅ 완료된 작업 (2026-02-18 - Session 111: Stream 싱가포르 마이그레이션 & 연결 안정화)

#### 1. **Stream Chat 싱가포르 프로젝트 마이그레이션** ✅
   - 기존: US East 클러스터 (`zz454a2savzv`)
   - 신규: Asia Pacific - Singapore 클러스터 (`hfbghwcu3sp3`)
   - **레이턴시 개선**: 베트남 기준 220~350ms → 30~60ms (4~6배)
   - `chat-app/.env`: `STREAM_API_KEY` 업데이트
   - `chat/.env`: `STREAM_API_KEY`, `STREAM_API_SECRET` 업데이트
   - Vercel 프로덕션 환경변수 업데이트 (`vercel env add` 사용)
   - **Stream Dashboard FCM Push Provider**: 기존 설정 그대로 복사 (알림 정상 작동)

#### 2. **`main.dart` — WidgetsBindingObserver 앱 생명주기 연동** ✅
   - 백그라운드 → 포그라운드 복귀 시 WebSocket 상태 즉시 확인 및 재연결
   - `_lastKnownStatus` 캐시: 스트림 이벤트 없이 현재 연결 상태 판단 가능
   - `_isReconnecting` 플래그: 생명주기 이벤트와 WebSocket 이벤트 중복 재연결 방지
   - `dispose()`에 `removeObserver(this)` 추가로 메모리 누수 방지

   ```dart
   class _AlmaChatAppState extends ConsumerState<AlmaChatApp>
       with WidgetsBindingObserver {
     ConnectionStatus _lastKnownStatus = ConnectionStatus.disconnected;

     @override
     void didChangeAppLifecycleState(AppLifecycleState state) {
       if (state == AppLifecycleState.resumed && _isConnected && !_isReconnecting) {
         if (_lastKnownStatus == ConnectionStatus.disconnected) {
           _attemptFullReconnect();
         }
       }
     }
   }
   ```

#### 3. **`auth_service.dart` — 토큰 요청 지수 백오프 재시도** ✅
   - 최대 3회 시도, 15초 타임아웃/요청
   - 1차 실패 → 1초 대기 → 2차 실패 → 2초 대기 → 3차 실패 → 예외 throw
   - 4xx 클라이언트 에러: 즉시 실패 (재시도 없음)
   - 5xx 서버 에러 / 네트워크 오류: 재시도

#### 4. **커밋 정보**
   - `b249384` - fix(chat-app,chat): Fix push notification and Stream connection stability (Session 111 이전)
   - `b82b78c` - fix(chat): Deploy API to Singapore region (sin1)
   - `2d63ef4` - feat(chat-app): Add app lifecycle reconnect & Stream Asia Pacific migration
   - APK: **76.3MB** ✅

#### 5. **현재 Stream Chat 설정** (Session 113 업데이트)

| 항목 | 값 |
|------|-----|
| **API Key** | `zz454a2savzv` |
| **지역** | US East (기본) |
| **FCM Provider** | `almachat` (V1 HTTP API) |
| **Vercel Backend** | US (`chat.almaneo.org`) |
| **토큰 만료** | 24시간 |
| **Health Endpoint** | v1.2.0, `streamConnected: true` ✅ |

---

### ✅ 완료된 작업 (2026-02-19 - Session 112: Stream "api_key not valid" 진단)

#### 1. **문제 현상**
   - Flutter 실기기 테스트: 로그인은 되나 채널 생성 실패 ("api_key not valid")
   - `health.ts`를 통해 진단 → `streamConnected: false`, error code 2

#### 2. **진단 과정**

   | 시도 | 내용 | 결과 |
   |------|------|------|
   | Singapore baseURL 추가 | `chat-proxy-singapore.stream-io-api.com` | ❌ 여전히 실패 |
   | US East 원래 키로 복원 | `zz454a2savzv` / `ndjrbz...` | ❌ 여전히 실패 |
   | `getInstance()` → `new StreamChat()` | 싱글턴 캐시 문제 배제 | ❌ 여전히 실패 |
   | raw HTTP 진단 추가 | `/app?api_key=...` 직접 호출 | 🔲 미확인 (다음 세션) |

#### 3. **현재 코드 상태 (미해결)**

   **`chat/lib/stream-client.ts`**:
   - `StreamChat.getInstance()` → `new StreamChat()` 변경 (싱글턴 배제)
   - `STREAM_BASE_URL` env var로 지역 URL 오버라이드 가능

   **`chat/api/health.ts`** (v1.0.2):
   - `streamKeyPrefix`: API 키 앞 8자리 표시
   - `streamBaseURL`: 사용 중인 엔드포인트 표시
   - `streamConnected`: SDK 연결 성공 여부
   - `streamRawHttpStatus` + `streamRawHttpBody`: raw HTTP 진단 (신규 추가, 미확인)

   **Vercel 환경변수** (chat 프로젝트):
   ```
   STREAM_API_KEY=zz454a2savzv
   STREAM_API_SECRET=ndjrbz63ggcda3z22swpzgnb75rqs3wbqyswfm6t9sdz9wxuy6tmuxefa9nmr5qf
   ```

   **로컬 `.env` 파일** (동일):
   ```
   chat/.env: STREAM_API_KEY=zz454a2savzv
   chat-app/.env: STREAM_API_KEY=zz454a2savzv
   ```

#### 4. **핵심 미해결 문제** → ✅ **Session 113에서 해결됨**
   - 근본 원인: Vercel 환경변수 설정 시 `echo` 명령어의 trailing newline 문제
   - Session 113에서 `printf`로 재설정하여 해결

#### 5. **커밋 내역**
   - `dc1802d` - fix(chat): Add Singapore baseURL to Stream Chat server SDK
   - `17800d2` - fix(chat): Add streamBaseURL to health diagnostic (v1.0.2)
   - `71183d3` - fix(chat): Revert to US East almachat (zz454a2savzv) Stream app
   - `4ca285c` - fix(chat): Fix misleading streamBaseURL in health diagnostic
   - `74ee889` - fix(chat): Switch to new StreamChat() and add raw HTTP diagnostic

---

### ✅ 완료된 작업 (2026-02-19 - Session 113: Stream "api_key not valid" 근본 해결)

#### 1. **근본 원인 확정 및 해결** ✅
   - **증상**: Stream SDK `getAppSettings()` 호출 시 `"api_key not valid"` (error code 2) 반환
   - **근본 원인**: Vercel CLI에서 `echo "value" | vercel env add` 사용 시 **trailing newline(`\n`) 포함**
     - `zz454a2savzv\n` → Stream 서버에서 유효하지 않은 키로 인식
   - **해결**: `printf "value" | vercel env add` 사용하여 개행 없이 재설정
   - **교훈**: Vercel 환경변수를 CLI로 설정할 때 반드시 `printf` 사용 (echo 금지)

#### 2. **싱가포르 프로젝트 정리** ✅
   - 싱가포르 앱 (`hfbghwcu3sp3`) 삭제 (키가 Stream 서버에서 존재하지 않는 상태였음)
   - US East 앱만 유지 (`zz454a2savzv`) — raw HTTP code 5 (키 유효, 인증 필요) 확인
   - FCM Push Provider 설정 확인 완료

#### 3. **진단 방법 확립** ✅
   - **raw HTTP code 5** (`"stream-auth-type missing or invalid"`): 키가 유효함 (인증 헤더만 필요)
   - **raw HTTP code 2** (`"api_key not found"`): 키가 존재하지 않음
   - health 엔드포인트 v1.2.0: raw HTTP 테스트에 `STREAM_BASE_URL` 반영

#### 4. **실기기 테스트 완료** ✅
   - APK 빌드 성공 (76.3MB)
   - 로그인, 채팅, 채널 생성 정상 작동
   - **푸시 알림 정상 작동** 확인

#### 5. **최종 상태**
   ```
   Health Endpoint (v1.2.0):
   streamKeyPrefix: zz454a2s
   streamConnected: true  ✅
   streamBaseURL: https://chat.stream-io-api.com (default)
   ```

#### 6. **커밋 내역**
   - `45026e9` - fix(chat): Switch to Singapore Stream Chat app (hfbghwcu3sp3)
   - `a40269a` - fix(chat): Use Singapore regional endpoint for Stream Chat
   - `4e7c430` - fix(chat): Fix trailing newline in Vercel env vars (v1.1.2)
   - `4ced820` - fix(chat): Restore US East Stream Chat key (v1.2.0)
   - `4180541` - docs: Update CLAUDE.md with Session 113 summary

---

### ✅ 완료된 작업 (2026-02-19 - Session 114: V0.5 기획 & Phase A 시작)

#### 1. **V0.5 "Social & UX Enhancement" 기획 완료** ✅
   - V0.3/V0.4 완료 상태 리뷰
   - 코드베이스 전체 조사 (34개 Dart 파일, 6개 디렉토리)
   - 사용자 선택: "소셜 & UX 강화" 방향
   - 구현 순서 확정: A(Reactions) → C(Unread Badge) → B(Profile/Info) → D(Safety) → E(Deep Links)
   - `chat-app/V0.5_PLAN.md` 생성

#### 2. **V0.5 Phase A 핵심 위젯 3개 생성** ✅

   | 파일 | 기능 |
   |------|------|
   | `lib/widgets/reaction_picker.dart` | 6개 이모지 가로 피커 (👍 ❤️ 😂 😮 😢 🙏) |
   | `lib/widgets/reaction_bar.dart` | 메시지 하단 리액션 카운트 표시, 탭으로 추가/제거 |
   | `lib/widgets/message_actions_sheet.dart` | 롱프레스 바텀시트 (리액션 + 복사 + 답장 + 삭제) |

   - Stream SDK v9.5 호환: `reactionGroups` 사용 (deprecated `reactionCounts` 대신)
   - `ReactionBar`: 내 리액션은 파란색 하이라이트, 타인 리액션은 기본 chipBg
   - `MessageActionsSheet`: 삭제 시 확인 다이얼로그, 복사 시 SnackBar 피드백

#### 3. **translated_message.dart 수정** ✅
   - 4개 새 파라미터 추가: `onLongPress`, `onReply`, `currentUserId`, `channel`
   - `GestureDetector(onLongPress)` 래핑으로 롱프레스 감지
   - Footer 아래 `ReactionBar` 조건부 표시
   - `_handleReactionTap()` 메서드 추가 (리액션 토글)

---

### ✅ 완료된 작업 (2026-02-19 - Session 115: V0.5 Phase A 완료 & Phase C 완료)

#### 1. **V0.5 Phase A 완료 — 채팅 화면 와이어링** ✅
   - 커밋: `c9b5b9e` - feat(chat-app): V0.5 Phase A - Wire message reactions & actions to chat screens

   | 파일 | 변경 |
   |------|------|
   | `chat_screen.dart` | `StreamMessageInputController` 추가, `_showMessageActions` 메서드, TranslatedMessage 콜백 와이어링, 답장(quotedMessage) 연결 |
   | `meetup_chat_screen.dart` | 동일 패턴 적용 |
   | `app_strings.dart` | 6개 키 × 15개 언어 = 90개 번역 (message.copy/copied/reply/delete/deleteConfirm/deleteConfirmDesc) |

#### 2. **V0.5 Phase C 완료 — 읽지 않은 메시지 뱃지 & 스크롤 FAB** ✅
   - 커밋: `1dab408` - feat(chat-app): V0.5 Phase C - Add unread badge, scroll FAB & markRead

   | 파일 | 변경 |
   |------|------|
   | `main.dart` | `_buildChatIcon()` — `StreamBuilder<int>` on `totalUnreadCountStream`, Badge 표시 |
   | `chat_screen.dart` | `scrollToBottomBuilder` — 테마 적용 원형 FAB + 읽지 않은 수 Badge |
   | `meetup_chat_screen.dart` | 동일 scrollToBottomBuilder 패턴 |
   | `channel_list_screen.dart` | `_navigateToChannel`에 `channel.markRead()` 추가 |

   - 4개 파일, +82줄, -2줄

#### 3. **V0.5_PLAN.md 업데이트** ✅
   - Phase A: ✅ Completed
   - Phase C: ✅ Completed
   - APK: 76.4MB ✅

---

### ✅ 완료된 작업 (2026-02-19 - Session 116: V0.5 Phase B 완료)

#### 1. **UserProfileSheet 위젯 생성** ✅
   - `chat-app/lib/widgets/user_profile_sheet.dart` (신규)
   - 바텀시트: 아바타(40dp), 이름, 온라인 상태, 유저 ID 복사, "메시지 보내기" DM 버튼
   - `UserProfileSheet.show()` 정적 메서드로 어디서나 호출 가능
   - `_startDM()`: distinct messaging 채널 생성 → ChatScreen 네비게이션
   - `_formatLastSeen()`: 번역된 상대 시간 표시 (방금, N분 전, N시간 전, N일 전)

#### 2. **ChannelInfoScreen 생성** ✅
   - `chat-app/lib/screens/channel_info_screen.dart` (신규)
   - 풀스크린: 채널 아바타, 이름, 설명, 멤버 수, 생성일
   - 멤버 목록: 온라인 표시, 역할 배지 (owner/admin), "나" 배지
   - 멤버 탭 → UserProfileSheet
   - 뮤트/뮤트해제: 클라이언트 사이드 `channel.mute()`/`channel.unmute()` (백엔드 불필요)
   - 채널 나가기: 확인 다이얼로그 → `channel.removeMembers()` → 루트로 이동

#### 3. **translated_message.dart 수정** ✅
   - `onAvatarTap` 콜백 파라미터 추가 (`void Function(User user)?`)
   - 아바타를 GestureDetector로 래핑하여 탭 감지

#### 4. **chat_screen.dart 와이어링** ✅
   - AppBar 제목 GestureDetector → ChannelInfoScreen 네비게이션
   - TranslatedMessage `onAvatarTap` → UserProfileSheet.show()

#### 5. **meetup_chat_screen.dart 와이어링** ✅
   - 동일 패턴 적용 (AppBar + 아바타 탭)

#### 6. **find_friends_screen.dart 와이어링** ✅
   - 유저 타일 탭 → UserProfileSheet (프로필 바텀시트)
   - trailing "Chat" 버튼 → _startDM (DM 직접 시작)
   - `_UserTile`에 `onChat` 파라미터 추가

#### 7. **i18n 15개 언어 번역** ✅
   - `app_strings.dart`에 375개 새 번역 항목 (25개 키 × 15개 언어)
   - `userProfile.*` 8개 키: online, offline, justNow, minutesAgo, hoursAgo, daysAgo, idCopied, sendMessage
   - `channelInfo.*` 17개 키: title, memberCount, created, channelId, idCopied, members, you, owner, admin, mute, unmute, muted, unmuted, leave, leaveConfirmTitle, leaveConfirmDesc, actionFailed

#### 8. **APK 빌드 성공** ✅
   - `flutter build apk --release` → 76.6MB
   - `flutter analyze` → 신규 에러/경고 없음 (기존 info 수준 25개만 존재)

#### 9. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `lib/widgets/user_profile_sheet.dart` | **신규** — 유저 프로필 바텀시트 |
   | `lib/screens/channel_info_screen.dart` | **신규** — 채널 정보 풀스크린 |
   | `lib/widgets/translated_message.dart` | 수정 — onAvatarTap 콜백 추가 |
   | `lib/screens/chat_screen.dart` | 수정 — AppBar + 아바타 탭 와이어링 |
   | `lib/screens/meetup_chat_screen.dart` | 수정 — 동일 와이어링 |
   | `lib/screens/find_friends_screen.dart` | 수정 — UserProfileSheet + onChat 분리 |
   | `lib/l10n/app_strings.dart` | 수정 — 375 번역 항목 추가 |
   | `V0.5_PLAN.md` | 수정 — Phase B ✅ 완료 |

---

### ✅ 완료된 작업 (2026-02-19 - Session 117: V0.5 Phase D+E 완료)

#### 1. **V0.5 Phase D — 채널 관리 & 안전** ✅
   - 커밋: `3871b7c` - feat(chat-app): V0.5 Phase D+E - Add channel actions, deep links & pull-to-refresh

   **신규 파일:**
   | 파일 | 기능 |
   |------|------|
   | `lib/widgets/channel_actions_sheet.dart` | 채널 롱프레스 바텀시트 (핀, 뮤트, 나가기) |

   **수정 파일:**
   | 파일 | 변경 |
   |------|------|
   | `channel_list_screen.dart` | onLongPress → ChannelActionsSheet, 핀 정렬, 뮤트 아이콘, SharedPreferences 핀 저장 |
   | `chat_screen.dart` | 뮤트 배너 (notifications_off 아이콘 + 안내 텍스트) |
   | `app_strings.dart` | 12개 키 × 15개 언어 = 180 항목 (channelActions.*, chat.mutedBanner) |

#### 2. **V0.5 Phase E — 딥링크 & 폴리싱** ✅

   **신규 파일:**
   | 파일 | 기능 |
   |------|------|
   | `lib/services/deep_link_service.dart` | `almachat://invite/{code}` 딥링크 핸들러 (cold/warm start) |

   **수정 파일:**
   | 파일 | 변경 |
   |------|------|
   | `main.dart` | DeepLinkService 초기화, `_initDeepLinks()`, `_onDeepLinkJoin()`, `_onDeepLinkError()` |
   | `channel_list_screen.dart` | RefreshIndicator + StreamChannelListController 추출 |
   | `AndroidManifest.xml` | `almachat://invite` intent-filter 추가 |
   | `pubspec.yaml` | `app_links: ^6.4.0` 추가 |
   | `app_strings.dart` | 5개 키 × 15개 언어 = 75 항목 (deepLink.*) |

#### 3. **V0.5 전체 완료** ✅
   - 모든 5개 Phase (A, B, C, D, E) 완료
   - APK: 76.7MB
   - 10개 파일, +822줄

---

### ✅ 완료된 작업 (2026-02-19 - Session 118: V0.5 버그 수정 5건)

#### 1. **Bug 1: 리액션 추가 후 사라지는 문제 수정** ✅
   - **근본 원인**: Stream Chat SDK가 이모지 문자(👍, ❤️)를 reaction type으로 인식하지 못함
   - **수정**: 이모지 → 문자열 ID(`like`, `love`, `haha`, `wow`, `sad`, `pray`) 전환
   - `reaction_picker.dart`: `reactionTypes` 문자열 배열 + `reactionEmojis` 매핑 + `reactionToEmoji()` 함수
   - `reaction_bar.dart`: `reactionToEmoji(type)`으로 표시 시 이모지 변환
   - `message_actions_sheet.dart`: `_toggleReaction`에서 `StreamChat.of(context)` 캡처를 `Navigator.pop` 전으로 이동
   - `translated_message.dart`: `enforceUnique: true` 추가

#### 2. **Bug 2: 삭제 다이얼로그 Cancel 번역 수정** ✅
   - **원인**: `tr('meetup.cancel', lang)` → `tr('common.cancel', lang)` 키 오류
   - `message_actions_sheet.dart` 수정

#### 3. **Bug 3: DM 채널에서 해시 ID 대신 상대방 이름 표시** ✅
   - `channel_info_screen.dart`: DM 감지 로직 (이름 없음 + 2명) → 상대방 이름/아바타 표시, 채널 ID 행 숨김
   - `channel_actions_sheet.dart`: 동일 DM 감지 로직 추가, `currentUserId` 파라미터 추가
   - `channel_list_screen.dart`: `ChannelActionsSheet`에 `currentUserId` 전달

#### 4. **Bug 4: 파일 첨부 시 채팅화면 연결 끊김 수정** ✅
   - **근본 원인**: WebSocket 일시 끊김 시 `_listenConnectionStatus`가 즉시 `_attemptFullReconnect()` 호출 → `disconnectUser()`로 진행 중인 HTTP 파일 업로드 중단
   - **수정**: 5초 디바운스 타이머 추가 — SDK 자체 재연결을 먼저 시도하도록 대기
   - `main.dart`: `_reconnectDebounceTimer` 추가, 재연결 성공 시 타이머 취소, dispose에서 정리

#### 5. **Bug 5: 딥링크 공유 URL 수정** ✅
   - `chat_screen.dart`: `https://chat.almaneo.org/invite/{code}` → `almachat://invite/{code}` 변경
   - 딥링크 등록 가이드 제공 (Android App Links / iOS Associated Domains — 앱 스토어 출시 전 설정)

#### 6. **커밋**
   - `357772c` - fix(chat-app): Fix 5 V0.5 bugs - reactions, DM names, file upload, deep links
   - 10개 파일, +171줄, -91줄

#### 7. **딥링크 등록 가이드**
   - **현재 상태**: `almachat://` 커스텀 스킴은 Android에서 이미 작동 (AndroidManifest.xml intent-filter)
   - **향후 작업 (앱 스토어 출시 전)**:
     - Android App Links: `chat.almaneo.org/.well-known/assetlinks.json` + `autoVerify="true"`
     - iOS Associated Domains: `apple-app-site-association` + Xcode capability
     - iOS URL Scheme: `Info.plist`에 `almachat` 스킴 추가

#### 8. **리액션 시스템 매핑 (확정)**
   | 타입 ID | 이모지 | 용도 |
   |---------|--------|------|
   | `like` | 👍 | 좋아요 |
   | `love` | ❤️ | 사랑 |
   | `haha` | 😂 | 웃음 |
   | `wow` | 😮 | 놀라움 |
   | `sad` | 😢 | 슬픔 |
   | `pray` | 🙏 | 감사 |

---

### ✅ 완료된 작업 (2026-02-19 - Session 119: Stream Chat 연결 끊김 근본 해결)

#### 1. **근본 원인 분석 (3가지)** ✅
   - **원인 1 (가장 치명적): 파괴적 재연결 패턴**
     - `_attemptFullReconnect()`가 WebSocket 5초 끊김 시 `disconnectUser()` 호출
     - SDK v9.23의 내부 지수 백오프 재연결을 파괴 (tokenManager.reset() 포함)
     - Stream SDK는 자체적으로 재연결하는데, 5초만에 이를 파괴하고 있었음
   - **원인 2: 5초 디바운스가 너무 짧음**
     - 베트남→US East 연결에서 SDK 내부 재연결에 10-30초 필요
     - 5초 디바운스는 SDK가 자체 복구하기 전에 파괴적 재연결을 발동
   - **원인 3: 재연결 실패 시 백오프 없음**
     - 실패 후 즉시 재시도 → 무한 실패 루프 → CPU/배터리 낭비

#### 2. **3-Tier 재연결 전략 구현** ✅
   - `chat-app/lib/main.dart` — 유일한 수정 파일 (+178줄, -55줄)

   | Tier | 시간 | 동작 | 특징 |
   |------|------|------|------|
   | **Tier 1** | 0-30초 | SDK 자체 재연결 (간섭 없음) | 대부분의 일시적 끊김 해결 |
   | **Tier 2** | 30-60초 | `closeConnection()` + `openConnection()` | 유저/토큰 보존, HTTP 불필요 |
   | **Tier 3** | 60초+ | `disconnectUser()` + `connectUserWithProvider()` | 최대 3회, 30/60/120초 백오프 |

   **타이밍 다이어그램:**
   ```
   T=0s    : WebSocket 끊김 → Tier 1 타이머 시작 (30초)
   T=0-30s : [TIER 1] SDK 자체 재연결 (지수 백오프, 최대 6회)
   T=30s   : Tier 1 만료 → Tier 2 시작
   T=~31s  : [TIER 2-1] closeConnection + openConnection
   T=~37s  : [TIER 2-2] 재시도 (5초 대기 후)
   T=~67s  : [TIER 3-1] disconnectUser + refreshToken + connectUserWithProvider
   T=~127s : [TIER 3-2] 재시도 (60초 백오프)
   T=~247s : [TIER 3-3] 최종 시도 (120초 백오프)
             총 ~4분 후 포기 (기존: 무한 루프)
   ```

#### 3. **추가 수정사항** ✅
   - `_connectUserWithRetry`에서 미사용 `token` 파라미터 제거 (이중 토큰 요청 방지)
   - 앱 포그라운드 복귀 시 Tier 1 건너뛰고 **Tier 2 직접 시작** (백그라운드에서 SDK 재연결 이미 소진)
   - 재연결 성공 후 `_listenConnectionStatus()` 재등록 (기존 누락 수정)
   - `_onConnectionRestored()`로 모든 카운터/타이머 일괄 리셋
   - `_waitForConnection()` 유틸리티 메서드 추가 (연결 대기 + 타임아웃)

#### 4. **신규/변경 메서드**
   | 메서드 | 상태 | 설명 |
   |--------|------|------|
   | `_listenConnectionStatus()` | 변경 | 5초 디바운스 → 30초 Tier 1 대기 |
   | `_onConnectionRestored()` | **신규** | 연결 복구 시 모든 상태 리셋 |
   | `_attemptSoftReconnect()` | **신규** | Tier 2: closeConnection + openConnection |
   | `_attemptHardReconnect()` | **신규** | Tier 3: disconnectUser + connectUserWithProvider (백오프) |
   | `_waitForConnection()` | **신규** | 연결 대기 유틸리티 (polling) |
   | `_attemptFullReconnect()` | **삭제** | Tier 3로 대체 |
   | `_connectUserWithRetry()` | 변경 | 미사용 `token` 파라미터 제거 |
   | `didChangeAppLifecycleState()` | 변경 | Tier 2 직접 시작 |

#### 5. **테스트 결과**
   - 실기기 테스트: 이전보다 훨씬 안정적으로 작동 확인
   - APK: 76.8MB
   - `flutter analyze`: No issues found

#### 6. **커밋**
   - `bd578b7` - fix(chat-app): Replace destructive reconnect with 3-tier strategy
   - 1개 파일, +178줄, -55줄

---

### ✅ 완료된 작업 (2026-02-19 - Session 120: AlmaChat 랜딩 섹션 & 밋업 CTA 추가)

#### 1. **AlmaChatSection 랜딩 섹션 생성** ✅
   - `web/src/components/sections/landing/AlmaChatSection.tsx` (신규)
   - 2컬럼 레이아웃: CSS 폰 목업 (왼쪽) + 4개 피처 카드 (오른쪽)
   - **4가지 특징 카드**: Auto Translation, Meetup Group Chat, Kindness Score, Ambassador SBT
   - **통계 행**: 15 Languages / Real-time / On-chain
   - **다운로드 버튼**: Google Play + App Store + Direct APK (플레이스홀더 `#`)
   - 커스텀 SVG 아이콘: GooglePlayIcon, AppleIcon (CTASection 패턴)
   - Warm overlay + `07.webp` 배경
   - Web3AuthSection과 RoadmapSection 사이에 배치

#### 2. **MeetupList AlmaChat 프로모션 배너** ✅
   - `web/src/pages/MeetupList.tsx` 수정
   - 검색/필터 바와 밋업 목록 사이에 warm 그라디언트 카드 배치
   - Smartphone 아이콘 + 다운로드 버튼

#### 3. **MeetupDetail AlmaChat CTA** ✅
   - `web/src/pages/MeetupDetail.tsx` 수정
   - Points Info 섹션 아래에 blue 그라디언트 카드 배치
   - "AlmaChat 열기" + "앱 다운로드" 버튼 2개

#### 4. **14개 언어 번역 완료** ✅
   - `landing.json`: `almachat` 섹션 (features, stats, download, phone greetings)
   - `common.json`: `meetup.almachat` 섹션 (bannerTitle, bannerDesc, detailTitle, detailDesc, openApp, downloadApp)
   - 대상 언어: ko, en, zh, ja, es, fr, ar, pt, id, ms, th, vi, km, sw

#### 5. **빌드 & 커밋**
   - 빌드 성공 (33.56초)
   - 커밋: `2ffea4b` - feat(web): Add AlmaChat landing section and meetup CTAs with 14-language i18n
   - 33개 파일, +1,094줄

#### 6. **앱스토어 URL 플레이스홀더** (추후 업데이트)
   - Google Play: `#` (출시 후 업데이트)
   - App Store: `#` (Apple Developer 등록 후)
   - APK 직접 다운로드: `#` (호스팅 설정 후)

---

### ✅ 완료된 작업 (2026-02-20 - Session 121: AlmaChat Partner System Phase 1)

#### 1. **Supabase 마이그레이션 생성** ✅
   - `supabase/migrations/20260220100000_partner_system.sql` (신규)
   - 5개 테이블: `partner_categories`, `partners`, `vouchers`, `voucher_redemptions`, `partner_photos`
   - 5개 초기 카테고리 시드: cafe, restaurant, coworking, cultural, other
   - 인덱스: category_id, lat/lng, owner_user_id, is_active, qr_code 등
   - RLS 정책: 모든 테이블 public read, authenticated write
   - Storage 버킷: `partner-photos` (10MB 제한, 이미지 MIME types)
   - Storage RLS 정책 (읽기/쓰기/수정/삭제)

#### 2. **PartnerService 생성** ✅
   - `chat-app/lib/services/partner_service.dart` (신규)
   - `getCategories()`: 카테고리 목록 조회
   - `getPartners({categoryId, search, lat, lng, radiusKm})`: 바운딩 박스 필터 + Haversine 거리 정렬
   - `getPartnerById(id)`: 파트너 상세 (카테고리 조인)
   - `getPartnerPhotos(partnerId)`: 사진 갤러리
   - `getVouchers(partnerId)`: 활성 바우처 (날짜 필터)
   - `generateQrCode({voucherId, userId, partnerId})`: 8자리 영숫자 코드, 5분 만료
   - `redeemVoucher(qrCode)`: 코드 검증 + 만료 확인 + 상태 업데이트
   - `_haversineDistance()`, `formatDistance()` 헬퍼

#### 3. **PartnerListScreen 생성** ✅
   - `chat-app/lib/screens/partner_list_screen.dart` (신규)
   - ConsumerStatefulWidget, 지도/목록 토글, 카테고리 필터 칩, 검색 바
   - 지도 뷰: GoogleMap 위젯 + 마커 + 다크 맵 스타일
   - 목록 뷰: RefreshIndicator + ListView.builder + 파트너 카드
   - FAB: "Near Me" GPS 위치 요청 (Geolocator)
   - StreamChat.of(context).currentUser?.id로 userId 전달

#### 4. **PartnerDetailScreen 생성** ✅
   - `chat-app/lib/screens/partner_detail_screen.dart` (신규)
   - SliverAppBar 커버 이미지, 비즈니스 정보, 주소, 전화, 웹사이트
   - "Open in Maps" → Google Maps URL 실행
   - 사진 갤러리 가로 스크롤
   - 바우처 카드: 할인 뱃지 (percentage/fixed/free_item), 조건, 유효기간
   - QR 코드 다이얼로그: QrImageView + 5분 카운트다운 타이머
   - `widget.userId` 파라미터 패턴 사용

#### 5. **4번째 하단 네비 탭 추가** ✅
   - `chat-app/lib/main.dart`: Home | Chat | **Partners** | Profile (4탭)
   - IndexedStack에 PartnerListScreen 추가 (index 2)
   - Profile은 index 2 → 3으로 이동
   - 아이콘: `Icons.storefront_outlined` / `Icons.storefront`

#### 6. **패키지 설치** ✅
   - `google_maps_flutter: ^2.14.2` — Google Maps
   - `geolocator: ^14.0.2` — GPS 위치 서비스
   - `qr_flutter: ^4.1.0` — QR 코드 생성

#### 7. **Google Maps 설정** ✅
   - `chat-app/lib/config/env.dart`: `googleMapsApiKey` getter 추가
   - `AndroidManifest.xml`: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` 권한 추가
   - `AndroidManifest.xml`: `com.google.android.geo.API_KEY` meta-data 추가 (PLACEHOLDER)
   - ⚠️ **사용자 작업 필요**: Google Cloud Console에서 API 키 발급 → `.env`에 `GOOGLE_MAPS_API_KEY=<key>` 설정 → AndroidManifest PLACEHOLDER 교체

#### 8. **i18n 15개 언어 번역** ✅
   - `chat-app/lib/l10n/app_strings.dart`: 37개 키 × 15개 언어 = 555 항목
   - 키 범위: `nav.partners`, `partners.title/search/nearMe/mapView/listView/noResults`
   - 카테고리: `partners.categories.all/cafe/restaurant/coworking/cultural/other`
   - 상세: `partners.detail.address/phone/website/openInMaps/description/photos/vouchers/noVouchers/useVoucher`
   - 바우처: `partners.voucher.discount/fixedDiscount/freeItem/validUntil/terms/qrTitle/qrExpires/qrExpired/qrGenerating/redeemed/redeemSuccess/redeemFailed`
   - 거리: `partners.distance.km/m/nearby`

#### 9. **빌드 성공** ✅
   - APK: **78.2MB** (이전: 76.8MB — 신규 패키지 추가)
   - QR 스타일 수정: `QrEyeShape.roundedRect` → `QrEyeShape.square` (qr_flutter 4.1.0 호환)

#### 10. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `supabase/migrations/20260220100000_partner_system.sql` | **신규** — DB 스키마 5 테이블 |
   | `chat-app/lib/services/partner_service.dart` | **신규** — 파트너 서비스 |
   | `chat-app/lib/screens/partner_list_screen.dart` | **신규** — 지도/목록 화면 |
   | `chat-app/lib/screens/partner_detail_screen.dart` | **신규** — 상세 + 바우처 + QR |
   | `chat-app/lib/main.dart` | 수정 — 4번째 탭 추가 |
   | `chat-app/lib/config/env.dart` | 수정 — Google Maps API 키 |
   | `chat-app/android/app/src/main/AndroidManifest.xml` | 수정 — 위치 권한 + Maps 키 |
   | `chat-app/pubspec.yaml` | 수정 — 3개 패키지 추가 |
   | `chat-app/lib/l10n/app_strings.dart` | 수정 — 555 번역 항목 |

---

### ✅ 완료된 작업 (2026-02-20 - Session 122: Partner Registration & FK Fix)

#### 1. **Google Maps API 키 설정** ✅
   - Google Cloud Console에서 Maps SDK for Android API 키 발급
   - `chat-app/.env` + `android/local.properties`에서 관리 (git 미추적)
   - `AndroidManifest.xml`: gradle manifest placeholder (`${GOOGLE_MAPS_API_KEY}`) 사용

#### 2. **Supabase 마이그레이션 적용** ✅
   - `supabase migration repair --status reverted 20260217` (orphan 히스토리 복구)
   - `supabase db push --include-all` 성공
   - 5개 테이블, Storage 버킷, 인덱스, RLS 정책 모두 적용 확인

#### 3. **파트너 실기기 테스트** ✅
   - Partners 탭 표시, 지도 뷰, 목록 뷰, Near Me GPS 위치 요청 — 4개 항목 모두 정상
   - 샘플 Starbucks 데이터 SQL 직접 등록 → 목록에 정상 표시

#### 4. **PartnerRegisterScreen 구현** ✅
   - `chat-app/lib/screens/partner_register_screen.dart` (신규)
   - ConsumerStatefulWidget, Form 유효성 검사
   - 필드: 비즈니스 이름 (필수), 카테고리 칩 (필수), 설명, 주소, 전화, 웹사이트
   - GoogleMap 위치 선택기 (탭하여 마커 배치, 드래그 가능, 다크 맵 스타일)
   - "My Location" GPS 버튼 (Geolocator)
   - 기본 맵 중심: Ho Chi Minh City (10.7769, 106.7009)
   - 제출 시 `PartnerService.createPartner()` 호출, 성공 시 목록으로 복귀

#### 5. **PartnerService.createPartner 메서드 추가** ✅
   - `chat-app/lib/services/partner_service.dart` 수정
   - `createPartner()`: partners 테이블 INSERT + `.select().single()` 반환
   - `uploadPartnerPhoto()`: Supabase Storage 업로드 (partner-photos 버킷)
   - `_getFile()`: `dart:io` File 읽기 헬퍼

#### 6. **FK 제약 위반 버그 수정** ✅
   - **문제**: `owner_user_id TEXT REFERENCES users(wallet_address)` — Stream Chat 유저 ID가 users 테이블에 없어 INSERT 실패
   - **수정**: `createPartner()` 호출 시 `ownerUserId`가 users 테이블에 존재하는지 먼저 확인 (`.maybeSingle()`), 없으면 `null`로 전달
   - 수정 후 앱에서 파트너 등록 → 목록에 정상 표시 확인

#### 7. **PartnerListScreen 등록 FAB 추가** ✅
   - 기존 단일 FAB → Column에 두 개 FAB
   - 위: GPS 위치 FAB (파란색, `my_location` 아이콘, heroTag: 'location')
   - 아래: 등록 FAB (주황색/terracottaOrange, `add_business` 아이콘, heroTag: 'register')
   - 등록 완료 후 `Navigator.pop(context, true)` → 목록 자동 새로고침

#### 8. **i18n 15개 언어 번역 추가** ✅
   - `app_strings.dart`: 22개 키 × 15개 언어 = 330 항목
   - 키: `partners.register.title/businessName/businessNameHint/category/selectCategory/description/descriptionHint/address/addressHint/location/pickOnMap/hideMap/useMyLocation/tapToPlace/phone/phoneHint/website/websiteHint/submit/success/failed/required`

#### 9. **빌드 성공** ✅
   - APK: **78.5MB**

#### 10. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `chat-app/lib/screens/partner_register_screen.dart` | **신규** — 파트너 등록 폼 |
   | `chat-app/lib/services/partner_service.dart` | 수정 — createPartner, uploadPartnerPhoto, FK 검증 |
   | `chat-app/lib/screens/partner_list_screen.dart` | 수정 — 등록 FAB 추가 |
   | `chat-app/lib/l10n/app_strings.dart` | 수정 — 330 번역 항목 |
   | `chat-app/android/app/src/main/AndroidManifest.xml` | 수정 — Google Maps API 키 |
   - **총 5개 파일**, +909줄, -5줄

---

### ✅ 완료된 작업 (2026-02-21 - Session 123: Partner System Feature Expansion)

#### 1. **DB 마이그레이션** ✅
   - `supabase/migrations/20260221100000_partner_expansion.sql` (신규)
   - `partner_photos` 테이블에 `uploaded_by TEXT`, `caption TEXT` 컬럼 추가
   - `partner_photos` UPDATE/DELETE RLS 정책 추가
   - `vouchers` DELETE RLS 정책 추가
   - `increment_voucher_redemptions` RPC 함수 생성
   - `partners` 테이블 `updated_at` 자동 갱신 트리거

#### 2. **PartnerService 확장 (9개 메서드)** ✅
   - `updatePartner()` — 파트너 정보 UPDATE
   - `deactivatePartner(id)` — SET is_active = false (soft-delete)
   - `uploadCoverImage(partnerId, filePath)` — Storage 업로드 + cover_image_url UPDATE
   - `addPartnerPhoto(partnerId, filePath, uploadedBy?, caption?)` — 갤러리 사진 추가
   - `deletePartnerPhoto(photoId)` — 사진 삭제
   - `uploadPartnerPhoto(partnerId, filePath, fileName)` — Storage 업로드 헬퍼
   - `createVoucher(partnerId, title, discountType, ...)` — 바우처 생성
   - `updateVoucher(voucherId, ...)` — 바우처 수정
   - `deactivateVoucher(voucherId)` — 바우처 비활성화
   - `getOwnerVouchers(partnerId)` — 비활성 포함 전체 조회

#### 3. **파트너 등록 → 수정 모드 확장** ✅
   - `existingPartner` 옵션 파라미터로 edit 모드 전환
   - 폼 필드 pre-fill, AppBar/버튼 텍스트 변경
   - 커버 이미지 피커: 갤러리/카메라/삭제 바텀시트 (image_picker 사용)
   - 비활성화(soft-delete) 버튼 + 확인 다이얼로그

#### 4. **상세 화면 Owner 관리 확장** ✅
   - Owner 감지: `widget.userId == _partner?['owner_user_id']`
   - Owner 액션 바: "Edit" + "Add Voucher" 버튼
   - 사진 갤러리: 모든 사용자 "Add Photo", Owner 삭제 X 오버레이
   - 바우처 Owner 관리: 활성/비활성 토글, 사용 횟수(current/max), 수정 아이콘
   - 비활성 바우처 Opacity(0.5) + "inactive" 뱃지

#### 5. **바우처 생성 화면** ✅
   - `chat-app/lib/screens/voucher_create_screen.dart` (신규)
   - 폼: Title, Description, Discount Type (3 ChoiceChips), Discount Value, Terms, Max Redemptions, Valid Until (DatePicker)
   - `existingVoucher` 파라미터로 수정 모드 지원

#### 6. **목록 화면 개선** ✅
   - 파트너 카드에 cover_image_url 썸네일 표시 (기존 storefront 아이콘 대체)
   - Owner 파트너에 "My" 뱃지 표시 (terracottaOrange)

#### 7. **i18n 15개 언어 번역** ✅
   - 46개 키 × 15개 언어 = **690 번역 항목** 추가
   - 키 그룹: partners.register (13키), partners.detail (10키), partners.myBadge (1키), voucher (22키)
   - 지원 언어: ko, en, zh, ja, es, fr, ar, vi, th, pt, id, hi, de, ru, tr

#### 8. **Supabase 마이그레이션 적용** ✅
   - `supabase migration repair --status reverted 20260217` (orphan 히스토리 복구)
   - `supabase db push --include-all` 성공

#### 9. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `supabase/migrations/20260221100000_partner_expansion.sql` | **신규** — DB 확장 |
   | `chat-app/lib/screens/voucher_create_screen.dart` | **신규** — 바우처 생성/수정 |
   | `chat-app/lib/services/partner_service.dart` | 수정 — 9개 메서드 추가 (+220줄) |
   | `chat-app/lib/screens/partner_register_screen.dart` | 수정 — Edit 모드 + 커버 이미지 |
   | `chat-app/lib/screens/partner_detail_screen.dart` | 수정 — Owner 관리 확장 |
   | `chat-app/lib/screens/partner_list_screen.dart` | 수정 — 커버 이미지 + My 뱃지 |
   | `chat-app/lib/l10n/app_strings.dart` | 수정 — 690 번역 항목 |
   - **총 7개 파일** (신규 2개, 수정 5개), +2,314줄, -113줄
   - **APK**: 78.8MB

#### 10. **커밋**
   - `e13a90c` - feat(chat-app): Add partner edit/delete, photo upload, voucher creation & i18n

---

### ✅ 완료된 작업 (2026-02-21 - Session 124: Partner System 코드 리뷰 & 버그 수정)

#### 1. **코드 리뷰 (5개 파일 병렬 검토)** ✅
   - 3개 병렬 에이전트로 Partner System 전체 코드 리뷰 수행
   - 15+ 버그 발견 및 수정

#### 2. **코드 리뷰 발견 버그 수정** ✅

   | 파일 | 수정 내용 |
   |------|----------|
   | `partner_list_screen.dart` | 검색 디바운스 타이머, `Geolocator.isLocationServiceEnabled()` 체크, LatLng 타입 캐스트 |
   | `partner_detail_screen.dart` | Google Maps URL `Uri.https()` 인코딩, website URL try-catch + scheme prefix, 하드코딩 텍스트 `tr()` 전환 |
   | `partner_register_screen.dart` | `_isSaving = false` 리셋, `Geolocator` 서비스 체크 |
   | `voucher_create_screen.dart` | edit 모드 discountType/Value/maxRedemptions 전달, DatePicker brightness-aware |
   | `partner_service.dart` | `updatePartner` cover_image_url 항상 포함, `updateVoucher` 파라미터 확장, `redeemVoucher` max_redemptions 체크 |

#### 3. **실기기 테스트 버그 2개 수정** ✅

   **Bug 1: 지도 GPS 버튼 누르면 목록/핀 사라짐**
   - **근본 원인**: `_loadData()`에서 GPS 위치가 있으면 50km 반경 바운딩 박스 필터 적용 → 범위 밖 파트너 전부 제외
   - **수정**: `radiusKm` 파라미터 및 바운딩 박스 필터 제거 — GPS는 거리 정렬에만 사용, 필터링 없음
   - 수정 파일: `partner_list_screen.dart`, `partner_service.dart`

   **Bug 2: 번역키가 원문 키값으로 표시**
   - **근본 원인**: Session 123에서 `partners.edit.*`, `partners.photo.*`, `partners.owner.*` 프리픽스 사용했으나 번역은 `partners.register.*`, `partners.detail.*` 프리픽스로 정의되어 있음
   - **수정**: 2개 파일에서 29개 번역키 경로 수정 + 4개 누락 키를 15개 언어에 추가
   - 수정 파일: `partner_detail_screen.dart` (14개 키), `partner_register_screen.dart` (15개 키), `app_strings.dart` (4개 키 × 15개 언어 = 60 항목)

#### 4. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `chat-app/lib/services/partner_service.dart` | 수정 — radius 필터 제거, updatePartner/Voucher/redeemVoucher 개선 |
   | `chat-app/lib/screens/partner_list_screen.dart` | 수정 — radiusKm 제거, 검색 디바운스, GPS 체크 |
   | `chat-app/lib/screens/partner_detail_screen.dart` | 수정 — 14개 번역키 수정, URL 인코딩, website 안전 처리 |
   | `chat-app/lib/screens/partner_register_screen.dart` | 수정 — 15개 번역키 수정, _isSaving 리셋 |
   | `chat-app/lib/screens/voucher_create_screen.dart` | 수정 — edit 모드 파라미터, DatePicker brightness |
   | `chat-app/lib/l10n/app_strings.dart` | 수정 — 4개 누락 키 × 15개 언어 추가 |
   - **총 6개 파일**, +173줄, -64줄
   - **APK**: 78.8MB

#### 5. **커밋**
   - `6cb192e` - fix(chat-app): Fix GPS radius filter and 29 translation key mismatches in Partner System

---

### ✅ 완료된 작업 (2026-02-21 - Session 125: Partner System 모바일 QA 버그 4건 수정)

#### 1. **Bug 1: Open in Maps 링크 연결 안됨** ✅
   - **근본 원인**: `Uri.https`에 `query_place_id` 잘못된 파라미터 + `canLaunchUrl`이 Android 11+에서 패키지 가시성 문제로 실패
   - **수정**: `Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng')` 직접 URL + `canLaunchUrl` 제거, try-catch로 전환
   - 수정 파일: `partner_detail_screen.dart` `_openInMaps()` 메서드

#### 2. **Bug 2: Voucher valid date {{date}} 표시 안됨** ✅
   - **근본 원인**: `tr()` 함수가 `{key}` 단일 중괄호만 지원했으나, 파트너 번역에서 `{{date}}` 이중 중괄호 사용. 또한 `tr()` 호출 시 args 미전달
   - **수정**: `tr('partners.voucher.validUntil', lang, args: {'date': '...'})` args 전달
   - 수정 파일: `partner_detail_screen.dart` 바우처 카드 validUntil 표시

#### 3. **Bug 3: QR 다이얼로그 {{time}}과 common.close 번역 안됨** ✅
   - **근본 원인**: QR 만료 카운트다운에 args 미전달 + `common.close` 번역 키가 15개 언어 모두에서 누락
   - **수정**: `tr('partners.voucher.qrExpires', lang, args: {'time': _formatTime(...)})` args 전달 + 15개 언어에 `common.close` 키 추가
   - 수정 파일: `partner_detail_screen.dart` QR 다이얼로그, `app_strings.dart` 15개 언어

#### 4. **Bug 4: 주소 입력 시 지도 핀 자동 표시 + 지도 UX 개선** ✅
   - **근본 원인**: 사용자가 주소를 텍스트로만 입력하고 지도에서 핀을 찍지 않음 → lat/lng null → 지도에 표시 안됨. 지도가 너무 작고(250px) 줌 불가
   - **수정 (3가지)**:
     1. `geocoding: ^3.0.0` 패키지 추가 — 주소 입력 후 📍 버튼 탭 시 자동 좌표 변환 + 핀 배치
     2. 지도 높이 250px → 350px, `zoomControlsEnabled: true` 활성화
     3. 지도 기본 표시 (`_showMap = true`) — 토글 없이 바로 보임
   - 수정 파일: `partner_register_screen.dart` (geocode 메서드, 주소 필드 suffixIcon, 지도 설정), `pubspec.yaml`

#### 5. **tr() 함수 이중/단일 중괄호 호환 수정** ✅
   - 기존: `text.replaceAll('{$k}', v)` — 단일 중괄호만 지원 (237+ 기존 번역)
   - 파트너 시스템: `{{date}}`, `{{time}}` 이중 중괄호 사용 (~30개)
   - **수정**: 이중 중괄호 먼저 치환 → 단일 중괄호 치환 (양쪽 모두 지원)
   ```dart
   args.forEach((k, v) {
     text = text.replaceAll('{{$k}}', v); // double braces first
     text = text.replaceAll('{$k}', v);   // then single braces
   });
   ```

#### 6. **i18n 번역 추가** ✅
   - `common.close`: 15개 언어 (en=Close, ko=닫기, zh=关闭, ja=閉じる 등)
   - `partners.register.findOnMap`: 15개 언어 (지도에서 찾기)
   - `partners.register.geocodeFailed`: 15개 언어 (주소에서 위치를 찾을 수 없습니다)

#### 7. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `chat-app/lib/l10n/app_strings.dart` | 수정 — tr() 이중+단일 중괄호 지원, common.close 15개 언어, geocode 번역 30개 |
   | `chat-app/lib/screens/partner_detail_screen.dart` | 수정 — Open in Maps URL, voucher date args, QR timer args |
   | `chat-app/lib/screens/partner_register_screen.dart` | 수정 — geocoding 자동 변환, 지도 350px, 줌 컨트롤, 주소 검색 버튼 |
   | `chat-app/pubspec.yaml` | 수정 — `geocoding: ^3.0.0` 추가 |
   - **총 5개 파일**, +138줄, -16줄
   - **APK**: 78.8MB

#### 8. **커밋**
   - `6ae5426` - fix(chat-app): Fix 4 Partner System bugs - maps link, voucher date, QR translations, geocoding

---

### ✅ 완료된 작업 (2026-02-21 - Session 126: Partner System UX 개선 5건)

#### 1. **지도 팬/줌 제스처 활성화** ✅
   - **문제**: 파트너 등록 화면에서 GoogleMap이 ListView 안에 있어 손으로 지도 이동 불가 (줌 +/- 버튼만 사용 가능)
   - **수정**: `EagerGestureRecognizer`를 `gestureRecognizers`에 추가 → 지도가 터치 제스처를 우선 소비
   - `scrollGesturesEnabled`, `zoomGesturesEnabled`, `rotateGesturesEnabled`, `tiltGesturesEnabled` 명시적 활성화
   - 수정 파일: `partner_register_screen.dart`
   - 커밋: `8fa68e1`

#### 2. **QR 바우처 카운트다운 425분 버그 수정** ✅
   - **문제**: QR 코드 생성 시 5분 카운트다운이 425분으로 표시
   - **근본 원인**: `DateTime.now().toIso8601String()` → 로컬 시간(UTC+7)이 타임존 없이 저장 → Supabase가 UTC로 해석 → 7시간 + 5분 = 425분
   - **수정**: `DateTime.now().toUtc()` 사용하여 생성/비교 모두 UTC 통일
   - 수정 파일: `partner_service.dart`, `partner_detail_screen.dart`
   - 커밋: `e314241`

#### 3. **파트너 추가 FAB 사이즈 통일** ✅
   - **문제**: 파트너 추가 FAB이 내 위치 FAB보다 크게 표시
   - **수정**: `FloatingActionButton` → `FloatingActionButton.small`, 아이콘 size 20으로 통일
   - 수정 파일: `partner_list_screen.dart`
   - 커밋: `be62b10`

#### 4. **Open in Maps 비즈니스 검색 개선** ✅
   - **문제**: `query=10.7769,106.7009` 좌표만 전달 → 지도에서 핀만 표시
   - **수정**: `query=Business+Name,+Address` 형식으로 변경 → Google Maps가 동일 상호 존재 시 해당 가게 정보 표시
   - 수정 파일: `partner_detail_screen.dart`
   - 커밋: `3279acb`

#### 5. **지도 탭 시 Reverse Geocoding → 주소 자동 표시/입력** ✅
   - **문제**: 지도에서 핀을 찍으면 좌표값만 표시 (`10.77690, 106.70090`)
   - **수정**: `placemarkFromCoordinates()` reverse geocoding으로 실제 주소 표시 (예: "123 Nguyen Hue, District 1, Ho Chi Minh City, Vietnam")
   - 지도 탭, 마커 드래그, GPS 위치 모두 적용
   - 주소 입력 필드가 비어있으면 자동 채워넣기
   - 연속 중복 제거 로직 (예: "District 1, District 1" 방지)
   - 수정 파일: `partner_register_screen.dart`
   - 커밋: `3279acb`

#### 6. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `chat-app/lib/screens/partner_register_screen.dart` | 지도 제스처 + reverse geocoding |
   | `chat-app/lib/screens/partner_detail_screen.dart` | QR 타임존 + Open in Maps URL |
   | `chat-app/lib/screens/partner_list_screen.dart` | FAB 사이즈 통일 |
   | `chat-app/lib/services/partner_service.dart` | QR 만료시간 UTC |
   - **총 4개 파일**, 4개 커밋
   - **APK**: 78.9MB

---

### ✅ 완료된 작업 (2026-02-21 - Session 127: Partner SBT 온체인 인증 시스템)

#### 1. **PartnerSBT.sol 스마트 컨트랙트 작성** ✅
   - `blockchain/contracts/PartnerSBT.sol` (신규)
   - ERC-721 Soulbound Token (양도 불가, UUPS Upgradeable)
   - 단일 "Verified Partner" 등급 (등급 없음)
   - 유효기간 1년, 활동 기반 자동 갱신
   - Roles: DEFAULT_ADMIN, MINTER_ROLE, UPGRADER_ROLE, RENEWER_ROLE
   - 핵심 함수: `mintPartnerSBT`, `renewPartnerSBT`, `revokePartnerSBT`, `isValid`, `getPartnerByAddress`, `daysUntilExpiry`
   - 이벤트: PartnerMinted, PartnerRenewed, PartnerRevoked

#### 2. **Polygon Amoy 배포 & Verify** ✅
   - 컨트랙트 주소: `0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08`
   - RENEWER_ROLE → Verifier 지갑 (`0x30073c2f47D41539dA6147324bb9257E0638144E`)
   - 배포 결과: `blockchain/deployments/amoy-partner-sbt-deployment.json`

#### 3. **Backend API** ✅
   - `web/api/partner-sbt.ts` (신규) — Vercel Serverless Function
   - 5개 액션: `mintPartner` (ADMIN), `renewPartner` (VERIFIER), `revokePartner` (ADMIN), `checkValidity` (public), `getPartnerData` (public)
   - Supabase 동기화: mint/renew 후 `partners` 테이블 `sbt_token_id`, `partnership_expires_at` 업데이트

#### 4. **프론트엔드 주소/타입 업데이트** ✅
   - `web/src/contracts/addresses.ts`: PartnerSBT 주소 추가
   - `shared/contracts/addresses.ts`: 동일
   - `shared/types/contracts.ts`: `ContractAddresses`에 `PartnerSBT` 추가
   - `web/src/components/sections/landing/Footer.tsx`: Core Contracts 목록에 추가

#### 5. **ABI 파일** ✅
   - `web/src/contracts/abis/PartnerSBT.ts` (신규)
   - view 함수 ABI + OnchainPartnerData 인터페이스

#### 6. **AlmaChat 앱 배지 표시** ✅
   - `partner_list_screen.dart`: 인증 파트너 상단 정렬 + `Icons.verified` (electricBlue) 배지
   - `partner_detail_screen.dart`: 헤더에 "Verified Partner" 배지 + 만료일 표시
   - `app_strings.dart`: 15개 언어 번역 (`partners.verified`, `partners.verifiedUntil`, `partners.verifiedPartner`)

#### 7. **빌드 검증** ✅
   - Web: 34.72초 성공
   - Flutter APK: 78.9MB 성공

#### 8. **수정 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `blockchain/contracts/PartnerSBT.sol` | **신규** — SBT 컨트랙트 |
   | `blockchain/scripts/deploy-partner-sbt.js` | **신규** — 배포 스크립트 |
   | `blockchain/deployments/amoy-partner-sbt-deployment.json` | **신규** — 배포 결과 |
   | `web/api/partner-sbt.ts` | **신규** — 백엔드 API |
   | `web/src/contracts/abis/PartnerSBT.ts` | **신규** — ABI 파일 |
   | `web/src/contracts/addresses.ts` | 수정 — PartnerSBT 주소 |
   | `shared/contracts/addresses.ts` | 수정 — 동일 |
   | `shared/types/contracts.ts` | 수정 — 타입 추가 |
   | `web/src/components/sections/landing/Footer.tsx` | 수정 — Core Contracts |
   | `chat-app/lib/screens/partner_list_screen.dart` | 수정 — 인증 배지 + 정렬 |
   | `chat-app/lib/screens/partner_detail_screen.dart` | 수정 — 인증 배지 + 만료일 |
   | `chat-app/lib/l10n/app_strings.dart` | 수정 — 45 번역 항목 |
   - **총 13개 파일** (신규 5개, 수정 8개), +1,604줄
   - 커밋: `7b0caa2`

#### 9. **PartnerSBT 설계 결정사항**
   | 항목 | 결정 |
   |------|------|
   | 등급 | 단일 "Verified Partner" (등급 없음) |
   | 유효기간 | 1년, 활동 기반 자동 갱신 |
   | 발급 | 어드민 직접 발급 (MINTER_ROLE) |
   | 갱신 조건 | 지난 1년간 바우처 발행/사용 활동 시 자동 갱신 |
   | 혜택 | 인증 배지 + 노출 우선 + NFT 수수료 15% 할인 |

---

### 📋 Admin 페이지 설계 토론 (Session 127)

#### NFT Admin 현황 분석
- **위치**: `nft.almaneo.org/admin` (NFT 서버)
- **페이지 7개**: Dashboard, Mint NFT, Collections, Payment Tokens, Marketplace, Hero Section, Settings
- **인증**: 하드코딩 지갑 주소 (`0x883D5c...`) + OPERATOR_ROLE
- **기술 스택**: React + MUI + ethers.js
- **범위**: NFT 마켓플레이스 전용

#### 결정: Web에 별도 플랫폼 Admin 페이지 생성
- **라우트**: `almaneo.org/admin`
- **NFT Admin은 그대로 유지** (마켓플레이스 전용)
- **Web Admin은 플랫폼 전체 관리** 담당

#### 이유
1. **관심사 분리**: NFT Admin ≠ 플랫폼 Admin
2. **API 위치**: `/api/partner-sbt`, `/api/ambassador` 등이 Web 서버에 있음
3. **Supabase 연동**: partners, meetups, users 테이블이 Web에서 이미 연동
4. **UI 일관성**: Web=Tailwind, NFT=MUI — 스타일 충돌 방지
5. **확장성**: 밋업 검증, 에어드롭 관리, 사용자 관리 등 추가 가능

#### 예상 관리 기능 (다음 세션에서 상세 설계)
- **Partner SBT**: 발급/갱신/취소, 인증 상태 관리
- **밋업 검증**: 사진 확인, 승인/거절, 점수 지급
- **Ambassador SBT**: 티어 관리, 활동 기록 조회
- **에어드롭 캠페인**: 캠페인 생성, Merkle Root 업로드
- **사용자 관리**: Kindness Score 조회, 활동 내역
- **대시보드**: 통계 (파트너 수, 밋업 수, 토큰 분배 현황)

---

### ✅ 완료된 작업 (2026-02-21 - Session 128: Platform Admin Panel 구현)

#### 1. **Platform Admin Panel 구현 완료** ✅
   - `almaneo.org/admin` 에 플랫폼 전체 관리 페이지 구현
   - NFT Admin(`nft.almaneo.org/admin`)은 마켓플레이스 전용으로 유지

#### 2. **Admin 페이지 7개 파일 생성** ✅
   | 파일 | 기능 |
   |------|------|
   | `web/src/pages/admin/index.ts` | Re-export 모든 admin 컴포넌트 |
   | `web/src/pages/admin/AdminLayout.tsx` | Auth gate + sidebar (Foundation/Verifier 지갑 체크) |
   | `web/src/pages/admin/AdminDashboard.tsx` | 통계 카드 4개 + 최근 유저/밋업 테이블 + 컨트랙트 주소 |
   | `web/src/pages/admin/AdminPartners.tsx` | Partner SBT 발급/갱신/취소, 검색/필터, 온체인 데이터 |
   | `web/src/pages/admin/AdminMeetups.tsx` | 밋업 사진 확인, 승인/거절, 온체인 Ambassador 기록 |
   | `web/src/pages/admin/AdminUsers.tsx` | 유저 검색, Kindness Score, 활동 내역 모달 |
   | `web/api/admin-action.ts` | Vercel Serverless Function (직접 ethers.js 실행) |

#### 3. **Admin 인증** ✅
   - Client-side: `useWallet().address` → `ADMIN_ADDRESSES` 배열 비교 (case-insensitive)
   - Foundation `0x7BD8...24FE`, Verifier `0x3007...44E`
   - 미연결/미인가 시 각각 안내 화면 표시

#### 4. **Admin Action API 재작성** ✅
   - **문제**: 초기 프록시 패턴(self-fetch to `/api/partner-sbt`)이 Vercel에서 504/HTML 에러
   - **해결**: ethers.js로 컨트랙트 직접 실행하도록 재작성
   - `VERIFIER_PRIVATE_KEY`로 트랜잭션 서명
   - Partner SBT: mintPartner, renewPartner, revokePartner
   - Ambassador: recordMeetupVerification, updateKindnessScore

#### 5. **Web3Auth 소셜 로그인 ID 호환성 수정** ✅
   - **문제**: `owner_user_id`가 이메일 기반 ID(`seanft_io_gmail_com`)로 저장 → 온체인 enrichment 504 타임아웃, Mint 폼에 비-주소 자동입력
   - **해결**: `isEthAddress()` 검증 헬퍼 추가
     - 비-0x ID에 대해 온체인 enrichment 건너뜀
     - Owner 컬럼: eth 주소는 PolygonScan 링크, 소셜 ID는 `(social)` 라벨
     - Mint: 유효한 eth 주소만 자동입력, 아닐 때 빈 칸 (수동 입력)
     - Renew/Revoke: 유효한 eth 주소가 있는 파트너에게만 표시
     - Mint 모달: 주소 유효성 검사 경고 + 버튼 비활성화

#### 6. **라우팅 (App.tsx)**
   ```
   <Route path="/admin" element={<AdminLayout />}>
     <Route index element={<AdminDashboard />} />
     <Route path="partners" element={<AdminPartners />} />
     <Route path="meetups" element={<AdminMeetups />} />
     <Route path="users" element={<AdminUsers />} />
   </Route>
   ```

#### 7. **환경변수**
   - `ADMIN_API_SECRET`: `52daaf2e512aebeb3e16a40d7f7a6ec0cc0206716c380f911949cefcef911698` (Vercel 대시보드에서 설정 완료)
   - `VERIFIER_PRIVATE_KEY`: 기존 설정 사용

#### 8. **커밋 내역**
   | 커밋 | 내용 |
   |------|------|
   | `92b60fe` | feat(web): Add platform admin panel (8 files, +2,054 lines) |
   | `1bf2c36` | fix(web): Rewrite admin-action to direct contract execution |
   | `7061c5f` | fix(web): Handle non-Ethereum owner_user_id in AdminPartners |

#### 9. **다음 세션에서 테스트 필요**
   - Vercel 배포 후 Partner SBT 민팅 테스트 (유효한 0x 지갑 주소 입력)
   - Renew/Revoke 기능 테스트
   - Meetup 승인 플로우 테스트
   - Users 검색/상세 테스트

---

### ✅ 완료된 작업 (2026-02-22 - Session 129: Admin 504 수정 & Access Management)

#### 1. **Partner SBT 민팅 504 에러 수정** ✅
   - **근본 원인 3가지**:
     - Verifier 지갑에 MINTER_ROLE 누락
     - Polygon Amoy 공개 RPC 불안정/느림
     - RPC 타임아웃 미설정
   - **해결**:
     - `blockchain/scripts/grant-partner-roles.js` 생성 — MINTER_ROLE 부여 (tx: `0x0e7d47...`)
     - `web/api/admin-action.ts` RPC 개선: 다중 fallback URL + 15초 타임아웃 + try-catch 에러 메시지
     - `web/api/partner-sbt.ts` 동일 RPC 개선 적용

#### 2. **seanft.io 파트너 owner_user_id 마이그레이션** ✅
   - 문제: `owner_user_id`가 Stream Chat ID (`seanft_io_gmail_com`)로 저장되어 FK 위반
   - 해결: `20260222100000_fix_seanft_partner_owner.sql` 마이그레이션
     - users 테이블에 `0x73c544e63bc19b4fed62cf47d659e2aea175c2aa` (seanft.io) 추가
     - partners의 `seanft_io_gmail_com` → 지갑 주소로 UPDATE
   - Ruca Lee 파트너도 동일 패턴으로 수정 완료 (`20260221200000`)

#### 3. **Admin Access Management 페이지 구현** ✅
   - **`admin_wallets` Supabase 테이블** 생성 (Foundation + Verifier 시드)
   - **`AdminLayout.tsx`** 수정:
     - 하드코딩 `ADMIN_ADDRESSES` → Supabase에서 동적 fetch
     - Foundation 지갑은 항상 접근 가능 (hardcoded fallback)
     - "Access" 메뉴: Foundation 지갑에만 표시
   - **`AdminAccess.tsx`** 신규 생성:
     - 관리자 지갑 목록 테이블 (주소, 역할, 라벨, 추가일)
     - Foundation 지갑 추가/제거 UI (모달 + 확인 다이얼로그)
     - Foundation role은 "Permanent" 표시로 삭제 불가
     - 주소 유효성 검사, 중복 검사
   - 라우트: `/admin/access` 추가

#### 4. **Verifier 지갑 프로세스 정리**
   - **Client-side**: MetaMask 지갑 주소 → admin_wallets 테이블 조회 → UI 접근 제어
   - **Server-side**: 모든 온체인 트랜잭션은 `VERIFIER_PRIVATE_KEY`로 서명 (어떤 admin이 연결되든 동일)
   - Foundation/Verifier 모두 민팅 가능 (MINTER_ROLE 부여 완료)

#### 5. **커밋 내역**
   | 커밋 | 내용 |
   |------|------|
   | `d36078c` | fix(web): Fix 504 minting error with RPC reliability and role grant script |
   | `e21d5ae` | fix(db): Migrate seanft.io partner owner_user_id to wallet address |
   | `6904f6a` | feat(web): Add dynamic admin access management page |

#### 6. **수정/생성 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `blockchain/scripts/grant-partner-roles.js` | **신규** — MINTER_ROLE 부여 스크립트 |
   | `web/api/admin-action.ts` | 수정 — RPC 개선 + try-catch |
   | `web/api/partner-sbt.ts` | 수정 — RPC 개선 |
   | `supabase/migrations/20260221200000_fix_partner_owner.sql` | **신규** — Ruca Lee owner 수정 |
   | `supabase/migrations/20260222100000_fix_seanft_partner_owner.sql` | **신규** — seanft.io owner 수정 |
   | `supabase/migrations/20260222200000_admin_wallets.sql` | **신규** — admin_wallets 테이블 |
   | `web/src/pages/admin/AdminLayout.tsx` | 수정 — Supabase fetch + Access 메뉴 |
   | `web/src/pages/admin/AdminAccess.tsx` | **신규** — 접근 관리 페이지 |
   | `web/src/pages/admin/index.ts` | 수정 — AdminAccess export |
   | `web/src/App.tsx` | 수정 — /admin/access 라우트 |

---

### ✅ 완료된 작업 (2026-02-22 - Session 130: Admin Panel 테스트 & 수정)

#### 1. **Admin Panel 코드 리뷰 (40+ 이슈 발견)** ✅
   - 8개 admin 파일 전체 코드 리뷰 수행
   - CRITICAL 2건, HIGH 2건, MEDIUM 1건 발견 및 수정

#### 2. **[CRITICAL] ambassador.ts RPC 타임아웃 누락 수정** ✅
   - **문제**: `RPC_URLS`가 단일 공개 RPC URL만 사용, `ethers.JsonRpcProvider(url)` 타임아웃 없음
   - **수정**: 3개 fallback RPC URL + `ethers.FetchRequest` 15초 타임아웃 + `createProvider()` 함수
   - 모든 `tx.wait()` → `tx.wait(1, 45000)` (1 confirmation, 45초 타임아웃)

#### 3. **[CRITICAL] admin-action.ts tx.wait() 타임아웃 + 에러 핸들링 개선** ✅
   - **문제**: 모든 `tx.wait()` 호출에 타임아웃 없음 → Vercel 60초 제한 초과 시 504
   - **수정**: 모든 `tx.wait()` → `tx.wait(1, 45000)` (replace_all)
   - `updateKindnessScore` 액션 try-catch 블록 추가

#### 4. **[HIGH] Verifier role 메뉴 제한** ✅
   - **문제**: Verifier 지갑이 Partners/Users/Access 메뉴에 접근 가능 (Foundation 전용이어야 함)
   - **수정**: `AdminLayout.tsx` 메뉴를 `COMMON_MENU_ITEMS` (Dashboard + Meetups) + `FOUNDATION_MENU_ITEMS` (Partners + Users + Access)로 분리
   - Foundation: 전체 메뉴, Verifier: Dashboard + Meetups만 표시
   - `MenuItem` TypeScript 인터페이스 추가

#### 5. **[HIGH] AdminPartners Revoke 확인 다이얼로그 추가** ✅
   - **문제**: Partner SBT Revoke 버튼이 단일 클릭으로 실행 (온체인 비가역 작업)
   - **수정**: 2-step 확인 패턴 구현
     - Step 1: "Revoke SBT" 클릭 → 경고 메시지 표시 (파트너 이름 포함)
     - Step 2: "Confirm Revoke" / "Cancel" 버튼
   - `revokeConfirmed` state 추가, 모달 닫을 때 리셋

#### 6. **[MEDIUM] AdminDashboard NaN 방지** ✅
   - StatCard: `Number.isFinite(value)` 가드 추가
   - `truncateAddress()`: null/short string 가드 추가
   - `kindness_score`: `?? 0` null coalescing 추가

#### 7. **빌드 테스트 & 커밋** ✅
   - `npm run build` 성공 (33.89초, 에러 없음)
   - 커밋: `d1beeb1` - fix(web): Improve admin panel security, error handling and UX
   - 5개 파일, +101줄, -38줄

#### 8. **수정 파일 요약**
   | 파일 | 수정 내용 |
   |------|----------|
   | `web/api/ambassador.ts` | RPC 3개 fallback + 15초 타임아웃 + tx.wait(1, 45000) |
   | `web/api/admin-action.ts` | tx.wait(1, 45000) + updateKindnessScore try-catch |
   | `web/src/pages/admin/AdminLayout.tsx` | COMMON/FOUNDATION 메뉴 분리, MenuItem 인터페이스 |
   | `web/src/pages/admin/AdminPartners.tsx` | 2-step Revoke 확인 다이얼로그 |
   | `web/src/pages/admin/AdminDashboard.tsx` | NaN 방지 + null 가드 |

---

### ✅ 완료된 작업 (2026-02-22 - Session 131: Edge-Safe Blockchain API 마이그레이션)

#### 1. **viem → 경량 rpc.ts 마이그레이션 (4개 API 전체 완료)** ✅
   - **근본 문제**: Partner SBT 민팅 504 타임아웃 — viem 라이브러리(44MB)가 Vercel Edge Runtime 4MB 한도 초과 + 콜드스타트 지연
   - **해결**: `web/api/_lib/rpc.ts` 경량 유틸리티 생성 (raw fetch() JSON-RPC + @noble/curves)
   - 4개 API 파일 전부 rpc.ts로 재작성 완료

   | API 파일 | 응답 시간 | 상태 |
   |----------|----------|------|
   | `admin-action.ts` | 0.90s | ✅ (기존 504 → 0.9s) |
   | `partner-sbt.ts` | 0.93s | ✅ |
   | `ambassador.ts` | 0.57s | ✅ |
   | `mining-claim.ts` | 1.37s | ✅ |

#### 2. **`web/api/_lib/rpc.ts` 경량 RPC 유틸리티** ✅
   - **의존성**: `@noble/curves/secp256k1` + `@noble/hashes/sha3` (순수 JS, 수 KB)
   - **제공 기능**:
     - `ethCall()`, `sendTransaction()`, `waitForReceipt()` — raw JSON-RPC
     - `isAddress()` — 주소 유효성 검사
     - Calldata builders: `PartnerSBT.*`, `AmbassadorSBT.*`, `MiningPool.*`
     - Decoders: `decodeUint256`, `decodeBool`, `decodeInt256`, `decodeHexString`
     - Helpers: `formatEther`, `parseEther`, `jsonResponse`, `CORS_HEADERS`
   - **EIP-155 트랜잭션 서명**: 수동 RLP 인코딩 + secp256k1 서명
   - **RPC fallback**: 체인별 다중 RPC URL (Polygon Amoy 3개)

#### 3. **mining-claim getStatus 리버트 핸들링** ✅
   - **문제**: `MiningPool.getContractBalance()` 컨트랙트 리버트 → 전체 Promise.all 실패
   - **수정**: `safeCall()` 래퍼 (리버트 시 null 반환) + `safeDecode()` (null → 0n)
   - 커밋: `37c5aaf` - fix(web): Handle reverted view calls in mining-claim getStatus

#### 4. **커밋 내역**
   | 커밋 | 내용 |
   |------|------|
   | `5777945` | fix(web): Replace viem with lightweight rpc.ts for edge-safe blockchain APIs |
   | `37c5aaf` | fix(web): Handle reverted view calls in mining-claim getStatus |

#### 5. **수정/생성 파일 요약**
   | 파일 | 작업 |
   |------|------|
   | `web/api/_lib/rpc.ts` | **신규** — 경량 RPC 유틸리티 (fetch + @noble/curves) |
   | `web/api/admin-action.ts` | 재작성 — viem → rpc.ts |
   | `web/api/partner-sbt.ts` | 재작성 — viem → rpc.ts |
   | `web/api/ambassador.ts` | 재작성 — viem → rpc.ts |
   | `web/api/mining-claim.ts` | 재작성 — viem → rpc.ts + safeCall/safeDecode 패턴 |

#### 6. **교훈: Vercel Edge Runtime에서 블록체인 라이브러리 사용 시**
   - ethers.js (2MB+), viem (44MB) 모두 Edge Runtime 4MB 한도 초과
   - raw fetch() JSON-RPC + @noble/curves가 가장 경량 (수 KB)
   - ABI 인코딩은 수동으로 충분 (keccak256 함수 선택자 + encodeAddress/Uint256)

---

### 🔲 다음 세션 작업 (Session 132+)

#### 🔴 높은 우선순위
- **Admin Panel 실기기 테스트**: Partner SBT 민팅/갱신/취소, Meetup 승인, Users 검색, Access Management
- **실기기 재테스트**: reverse geocoding, QR 카운트다운, 지도 제스처, 인증 배지 표시 확인

#### 🟡 중간 우선순위
- **GAII 페이지 i18n 완성**: 12개 언어 `platform.json` 추가
- **Governance 실제 제안 로드**: Mock 데이터 제거
- **게임 서버 MiningPool 연동**: mining-claim API 활용
- **AlmaPaymentManager 수수료 할인 연동**: PartnerSBT 15% 할인 (NFT 마켓 활성화 후)
- **앱스토어 URL 업데이트**: Google Play, App Store, APK 다운로드 링크

#### 🟢 낮은 우선순위
- **Google Places Autocomplete**: 주소 입력 시 자동완성 + 비즈니스 검색 (유료 API)
- **Kindness AI 분석 MVP**: V0.6+
- **메인넷 배포 준비**: Multi-sig, 감사
- **토큰 로고 AI 생성**
- **모바일 실기기 QA 테스트**
