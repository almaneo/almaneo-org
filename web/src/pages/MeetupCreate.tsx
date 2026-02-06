/**
 * Meetup Create Page
 * 새 밋업 생성 폼
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Wallet,
  FileText,
} from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useMeetups } from '../hooks/useMeetups';
import { MEETUP_POINTS } from '../services/meetup';

export default function MeetupCreate() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { isConnected, isLoading: authLoading, connect: login } = useWallet();
  const { createNewMeetup, isLoading } = useMeetups();

  // 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = t('meetup.errors.titleRequired');
    } else if (title.length < 5) {
      newErrors.title = t('meetup.errors.titleMinLength');
    }

    if (!location.trim()) {
      newErrors.location = t('meetup.errors.locationRequired');
    }

    if (!meetingDate) {
      newErrors.meetingDate = t('meetup.errors.dateRequired');
    } else {
      const selectedDate = new Date(meetingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.meetingDate = t('meetup.errors.datePast');
      }
    }

    if (!meetingTime) {
      newErrors.meetingTime = t('meetup.errors.timeRequired');
    }

    if (maxParticipants < 3) {
      newErrors.maxParticipants = t('meetup.errors.participantsMin');
    } else if (maxParticipants > 100) {
      newErrors.maxParticipants = t('meetup.errors.participantsMax');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // 날짜와 시간 합치기
    const dateTime = new Date(`${meetingDate}T${meetingTime}`);

    const meetup = await createNewMeetup({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      meetingDate: dateTime,
      maxParticipants,
      hostAddress: '', // useMeetups에서 자동으로 설정
    });

    if (meetup) {
      navigate(`/meetup/${meetup.id}`);
    }
  };

  // 지갑 미연결 상태
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-jeong-orange to-amber-500 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('meetup.connectTitle')}
          </h1>
          <p className="text-slate-400 mb-8">
            {t('meetup.connectDescription')}
          </p>
          <button
            onClick={login}
            disabled={authLoading}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50"
          >
            {authLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('wallet.connect')}...
              </span>
            ) : (
              t('wallet.connect')
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          to="/meetup"
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('meetup.backToList')}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('meetup.createTitle')}</h1>
          <p className="text-slate-400">
            {t('meetup.createSubtitle')}
          </p>
        </div>

        {/* Points Info */}
        <div className="card p-4 mb-8 bg-gradient-to-r from-jeong-orange/10 to-amber-500/10 border-jeong-orange/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-jeong-orange/20 flex items-center justify-center flex-shrink-0">
              🎉
            </div>
            <div>
              <p className="text-white font-medium">{t('meetup.hostReward')}</p>
              <p className="text-slate-400 text-sm">
                {t('meetup.hostRewardDesc', {
                  host: MEETUP_POINTS.HOST,
                  hostLarge: MEETUP_POINTS.HOST_LARGE,
                }).replace(/<1>/g, '').replace(/<\/1>/g, '')}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              {t('meetup.fieldTitle')} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('meetup.fieldTitlePlaceholder')}
              className={`w-full p-4 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-neos-blue ${
                errors.title ? 'border-red-500' : 'border-slate-700'
              }`}
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('meetup.fieldDescription')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('meetup.fieldDescriptionPlaceholder')}
              rows={4}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-neos-blue resize-none"
              maxLength={500}
            />
            <p className="text-slate-500 text-xs mt-1 text-right">
              {description.length}/500
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              {t('meetup.fieldLocation')} *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('meetup.fieldLocationPlaceholder')}
              className={`w-full p-4 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-neos-blue ${
                errors.location ? 'border-red-500' : 'border-slate-700'
              }`}
            />
            {errors.location && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                {t('meetup.fieldDate')} *
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-4 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-neos-blue ${
                  errors.meetingDate ? 'border-red-500' : 'border-slate-700'
                }`}
              />
              {errors.meetingDate && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.meetingDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('meetup.fieldTime')} *
              </label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className={`w-full p-4 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-neos-blue ${
                  errors.meetingTime ? 'border-red-500' : 'border-slate-700'
                }`}
              />
              {errors.meetingTime && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.meetingTime}
                </p>
              )}
            </div>
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              {t('meetup.fieldMaxParticipants')} *
            </label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 3)}
              min={3}
              max={100}
              className={`w-full p-4 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-neos-blue ${
                errors.maxParticipants ? 'border-red-500' : 'border-slate-700'
              }`}
            />
            {errors.maxParticipants && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.maxParticipants}
              </p>
            )}
            <p className="text-slate-500 text-xs mt-1">
              {t('meetup.bonusNote')}
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Link
              to="/meetup"
              className="flex-1 btn-secondary py-4 text-center"
            >
              {t('meetup.cancel')}
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary py-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('meetup.creating')}
                </>
              ) : (
                t('meetup.create')
              )}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-sm font-medium text-slate-300 mb-2">💡 {t('meetup.tipsTitle')}</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>• {t('meetup.tips.tip1')}</li>
            <li>• {t('meetup.tips.tip2')}</li>
            <li>• {t('meetup.tips.tip3')}</li>
            <li>• {t('meetup.tips.tip4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
