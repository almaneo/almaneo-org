/**
 * Proposal Page - 제안서 뷰어 페이지
 * /proposals/:proposalId?lang=ko&slide=1
 */

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SlideViewer } from '../components/proposal';
import { getProposalById, getProposalLanguages } from '../data/proposals';
import type { ProposalLanguage } from '../data/proposals/types';

export default function Proposal() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 언어 및 슬라이드 파라미터 읽기
  const langParam = searchParams.get('lang') as ProposalLanguage | null;
  const currentLanguage: ProposalLanguage = langParam || 'ko';
  const initialSlide = parseInt(searchParams.get('slide') || '1', 10) - 1;

  // 제안서 데이터 로드
  const proposal = proposalId ? getProposalById(proposalId, currentLanguage) : undefined;

  // 언어 변경 핸들러
  const handleLanguageChange = (lang: ProposalLanguage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', lang);
    setSearchParams(newParams, { replace: true });
  };

  // 닫기 핸들러
  const handleClose = () => {
    navigate('/');
  };

  // 제안서가 없으면 404
  if (!proposal) {
    const availableLangs = proposalId ? getProposalLanguages(proposalId) : [];

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-slate-400 mb-6">
            {currentLanguage === 'ko'
              ? '제안서를 찾을 수 없습니다.'
              : 'Proposal not found.'}
          </p>
          {availableLangs.length > 0 && (
            <p className="text-slate-500 mb-4 text-sm">
              {currentLanguage === 'ko'
                ? `사용 가능한 언어: ${availableLangs.join(', ')}`
                : `Available languages: ${availableLangs.join(', ')}`}
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-neos-blue text-white rounded-lg hover:bg-neos-blue/80 transition-colors"
          >
            {currentLanguage === 'ko' ? '홈으로 돌아가기' : 'Go Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <SlideViewer
      proposal={proposal}
      initialSlide={initialSlide}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
      onClose={handleClose}
    />
  );
}
