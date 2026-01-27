# Game Update Session - 세계문화여행 업그레이드

> 이 파일은 게임 업데이트 작업 전용 세션 관리 파일입니다.
> 작업 완료 후 CLAUDE.md에 요약 기록합니다.

## 목표
Kindness Game을 세계문화여행 게임으로 업그레이드

## 사용자 결정사항
- MVP 범위: **15~20개국**
- 메인 화면: **세계여행 중심으로 전환** (기존 랜덤 시나리오 대체)
- 지도 UI: **게임풍 지역 카드 리스트** (세로/가로 모두 대응)

## 게임 기술 스택
- Next.js 14 + TypeScript + MUI + Framer Motion + Zustand + Supabase
- 개발 서버: `cd c:\DEV\ALMANEO\game && npm run dev` (포트 3000)
- 빌드: `npm run build`

## 핵심 파일 맵
```
game/
├── app/page.tsx              # ✅ 메인 오케스트레이터 (MoreMenu 통합, 이모지 아이콘)
├── app/layout.tsx            # ✅ 루트 레이아웃 (dvh 뷰포트)
├── app/globals.css           # ✅ 글로벌 CSS (스토리 모달, dvh, safe-area)
├── locales/                  # 🆕 i18n 번역 파일
│   ├── ko.json                  # 한국어 (~200키)
│   └── en.json                  # 영어 (~200키)
├── hooks/useGameStore.ts     # Zustand 게임 상태 (812줄)
├── hooks/useTravelStore.ts   # 🆕 Travel 전용 Zustand 스토어
├── hooks/useIsMobile.ts      # 모바일 감지
├── lib/
│   ├── i18n.ts               # 🆕 i18n 설정 (bundled resources, LanguageDetector)
│   ├── constants.ts          # 게임 상수 (레벨, 업그레이드, 티어)
│   ├── kindnessData.ts       # ✅ 국가 데이터에서 동적 추출 (20개국 cultural_scenario)
│   ├── quests.ts             # ✅ 일일 퀘스트 (tap/points/upgrade/travel)
│   ├── achievements.ts       # ✅ 업적 27개 (tap/points/upgrade/level/special/travel)
│   ├── storyContent.ts       # ✅ 새 스토리 5장 (.webp 이미지) + 마일스톤 10개
│   ├── tokenMining.ts        # 800M ALMAN 채굴 풀
│   ├── tokenReward.ts        # 토큰 보상 계산
│   ├── contentService.ts     # 🆕 Supabase 콘텐츠 서비스 (캐시, fallback)
│   ├── appealService.ts      # 🆕 어필 서비스 (제출, 조회)
│   ├── supabase.ts           # ✅ Supabase 클라이언트 (TravelSaveData 추가)
│   ├── supabase-db.ts        # ✅ 게임 상태 CRUD (travel_state 포함)
│   └── worldTravel/          # 🆕 세계문화여행 시스템
│       ├── types.ts          # 타입 정의 (Region, Country, Quest 등)
│       ├── regions.ts        # 8개 지역 정의
│       ├── progression.ts    # 별 계산, 포인트, 언락 로직
│       ├── index.ts          # 모듈 export
│       └── countries/        # 20개국 데이터
│           ├── eastAsia.ts       # 한국, 일본, 중국
│           ├── southeastAsia.ts  # 태국, 베트남, 인도네시아
│           ├── southAsia.ts      # 인도, 네팔
│           ├── middleEast.ts     # 터키, UAE
│           ├── europe.ts         # 프랑스, 영국, 독일, 이탈리아
│           ├── africa.ts         # 남아프리카, 케냐
│           ├── americas.ts       # 미국, 캐나다, 브라질, 멕시코
│           ├── oceania.ts        # 호주, 뉴질랜드
│           └── index.ts
├── scripts/                  # 🆕 DB 시드 스크립트
│   ├── seed-quest-data.ts       # 영어 데이터 시드 (지역+국가+퀘스트+번역)
│   ├── seed-korean-translations.ts # 한국어 번역 시드
│   └── data/                    # 🆕 번역 데이터 파일
│       ├── ko-quests-part1.ts      # 22개 (동아시아, 동남아, 남아시아)
│       ├── ko-quests-part2.ts      # 15개 (중동, 유럽)
│       └── ko-quests-part3.ts      # 21개 (아프리카, 아메리카, 오세아니아)
├── components/
│   ├── I18nProvider.tsx       # 🆕 i18n 클라이언트 Provider 래퍼
│   ├── LoadingScreen.tsx      # ✅ 전체 배경 이미지 + 오버레이 (almaneo-title.webp)
│   ├── GameLayout.tsx         # ✅ flex 레이아웃 (dvh, 네비바 항상 표시)
│   ├── GameHUD.tsx            # ✅ 간결화 + 모바일 사이즈 축소 (gap/px 조정)
│   ├── GameNavBar.tsx         # ✅ 5탭 이모지 네비 (More: MUI MoreHorizIcon)
│   ├── MoreMenu.tsx           # 🆕 바텀시트 메뉴 (MUI Drawer)
│   ├── AppealButton.tsx       # 🆕 콘텐츠 어필 버튼 + 모달
│   ├── AppealHistory.tsx      # 🆕 어필 내역 (상태별 필터)
│   ├── KindnessCanvas.tsx     # ✅ 메인 캔버스 (Travel CTA 추가)
│   ├── GameModal.tsx          # ✅ 세로모드 최적화
│   ├── UpgradePanel.tsx       # 업그레이드 패널
│   ├── QuestPanel.tsx         # 일일 퀘스트 패널
│   ├── AchievementPanel.tsx   # 업적 패널
│   ├── LeaderboardPanel.tsx   # 리더보드
│   ├── TokenClaimModal.tsx    # 토큰 클레임
│   ├── LoginScreen.tsx        # ✅ 모바일 세로 레이아웃 최적화
│   ├── StartScreen.tsx        # ✅ 타이틀 이미지 적용 (almaneo-title.webp)
│   ├── StoryIntro.tsx         # ✅ 카드형 모달로 전면 재작성
│   ├── WorldMap/              # 🆕 세계지도
│   │   ├── WorldMap.tsx
│   │   ├── RegionCard.tsx
│   │   ├── CountryNode.tsx
│   │   └── index.ts
│   ├── CountryScreen/         # 🆕 국가 상세
│   │   ├── CountryScreen.tsx
│   │   ├── CultureCard.tsx
│   │   ├── QuestList.tsx
│   │   └── index.ts
│   └── QuestScreen/           # 🆕 퀘스트 실행
│       ├── QuestScreen.tsx
│       ├── CulturalScenarioQuest.tsx
│       ├── TriviaQuizQuest.tsx
│       ├── HistoryLessonQuest.tsx
│       ├── CulturalPracticeQuest.tsx
│       ├── QuestComplete.tsx
│       └── index.ts
```

## 작업 체크리스트

### Phase 1: MiMiG 로딩화면 → AlmaNEO ✅
- [x] LoadingScreen.tsx: 로고, 배경색, 텍스트 변경
- [x] GameNavBar.tsx: mimig-token.png 교체

### Phase 2: 가로모드 강제 제거 + 세로모드 지원 ✅
- [x] OrientationLock.tsx 삭제
- [x] RotateDevicePrompt.tsx 삭제
- [x] layout.tsx: OrientationLock 래핑 제거
- [x] page.tsx: RotateDevicePrompt 제거
- [x] globals.css: portrait 차단 CSS 제거/수정
- [x] GameNavBar.tsx: 세로모드 반응형
- [x] GameModal.tsx: 세로모드 최적화

### Phase 3A: 타입 정의 ✅
- [x] game/lib/worldTravel/types.ts

### Phase 3B: 국가 데이터 (20개국, ~65 퀘스트) ✅
- [x] game/lib/worldTravel/regions.ts
- [x] game/lib/worldTravel/countries/eastAsia.ts (한국, 일본, 중국)
- [x] game/lib/worldTravel/countries/southeastAsia.ts (태국, 베트남, 인도네시아)
- [x] game/lib/worldTravel/countries/southAsia.ts (인도, 네팔)
- [x] game/lib/worldTravel/countries/middleEast.ts (터키, UAE)
- [x] game/lib/worldTravel/countries/europe.ts (프랑스, 영국, 독일, 이탈리아)
- [x] game/lib/worldTravel/countries/africa.ts (남아프리카, 케냐)
- [x] game/lib/worldTravel/countries/americas.ts (미국, 캐나다, 브라질, 멕시코)
- [x] game/lib/worldTravel/countries/oceania.ts (호주, 뉴질랜드)
- [x] game/lib/worldTravel/countries/index.ts

### Phase 3C: useTravelStore ✅
- [x] game/hooks/useTravelStore.ts
- [x] game/lib/worldTravel/progression.ts

### Phase 3D: 세계지도 컴포넌트 ✅
- [x] game/components/WorldMap/WorldMap.tsx
- [x] game/components/WorldMap/RegionCard.tsx
- [x] game/components/WorldMap/CountryNode.tsx
- [x] game/components/WorldMap/index.ts

### Phase 3E: 국가 상세 화면 ✅
- [x] game/components/CountryScreen/CountryScreen.tsx
- [x] game/components/CountryScreen/CultureCard.tsx
- [x] game/components/CountryScreen/QuestList.tsx
- [x] game/components/CountryScreen/index.ts

### Phase 3F: 퀘스트 실행 컴포넌트 ✅
- [x] game/components/QuestScreen/QuestScreen.tsx
- [x] game/components/QuestScreen/CulturalScenarioQuest.tsx
- [x] game/components/QuestScreen/TriviaQuizQuest.tsx
- [x] game/components/QuestScreen/HistoryLessonQuest.tsx
- [x] game/components/QuestScreen/CulturalPracticeQuest.tsx
- [x] game/components/QuestScreen/QuestComplete.tsx
- [x] game/components/QuestScreen/index.ts

### Phase 3G: 메인 게임 루프 통합 ✅
- [x] page.tsx: travelView 상태 + 화면 전환 로직
- [x] GameNavBar.tsx: Impact → Travel 버튼 교체
- [x] KindnessCanvas.tsx: 여행 유도 CTA

### Phase 3H: 기존 시스템 연동 ✅
- [x] achievements.ts: travel 카테고리 + 10개 업적 추가
- [x] quests.ts: travel 일일 퀘스트 추가 (4개 난이도)
- [x] useGameStore.ts: travel 통계 + 저장/로드 + 업적 체크
- [x] supabase-db.ts + supabase.ts: TravelSaveData 타입 + travel_state 저장/로드
- [x] kindnessData.ts: 국가 데이터에서 cultural_scenario 동적 추출
- [x] QuestScreen.tsx: 퀘스트 완료 시 travel 통계 동기화

### Phase 3I: Supabase 스키마 ✅
- [x] supabase/migrations/20260126_travel_system.sql
- [x] `npx supabase db push` 마이그레이션 적용 완료

### Phase 4: 모바일 네비게이션 리디자인 ✅
> 모바일 세로화면 중심으로 헤더/하단 메뉴 재구성

- [x] GameLayout.tsx: 로고 영역 제거 (`logo` prop 삭제)
- [x] GameHUD.tsx: 간결화 (포인트 | 에너지 | 레벨 | 지갑만)
  - Profile, Settings 아이콘 제거 → More 메뉴로 이동
- [x] GameNavBar.tsx: 5탭 이모지 네비바로 전면 재작성
  - 🏠 Home | 🌍 Travel | 📋 Quest | ⬆️ Upgrade | ☰ More
  - GameIconButton 의존 제거, MUI Badge + Typography 사용
  - 활성 탭 골드 글로우 (#FFD700) 하이라이트
- [x] MoreMenu.tsx: 바텀시트 신규 생성 (MUI Drawer)
  - Main: Achievement, Ranking, Token Mining
  - Secondary: Profile (Coming Soon), Settings (Coming Soon), Story (Replay)
- [x] page.tsx: activeTab 계산, More 메뉴 통합, 모달 아이콘 이모지로 교체
- [x] page.tsx: questBadge 타입 에러 수정 (`q.claimed` → `q.current >= q.target && !q.completed`)

### Phase 5: 스토리 팝업 리디자인 ✅
> daomimi StoryModal 프레임 적용 — 정사각형 이미지 + 하단 텍스트 카드

- [x] StoryIntro.tsx: 전면 재작성 (daomimi StoryModal 구조 참고)
  - MUI fullscreen Dialog → CSS 카드형 모달 (max-width 480px)
  - 정사각형 이미지 (aspect-ratio 1:1) + 하단 텍스트 영역
  - Progress dots (이미지 상단, 골드 색상)
  - 좌/우 네비 화살표 (반투명 원형 버튼)
  - 타이핑 애니메이션 유지 (30ms/char, 골드 커서)
  - "Tap image to continue" / "Tap to skip" 힌트
  - X 닫기 버튼 (오버레이 클릭도 닫기)
  - Howl 사운드 이펙트 유지 (page-turn, typing)
- [x] storyContent.ts: 새 5장 스토리 텍스트 교체 (.claude/story.md 영문 버전)
- [x] storyContent.ts: 이미지 경로 `.png` → `.webp` 변경
- [x] 스토리 이미지 배치 완료 (game/public/images/story/intro-1~5.webp)
- [x] globals.css: `.story-modal-*` CSS 클래스 추가 (overlay, content, scene-container, progress, nav-btn, subtitle, typing-cursor 등)

### Phase 6: 타이틀 이미지 적용 ✅
- [x] 타이틀 이미지 배치: `game/public/images/almaneo-title.webp`
- [x] StartScreen.tsx: 텍스트 로고 → Next.js Image (`almaneo-title.webp`, 280x280)
- [x] LoadingScreen.tsx: 텍스트 로고 → Next.js Image (`almaneo-title.webp`, 200x200)

### Phase 7: 모바일 UI 최적화 (360x740) ✅
- [x] 퀘스트 팝업 4종: `position: fixed` 풀스크린 오버레이
- [x] GameNavBar: More 아이콘 MUI MoreHorizIcon, icon prop ReactNode
- [x] WalletButton: 웹 서버 스타일 통일
- [x] LoginScreen: 세로 단일 컬럼 레이아웃, 반응형 폰트/패딩
- [x] LoadingScreen: 전체 배경 이미지 + 오버레이
- [x] ResourceCounter: 모바일 아이콘/텍스트 축소 (20px/16px/12px)
- [x] EnergyBar: 모바일 아이콘/텍스트 축소 (18px/14px/12px)
- [x] LevelBadge: 모바일 축소 + "Lv." 약어 + Exo 2 폰트
- [x] GameHUD: 모바일 gap/px 조정

### Phase 8: 세부 메뉴/팝업 테마 통일 (Blue→Gold) ✅
> 이전 가로화면 UI 기준 Blue(`#0052FF`) 테마 → 메인 테마 Gold(`#FFD700`) 통일
- [x] KindnessCanvas.tsx: 배경 `#1a237e` → `#0A0F1A`, 그리드 `#4fc3f7` → `#FFD700`, 버튼 골드 테두리
- [x] AchievementPanel.tsx: Chip, Tab selected/indicator `#0052FF` → `#FFD700`
- [x] AchievementCard.tsx: 완료 배경/테두리/뱃지, 프로그레스바, 퍼센트 `#0052FF` → `#FFD700`
- [x] LeaderboardPanel.tsx: Chip, Tab, RefreshIcon, 스크롤바 `#0052FF` → `#FFD700`
- [x] LeaderboardCard.tsx: 현재 유저 배경/테두리/아바타/Chip `#0052FF` → `#FFD700`
- [x] QuestPanel.tsx: 헤더 테두리, 상태 텍스트, 구분선 `#0052FF` → `#FFD700`
- [x] QuestCard.tsx: 호버, 프로그레스바, 퍼센트, Claim 버튼 `#0052FF` → `#FFD700`
- [x] UpgradeCard.tsx: 호버, 아이콘 그림자, 레이블, Upgrade 버튼 `#0052FF` → `#FFD700`
- [x] QuestComplete.tsx: Continue 버튼 블루 그라디언트 → 골드, 반응형 폰트 사이즈
- [x] WorldMap.tsx: PublicIcon `#0052FF` → `#FFD700`

## 진행 기록

### Session 32 (2026-01-26)
- 게임 업그레이드 계획 수립 완료
- 사용자 결정: 15~20개국 MVP, 세계여행 중심, 지역 카드 리스트 UI
- GAME_UPDATE.md 세션 관리 파일 생성

### Session 33 (2026-01-26) - Phase 1~3G 완료
- Phase 1: LoadingScreen AlmaNEO 브랜딩 변경
- Phase 2: 가로모드 강제 제거, OrientationLock/RotateDevicePrompt 삭제
- Phase 3A: types.ts - Region, Country, Quest, Progress 타입 정의
- Phase 3B: 8개 지역 20개국 ~80 퀘스트 데이터 생성
  - 동아시아 (한국, 일본, 중국)
  - 동남아시아 (태국, 베트남, 인도네시아)
  - 남아시아 (인도, 네팔)
  - 중동 (터키, UAE)
  - 유럽 (프랑스, 영국, 독일, 이탈리아)
  - 아프리카 (남아프리카, 케냐)
  - 아메리카 (미국, 캐나다, 브라질, 멕시코)
  - 오세아니아 (호주, 뉴질랜드)
- Phase 3C: useTravelStore + progression.ts
- Phase 3D: WorldMap, RegionCard, CountryNode 컴포넌트
- Phase 3E: CountryScreen, CultureCard, QuestList 컴포넌트
- Phase 3F: QuestScreen, 4개 퀘스트 타입 컴포넌트
- Phase 3G: page.tsx 통합, GameNavBar Travel 버튼, KindnessCanvas CTA
- 빌드 성공 (TypeScript 에러 0개)

### Session 34 (2026-01-26) - Phase 3H~3I 완료
- Phase 3H-1: achievements.ts - 'travel' 카테고리 + 10개 여행 업적 추가
  - countriesVisited, travelQuestsCompleted, totalStars, perfectCountries 통계 추가
- Phase 3H-2: quests.ts - 'travel' 일일 퀘스트 타입 + 4개 난이도 템플릿
  - 일일 퀘스트 3개 → 4개로 확장
- Phase 3H-3: useGameStore.ts - travel 통계, 저장/로드, 업적 체크 통합
  - useTravelStore 연동 (save/load/stats sync)
  - updateQuestProgress('travel'), updateAchievementStats('travel') 지원
  - checkAchievements에 10개 travel 업적 케이스 추가
- Phase 3H-4: supabase.ts + supabase-db.ts - TravelSaveData 타입 + travel_state JSONB 저장/로드
  - DailyQuest.type, Achievement.category에 'travel' 추가
  - AchievementStats에 travel 필드 추가
- Phase 3H-5: kindnessData.ts - 하드코딩된 10개 시나리오 → ALL_COUNTRIES에서 cultural_scenario 동적 추출
- QuestScreen.tsx: 퀘스트 완료 시 travel 통계를 achievementStats에 동기화
- Phase 3I: supabase/migrations/20260126_travel_system.sql - game_states에 travel_state JSONB 컬럼 추가
- 빌드 성공 (TypeScript 에러 0개)

### Session 35 (2026-01-26) - Phase 4~6 설계 완료
- Supabase 마이그레이션 적용 (`npx supabase db push`)
- 모바일 네비게이션 리디자인 설계
  - 상단 헤더: 포인트 | 에너지 | 레벨 | 지갑 (간결화)
  - 하단 네비: 5버튼 (Home | Travel | Quest | Upgrade | More)
  - More 메뉴: Achievement, Ranking, Token, Profile, Settings, Story
- 스토리 팝업 리디자인 설계
  - daomimi StoryModal 프레임 참조 (카드형, 정사각형 이미지 + 하단 텍스트)
  - 참조 파일: `c:\dev\daomimi\website\src\components\StoryModal.jsx`
  - 참조 CSS: `c:\dev\daomimi\website\src\styles\sections.css` (line 948~1181)
- 새 스토리 5장 작성 완료 → `.claude/story.md` 저장
- 타이틀 이미지 경로 결정: `game/public/images/almaneo-title.png`

### Session 36 (2026-01-26) - Phase 4~6 구현 완료
- **Phase 4: 모바일 네비게이션 리디자인** ✅
  - GameHUD.tsx: Profile/Settings 버튼 제거, 간결화
  - GameNavBar.tsx: 5탭 이모지 네비바 전면 재작성 (GameIconButton 의존 제거)
  - MoreMenu.tsx: MUI Drawer 바텀시트 신규 생성
  - GameLayout.tsx: `logo` prop 제거
  - page.tsx: activeTab 계산, More 메뉴 통합, 모달 아이콘 이모지 교체
  - page.tsx: `q.claimed` 타입 에러 수정 → `q.current >= q.target && !q.completed`
- **Phase 5: 스토리 팝업 리디자인** ✅
  - storyContent.ts: 새 5장 영문 스토리 텍스트 교체
  - StoryIntro.tsx: MUI Dialog fullscreen → CSS 카드형 모달 전면 재작성
    - 480px 카드, 1:1 이미지, progress dots, nav arrows, typing animation
  - globals.css: `.story-modal-*` CSS 클래스 추가
  - 이미지 경로 `.png` → `.webp`로 변경 (전체 webp 통일)
- **Phase 6: 타이틀 이미지 적용** ✅
  - StartScreen.tsx: 텍스트 로고 → `almaneo-title.webp` Image
  - LoadingScreen.tsx: 텍스트 로고 → `almaneo-title.webp` Image
- 빌드 성공 (TypeScript 에러 0개)
- **다음 세션**: dev 서버에서 UI 확인 작업 진행

### Session 37 (2026-01-27) - Phase 7: 모바일 UI 최적화 (360x740)
> Samsung 360x740 뷰포트 기준 모바일 최적화 작업

- **Phase 7A: 퀘스트 팝업 고정 오버레이** ✅ (이전 세션)
  - CulturalScenarioQuest.tsx: `position: fixed` 풀스크린 오버레이
  - TriviaQuizQuest.tsx: 동일 패턴 적용
  - HistoryLessonQuest.tsx: 동일 패턴 적용
  - CulturalPracticeQuest.tsx: 동일 패턴 적용

- **Phase 7B: 네비게이션 아이콘 & 지갑 스타일** ✅ (이전 세션)
  - GameNavBar.tsx: More 아이콘 `☰` → MUI `MoreHorizIcon` 변경
  - GameNavBar.tsx: icon prop 타입 `string` → `ReactNode`
  - WalletButton.tsx: 웹 서버 지갑 스타일로 통일 (#0052FF, #1a1f2e, #2d3748)
  - EnergyBar.tsx: PNG → ⚡ 이모지
  - LevelBadge.tsx: PNG → 🏆 이모지

- **Phase 7C: LoginScreen 모바일 세로 최적화** ✅
  - 레이아웃: 가로 분할 → 세로 단일 컬럼 (`flexDirection: 'column'`)
  - justifyContent: `'center'` → `'flex-start'`
  - 패딩/간격 반응형: `{ xs: 1.5, sm: 4 }` 등
  - 슬로건 폰트: `{ xs: '1.4rem', sm: '2rem', md: '3rem' }`
  - 설명 폰트: `{ xs: '0.8rem', sm: '1rem' }`
  - 로그인 카드: maxWidth 400→360, 패딩 축소
  - Feature 아이콘/텍스트 폰트 반응형
  - Footer: `position: absolute` → `mt: 'auto'` 플로우 레이아웃

- **Phase 7D: LoadingScreen 전체 배경 이미지** ✅
  - `<Image width={200} height={200}>` → `<Image fill objectFit="cover">`
  - 배경 리니어 그라디언트 제거, 전체 이미지 배경으로 전환
  - 다크 오버레이 추가 (`radial-gradient`, rgba)
  - 콘텐츠 `zIndex: 2`, 텍스트 `textShadow` 추가

- **Phase 7E: 헤더 HUD 사이즈 축소** ✅
  - ResourceCounter.tsx: 아이콘 28→20px, 이모지 24→16px, 텍스트 16→12px
  - EnergyBar.tsx: 아이콘 24→18px, 이모지 20→14px, 텍스트 16→12px
  - LevelBadge.tsx: 아이콘 24→18px, 이모지 20→14px, 텍스트 16→12px
    - "Level X" → "Lv.X" (모바일 약어)
    - fontFamily: Orbitron → Exo 2 (모바일, 폭 절약)
  - GameHUD.tsx: gap 0.3→0.5, px 1→0.5 (모바일)

- 빌드 성공 (329 kB, TypeScript 에러 0개)
- **다음 세션**: dev 서버 실제 디바이스 테스트, Vercel 배포 설정

### Session 38 (2026-01-27) - Phase 8: 세부 메뉴/팝업 테마 통일
> 이전 가로화면 UI 기준 Blue(`#0052FF`) 테마를 메인 테마 Gold(`#FFD700`)로 통일

- **KindnessCanvas.tsx** ✅
  - 배경: `radial-gradient(#1a237e → #000)` → `linear-gradient(#0A0F1A → #111827)`
  - 그리드 도트: `#4fc3f7` → `#FFD700`
  - Paper 테두리: white → gold
  - 버튼: white 배경/테두리 → gold 배경/테두리
- **AchievementPanel.tsx + AchievementCard.tsx** ✅
  - Chip: blue → gold
  - Tab selected/indicator: `#0052FF` → `#FFD700`
  - 완료 배경/테두리/EARNED 뱃지: blue → gold (뱃지 텍스트 `#0A0F1A`)
  - 프로그레스바: `#0052FF→#00C2FF` → `#FFD700→#FF6B00`
  - 퍼센트 텍스트: blue → gold
- **LeaderboardPanel.tsx + LeaderboardCard.tsx** ✅
  - Chip, Tab, RefreshIcon, CircularProgress, 스크롤바: blue → gold
  - 현재 유저 카드: 배경/테두리/아바타/YOU Chip 모두 blue → gold
- **QuestPanel.tsx + QuestCard.tsx** ✅
  - 헤더 테두리, RECONSTRUCTION 텍스트, 구분선: blue → gold
  - 호버 효과, 프로그레스바, 퍼센트, Claim 버튼: blue → gold
- **UpgradeCard.tsx** ✅
  - 호버 테두리/그림자, 아이콘 드롭섀도, UPGRADE PHASE 라벨: blue → gold
  - Upgrade 버튼: `#0052FF` → `#FFD700` (텍스트 `#0A0F1A`)
- **QuestComplete.tsx** ✅
  - Continue 버튼: `linear-gradient(#0052FF, #06b6d4)` → `#FFD700`
  - 이모지/타이틀/포인트 폰트 사이즈 반응형 (`{ xs, sm }`)
  - 패딩/최소높이 반응형
- **WorldMap.tsx** ✅
  - PublicIcon: `#0052FF` → `#FFD700`
- 빌드 성공 (329 kB, TypeScript 에러 0개)

### Phase 8 보완: Token Mining 아이콘 수정 ✅
- [x] MoreMenu.tsx: Token Mining 아이콘 `🪙` → `⛏️` 변경

### Phase 10: Quest Data DB Migration + Localization + Appeal System ✅
> 하드코딩된 퀘스트/문화 콘텐츠를 Supabase DB로 마이그레이션, 다국어 지원 기반 구축, 콘텐츠 어필 시스템 추가

- [x] Supabase 마이그레이션 SQL (`supabase/migrations/20260127_quest_content_system.sql`)
  - `regions` 테이블 (8개 지역)
  - `countries` 테이블 (19개국)
  - `quests` 테이블 (~58개 퀘스트, quest_data JSONB)
  - `content_translations` 테이블 (다국어 번역, JSONB)
  - `content_appeals` 테이블 (어필 시스템)
  - RLS 정책, 인덱스, 승인 시 자동 보상 트리거 함수
- [x] 영어 시드 스크립트 (`game/scripts/seed-quest-data.ts`)
  - 8개 지역 + 19개국 + 58개 퀘스트 → DB 삽입
  - 영어 번역 → content_translations (language='en')
- [x] 한국어 시드 스크립트 (`game/scripts/seed-korean-translations.ts`)
  - 지역(8) + 국가(19) + 퀘스트(58) 한국어 번역 완료
  - 3개 파트 파일로 분리: `data/ko-quests-part{1,2,3}.ts`
  - DB 시딩 완료 (Session 40)
- [x] Content Service 리팩토링 (`game/lib/contentService.ts`)
  - API Route → Direct Supabase 쿼리 (output: export 호환)
  - 5개 병렬 쿼리 (regions, countries, quests, translations_en, translations_lang)
  - 번역 병합 (요청 언어 → 영어 fallback)
  - 메모리 + localStorage 캐시 (1시간 TTL, stale-while-revalidate)
- [x] Appeal Service (`game/lib/appealService.ts`)
  - `submitAppeal()`: 검증 + 중복 체크 + 삽입
  - `getUserAppeals()`: 사용자 어필 내역 조회
  - Direct Supabase 호출 (API Route 없이)
- [x] useTravelStore 리팩토링 (`game/hooks/useTravelStore.ts`)
  - 정적 import → contentService 동적 로드
  - `initialize(lang)` 비동기 초기화
  - 데이터 로딩 상태 관리
- [x] kindnessData.ts 리팩토링
  - 정적 ALL_COUNTRIES → contentService.getCountries() 동적 로드
- [x] Appeal UI 컴포넌트
  - `AppealButton.tsx`: "Report Error" 버튼 + 제출 모달
  - `AppealHistory.tsx`: 어필 내역 (상태별 필터, 보상 표시)
- [x] MoreMenu에 "내 어필 내역" 메뉴 추가
- [x] QuestComplete에 "Report Error" 버튼 추가
- [x] API Routes 전체 삭제 (`game/app/api/` 디렉토리)
  - `output: 'export'` (정적 빌드)와 호환되지 않아 제거
  - 모든 서버 로직을 클라이언트 Direct Supabase 호출로 변환
- [x] 빌드 성공 확인

### Phase 11: Game i18n (한국어/영어 분리) ✅
> react-i18next로 게임 UI 텍스트를 한국어/영어 분리, MoreMenu에서 언어 전환 가능

- [x] Wave 1: 인프라 설치 (react-i18next, i18next, i18next-browser-languagedetector)
  - `game/lib/i18n.ts` - i18n 설정 (bundled resources, LanguageDetector)
  - `game/components/I18nProvider.tsx` - 클라이언트 Provider 래퍼
  - `game/locales/ko.json` - 한국어 번역 (~200키)
  - `game/locales/en.json` - 영어 번역 (~200키)
  - `game/app/layout.tsx` - I18nProvider 래핑
- [x] Wave 2: 데이터 파일 키 기반 변환
  - `constants.ts` - TIERS name → nameKey
  - `tokenMining.ts` - HALVING_EPOCHS label → labelKey
  - `quests.ts` - QUEST_TEMPLATES title/description → 키
  - `achievements.ts` - ACHIEVEMENTS title/description → 키
  - `storyContent.ts` - story text, milestone title/message → 키
  - `TokenClaimModal.tsx` - tier/halving labelKey 참조 수정
- [x] Wave 3: 핵심 UI 컴포넌트 t() 적용
  - GameNavBar, GameHUD, KindnessCanvas, LoadingScreen, LoginScreen, StartScreen
- [x] Wave 4: 메뉴/모달 t() 적용
  - MoreMenu, page.tsx, TokenClaimModal, OfflineEarningsModal
- [x] Wave 5: 패널/리스트 t() 적용
  - UpgradePanel, UpgradeCard, QuestPanel, QuestCard, AchievementPanel, AchievementCard, LeaderboardPanel
- [x] Wave 6: Travel/Quest UI t() 적용
  - WorldMap, RegionCard, CountryNode, CountryScreen, QuestList, QuestScreen, QuestComplete
  - CulturalScenarioQuest, TriviaQuizQuest, CulturalPracticeQuest, HistoryLessonQuest
- [x] Wave 7: 기타 컴포넌트 + 언어 전환 UI
  - AppealButton, AppealHistory, StoryIntro
  - MoreMenu에 🌐 Language 토글 추가 (한국어 ↔ English)
- [x] 빌드 성공 확인 (TypeScript 에러 0개)

### Phase 9: 모바일 하단 네비바 가시성 수정 ✅
> 모바일(iPhone 430x932)에서 하단 네비바가 보이지 않는 문제 수정
> 원인: `100vh`가 모바일 브라우저 URL바 영역을 포함하여 네비바가 화면 밖으로 밀림

- [x] GameLayout.tsx: absolute 포지셔닝 → flex 레이아웃으로 전환
  - Canvas: `position: absolute, inset: 0, zIndex: 0` (전체 배경)
  - HUD: `position: relative, zIndex: 100, flexShrink: 0` (flex item)
  - Navbar: `position: relative, zIndex: 100, flexShrink: 0` (flex item, 항상 표시)
  - 높이: `100dvh` + `@supports not` fallback `100vh`
- [x] globals.css: 뷰포트 높이 단위 마이그레이션
  - `-webkit-fill-available` → `100dvh` (html, body, #__next, .game-layout)
  - body safe-area padding: 상하 제거 (좌우만 유지)
  - navbar가 내부적으로 `env(safe-area-inset-bottom)` 처리
- [x] layout.tsx: 인라인 스타일에 `height: 100dvh` 추가 (100vh 뒤에 fallback)
- 빌드 성공 (329 kB, TypeScript 에러 0개)

### Session 39 (2026-01-27) - Phase 8 커밋 + Phase 9: 모바일 네비바 수정
- **Phase 8 커밋 & 푸시** ✅
  - 23개 파일 (Phase 8 Blue→Gold 테마 통일 + Token Mining 아이콘 수정)
  - 커밋: `9f36567` - feat(game): World Culture Travel upgrade with UI fixes
  - 원격 저장소 푸시 완료
- **Phase 9: 모바일 하단 네비바 가시성 수정** ✅
  - 문제: iPhone(430x932)에서 하단 네비바가 화면 밖으로 밀려 보이지 않음
  - 원인 1: `100vh`가 모바일 브라우저 URL바 영역을 포함
  - 원인 2: body의 `padding-bottom: env(safe-area-inset-bottom)`이 추가 밀림 유발
  - 수정 1: GameLayout.tsx - 전체 absolute → flex 레이아웃 전환 (Canvas만 absolute 유지)
  - 수정 2: globals.css - `100dvh` 마이그레이션 + body safe-area 상하 패딩 제거
  - 수정 3: layout.tsx - 인라인 스타일에 `height: 100dvh` fallback 추가
  - 커밋: `9b8de21` - fix(game): Make bottom navbar always visible on mobile
  - 원격 저장소 푸시 완료
- 빌드 성공 (329 kB, TypeScript 에러 0개)

### Session 40 (2026-01-27) - 한국어 퀘스트 번역 + DB 시딩
- **한국어 퀘스트 번역 58개 생성** ✅
  - `game/scripts/data/ko-quests-part1.ts`: 22개 (동아시아 KR/JP/CN, 동남아 TH/VN/ID, 남아시아 IN)
  - `game/scripts/data/ko-quests-part2.ts`: 15개 (중동 TR/AE, 유럽 FR/GB/DE)
  - `game/scripts/data/ko-quests-part3.ts`: 21개 (아프리카 ZA/KE, 아메리카 US/CA/BR/MX, 오세아니아 AU)
- **시드 스크립트 업데이트** ✅
  - `seed-korean-translations.ts`: 3개 파트 파일 import + spread 연결
  - TODO/예시 코드 제거
- **DB 시딩 완료** ✅
  - 영어: 8 지역 + 19 국가 + 58 퀘스트 + 85 번역 = 전체 데이터 삽입
  - 한국어: 8 지역 + 19 국가 + 58 퀘스트 = 85 번역 삽입
  - 총 170개 content_translations 레코드
- **게임 배포 확인** ✅
  - `https://game.almaneo.org` HTTP 200 정상 응답
  - Vercel 환경변수 설정 완료 (사용자 확인)
- 커밋: `a3621e5` - feat(game): Add Korean quest translations for 58 quests across 19 countries
- 빌드 성공 (TypeScript 에러 0개)
- **다음 세션**: 실제 디바이스 테스트, UI 버그 수정

### Session 41 (2026-01-27) - Phase 11: Game i18n (한국어/영어 분리)
> react-i18next를 사용하여 게임 UI 텍스트를 한국어/영어로 분리, 언어 전환 기능 구현

- **Wave 1: 인프라 설치** ✅
  - `npm install react-i18next i18next i18next-browser-languagedetector --legacy-peer-deps`
  - `game/lib/i18n.ts`: bundled resources, LanguageDetector, localStorage 키 `almaneo-game-language`
  - `game/components/I18nProvider.tsx`: 클라이언트 Provider 래퍼
  - `game/locales/ko.json` + `game/locales/en.json`: ~200키 번역 파일 생성
  - `game/app/layout.tsx`: I18nProvider 래핑

- **Wave 2: 데이터 파일 키 기반 변환** ✅
  - `constants.ts`: TIERS `name` → `nameKey` (4개 티어)
  - `tokenMining.ts`: HALVING_EPOCHS `label` → `labelKey` (4개 반감기)
  - `quests.ts`: QUEST_TEMPLATES `title`/`description` → `titleKey`/`descriptionKey`
  - `achievements.ts`: ACHIEVEMENTS `title`/`description` → `titleKey`/`descriptionKey`
  - `storyContent.ts`: story `text` → `textKey`, milestone `title`/`message` → `titleKey`/`messageKey`
  - `TokenClaimModal.tsx`: labelKey 참조로 수정

- **Wave 3: 핵심 UI 컴포넌트** ✅ (GameNavBar, GameHUD, KindnessCanvas, LoadingScreen, LoginScreen, StartScreen)
- **Wave 4: 메뉴/모달** ✅ (MoreMenu, page.tsx, TokenClaimModal, OfflineEarningsModal)
- **Wave 5: 패널/리스트** ✅ (UpgradePanel/Card, QuestPanel/Card, AchievementPanel/Card, LeaderboardPanel)
- **Wave 6: Travel/Quest UI** ✅ (WorldMap, RegionCard, CountryNode, CountryScreen, QuestList, QuestScreen, QuestComplete, 4개 퀘스트 타입)
- **Wave 7: 기타 + 언어 전환** ✅
  - AppealButton (14개 문자열), AppealHistory (12개 문자열), StoryIntro (2개 문자열)
  - MoreMenu에 🌐 Language 토글 추가 (한국어 ↔ English, 블루 뱃지 UI)

- **번역 키 구조** (JSON 네임스페이스: `game`)
  ```
  common, tiers, mining, nav, moreMenu, hud, login, loading,
  startScreen, story, milestones, dailyQuests, achievements,
  upgrades, leaderboard, offline, travel, appeal, modals, canvas
  ```

- 빌드 성공 (347 kB, TypeScript 에러 0개, 경고는 기존 Web3Auth 관련만)
- **~25개 컴포넌트 파일** 수정, **~200개 번역 키** (ko/en)
- **다음 세션**: 커밋 & 푸시, 실제 디바이스에서 언어 전환 테스트

### Session 42 (2026-01-27) - 퀘스트 결과 팝업 오른쪽 밀림 버그 수정 시도 (미해결)
> 모바일에서 퀘스트 결과 팝업이 오른쪽으로 밀려 잘리는 문제 수정 시도
> 여러 세션에 걸쳐 6가지 접근법 시도했으나 아직 미해결

- **핵심 아키텍처 변경: createPortal 완전 제거** ✅ (빌드 성공, 동작 미확인)
  - 이전 방식: 각 퀘스트 컴포넌트가 `createPortal`로 직접 결과 오버레이를 렌더링
  - 새 방식: QuestScreen이 중앙에서 결과 오버레이를 관리 (`position: absolute; inset: 0`)
  - 각 퀘스트 컴포넌트는 `onShowResult(data)` 콜백으로 결과 데이터만 전달

- **수정된 파일 5개:**
  - `QuestScreen.tsx` (대규모 리팩토링):
    - `QuestResultData` 인터페이스 export (correct, emoji, title, explanation, answerText?, funFact?)
    - `resultData` 상태 + `handleShowResult` 콜백 + `handleResultContinue` 핸들러
    - 루트 Box에 `position: 'relative'` 추가 (absolute 기준점)
    - 결과 오버레이: `position: absolute; top/left/right/bottom: 0; zIndex: 50`
    - motion.div 애니메이션 (opacity: 0→1, scale: 0.85→1)
    - Result Card + Continue 버튼 + Fun Fact (history_lesson용)
  - `CulturalScenarioQuest.tsx`: createPortal/showResult 제거, onShowResult 콜백 사용
  - `TriviaQuizQuest.tsx`: createPortal 제거, showResult→revealed (정답 하이라이트용), onShowResult 사용
  - `CulturalPracticeQuest.tsx`: createPortal 제거, onShowResult 사용
  - `HistoryLessonQuest.tsx`: createPortal 제거, phase에서 'result' 제거, onShowResult 사용

- **이전 세션 수정 사항 (유지됨):**
  - `layout.tsx`: body `position: fixed` 제거, `width: 100%` 사용
  - `globals.css`: `100vw` → `100%` 변경, safe-area 좌우 패딩만 유지
  - `GameLayout.tsx`: `width: 100%` 사용

- **시도한 접근법 히스토리 (전체 6가지):**
  1. `position: fixed; inset: 0` (퀘스트 컴포넌트 내) → ❌ 상위 transform이 fixed 기준점 변경
  2. `createPortal` + MUI Box + `100vw/100vh` → ❌
  3. `createPortal` + raw div + inline styles → ❌
  4. `100vw` → `100%` 전체 변경 → ❌
  5. body에서 `position: fixed` 제거 → ❌ 미테스트
  6. **createPortal 완전 제거** + QuestScreen에서 `position: absolute; inset: 0` → ⚠️ 빌드 성공, 로컬 미확인

- **빌드 성공** (TypeScript 에러 0개)
- **상태**: ❌ 로컬에서 아직 미해결 (사용자 확인)

- **다음 세션 디버깅 방향:**
  1. Chrome DevTools Elements 탭으로 실제 computed styles 검사 필요
  2. `globals.css`의 safe-area padding (`padding-left/right: env(safe-area-inset-*)`)이 영향 줄 가능성
  3. `page.tsx`의 travel overlay Box (MUI, `position: fixed; inset: 0; zIndex: 1200`)가 자식에 영향 줄 가능성
  4. framer-motion의 `motion.div`가 transform을 적용하여 position 기준점이 변경될 가능성
  5. QuestScreen 자체의 높이/너비가 부모 컨테이너에 의해 제한될 가능성
  6. 모바일 스크롤바 또는 브라우저 UI에 의한 레이아웃 차이 가능성

### Session 43 (2026-01-27) - 퀘스트 결과 팝업 수정 최종 + Gold 테마 완성
> Session 42의 createPortal 제거 리팩토링 검증 및 추가 수정

- **QuestScreen.tsx 포지셔닝 강화** ✅
  - 루트 Box에 `width: '100%'` 명시 추가 (부모 컨테이너 폭 명확화)
  - 루트 Box에 `overflow: 'hidden'` 추가 (스크롤 방지)
  - 결과 Continue 버튼: `linear-gradient(#0052FF, #06b6d4)` → `#FFD700` (Gold)
  - 버튼 텍스트: `#fff` → `#0A0F1A` (dark)

- **퀘스트 컴포넌트 Gold 테마 적용** ✅ (Phase 8 보완)
  - `CulturalPracticeQuest.tsx`:
    - Step box: `rgba(0,82,255,*)` → `rgba(255,215,0,*)`
    - Progress bar (in-progress): `#0052FF, #06b6d4` → `#FFD700, #FFA500`
    - Tap area: blue gradient → gold gradient
  - `HistoryLessonQuest.tsx`:
    - "Quiz Me" 버튼: blue gradient → `#FFD700`, 텍스트 `#0A0F1A`
    - 선택 답변 하이라이트: `rgba(0,82,255,*)` → `rgba(255,215,0,*)`
  - `TriviaQuizQuest.tsx`:
    - 선택 답변 하이라이트 (reveal 전): `rgba(0,82,255,*)` → `rgba(255,215,0,*)`

- **뷰포트/레이아웃 수정 (Session 42 계속)** ✅
  - `globals.css`: `100vw` → `100%`, body height `100dvh` → `100%` (layout.tsx에서 관리)
  - `layout.tsx`: body에서 `position: fixed` 제거, `100vw` → `100%`, `100dvh` 유지
  - `GameLayout.tsx`: `100vw` → `100%`, `100dvh` → `100%`, `@supports not` fallback 제거

- **빌드 성공** (345 kB, TypeScript 에러 0개)
- **커밋**: `7da34f5` - fix(game): Fix quest result popup centering with createPortal
- **원격 저장소 푸시 완료**
- **다음 세션**: 실제 디바이스에서 퀘스트 결과 팝업 포지셔닝 검증

### Session 44 (2026-01-27) - 퀘스트 언어 바인딩 + 팝업 page.tsx 리프팅
> Session 43에서 팝업 수정 실패 확인 + 퀘스트 언어 설정 미반영 버그 발견

- **퀘스트 언어 바인딩 수정** ✅
  - 문제: `page.tsx`에서 `navigator.language` (브라우저 로캘) 사용 → i18n 설정 무시
  - 원인: `useEffect`에서 `navigator.language`로 `travelStore.initializeContent(lang)` 호출
  - 수정: `i18n.language?.split('-')[0]`으로 변경, `i18n.language` 의존성 추가
  - 효과: MoreMenu 언어 토글 시 퀘스트 콘텐츠도 즉시 변경됨

- **퀘스트 결과 팝업 page.tsx 리프팅** ✅ (8번째 시도)
  - 문제: QuestScreen 내부 overlay가 모바일에서 오른쪽으로 밀림 (7번 수정 실패)
  - 원인 분석: CSS containment (position: fixed → relative → absolute) 체인에서
    조상 요소의 transform/filter 등이 containing block을 변경하는 문제
  - 해결: 결과 오버레이를 QuestScreen에서 page.tsx로 완전히 분리
    - QuestScreen → `forwardRef` + `useImperativeHandle`로 전환
    - `QuestScreenHandle` 인터페이스: `handleResultContinue()` 노출
    - `onResultChange` prop으로 부모에게 resultData 전달
    - page.tsx에서 `position: fixed; inset: 0; zIndex: 1300`으로 렌더링
    - 여행 오버레이(zIndex: 1200)의 형제 요소로 배치 → CSS 간섭 없음
  - 변경 파일:
    - `QuestScreen.tsx`: forwardRef 전환, overlay 제거, motion 임포트 제거
    - `QuestScreen/index.ts`: QuestResultData, QuestScreenHandle 타입 re-export
    - `page.tsx`: motion 임포트, 결과 상태/ref 추가, 오버레이 렌더링

- **빌드 성공** (346 kB, TypeScript 에러 0개)
- **커밋**: `4dfefff` - fix(game): Fix quest language binding and lift result popup to page level
- **원격 저장소 푸시 완료**

### Session 45 (2026-01-27) - MUI Dialog 팝업 + 퀘스트/업그레이드 간격 축소
> 퀘스트 결과 팝업 중앙 정렬 9번째 시도 (MUI Dialog) + 모바일 패널 간격 최적화

- **퀘스트 결과 팝업: MUI Dialog로 전환** ✅ (9번째 시도)
  - 문제: CSS 기반 `position: fixed` 접근이 8회 연속 실패
  - 원인 분석: framer-motion의 `transform`, MUI Box의 CSS containment 등 조상 요소가 `position: fixed`의 containing block을 변경
  - 해결: **MUI Dialog** 사용 (자체 Portal을 `document.body`에 생성하여 모든 CSS containment 우회)
  - `framer-motion` import 제거, `Dialog` + `Fade` transition 사용
  - `PaperProps: { background: 'transparent', boxShadow: 'none' }` 투명 카드
  - `zIndex: 1400` (travel overlay 1200보다 위)
  - 변경 파일: `page.tsx`

- **퀘스트 패널 모바일 간격 축소** ✅
  - `QuestPanel.tsx`: 헤더 패딩 `1.5→1`, mb `1→0.75`, 카드 gap `1→0.75`
  - `QuestCard.tsx`: 카드 패딩 `1.5→1`, 내부 mb 전체 `0.75→0.5`

- **업그레이드 패널 모바일 간격 축소** ✅
  - `UpgradePanel.tsx`: 그리드 gap `1.25→0.75`, 미사용 Typography import 제거
  - `UpgradeCard.tsx`: 카드 패딩 `1.5→1`, 아이콘 크기 `28→24px`, 내부 mb `1→0.75`, 이펙트 박스 패딩 `0.75→0.5`

- **GameModal 모바일 간격 축소** ✅
  - 헤더 패딩 `1.5→1`, 콘텐츠 패딩 `1.5→1`

- **빌드 성공** (346 kB, TypeScript 에러 0개)

#### 팝업 수정 이력 (총 9회 시도)
| # | 접근 | 결과 |
|---|------|------|
| 1 | `position: fixed; inset: 0` (퀘스트 컴포넌트 내부) | ❌ 조상 transform이 fixed 컨텍스트 변경 |
| 2 | `createPortal` + MUI Box + `100vw/100vh` | ❌ |
| 3 | `createPortal` + raw div + inline styles | ❌ |
| 4 | `100vw` → `100%` 전역 변경 | ❌ |
| 5 | body에서 `position: fixed` 제거 | ❌ |
| 6 | createPortal 제거 + QuestScreen `position: absolute` | ❌ |
| 7 | QuestScreen에 `width: 100%` + `overflow: hidden` 추가 | ❌ |
| 8 | page.tsx로 overlay 리프팅 (forwardRef + zIndex: 1300) | ❌ 여전히 밀림 |
| 9 | **MUI Dialog** (자체 Portal → document.body, CSS containment 완전 우회) | ⏳ 검증 대기 |

### Session 46 (2026-01-27) - fullScreen Dialog 팝업 + 패널 테마 통일
> 퀘스트 결과 팝업 중앙 정렬 10번째 시도 (fullScreen Dialog) + 패널 Leaderboard 테마 통일

- **퀘스트 결과 팝업: fullScreen Dialog로 전환** ✅ (10번째 시도)
  - 문제: Session 45의 MUI Dialog(9번째)도 여전히 오른쪽 밀림 + 잘림 발생
  - 해결: `fullScreen` Dialog로 Paper가 뷰포트 전체(100vw×100vh)를 덮도록 변경
  - Paper에 `display: flex; align-items: center; justify-content: center` 적용
  - `hideBackdrop` 사용, Paper 자체를 반투명 오버레이로 사용 (`rgba(0,0,0,0.75)`)
  - 콘텐츠 Box에 `maxWidth: 320, width: '90%'`로 크기 제한
  - 변경 파일: `page.tsx`

- **퀘스트/업그레이드 패널 Leaderboard 테마 통일** ✅
  - LeaderboardCard/Panel을 참조하여 일관된 테마 적용
  - **QuestCard.tsx**:
    - 배경: `rgba(255,255,255,0.03)` → `0.02`
    - 테두리: `rgba(255,255,255,0.1)` → `0.05`
    - 호버: `translateY(-4px)` → `-2px`, boxShadow/bgcolor 통일
    - 패딩: `isMobile ? 1 : 2.5` → `isMobile ? 1.25 : 2`
    - 아이콘: `isMobile ? 24 : 36` → `isMobile ? 20 : 36`
    - 설명 폰트: `isMobile ? 11` → `10`, 프로그레스바 높이: `5` → `4`
    - 내부 마진 desktop 값 축소 (2→1.5)
  - **UpgradeCard.tsx**:
    - 배경/테두리/호버: QuestCard와 동일하게 통일
    - 패딩: `isMobile ? 1 : 2.5` → `isMobile ? 1.25 : 2`
    - 아이콘: `isMobile ? 24 : 48` → `isMobile ? 20 : 40`
    - 내부 마진 desktop 값 축소 (2→1.5)
    - 비용 라벨: `fontWeight: 'bold', letterSpacing: 0.5` 추가
  - **QuestPanel.tsx**:
    - 헤더 배경: `0.03` → `0.02`, 패딩: `isMobile ? 1 : 2.5` → `isMobile ? 1 : 2`
    - 헤더 mb: `isMobile ? 0.75` → `1`, 카드 gap: `isMobile ? 0.75` → `1`
    - All completed: mt/p 값 통일
  - **UpgradePanel.tsx**:
    - 그리드 gap: `isMobile ? 0.75` → `1`

- **빌드 성공** (346 kB, TypeScript 에러 0개)
- **커밋**: `5cb8d9e` - fix(game): Use fullScreen Dialog for popup centering and align panel themes

#### 팝업 수정 이력 (총 10회 시도)
| # | 접근 | 결과 |
|---|------|------|
| 1 | `position: fixed; inset: 0` (퀘스트 컴포넌트 내부) | ❌ 조상 transform이 fixed 컨텍스트 변경 |
| 2 | `createPortal` + MUI Box + `100vw/100vh` | ❌ |
| 3 | `createPortal` + raw div + inline styles | ❌ |
| 4 | `100vw` → `100%` 전역 변경 | ❌ |
| 5 | body에서 `position: fixed` 제거 | ❌ |
| 6 | createPortal 제거 + QuestScreen `position: absolute` | ❌ |
| 7 | QuestScreen에 `width: 100%` + `overflow: hidden` 추가 | ❌ |
| 8 | page.tsx로 overlay 리프팅 (forwardRef + zIndex: 1300) | ❌ 여전히 밀림 |
| 9 | MUI Dialog (자체 Portal → document.body, zIndex: 1400) | ❌ 여전히 밀림 |
| 10 | **fullScreen Dialog** (Paper=뷰포트, flexbox 중앙 정렬) | ⏳ 검증 대기 |

---

### Session 47 (2026-01-27) - 팝업 근본 원인 분석 + absolute 포지셔닝 전환
> 10회 실패 근본 원인 분석 후, travel overlay 내부 absolute 포지셔닝으로 전환

- **근본 원인 분석** ✅
  - 10회 모두 `position: fixed` 또는 MUI Dialog Portal(document.body로 렌더링) 사용
  - `globals.css`: body에 `padding-left/right: env(safe-area-inset)` 적용
  - `globals.css`: html과 body 모두 `overflow-x: hidden` 적용
  - `layout.tsx` inline style: body에 `overflow: hidden` 적용
  - 이 조합이 `position: fixed` 요소의 containing block에 영향을 줌
  - `100vw`는 스크롤바/safe-area 포함 가능 → 뷰포트 실제 너비와 불일치

- **해결: MUI Dialog 제거, travel overlay 내부 absolute 포지셔닝** ✅ (11번째 시도)
  - MUI `Dialog`, `Fade` import 완전 제거
  - 팝업을 travel overlay(`position: fixed; inset: 0`) **내부**에 렌더링
  - raw `<div>` + inline `style` 사용 (MUI sx/CSS-in-JS 우회)
  - `position: absolute; top: 0; left: 0; right: 0; bottom: 0` (not inset)
  - `display: flex; align-items: center; justify-content: center`
  - `margin: 0; padding: 0; boxSizing: border-box` 명시
  - 핵심: containing block이 travel overlay(=뷰포트)이므로 body CSS 영향 없음
  - Portal/body/100vw 문제를 완전히 회피

- **변경 파일**: `page.tsx` (109 insertions, 111 deletions)
- **빌드 성공** (346 kB, TypeScript 에러 0개)
- **커밋**: `a18c9c8` - fix(game): Render quest result popup inside travel overlay with absolute positioning

#### 팝업 수정 이력 (총 11회 시도)
| # | 접근 | 결과 |
|---|------|------|
| 1 | `position: fixed; inset: 0` (퀘스트 컴포넌트 내부) | ❌ 조상 transform이 fixed 컨텍스트 변경 |
| 2 | `createPortal` + MUI Box + `100vw/100vh` | ❌ |
| 3 | `createPortal` + raw div + inline styles | ❌ |
| 4 | `100vw` → `100%` 전역 변경 | ❌ |
| 5 | body에서 `position: fixed` 제거 | ❌ |
| 6 | createPortal 제거 + QuestScreen `position: absolute` | ❌ |
| 7 | QuestScreen에 `width: 100%` + `overflow: hidden` 추가 | ❌ |
| 8 | page.tsx로 overlay 리프팅 (forwardRef + zIndex: 1300) | ❌ 여전히 밀림 |
| 9 | MUI Dialog (자체 Portal → document.body, zIndex: 1400) | ❌ 여전히 밀림 |
| 10 | fullScreen Dialog (Paper=뷰포트, flexbox 중앙) | ❌ 여전히 밀림 |
| 11 | **travel overlay 내부 absolute `<div>`** (raw inline styles) | ⏳ 검증 대기 |

#### 이번 접근이 근본적으로 다른 이유
- **기존**: `position: fixed` 또는 Portal → body 레벨 렌더링 → body CSS 영향 받음
- **새로운**: `position: absolute` → travel overlay(이미 fixed; inset: 0) 내부 → body CSS 무관
- MUI Dialog/Modal 완전 제거 → Portal 없음
- raw `<div>` + inline style → CSS-in-JS 간섭 없음
- `100vw`/`100vh` 사용하지 않음 → viewport unit 불일치 문제 없음

---

### Session 48 (2026-01-28) - 홈 화면 시나리오 카드 오른쪽 잘림 수정 ✅
> **핵심 발견**: 11회에 걸친 팝업 수정은 **여행/퀘스트 결과 팝업**을 대상으로 했으나,
> 실제 사용자가 보고한 문제는 **홈 화면(KindnessCanvas)의 시나리오 카드**가 오른쪽으로 잘리는 것이었음.
> 완전히 다른 컴포넌트의 문제였음.

- **근본 원인 분석** ✅
  - `KindnessCanvas.tsx`의 시나리오 카드가 `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)` 중앙 정렬 사용
  - `globals.css`의 body에 `padding-left/right: env(safe-area-inset-*)` 적용
  - body 패딩이 absolute 포지셔닝 기준점을 이동시켜 카드가 오른쪽으로 밀림

- **수정 파일 5개:**
  - **KindnessCanvas.tsx** (핵심 수정):
    - 루트 컨테이너: `position: absolute; inset: 0` + `display: flex; align-items: center; justify-content: center` (flexbox 중앙)
    - 시나리오 카드: `position: absolute + transform: translate(-50%, -50%)` 제거 → `width: '90%'; maxWidth: 400; zIndex: 5; position: 'relative'` (부모 flexbox에 의한 중앙)
    - `perspective: '1000px'`을 motion.div의 `style` prop으로 이동
    - 피드백 오버레이: `position: absolute + transform` → 래퍼 Box(`position: absolute; inset: 0; display: flex; align-items: center; justify-content: center`)
    - 배경 그리드에 `pointerEvents: 'none'` 추가
  - **globals.css**: body safe-area 패딩 제거 (`padding-left/right: env(safe-area-inset-*)` → 주석으로 대체)
  - **page.tsx**: 이전 퀘스트 결과 팝업 오버레이 코드 ~130줄 제거, 디버그 yellow border 제거, 미사용 import 제거
  - **QuestScreen.tsx**: `forwardRef`/`useImperativeHandle` 제거 → phase 기반 렌더링 (`'playing' | 'result' | 'complete'`), 디버그 마커 제거
  - **QuestScreen/index.ts**: `QuestScreenHandle` export 제거

- **빌드 성공** (TypeScript 에러 0개)
- **커밋**: `6e748bc` - fix(game): Fix home screen scenario card right-side cutoff on mobile
- **원격 저장소 푸시 완료**

#### 팝업 수정 이력 최종 (총 12회 시도)
| # | 접근 | 대상 | 결과 |
|---|------|------|------|
| 1~11 | 다양한 CSS/Portal/Dialog 접근 | ❌ 잘못된 컴포넌트 (QuestScreen 결과 팝업) | ❌ 모두 실패 |
| **12** | **flexbox 중앙 정렬 + body safe-area 패딩 제거** | ✅ 올바른 컴포넌트 (KindnessCanvas 시나리오 카드) | ✅ 해결 |

#### 교훈
- 11회 실패의 근본 원인: **잘못된 컴포넌트를 수정**하고 있었음
- 사용자가 "홈 화면에서 팝업이 잘린다"고 했을 때, QuestScreen이 아닌 **KindnessCanvas**를 확인했어야 함
- `absolute + transform` 중앙 정렬은 body에 safe-area 패딩이 있을 때 오프셋 발생 → **flexbox 중앙 정렬**이 더 안전

---

## 설계 메모

### 화면 전환 플로우
```
메인 화면 (KindnessCanvas → "세계를 탐험하세요!")
    ↓ Travel 버튼
세계지도 (WorldMap - 지역 카드 리스트)
    ↓ 국가 선택
국가 상세 (CountryScreen - 문화 + 퀘스트 목록)
    ↓ 퀘스트 선택
퀘스트 실행 (QuestScreen - 4종류)
    ↓ 완료
퀘스트 결과 (QuestComplete - 포인트 + 별)
    ↓ 돌아가기
국가 상세 or 세계지도
```

### 별 계산 (국가당 3개)
- 1별: 퀘스트 50% 완료
- 2별: 퀘스트 100% 완료
- 3별: 100% + 모두 첫 시도 정답

### 지역 언락 순서
시작 지역은 브라우저 locale 기반으로 결정.
이전 지역에서 일정 별 수 달성 시 다음 지역 언락.

### 기존 시스템 연동
- 퀘스트 완료 → useGameStore.addPoints() 호출
- 별도 useTravelStore로 독립 관리
- 기존 kindnessData.ts 10개 시나리오 → 국가별 cultural_scenario로 마이그레이션
- travel_state → Supabase JSONB 컬럼으로 영속화
- 일일 퀘스트 4개 (tap/points/upgrade/travel)
- travel 업적 10개 (countries, stars, perfect, quests)

### 크로스-스토어 연동
```
useTravelStore (여행 전용)
  ├── completeQuest() → 별/포인트 계산
  ├── exportTravelState() → 저장용 직렬화
  └── loadTravelState() → 복원

useGameStore (메인 게임)
  ├── saveGame() → useTravelStore.exportTravelState() 호출
  ├── loadGame() → useTravelStore.loadTravelState() 호출
  ├── updateQuestProgress('travel') → 일일 퀘스트 진행
  └── checkAchievements() → travel 업적 체크

QuestScreen.tsx (퀘스트 완료 시)
  ├── useTravelStore.completeQuest()
  ├── useGameStore.addPoints()
  ├── useGameStore.updateQuestProgress('travel')
  ├── useGameStore.updateAchievementStats('travel')
  └── 통계 동기화 (countriesVisited, totalStars, perfectCountries)
```

### 새 네비게이션 구조 (Phase 4)

#### 상단 헤더 (간결화)
```
┌─────────────────────────────────────┐
│ 💖 12,345  ⚡ 80/100  Lv.15   [👛] │
└─────────────────────────────────────┘
```
- 로고 제거 (세로 공간 확보)
- Profile, Settings → More 메뉴로 이동

#### 하단 네비 (5탭)
```
┌─────────────────────────────────────┐
│  🏠      🌍      📋      ⬆️      ☰  │
│ Home   Travel   Quest  Upgrade  More │
└─────────────────────────────────────┘
```

| 탭 | 기능 | 이유 |
|---|---|---|
| Home | 메인 탭 화면 | 핵심 인터랙션 |
| Travel | 세계문화여행 | 신규 핵심 기능 |
| Quest | 일일 퀘스트 (뱃지) | 매일 확인 |
| Upgrade | 업그레이드 | 자주 사용 |
| More | 서랍 메뉴 | 나머지 통합 |

#### More 메뉴 (바텀시트)
```
┌─────────────────────────────────────┐
│  🏆 Achievement                      │
│  📊 Ranking                          │
│  🪙 Token Mining                     │
│  ─────────────────────               │
│  👤 Profile          (Coming Soon)   │
│  ⚙️ Settings         (Coming Soon)   │
│  📖 Story            (다시 보기)      │
└─────────────────────────────────────┘
```

### 스토리 팝업 구조 (Phase 5)

#### daomimi StoryModal 참조
```
참조 컴포넌트: c:\dev\daomimi\website\src\components\StoryModal.jsx
참조 CSS: c:\dev\daomimi\website\src\styles\sections.css (line 948~1181)
```

#### 카드형 모달 레이아웃
```
┌─────────────────────────────────────┐
│ Story Modal Overlay (반투명 배경)     │
│  ┌─────────────────────────────┐    │
│  │ [X] Close                    │    │
│  │ Progress Dots [● ○ ○ ○ ○]  │    │
│  │ ┌─────────────────────────┐ │    │
│  │ │                         │ │    │
│  │ │   정사각형 이미지 (1:1)  │ │    │
│  │ │                         │ │    │
│  │ │  [←]              [→]   │ │    │
│  │ └─────────────────────────┘ │    │
│  │ 텍스트 (타이핑 애니메이션):  │    │
│  │ "2026년. 인공지능은..."     │    │
│  │                             │    │
│  │ 1 / 5                       │    │
│  │ Tap to continue             │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### 핵심 CSS 클래스 (daomimi 참조)
```css
.story-modal-overlay     /* 전체화면 오버레이 */
.story-modal-content     /* 카드 컨테이너 (max-width: 500px) */
.story-scene-container   /* 정사각형 이미지 (aspect-ratio: 1/1) */
.story-progress          /* Progress dots */
.story-image-wrapper     /* 이미지 트랜지션 */
.story-nav-btn           /* 좌/우 화살표 */
.story-subtitle-container /* 하단 텍스트 영역 */
.typing-cursor           /* 타이핑 커서 */
```

### 이미지 파일 경로

#### 타이틀 이미지 (세로, webp)
```
game/public/images/almaneo-title.webp
```
사용 위치: StartScreen.tsx, LoadingScreen.tsx

#### 스토리 이미지 (정사각형 1:1, webp)
```
game/public/images/story/intro-1.webp  → Scene 1: 빛과 그림자
game/public/images/story/intro-2.webp  → Scene 2: 정(情)의 발견
game/public/images/story/intro-3.webp  → Scene 3: AlmaNEO의 탄생
game/public/images/story/intro-4.webp  → Scene 4: 세계를 여행하며
game/public/images/story/intro-5.webp  → Scene 5: 함께, 80억의 친절한 영혼
```

#### 스토리 텍스트/프롬프트 참조
```
.claude/story.md
```
