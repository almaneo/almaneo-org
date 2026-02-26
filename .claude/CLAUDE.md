# AlmaNEO — Project Reference

> 세션 기록: `HISTORY.md` | 다음 작업: `NEXT_STEPS.md` | 게임 업데이트: `GAME_UPDATE.md`

---

## Project Overview

- **Name**: AlmaNEO | **Token**: ALMAN | **Domain**: almaneo.org
- **Stack**: Vite 7 + React 19 + TypeScript + Tailwind 3.x + Supabase
- **Mobile**: Flutter 3.x (AlmaChat) + Stream Chat + Web3Auth
- **Blockchain**: Polygon Amoy (testnet) → Mainnet 예정
- **Theme**: "Cold Code, Warm Soul" — AI democratization

## Key Concepts

| 개념 | 설명 |
|------|------|
| **정(情)** | 한국의 깊은 유대감 — 핵심 철학 |
| **GAII** | Global AI Inequality Index (4지표: Access 40%, Affordability 30%, Language 20%, Skill 10%) |
| **Kindness Protocol** | Proof of Humanity — 오프라인 밋업 인증 기반 |
| **ALMAN Token** | 8B 공급량 (8B humans) |
| **Ambassador SBT** | Kindness Score 기반 자동 발급 (Friend/Host/Ambassador/Guardian) |
| **Partner SBT** | 파트너 비즈니스 온체인 인증 (1년 유효기간) |
| **AlmaChat** | 자동 번역 글로벌 채팅 앱 (Flutter) |

---

## Commands

```bash
# Web 서버 (포트 5173)
cd C:\DEV\ALMANEO\web && npm run dev

# NFT 서버 (포트 5174)
cd C:\DEV\ALMANEO\nft && npm run dev

# Game 서버 (포트 3000)
cd C:\DEV\ALMANEO\game && npm run dev

# Flutter Chat 앱
cd C:\DEV\ALMANEO\chat-app && flutter run

# AlmaChat Backend (로컬)
cd C:\DEV\ALMANEO\chat && vercel dev

# Build
cd web && npm run build
cd chat-app && flutter build apk --release
cd chat-app && flutter build appbundle --release  # Play Store AAB
```

---

## Deployments & Config

| 서버 | URL | 플랫폼 |
|------|-----|--------|
| Web | https://almaneo.org | Vercel |
| NFT | https://nft.almaneo.org | Vercel |
| Game | https://game.almaneo.org | Vercel |
| Chat Backend | https://chat.almaneo.org | Vercel (chat/) |

### Supabase
```
URL: https://euchaicondbmdkomnilr.supabase.co  (Seoul)
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...HX0kk4u9iy7G_DX1zEgLH33jTxhzsw75YKHPdFBaNYA
```

### Stream Chat
```
API Key: zz454a2savzv  (US East)
FCM Push Provider: almachat
Health: https://chat.almaneo.org/api/health
```

### Key Wallets
```
Foundation:  0x7BD8194c22b79B0BBa6B2AFDfe36c658707024FE
Verifier:    0x30073c2f47D41539dA6147324bb9257E0638144E
```

---

## Contract Addresses (Polygon Amoy)

### Core TGE (2026-02-06, 8B ALMAN)
```
ALMANToken:       0x2B52bD2daFd82683Dcf0A994eb24427afb9C1c63
JeongSBT:         0x41588D71373A6cf9E6f848250Ff7322d67Bb393c
ALMANStaking:     0xB691a0DF657A06209A3a4EF1A06a139B843b945B
ALMANTimelock:    0x464bca66C5B53b2163A89088213B1f832F0dF7c0
ALMANGovernor:    0x30E0FDEb1A730B517bF8851b7485107D7bc9dE33
KindnessAirdrop:  0xfb89843F5a36A5E7E48A727225334E7b68fE22ac
TokenVesting:     0x02fB6851B6cDc6B9176B42065bC9e0E0F6cf8F0E
MiningPool:       0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9
AmbassadorSBT:    0xf368d239a0b756533ff5688021A04Bc62Ab3c27B
PartnerSBT:       0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08
```

### NFT (2026-01-20)
```
AlmaNFT721:            0xbFbE2b1eDB0f7F0675D5E449E508adE3697B8dfa
AlmaNFT1155:           0x50FC5Ecaa9517CCD24b86874b0E87ab6225E9cfF
AlmaMarketplace:       0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b
AlmaPaymentManager:    0x2410Fa2958f2966DB85eF98aCbA4b9e360257E4e
AlmaCollectionManager: 0x1Ad2176A1181CFF2d82289f5cc5d143d9B3AFE1D
TrustedForwarder:      0xd240234dacd7ffdca7e4effcf6c7190885d7e2f0
```

---

## Current Status (Session 135 기준, 2026-02-22)

| 서비스 | 상태 | 비고 |
|--------|------|------|
| Web Landing | ✅ | SEO, 14개 언어 i18n, AlmaChat 섹션 |
| GAII Dashboard/Report | ✅ | 50개국, PDF, i18n (ko/en만) |
| AI Hub | ✅ | Gemini + Groq + Vercel AI Gateway |
| Kindness/Meetup | ✅ | Supabase + AmbassadorSBT 온체인 |
| Whitepaper | ✅ | 15개 언어 |
| Dashboard/Staking/Airdrop | ✅ | 컨트랙트 연동 |
| Governance | ⚠️ | Mock 데이터 |
| Partners | ✅ | 지도/목록, 바우처 QR, PartnerSBT |
| Admin Panel | ✅ | /admin (파트너/밋업/유저/접근관리) |
| Proposal (Pitch Deck) | ✅ | 한국어/영어 TTS 음성 |
| NFT Site | ✅ | nft.almaneo.org |
| Game | ✅ | game.almaneo.org + MiningPool API |
| AlmaChat | ✅ | v0.5 완료 (APK 76.7MB) |
| AlmaChat Play Store | 🔲 | 미등록 ($25 필요) |
| AlmaChat App Store | 🔲 | 미등록 ($99/년 필요) |

---

## Architecture

```
almaneo.org (Web)          chat.almaneo.org (API)
├─ /ai-hub                 ├─ /api/chat (Gemini/Groq)
├─ /gaii                   ├─ /api/stream-token
├─ /kindness + /meetup     ├─ /api/ambassador (AmbassadorSBT)
├─ /admin                  ├─ /api/partner-sbt (PartnerSBT)
└─ /proposals              ├─ /api/admin-action (온체인)
                           ├─ /api/mining-claim (MiningPool)
                           └─ /api/health

Flutter AlmaChat ──── Stream Chat (zz454a2savzv) ──── Supabase (Seoul)
      │                    (WebSocket, US East)
      └── Web3Auth (소셜 로그인 + 지갑)

game.almaneo.org ──── /api/mining-claim (알마채팅 백엔드 공용)
```

---

## Technical Patterns (중요)

### Vercel 환경변수
```bash
# echo 금지! trailing newline → API 키 오류
printf "value" | vercel env add KEY_NAME production
```

### AlmaChat Stream 재연결 (3-Tier)
| Tier | 시간 | 전략 |
|------|------|------|
| 1 | 0~30s | SDK 자체 재연결 (간섭 없음) |
| 2 | 30~60s | closeConnection + openConnection |
| 3 | 60s+ | disconnectUser + connectUserWithProvider (max 3회) |

### Blockchain API (Edge-Safe)
- `web/api/_lib/rpc.ts` 사용 — raw fetch() + @noble/curves (ethers/viem 금지, 4MB 초과)
- `sendTransactionAndWait()` 사용 (tx.wait(1, 45000))

### i18n 초기화 패턴
```typescript
// main.tsx: initPromise.then(() => root.render(...))
// App.tsx: <I18nextProvider i18n={i18n}>
// 네임스페이스: 'common', 'landing', 'platform'
```

### Partner/User FK 패턴
- `owner_user_id`: eth 주소가 아닌 소셜 ID면 `null` 저장

---

## Design Tokens

```
Cold: #0A0F1A (bg), #0052FF (electricBlue), #06b6d4 (cyan)
Warm: #FF6B00 (terracottaOrange), #d4a574 (sandGold)
Fonts: Montserrat (영문), Pretendard (한글)
Icons: Lucide React (strokeWidth 1.5)
AlmaChat: AlmaColors ThemeExtension (context.alma.*)
```

---

## SNS

```
Twitter/X: https://x.com/almaneo_org
Discord:   https://discord.gg/JkRNuj7aYd
GitHub:    https://github.com/almaneo (SSH: git@github-almaneo:almaneo/almaneo-org.git)
```

---

> 📋 다음 작업: `.claude/NEXT_STEPS.md` 를 먼저 확인하세요.
