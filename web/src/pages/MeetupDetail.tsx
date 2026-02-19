/**
 * Meetup Detail Page
 * 밋업 상세 정보, 참가 신청, 인증 제출
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  CheckCircle2,
  XCircle,
  Loader2,
  Camera,
  UserPlus,
  UserMinus,
  Clock,
  MessageCircle,
  Smartphone,
  Download,
} from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useMeetups } from '../hooks/useMeetups';
import { submitMeetupVerification, MEETUP_POINTS } from '../services/meetup';
import { validateImageFile, createPreviewUrl, revokePreviewUrl } from '../services/storage';

// 날짜 포맷
function formatDateTime(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 주소 축약
function shortenAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export default function MeetupDetail() {
  const { t, i18n } = useTranslation('common');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address, isConnected } = useWallet();
  const {
    currentMeetup,
    isParticipating,
    isLoading,
    error,
    loadMeetupDetail,
    joinCurrentMeetup,
    leaveCurrentMeetup,
  } = useMeetups();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  // 밋업 로드
  useEffect(() => {
    if (id) {
      loadMeetupDetail(id);
    }
  }, [id, loadMeetupDetail]);

  // 호스트 여부
  const isHost = address && currentMeetup?.host_address === address.toLowerCase();

  // 밋업 날짜가 지났는지
  const isPastMeetup = currentMeetup
    ? new Date(currentMeetup.meeting_date) < new Date()
    : false;

  // 참가 신청
  const handleJoin = async () => {
    if (!isConnected) {
      alert(t('meetup.detail.connectFirst'));
      return;
    }

    setIsSubmitting(true);
    const success = await joinCurrentMeetup();
    setIsSubmitting(false);

    if (!success) {
      alert(t('meetup.detail.joinFailed'));
    }
  };

  // 참가 취소
  const handleLeave = async () => {
    if (!confirm(t('meetup.detail.confirmLeave'))) return;

    setIsSubmitting(true);
    const success = await leaveCurrentMeetup();
    setIsSubmitting(false);

    if (!success) {
      alert(t('meetup.detail.leaveFailed'));
    }
  };

  // 인증 제출
  const handleVerification = async () => {
    if (!id || !address || !selectedPhoto || selectedParticipants.length === 0) {
      alert(t('meetup.detail.selectPhotoAndParticipants'));
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await submitMeetupVerification(
        id,
        address.toLowerCase(),
        selectedPhoto,
        selectedParticipants
      );

      if (success) {
        alert(t('meetup.detail.verifySuccess'));
        setShowVerificationForm(false);
        loadMeetupDetail(id);
      } else {
        alert(t('meetup.detail.verifyFailed'));
      }
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 사진 선택 핸들러
  const handlePhotoSelect = (file: File | null) => {
    // 이전 미리보기 URL 해제
    if (photoPreview) {
      revokePreviewUrl(photoPreview);
      setPhotoPreview(null);
    }

    // 파일 초기화
    setSelectedPhoto(null);
    setPhotoError(null);

    if (!file) return;

    // 유효성 검사
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setPhotoError(validation.error || t('meetup.errors.fileValidationFailed'));
      return;
    }

    // 미리보기 생성
    const previewUrl = createPreviewUrl(file);
    setPhotoPreview(previewUrl);
    setSelectedPhoto(file);
  };

  // 참가자 토글
  const toggleParticipant = (participantAddress: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantAddress)
        ? prev.filter((a) => a !== participantAddress)
        : [...prev, participantAddress]
    );
  };

  // 공유
  const handleShare = async () => {
    try {
      await navigator.share({
        title: currentMeetup?.title,
        text: currentMeetup?.description || '',
        url: window.location.href,
      });
    } catch {
      // 공유 API 미지원 시 URL 복사
      await navigator.clipboard.writeText(window.location.href);
      alert(t('meetup.detail.linkCopied'));
    }
  };

  // 상태 라벨
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      completed: t('meetup.statusCompleted'),
      upcoming: t('meetup.statusUpcoming'),
      cancelled: t('meetup.statusCancelled'),
    };
    return map[status] || status;
  };

  // 로딩
  if (isLoading && !currentMeetup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neos-blue animate-spin" />
      </div>
    );
  }

  // 에러 또는 밋업 없음
  if (!currentMeetup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t('meetup.detail.notFound')}</h1>
          <p className="text-slate-400 mb-6">{error || t('meetup.detail.notFoundDesc')}</p>
          <Link to="/meetup" className="btn-primary">
            {t('meetup.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('meetup.detail.back')}
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-white">{currentMeetup.title}</h1>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentMeetup.status === 'completed'
                    ? 'bg-green-500/20 text-green-400'
                    : currentMeetup.status === 'upcoming'
                      ? 'bg-neos-blue/20 text-neos-blue'
                      : 'bg-red-500/20 text-red-400'
                }`}
              >
                {getStatusLabel(currentMeetup.status)}
              </span>
              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {currentMeetup.description && (
            <p className="text-slate-300 text-lg">{currentMeetup.description}</p>
          )}
        </div>

        {/* Photo */}
        {currentMeetup.photo_url && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={currentMeetup.photo_url}
              alt={currentMeetup.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center gap-3 text-slate-400 mb-1">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">{t('meetup.detail.dateTime')}</span>
            </div>
            <p className="text-white">{formatDateTime(currentMeetup.meeting_date, i18n.language)}</p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 text-slate-400 mb-1">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">{t('meetup.detail.location')}</span>
            </div>
            <p className="text-white">{currentMeetup.location || t('meetup.detail.locationUndefined')}</p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 text-slate-400 mb-1">
              <Users className="w-5 h-5" />
              <span className="text-sm">{t('meetup.detail.participants')}</span>
            </div>
            <p className="text-white">
              {t('meetup.detail.participantCount', {
                current: currentMeetup.participantCount,
                max: currentMeetup.max_participants,
              })}
            </p>
          </div>
        </div>

        {/* Points Info */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-jeong-orange/10 to-amber-500/10 border-jeong-orange/30">
          <h3 className="text-lg font-semibold text-white mb-4">{t('meetup.detail.earnablePoints')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-slate-400 text-sm">{t('meetup.detail.firstMeetup')}</p>
              <p className="text-jeong-orange font-bold">+{MEETUP_POINTS.FIRST_MEETUP}{i18n.language === 'ko' ? '점' : ' pts'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">{t('meetup.detail.meetupAttend')}</p>
              <p className="text-jeong-orange font-bold">+{MEETUP_POINTS.ATTEND}{i18n.language === 'ko' ? '점' : ' pts'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">{t('meetup.detail.meetupHost')}</p>
              <p className="text-jeong-orange font-bold">+{MEETUP_POINTS.HOST}{i18n.language === 'ko' ? '점' : ' pts'}</p>
            </div>
          </div>
        </div>

        {/* AlmaChat CTA */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-neos-blue/10 to-cyan-500/10 border-neos-blue/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-neos-blue/15 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-neos-blue" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{t('meetup.almachat.detailTitle')}</h3>
              <p className="text-slate-400 text-sm mb-3">{t('meetup.almachat.detailDesc')}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neos-blue/20 text-neos-blue text-sm font-medium hover:bg-neos-blue/30 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  {t('meetup.almachat.openApp')}
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t('meetup.almachat.downloadApp')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('meetup.detail.participantList', { count: currentMeetup.participantCount })}
          </h3>

          {currentMeetup.participants.length === 0 ? (
            <p className="text-slate-400 text-center py-4">{t('meetup.detail.noParticipants')}</p>
          ) : (
            <div className="space-y-2">
              {currentMeetup.participants.map((participant) => (
                <div
                  key={participant.user_address}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-white">
                      {shortenAddress(participant.user_address)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {participant.attended ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        {t('meetup.detail.attended')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {t('meetup.detail.waiting')}
                      </span>
                    )}
                    {participant.points_earned > 0 && (
                      <span className="text-jeong-orange text-sm">
                        +{participant.points_earned}{i18n.language === 'ko' ? '점' : ' pts'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* 일반 사용자 - 참가 신청/취소 */}
          {!isHost && currentMeetup.status === 'upcoming' && (
            <div className="flex gap-4">
              {isParticipating ? (
                <button
                  onClick={handleLeave}
                  disabled={isSubmitting}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <UserMinus className="w-5 h-5" />
                      {t('meetup.detail.leave')}
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={
                    isSubmitting ||
                    currentMeetup.participantCount >= currentMeetup.max_participants
                  }
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      {t('meetup.detail.join')}
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* 호스트 - 인증 제출 */}
          {isHost && isPastMeetup && currentMeetup.status === 'upcoming' && (
            <div>
              {!showVerificationForm ? (
                <button
                  onClick={() => setShowVerificationForm(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                >
                  <Camera className="w-5 h-5" />
                  {t('meetup.detail.verify')}
                </button>
              ) : (
                <div className="card p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-white">{t('meetup.detail.verifyTitle')}</h3>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      {t('meetup.detail.photoUpload')}
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handlePhotoSelect(e.target.files?.[0] || null)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neos-blue file:text-white file:cursor-pointer"
                    />
                    {photoError && (
                      <p className="text-sm text-red-400 mt-2">
                        ✗ {photoError}
                      </p>
                    )}
                    {selectedPhoto && !photoError && (
                      <p className="text-sm text-green-400 mt-2">
                        ✓ {selectedPhoto.name} ({(selectedPhoto.size / 1024 / 1024).toFixed(2)}MB)
                      </p>
                    )}
                    {photoPreview && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-slate-700">
                        <img
                          src={photoPreview}
                          alt={t('meetup.detail.preview')}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Participant Selection */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      {t('meetup.detail.selectParticipants', { count: selectedParticipants.length })}
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {currentMeetup.participants.map((p) => (
                        <button
                          key={p.user_address}
                          onClick={() => toggleParticipant(p.user_address)}
                          className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-colors ${
                            selectedParticipants.includes(p.user_address)
                              ? 'bg-green-500/20 border border-green-500/50'
                              : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <span className="text-white">
                            {shortenAddress(p.user_address)}
                          </span>
                          {selectedParticipants.includes(p.user_address) && (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowVerificationForm(false)}
                      className="flex-1 btn-secondary py-3"
                    >
                      {t('meetup.cancel')}
                    </button>
                    <button
                      onClick={handleVerification}
                      disabled={
                        isSubmitting ||
                        !selectedPhoto ||
                        selectedParticipants.length === 0
                      }
                      className="flex-1 btn-primary py-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        t('meetup.detail.verifyComplete')
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 완료된 밋업 */}
          {currentMeetup.status === 'completed' && (
            <div className="card p-6 text-center bg-green-500/10 border-green-500/30">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-green-400 font-medium">{t('meetup.detail.meetupCompleted')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
