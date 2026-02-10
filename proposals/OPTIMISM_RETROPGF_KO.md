# Optimism RetroPGF 지원서: AlmaNEO

**프로젝트:** AlmaNEO — 오픈소스 AI 민주화 플랫폼
**웹사이트:** https://almaneo.org
**GitHub:** https://github.com/almaneo
**카테고리:** Public Goods / Open Data / AI Access
**라이선스:** MIT (코드), CC-BY-4.0 (데이터)

---

## 1. 프로젝트 소개

AlmaNEO는 전 세계 AI 불평등을 측정하고 해결하는 오픈소스 플랫폼입니다. 50개국의 AI 접근 격차를 정량화하는 최초의 복합 지표 **GAII (Global AI Inequality Index)**를 만들었고, 14개 언어를 지원하는 **무료 AI Hub**를 운영하고 있습니다. 18개의 검증된 스마트 컨트랙트 라이브러리를 포함해 우리가 만드는 모든 것은 오픈소스이며, 데이터는 CC-BY-4.0으로 누구나 자유롭게 사용할 수 있습니다.

우리의 철학은 **"차가운 코드, 따뜻한 영혼(Cold Code, Warm Soul)"** — 기술은 인류를 분열시키는 것이 아니라 연결해야 한다는 것입니다. 이것은 Optimism의 **"Impact = Profit"** 원칙과 정확히 일치합니다. 우리는 공공재 임팩트를 측정하고, 공공 인프라를 구축하며, 가장 필요한 사람들에게 자원을 분배합니다.

---

## 2. 우리가 만든 Public Goods

### 2.1 GAII (Global AI Inequality Index) — 오픈 데이터셋

AI 불평등을 글로벌 단위로 측정하는 세계 최초의 복합 지표입니다.

| 항목 | 내용 |
|:-----|:-----|
| 측정 국가 | 50개국 (100개국 확대 예정) |
| 지표 | 4개 복합 (16개 세부 지표) |
| 분석 지역 | 10개 권역 |
| 라이선스 | CC-BY-4.0 (완전 공개) |
| 대시보드 | [almaneo.org/gaii](https://almaneo.org) |
| PDF 리포트 | 무료 다운로드 |

**4대 지표:** Access(접근성, 40%) / Affordability(경제성, 30%) / Language(언어, 20%) / Skill(역량, 10%)

세계은행도, UN도, 어떤 AI 기업도 채우지 못한 빈자리가 있습니다. AI가 얼마나 불균등하게 분배되어 있는지 보여주는 표준화된 복합 지표. GAII가 그 역할을 합니다. 데이터는 완전 공개이며, 누구나 인용하고 활용할 수 있습니다.

### 2.2 AI Hub — 무료 공공 AI 인프라

페이월 없이 누구나 사용할 수 있는 멀티모델 AI 게이트웨이입니다.

| 항목 | 내용 |
|:-----|:-----|
| 모델 | Gemini 2.5 Flash Lite + Llama 3.3 70B |
| 지원 언어 | 14개 (Global South 언어 포함) |
| 무료 쿼터 | 일 50회/사용자 |
| 인증 | Web3Auth (소셜 로그인, 암호화폐 지식 불필요) |
| 유료 구간 | 없음 (기본 접근 무료) |

**지원 언어:** 한국어, 영어, 중국어, 일본어, 스페인어, 프랑스어, 아랍어, 포르투갈어, 인도네시아어, 말레이어, 태국어, 베트남어, 크메르어, 스와힐리어

월 $20의 AI 구독료를 감당할 수 없는 약 35억 명을 위한 서비스입니다.

### 2.3 오픈소스 코드베이스

| 항목 | 내용 |
|:-----|:-----|
| 소스 파일 | 670개+ |
| 코드 라인 | 178,000줄+ |
| 라이선스 | MIT |
| 저장소 | [github.com/almaneo](https://github.com/almaneo) |
| 기술 스택 | Vite 7 + React 19 + TypeScript + Tailwind CSS |

### 2.4 스마트 컨트랙트 라이브러리 — 재사용 가능한 공공 인프라

Polygon에 배포된 18개 Solidity 컨트랙트. 모두 UUPS Upgradeable 패턴과 OpenZeppelin 5.x 기반입니다. 프로덕션 검증 완료, 어떤 프로젝트에서든 재사용 가능합니다.

| 컨트랙트 | 표준 | 용도 |
|:---------|:-----|:-----|
| ALMANToken | ERC-20Votes | 거버넌스 토큰 (8B 공급량) |
| JeongSBT | ERC-721 Soulbound | 양도 불가 영혼 토큰 (4티어) |
| AmbassadorSBT | ERC-721 Soulbound | 활동 기반 자동 발급 |
| ALMANStaking | Custom | 4티어 스테이킹 (APY 5-18%) |
| ALMANGovernor | Governor | DAO 거버넌스 (쿼럼 4%) |
| ALMANTimelock | Timelock | 2일 실행 지연 |
| KindnessAirdrop | Merkle Proof | 활동 기반 분배 |
| TokenVesting | Custom | 12개월 cliff + 3년 선형 |
| MiningPool | Custom | 게임 마이닝 (반감기 에포크) |
| AlmaNFT721 | ERC-721 + ERC-4907 | 렌탈 지원 NFT |
| AlmaNFT1155 | ERC-1155 + ERC-5006 | 멀티토큰 렌탈 |
| AlmaMarketplace | Custom | 고정가/경매/렌탈 거래 |
| AlmaPaymentManager | Custom | 멀티토큰 결제 |
| AlmaCollectionManager | Custom | 컬렉션 관리 |

PolygonScan에서 9개 컨트랙트 검증 완료. 전체 소스 MIT 라이선스.

### 2.5 다국어 인프라

| 항목 | 내용 |
|:-----|:-----|
| UI 지원 언어 | 14개 |
| 화이트페이퍼 언어 | 15개 |
| 문화 교육 게임 | [game.almaneo.org](https://game.almaneo.org) (20개국, 58퀘스트) |
| 번역 키 | 1,000개+ |

---

## 3. 측정 가능한 임팩트 지표

| 지표 | 수치 |
|:-----|:-----|
| GAII 데이터 보유 국가 | 50개국 |
| UI 지원 언어 | 14개 |
| 화이트페이퍼 언어 | 15개 |
| 오픈소스 파일 수 | 670개+ |
| 오픈소스 코드 라인 | 178,000줄+ |
| 배포된 스마트 컨트랙트 | 18개 |
| PolygonScan 검증 완료 | 9개 |
| 라이브 서비스 | 3개 (web, nft, game) |
| 국가별 GAII 지표 | 4개 (세부 16개) |
| 게임 퀘스트 (문화 교육) | 20개국 58개 |
| 토큰 공급량 (커뮤니티 우선) | 8B ALMAN (40% 커뮤니티 배분) |
| 친절 모드 용어 사전 | 30개+ 용어 x 14개 언어 |

---

## 4. Optimism "Impact = Profit"과의 정합성

AlmaNEO는 처음부터 공공재 인프라로 설계되었습니다.

1. **오픈 데이터 = Public Good**: GAII는 CC-BY-4.0 라이선스입니다. API 키도 필요 없고, 속도 제한도 없습니다. 누구나 자유롭게 사용, 재가공, 확장할 수 있습니다.

2. **무료 접근 = Public Infrastructure**: AI Hub는 매일 50회 무료 쿼리를 제공하며 기본 접근에 유료 구간이 없습니다. 접근을 수익화하지 않고, 민주화합니다.

3. **오픈소스 = Public Code**: 670개+ 파일, 178K+ 코드 라인, MIT 라이선스. 스마트 컨트랙트 라이브러리만으로도 어떤 Web3 프로젝트에서든 재사용할 수 있는 공공재입니다.

4. **커뮤니티 거버넌스**: 8B ALMAN 토큰의 40%가 커뮤니티에 배분됩니다 (마이닝, 스테이킹 보상, 에어드롭, DAO 준비금). Kindness Protocol은 투기가 아닌 실제 오프라인 밋업과 멘토링을 인센티브화합니다.

5. **임팩트 측정 도구**: GAII 자체가 임팩트 측정 도구입니다. 임팩트를 주장만 하는 것이 아니라, 글로벌 단위로 측정하는 지표를 직접 만들었습니다.

> **우리는 AI 접근이 프리미엄 상품이 아닌 공공재라고 믿습니다.**

---

## 5. 기술 아키텍처

```
almaneo.org (메인 플랫폼)
  ├─ GAII Dashboard (50개국, 인터랙티브 세계지도)
  ├─ AI Hub (멀티모델, SSE 스트리밍)
  ├─ Kindness Protocol (밋업 검증, Ambassador SBT)
  ├─ Governance (온체인 DAO)
  ├─ Staking / Airdrop
  └─ Whitepaper (15개 언어)

game.almaneo.org (문화 교육)
  └─ 세계문화여행 (20개국, 58퀘스트, 2개 언어)

nft.almaneo.org (NFT 마켓플레이스)
  └─ Biconomy 가스비 대납 민팅

Backend: Supabase (PostgreSQL, Seoul 리전)
Hosting: Vercel (Edge Functions)
Blockchain: Polygon (18개 컨트랙트, UUPS Upgradeable)
```

---

## 6. RetroPGF 펀딩 사용 계획

| 배분 | 용도 | 기대 임팩트 |
|:-----|:-----|:-----------|
| 40% | GAII 100개국 확대 | 오픈 데이터셋 커버리지 2배 확장 |
| 25% | AI Hub 무료 운영 유지 | Global South 사용자 무료 AI 접근 지속 |
| 20% | 커뮤니티 밋업 지원 | Kindness Protocol 오프라인 이벤트 확대 |
| 15% | 번역/로컬라이제이션 | Global South 5개+ 신규 언어 추가 |

모든 결과물은 오픈소스로 유지되며 무료로 제공됩니다.

---

## 7. 팀

| 역할 | 이름 | 담당 |
|:-----|:-----|:-----|
| Co-Founder | Ruca Lee | 비전, AI/블록체인 아키텍처 |
| Co-Founder | Patrick Ma | 글로벌 커뮤니티 빌딩 |
| Co-Founder | Lion Kim | 토큰 비즈니스, 결제 시스템 |

3명의 풀타임 Co-Founder. 현재 채용 진행 중: CTO, Head of Product, Community Lead, AI Researcher.

---

## 8. 링크

| 리소스 | URL |
|:-------|:----|
| 웹사이트 | https://almaneo.org |
| GAII Dashboard | https://almaneo.org (Platform > GAII) |
| AI Hub | https://almaneo.org (Platform > AI Hub) |
| 게임 | https://game.almaneo.org |
| NFT 마켓플레이스 | https://nft.almaneo.org |
| GitHub | https://github.com/almaneo |
| Twitter/X | https://x.com/almaneo_org |
| Discord | https://discord.gg/JkRNuj7aYd |
| 블로그 | https://medium.com/@news_15809 |

---

*AlmaNEO — Cold Code, Warm Soul*
*AI를 80억 인류의 공공재로.*
*Impact = Profit. 오픈소스. 영원히 무료.*
