/**
 * Meetup Create Page
 * 새 밋업 생성 폼
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      newErrors.title = '밋업 제목을 입력해주세요';
    } else if (title.length < 5) {
      newErrors.title = '제목은 5자 이상이어야 합니다';
    }

    if (!location.trim()) {
      newErrors.location = '장소를 입력해주세요';
    }

    if (!meetingDate) {
      newErrors.meetingDate = '날짜를 선택해주세요';
    } else {
      const selectedDate = new Date(meetingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.meetingDate = '과거 날짜는 선택할 수 없습니다';
      }
    }

    if (!meetingTime) {
      newErrors.meetingTime = '시간을 선택해주세요';
    }

    if (maxParticipants < 3) {
      newErrors.maxParticipants = '최소 3명 이상이어야 합니다';
    } else if (maxParticipants > 100) {
      newErrors.maxParticipants = '최대 100명까지 가능합니다';
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
            밋업 만들기
          </h1>
          <p className="text-slate-400 mb-8">
            밋업을 만들려면 지갑을 먼저 연결해주세요.
          </p>
          <button
            onClick={login}
            disabled={authLoading}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50"
          >
            {authLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
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
          밋업 목록으로
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">새 밋업 만들기</h1>
          <p className="text-slate-400">
            오프라인에서 AlmaNEO 커뮤니티와 만나보세요
          </p>
        </div>

        {/* Points Info */}
        <div className="card p-4 mb-8 bg-gradient-to-r from-jeong-orange/10 to-amber-500/10 border-jeong-orange/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-jeong-orange/20 flex items-center justify-center flex-shrink-0">
              🎉
            </div>
            <div>
              <p className="text-white font-medium">밋업 주최 보상</p>
              <p className="text-slate-400 text-sm">
                밋업 완료 시 <span className="text-jeong-orange">+{MEETUP_POINTS.HOST}점</span>,
                10명 이상 참가 시 <span className="text-jeong-orange">+{MEETUP_POINTS.HOST_LARGE}점</span>
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
              밋업 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 서울 AlmaNEO 첫 번째 밋업"
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
              설명 (선택)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="밋업에 대한 간단한 설명을 입력해주세요"
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
              장소 *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 서울시 강남구 카페 OOO"
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
                날짜 *
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
                시간 *
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
              최대 참가자 수 *
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
              10명 이상 참가 시 추가 보너스 점수!
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Link
              to="/meetup"
              className="flex-1 btn-secondary py-4 text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary py-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  생성 중...
                </>
              ) : (
                '밋업 만들기'
              )}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-sm font-medium text-slate-300 mb-2">💡 밋업 팁</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>• 명확하고 구체적인 제목을 사용하세요</li>
            <li>• 찾기 쉬운 장소를 선택하세요</li>
            <li>• 밋업 후 24시간 내에 인증을 완료해주세요</li>
            <li>• 3명 이상의 단체 사진을 찍어주세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
