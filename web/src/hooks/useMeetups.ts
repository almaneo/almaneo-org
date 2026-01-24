/**
 * useMeetups Hook
 * 밋업 관련 데이터 및 액션을 관리하는 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, type DbMeetup } from '../supabase';
import { useWallet } from '../components/wallet';
import {
  getMeetups,
  getMeetupById,
  createMeetup,
  joinMeetup,
  leaveMeetup,
  getMyHostedMeetups,
  getMyParticipatedMeetups,
  isParticipant,
  type CreateMeetupInput,
  type MeetupWithParticipants,
} from '../services/meetup';

interface UseMeetupsReturn {
  // 데이터
  meetups: DbMeetup[];
  myHostedMeetups: DbMeetup[];
  myParticipatedMeetups: DbMeetup[];
  currentMeetup: MeetupWithParticipants | null;
  isParticipating: boolean;

  // 상태
  isLoading: boolean;
  error: string | null;

  // 액션
  loadMeetups: (status?: 'upcoming' | 'completed' | 'cancelled') => Promise<void>;
  loadMeetupDetail: (meetupId: string) => Promise<void>;
  createNewMeetup: (input: CreateMeetupInput) => Promise<DbMeetup | null>;
  joinCurrentMeetup: () => Promise<boolean>;
  leaveCurrentMeetup: () => Promise<boolean>;
  refreshMyMeetups: () => Promise<void>;
}

export function useMeetups(): UseMeetupsReturn {
  const { address, isConnected } = useWallet();
  const [meetups, setMeetups] = useState<DbMeetup[]>([]);
  const [myHostedMeetups, setMyHostedMeetups] = useState<DbMeetup[]>([]);
  const [myParticipatedMeetups, setMyParticipatedMeetups] = useState<DbMeetup[]>([]);
  const [currentMeetup, setCurrentMeetup] = useState<MeetupWithParticipants | null>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 밋업 목록 로드
  const loadMeetups = useCallback(async (status?: 'upcoming' | 'completed' | 'cancelled') => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMeetups({ status, limit: 50 });
      setMeetups(data);
    } catch (err) {
      console.error('[useMeetups] 목록 로드 실패:', err);
      setError('밋업 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 밋업 상세 로드
  const loadMeetupDetail = useCallback(async (meetupId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMeetupById(meetupId);
      setCurrentMeetup(data);

      // 참가 여부 확인
      if (address && data) {
        const participating = await isParticipant(meetupId, address.toLowerCase());
        setIsParticipating(participating);
      }
    } catch (err) {
      console.error('[useMeetups] 상세 로드 실패:', err);
      setError('밋업 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // 새 밋업 생성
  const createNewMeetup = useCallback(async (input: CreateMeetupInput): Promise<DbMeetup | null> => {
    if (!isConnected || !address) {
      setError('지갑을 먼저 연결해주세요.');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const meetup = await createMeetup({
        ...input,
        hostAddress: address.toLowerCase(),
      });

      if (meetup) {
        // 내 밋업 목록 새로고침
        await refreshMyMeetups();
      }

      return meetup;
    } catch (err) {
      console.error('[useMeetups] 생성 실패:', err);
      setError('밋업 생성에 실패했습니다.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  // 현재 밋업 참가
  const joinCurrentMeetup = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !address || !currentMeetup) {
      setError('지갑을 먼저 연결해주세요.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await joinMeetup(currentMeetup.id, address.toLowerCase());

      if (success) {
        setIsParticipating(true);
        // 밋업 상세 새로고침
        await loadMeetupDetail(currentMeetup.id);
      }

      return success;
    } catch (err) {
      console.error('[useMeetups] 참가 실패:', err);
      setError('밋업 참가에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, currentMeetup, loadMeetupDetail]);

  // 현재 밋업 참가 취소
  const leaveCurrentMeetup = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !address || !currentMeetup) {
      setError('지갑을 먼저 연결해주세요.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await leaveMeetup(currentMeetup.id, address.toLowerCase());

      if (success) {
        setIsParticipating(false);
        // 밋업 상세 새로고침
        await loadMeetupDetail(currentMeetup.id);
      }

      return success;
    } catch (err) {
      console.error('[useMeetups] 참가 취소 실패:', err);
      setError('밋업 참가 취소에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, currentMeetup, loadMeetupDetail]);

  // 내 밋업 새로고침
  const refreshMyMeetups = useCallback(async () => {
    if (!address) return;

    const walletAddress = address.toLowerCase();

    try {
      const [hosted, participated] = await Promise.all([
        getMyHostedMeetups(walletAddress),
        getMyParticipatedMeetups(walletAddress),
      ]);

      setMyHostedMeetups(hosted);
      setMyParticipatedMeetups(participated);
    } catch (err) {
      console.error('[useMeetups] 내 밋업 조회 실패:', err);
    }
  }, [address]);

  // 연결 시 내 밋업 로드 및 실시간 구독
  useEffect(() => {
    if (!isConnected || !address) {
      setMyHostedMeetups([]);
      setMyParticipatedMeetups([]);
      return;
    }

    // 내 밋업 로드
    refreshMyMeetups();

    // 실시간 구독 (새 밋업 생성 시)
    const channel = supabase
      .channel('meetups')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meetups',
        },
        () => {
          // 밋업 변경 시 목록 새로고침
          loadMeetups();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConnected, address, refreshMyMeetups, loadMeetups]);

  return {
    meetups,
    myHostedMeetups,
    myParticipatedMeetups,
    currentMeetup,
    isParticipating,
    isLoading,
    error,
    loadMeetups,
    loadMeetupDetail,
    createNewMeetup,
    joinCurrentMeetup,
    leaveCurrentMeetup,
    refreshMyMeetups,
  };
}
