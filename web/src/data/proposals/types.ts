/**
 * Proposal Pitch Deck Types
 * 슬라이드형 피치덱 제안서 타입 정의
 */

// 제안서 상태
export type ProposalStatus =
  | 'draft'         // 작성 중
  | 'submitted'     // 제출됨
  | 'under-review'  // 검토 중
  | 'approved'      // 승인됨
  | 'rejected'      // 거절됨
  | 'funded';       // 펀딩 완료

// 슬라이드 레이아웃 타입
export type SlideLayout =
  | 'title'         // 타이틀 슬라이드 (풀스크린 이미지 + 중앙 텍스트)
  | 'content'       // 콘텐츠 슬라이드 (이미지 + 텍스트)
  | 'stats'         // 통계/테이블 슬라이드
  | 'comparison'    // 비교 테이블
  | 'quote'         // 인용문 슬라이드
  | 'conclusion';   // 결론/CTA 슬라이드

// 자막 엔트리 (타이핑 효과용)
export interface SubtitleEntry {
  text: string;           // 기본 텍스트 (한국어)
  textEn?: string;        // 영어 텍스트
  duration: number;       // 표시 시간 (ms)
  delay?: number;         // 시작 지연 (ms), 기본값 0
  highlight?: boolean;    // 강조 표시 여부
}

// 테이블 데이터
export interface TableData {
  headers: string[];
  rows: string[][];
  highlightColumn?: number;  // 강조할 열 인덱스
}

// 비교 데이터
export interface ComparisonData {
  leftTitle: string;
  rightTitle: string;
  leftItems: string[];
  rightItems: string[];
  leftColor?: 'cold' | 'warm' | 'neutral';
  rightColor?: 'cold' | 'warm' | 'neutral';
}

// 슬라이드 컴포넌트 (동적 컴포넌트용)
export interface SlideComponent {
  type: 'stats' | 'table' | 'comparison' | 'list' | 'cards';
  data: TableData | ComparisonData | string[];
  animation?: {
    type: 'fade-in' | 'slide-in' | 'scale-in';
    delay?: number;
    duration?: number;
  };
}

// 개별 슬라이드
export interface Slide {
  id: string;
  slideNumber: number;
  layout: SlideLayout;

  // 이미지
  image: string;            // 이미지 파일명 (assets/images/proposal/ 기준)
  imageAlt?: string;

  // 텍스트 콘텐츠
  title?: string;
  titleHighlight?: string;  // 그라디언트 강조 부분
  subtitle?: string;
  content?: string;         // 마크다운 콘텐츠
  quote?: string;           // 인용문
  quoteAuthor?: string;

  // 자막/스크립트
  script: SubtitleEntry[];

  // 데이터 컴포넌트
  tableData?: TableData;
  comparisonData?: ComparisonData;
  components?: SlideComponent[];

  // 타이밍
  autoAdvanceDelay?: number;  // 슬라이드 총 표시 시간 (ms), 없으면 자막 기반

  // 음성 (미래 확장용)
  audioFile?: string;
  audioDuration?: number;
}

// 제안서 메타데이터
export interface ProposalMeta {
  id: string;                 // URL slug (e.g., "polygon-grant")
  title: string;
  version: string;
  date: string;               // ISO date
  language: string;           // 'ko', 'en'

  // 상태
  status: ProposalStatus;
  statusDate?: string;        // 상태 변경일
  statusNote?: string;        // 상태 관련 메모

  // 타겟 정보
  targetOrg: string;          // 타겟 조직
  targetProgram?: string;     // 타겟 프로그램
  requestedAmount?: string;   // 요청 금액

  // 링크
  documentUrl?: string;       // 전체 문서 링크 (마크다운)
  pdfUrl?: string;            // PDF 다운로드 링크
  resultUrl?: string;         // 결과 페이지 링크

  // 번역
  availableLanguages?: string[];
}

// 완전한 제안서
export interface Proposal {
  meta: ProposalMeta;
  slides: Slide[];
}

// 상태별 색상 매핑
export const statusColors: Record<ProposalStatus, string> = {
  draft: 'bg-slate-500',
  submitted: 'bg-blue-500',
  'under-review': 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  funded: 'bg-purple-500',
};

// 상태별 라벨
export const statusLabels: Record<ProposalStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  'under-review': 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  funded: 'Funded',
};

// 상태별 한국어 라벨
export const statusLabelsKo: Record<ProposalStatus, string> = {
  draft: '작성 중',
  submitted: '제출됨',
  'under-review': '검토 중',
  approved: '승인됨',
  rejected: '거절됨',
  funded: '펀딩 완료',
};

// 지원 언어
export type ProposalLanguage = 'ko' | 'en' | 'zh';

export interface LanguageOption {
  code: ProposalLanguage;
  label: string;
  nativeLabel: string;
}

export const supportedLanguages: LanguageOption[] = [
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
];

// 상태별 중국어 라벨
export const statusLabelsZh: Record<ProposalStatus, string> = {
  draft: '草稿',
  submitted: '已提交',
  'under-review': '审核中',
  approved: '已批准',
  rejected: '已拒绝',
  funded: '已资助',
};

// 상태 라벨 다국어
export const statusLabelsByLanguage: Record<ProposalLanguage, Record<ProposalStatus, string>> = {
  ko: statusLabelsKo,
  en: statusLabels,
  zh: statusLabelsZh,
};

// 다국어 제안서 레지스트리 타입
export type ProposalRegistry = Record<string, Record<ProposalLanguage, Proposal>>;
