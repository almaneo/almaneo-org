/**
 * Meetup List Page
 * 밋업 목록 및 검색/필터
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Loader2,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { useMeetups } from '../hooks/useMeetups';
import type { DbMeetup } from '../supabase';

type MeetupFilter = 'all' | 'upcoming' | 'completed';

// 날짜 포맷
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function formatTime(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 상태 뱃지
function StatusBadge({ status, t }: { status: DbMeetup['status']; t: (key: string) => string }) {
  const styles = {
    upcoming: 'bg-neos-blue/20 text-neos-blue',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  const labelKeys: Record<string, string> = {
    upcoming: 'meetup.statusUpcoming',
    completed: 'meetup.statusCompleted',
    cancelled: 'meetup.statusCancelled',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {t(labelKeys[status])}
    </span>
  );
}

export default function MeetupList() {
  const { t, i18n } = useTranslation('common');
  const { meetups, isLoading, loadMeetups } = useMeetups();
  const [filter, setFilter] = useState<MeetupFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 필터 변경 시 밋업 로드
  useEffect(() => {
    if (filter === 'all') {
      loadMeetups();
    } else {
      loadMeetups(filter);
    }
  }, [filter, loadMeetups]);

  // 검색 필터링
  const filteredMeetups = meetups.filter((meetup) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      meetup.title.toLowerCase().includes(query) ||
      meetup.location?.toLowerCase().includes(query) ||
      meetup.description?.toLowerCase().includes(query)
    );
  });

  // 날짜별 그룹핑
  const groupedMeetups = filteredMeetups.reduce((groups, meetup) => {
    const date = new Date(meetup.meeting_date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(meetup);
    return groups;
  }, {} as Record<string, DbMeetup[]>);

  const filterLabels: Record<MeetupFilter, string> = {
    all: t('meetup.filterAll'),
    upcoming: t('meetup.filterUpcoming'),
    completed: t('meetup.filterCompleted'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('meetup.title')}</h1>
            <p className="text-slate-400">
              {t('meetup.subtitle')}
            </p>
          </div>
          <Link to="/meetup/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t('meetup.create')}
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder={t('meetup.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-neos-blue focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'upcoming', 'completed'] as MeetupFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-neos-blue text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {/* AlmaChat CTA Banner */}
        <div className="mb-8 card p-5 bg-gradient-to-r from-jeong-orange/5 to-amber-500/5 border-jeong-orange/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-jeong-orange/15 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-jeong-orange" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold">{t('meetup.almachat.bannerTitle')}</h3>
              <p className="text-slate-400 text-sm">{t('meetup.almachat.bannerDesc')}</p>
            </div>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-jeong-orange hover:text-orange-300 transition-colors whitespace-nowrap"
            >
              {t('meetup.almachat.download')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-neos-blue animate-spin mx-auto mb-3" />
            <p className="text-slate-400">{t('meetup.loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMeetups.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? t('meetup.emptySearchTitle') : t('meetup.emptyTitle')}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchQuery
                ? t('meetup.emptySearchDescription')
                : t('meetup.emptyDescription')}
            </p>
            <Link to="/meetup/new" className="btn-primary">
              {t('meetup.create')}
            </Link>
          </div>
        )}

        {/* Meetup List */}
        {!isLoading && Object.keys(groupedMeetups).length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedMeetups).map(([date, dayMeetups]) => (
              <div key={date}>
                <h2 className="text-sm font-medium text-slate-400 mb-4">
                  {formatDate(dayMeetups[0].meeting_date, i18n.language)}
                </h2>
                <div className="space-y-4">
                  {dayMeetups.map((meetup) => (
                    <Link
                      key={meetup.id}
                      to={`/meetup/${meetup.id}`}
                      className="block card card-hover p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {meetup.title}
                            </h3>
                            <StatusBadge status={meetup.status} t={t} />
                          </div>

                          {meetup.description && (
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                              {meetup.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{formatTime(meetup.meeting_date, i18n.language)}</span>
                            </div>
                            {meetup.location && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                <span>{meetup.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>{t('meetup.maxParticipants', { count: meetup.max_participants })}</span>
                            </div>
                          </div>
                        </div>

                        {meetup.photo_url && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={meetup.photo_url}
                              alt={meetup.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
