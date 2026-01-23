# AlmaNEO Project - Claude Memory

## Project Overview
- **Name**: AlmaNEO (이전: NEO-SAPIENS)
- **Token**: ALMAN (이전: NEOS)
- **Domain**: almaneo.org
- **Type**: Web3 Landing Page / DApp
- **Stack**: Vite 7.x + React 19 + TypeScript + Tailwind CSS 3.x + Firebase
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
│   │   │   ├── useUserData.ts     # Firebase 사용자 데이터
│   │   │   ├── useStaking.ts      # 스테이킹 컨트랙트 연동
│   │   │   ├── useGovernance.ts   # 거버넌스 컨트랙트 연동
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
│   │   │   │   ├── schema.ts      # 타입 정의 및 계산 함수
│   │   │   │   ├── countries.ts   # ~100개국 GAII 데이터
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
│   │   │   ├── Dashboard.tsx      # ✅ Firebase 연동
│   │   │   ├── GAII.tsx           # ✅ GAII Dashboard (세계지도)
│   │   │   ├── Governance.tsx     # ✅ 컨트랙트 연동
│   │   │   ├── Staking.tsx        # ✅ 컨트랙트 연동
│   │   │   ├── Airdrop.tsx
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
│   │   ├── firebase.ts            # Firebase + Firestore 초기화
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
│   ├── firebase/config.ts, firestore.ts
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
  "firebase": "^12.8.0",
  "@web3auth/modal": "latest",
  "@web3auth/base": "latest",
  "ethers": "^6.x",
  "react-simple-maps": "^3.0.0",
  "d3-geo": "^3.x",
  "prop-types": "^15.x",
  "react-i18next": "^15.x",
  "i18next": "^24.x",
  "i18next-browser-languagedetector": "^8.x",
  "i18next-http-backend": "^3.x"
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
   - firebase/config.ts, firestore.ts (Firebase 초기화 및 유틸리티)
   - contracts/addresses.ts (컨트랙트 주소 관리)
   - types/user.ts, game.ts, contracts.ts (공통 타입 정의)
2. 환경 변수 설정 (.env, .env.example)
   - Web3Auth Client ID 설정 완료
   - Firebase 프로젝트 연동 완료 (neos-p)
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
   - hooks/useUserData.ts (Firebase 연동)
   - Dashboard.tsx 리팩토링 (Web3Auth + Firebase)
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
- [ ] 나머지 섹션에 t() 함수 확장 (Team, Partners, Roadmap, FAQ)
- [ ] 이미지/미디어 추가
- [ ] 접근성 기능 (고대비, 큰 글씨 등)
- [ ] Game 서버 배포
- [ ] 반응형 최적화
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
│  │                    Firebase Backend                      │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │   │
│  │  │   Auth      │ │  Firestore  │ │  Storage    │        │   │
│  │  │ (사용자)    │ │ (데이터)    │ │ (파일)      │        │   │
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
│   ├── firebase/           # Firebase 설정
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
3. Firebase Auth에 Custom Token으로 인증
4. Firestore에서 사용자 데이터 조회/생성
5. 다른 서버 방문 시 → 이미 로그인 상태 (세션 공유)
```

### Firebase 컬렉션 구조
```
firestore/
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

# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

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

### 🔲 다음 세션 작업 (Session 15)
1. **Firebase 재배포**
   - 화이트페이퍼 페이지 포함하여 배포
   - `firebase deploy --only hosting`

2. **SNS URL 실제 주소로 업데이트**
   - Twitter/X, Telegram, Discord, YouTube, TikTok 실제 채널 연결

3. **화이트페이퍼 PDF 다운로드 기능**
   - PDF 파일 생성 및 호스팅
   - 다운로드 버튼 연결

4. **반응형 최적화**
   - 모바일에서 화이트페이퍼 사이드바 개선
   - 터치 제스처 지원

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

### 배포된 URL
```
Web:  https://almaneo.org (Firebase Hosting → Custom Domain)
NFT:  https://nft.almaneo.org (Firebase Hosting → Custom Domain)
Game: https://game.almaneo.org (미배포)
```

### Firebase 프로젝트 정보
```
# Web 서버
Project ID: almaneo-org
URL: https://almaneo-org.web.app → https://almaneo.org
API Key: AIzaSyCS0K_LWjyJXm7hCSTyy7bfxJPXzQuLsbk

# NFT 서버
Project ID: almaneo-nft
URL: https://almaneo-nft.web.app → https://nft.almaneo.org
API Key: AIzaSyAQw5P6coTtt9GZAYqbcPBpX64BdM6F0Pw
```

### 현재 완료된 배포

**Polygon Amoy Testnet - Core (2026-01-20 재배포 - AlmaNEO 브랜딩):**
```
ALMANToken:       0x261d686c9ea66a8404fBAC978d270a47eFa764bA
JeongSBT:         0x8d8eECb2072Df7547C22e12C898cB9e2326f827D
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
- **토큰명**: MiMiG → NEOS
- **채굴 풀**: 10M → 800M NEOS (전체 8B의 10%)
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

### 친절 모드 (Kindness Mode) 가이드
친절 모드는 Web3/블록체인 초보자를 위한 용어 설명 기능입니다.

**파일 구조:**
- `contexts/KindnessModeContext.tsx`: 전역 상태 관리
- `data/glossary.ts`: 용어 정의 데이터
- `components/ui/KindnessTerm.tsx`: 툴팁 컴포넌트

**사용 방법:**
```tsx
import { KindnessTerm } from '../ui';

// 텍스트에 툴팁 적용
<KindnessTerm termKey="staking">스테이킹</KindnessTerm>
```

**용어 카테고리:**
- `blockchain`: 블록체인, 스마트 컨트랙트, 가스비 등
- `token`: ERC-20, 토큰, 총 공급량 등
- `defi`: 스테이킹, APY, 유동성 등
- `nft`: NFT, 로열티, 민팅 등
- `governance`: DAO, 제안, 투표, 쿼럼 등
- `neos`: NEOS 고유 개념 (정, Kindness Score, Jeong-SBT 등)

**신규 용어 추가:**
```typescript
// data/glossary.ts
export const glossary: Record<string, GlossaryTerm> = {
  newTerm: {
    term: '새 용어',
    simple: '간단한 설명 (1줄)',
    detailed: '자세한 설명 (예시 포함)',
    example: '실제 사용 예시',
    category: 'blockchain' | 'token' | 'defi' | 'nft' | 'governance' | 'neos',
  },
};
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
