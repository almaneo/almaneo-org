/**
 * Meetup Service
 * 밋업 관련 CRUD 및 비즈니스 로직
 */

import { supabase, type DbMeetup, type DbMeetupParticipant } from '../supabase';
import { uploadPhotoToStorage } from './storage';

// 점수 상수 (CLAUDE.md 정의 기준)
export const MEETUP_POINTS = {
  FIRST_MEETUP: 50,      // 첫 밋업 참가
  ATTEND: 30,            // 밋업 참가
  HOST: 80,              // 밋업 주최
  HOST_LARGE: 120,       // 대규모 밋업 주최 (10명+)
  MONTHLY_TOP_HOST: 150, // 월간 최다 주최
} as const;

export interface CreateMeetupInput {
  title: string;
  description: string;
  hostAddress: string;
  location: string;
  meetingDate: Date;
  maxParticipants: number;
}

export interface MeetupWithParticipants extends DbMeetup {
  participants: DbMeetupParticipant[];
  participantCount: number;
}

/**
 * 새 밋업 생성
 */
export async function createMeetup(input: CreateMeetupInput): Promise<DbMeetup | null> {
  const { data, error } = await supabase
    .from('meetups')
    .insert({
      title: input.title,
      description: input.description,
      host_address: input.hostAddress,
      location: input.location,
      meeting_date: input.meetingDate.toISOString(),
      max_participants: input.maxParticipants,
      status: 'upcoming',
    })
    .select()
    .single();

  if (error) {
    console.error('[Meetup] 생성 실패:', error);
    return null;
  }

  return data;
}

/**
 * 밋업 목록 조회
 */
export async function getMeetups(options?: {
  status?: 'upcoming' | 'completed' | 'cancelled';
  limit?: number;
  offset?: number;
}): Promise<DbMeetup[]> {
  let query = supabase
    .from('meetups')
    .select('*')
    .order('meeting_date', { ascending: true });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Meetup] 목록 조회 실패:', error);
    return [];
  }

  return data || [];
}

/**
 * 내가 주최한 밋업 조회
 */
export async function getMyHostedMeetups(hostAddress: string): Promise<DbMeetup[]> {
  const { data, error } = await supabase
    .from('meetups')
    .select('*')
    .eq('host_address', hostAddress)
    .order('meeting_date', { ascending: false });

  if (error) {
    console.error('[Meetup] 내 밋업 조회 실패:', error);
    return [];
  }

  return data || [];
}

/**
 * 밋업 상세 조회 (참가자 포함)
 */
export async function getMeetupById(meetupId: string): Promise<MeetupWithParticipants | null> {
  // 밋업 정보 조회
  const { data: meetup, error: meetupError } = await supabase
    .from('meetups')
    .select('*')
    .eq('id', meetupId)
    .single();

  if (meetupError || !meetup) {
    console.error('[Meetup] 상세 조회 실패:', meetupError);
    return null;
  }

  // 참가자 목록 조회
  const { data: participants, error: participantsError } = await supabase
    .from('meetup_participants')
    .select('*')
    .eq('meetup_id', meetupId);

  if (participantsError) {
    console.error('[Meetup] 참가자 조회 실패:', participantsError);
  }

  return {
    ...meetup,
    participants: participants || [],
    participantCount: participants?.length || 0,
  };
}

/**
 * 밋업 참가 신청
 */
export async function joinMeetup(meetupId: string, userAddress: string): Promise<boolean> {
  // 이미 참가했는지 확인
  const { data: existing } = await supabase
    .from('meetup_participants')
    .select('*')
    .eq('meetup_id', meetupId)
    .eq('user_address', userAddress)
    .single();

  if (existing) {
    console.warn('[Meetup] 이미 참가 신청함');
    return false;
  }

  // 참가 인원 확인
  const meetup = await getMeetupById(meetupId);
  if (!meetup || meetup.participantCount >= meetup.max_participants) {
    console.warn('[Meetup] 참가 인원 초과');
    return false;
  }

  // 참가 신청
  const { error } = await supabase
    .from('meetup_participants')
    .insert({
      meetup_id: meetupId,
      user_address: userAddress,
      attended: false,
      points_earned: 0,
    });

  if (error) {
    console.error('[Meetup] 참가 신청 실패:', error);
    return false;
  }

  return true;
}

/**
 * 밋업 참가 취소
 */
export async function leaveMeetup(meetupId: string, userAddress: string): Promise<boolean> {
  const { error } = await supabase
    .from('meetup_participants')
    .delete()
    .eq('meetup_id', meetupId)
    .eq('user_address', userAddress);

  if (error) {
    console.error('[Meetup] 참가 취소 실패:', error);
    return false;
  }

  return true;
}

/**
 * 밋업 상태 업데이트
 */
export async function updateMeetupStatus(
  meetupId: string,
  status: 'upcoming' | 'completed' | 'cancelled'
): Promise<boolean> {
  const { error } = await supabase
    .from('meetups')
    .update({ status })
    .eq('id', meetupId);

  if (error) {
    console.error('[Meetup] 상태 업데이트 실패:', error);
    return false;
  }

  return true;
}

/**
 * 밋업 사진 업로드
 */
export async function uploadMeetupPhoto(
  meetupId: string,
  file: File
): Promise<string | null> {
  try {
    // Storage에 업로드
    const photoUrl = await uploadPhotoToStorage(file, meetupId);

    // 밋업에 사진 URL 저장
    const { error: updateError } = await supabase
      .from('meetups')
      .update({ photo_url: photoUrl })
      .eq('id', meetupId);

    if (updateError) {
      console.error('[Meetup] 사진 URL 저장 실패:', updateError);
      return null;
    }

    return photoUrl;
  } catch (error) {
    console.error('[Meetup] 사진 업로드 실패:', error);
    return null;
  }
}

/**
 * 밋업 인증 제출 (호스트가 완료 처리)
 */
export async function submitMeetupVerification(
  meetupId: string,
  hostAddress: string,
  photoFile: File,
  attendedAddresses: string[]
): Promise<boolean> {
  // 밋업 확인
  const meetup = await getMeetupById(meetupId);
  if (!meetup || meetup.host_address !== hostAddress) {
    console.error('[Meetup] 권한 없음');
    return false;
  }

  // 사진 업로드
  const photoUrl = await uploadMeetupPhoto(meetupId, photoFile);
  if (!photoUrl) {
    return false;
  }

  // 참가자 출석 처리 및 점수 부여
  for (const address of attendedAddresses) {
    // 첫 밋업인지 확인
    const { data: previousMeetups } = await supabase
      .from('meetup_participants')
      .select('*')
      .eq('user_address', address)
      .eq('attended', true);

    const isFirstMeetup = !previousMeetups || previousMeetups.length === 0;
    const points = isFirstMeetup
      ? MEETUP_POINTS.FIRST_MEETUP
      : MEETUP_POINTS.ATTEND;

    // 출석 및 점수 업데이트
    await supabase
      .from('meetup_participants')
      .update({
        attended: true,
        points_earned: points,
      })
      .eq('meetup_id', meetupId)
      .eq('user_address', address);

    // 사용자 kindness_score 업데이트
    await supabase.rpc('increment_kindness_score', {
      p_address: address,
      p_points: points,
    });
  }

  // 호스트 점수 부여
  const hostPoints = attendedAddresses.length >= 10
    ? MEETUP_POINTS.HOST_LARGE
    : MEETUP_POINTS.HOST;

  await supabase.rpc('increment_kindness_score', {
    p_address: hostAddress,
    p_points: hostPoints,
  });

  // 밋업 상태를 완료로 변경
  await updateMeetupStatus(meetupId, 'completed');

  return true;
}

/**
 * 내가 참가한 밋업 조회
 */
export async function getMyParticipatedMeetups(userAddress: string): Promise<DbMeetup[]> {
  const { data: participations, error } = await supabase
    .from('meetup_participants')
    .select('meetup_id')
    .eq('user_address', userAddress);

  if (error || !participations?.length) {
    return [];
  }

  const meetupIds = participations.map(p => p.meetup_id);

  const { data: meetups } = await supabase
    .from('meetups')
    .select('*')
    .in('id', meetupIds)
    .order('meeting_date', { ascending: false });

  return meetups || [];
}

/**
 * 참가 여부 확인
 */
export async function isParticipant(meetupId: string, userAddress: string): Promise<boolean> {
  const { data } = await supabase
    .from('meetup_participants')
    .select('*')
    .eq('meetup_id', meetupId)
    .eq('user_address', userAddress)
    .single();

  return !!data;
}
