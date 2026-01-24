/**
 * Kindness Service
 * 친절 활동 및 점수 관련 비즈니스 로직
 */

import { supabase, type DbKindnessActivity } from '../supabase';

// 타입 정의 (shared/types/user.ts에서 Firebase 의존성 제거를 위해 여기서 재정의)
export type AmbassadorTier = 'friend' | 'host' | 'ambassador' | 'guardian';

export type KindnessActivityType =
  | 'meetup_attend' | 'meetup_host' | 'meetup_host_large' | 'first_meetup' | 'monthly_top_host'
  | 'mentoring' | 'onboarding' | 'education_content' | 'workshop'
  | 'translation' | 'community_leader' | 'new_language'
  | 'volunteer' | 'donation' | 'charity_event'
  | 'twitter_share' | 'discord_help' | 'referral' | 'governance_vote' | 'staking_weekly' | 'nft_trade'
  | 'daily_quest' | 'weekly_mission' | 'monthly_challenge';

// 활동별 점수 (CLAUDE.md 정의 기준)
export const ACTIVITY_POINTS: Record<KindnessActivityType, number> = {
  // 밋업 활동
  first_meetup: 50,
  meetup_attend: 30,
  meetup_host: 80,
  meetup_host_large: 120,
  monthly_top_host: 150,

  // 교육/멘토링
  onboarding: 30,
  mentoring: 40,
  education_content: 50,
  workshop: 100,

  // 번역/로컬라이징
  translation: 20,
  community_leader: 50,
  new_language: 100,

  // 기부/봉사
  volunteer: 40,
  donation: 20,
  charity_event: 80,

  // 온라인/온체인
  twitter_share: 5,
  discord_help: 10,
  referral: 20,
  governance_vote: 10,
  staking_weekly: 1,
  nft_trade: 5,

  // 게임
  daily_quest: 5,
  weekly_mission: 20,
  monthly_challenge: 50,
};

// Ambassador 티어 기준
export const AMBASSADOR_TIERS = {
  friend: { minScore: 0, label: 'Kindness Friend', requirement: '첫 밋업 참가' },
  host: { minScore: 0, label: 'Kindness Host', requirement: '밋업 3회 주최' },
  ambassador: { minScore: 500, label: 'Kindness Ambassador', requirement: '500점 달성' },
  guardian: { minScore: 1000, label: 'Kindness Guardian', requirement: '1,000점 + 추천인 10명' },
} as const;

export interface AddActivityInput {
  userAddress: string;
  type: KindnessActivityType;
  description?: string;
  verified?: boolean;
}

/**
 * 친절 활동 추가
 */
export async function addKindnessActivity(input: AddActivityInput): Promise<DbKindnessActivity | null> {
  const points = ACTIVITY_POINTS[input.type] || 0;

  const { data, error } = await supabase
    .from('kindness_activities')
    .insert({
      user_address: input.userAddress,
      activity_type: input.type,
      description: input.description || null,
      points,
      verified: input.verified ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error('[Kindness] 활동 추가 실패:', error);
    return null;
  }

  // 인증된 활동인 경우 사용자 점수 업데이트
  if (input.verified) {
    await updateUserKindnessScore(input.userAddress, points);
  }

  return data;
}

/**
 * 활동 인증 처리
 */
export async function verifyActivity(activityId: string): Promise<boolean> {
  // 활동 조회
  const { data: activity, error: fetchError } = await supabase
    .from('kindness_activities')
    .select('*')
    .eq('id', activityId)
    .single();

  if (fetchError || !activity) {
    console.error('[Kindness] 활동 조회 실패:', fetchError);
    return false;
  }

  if (activity.verified) {
    console.warn('[Kindness] 이미 인증된 활동');
    return true;
  }

  // 인증 처리
  const { error: updateError } = await supabase
    .from('kindness_activities')
    .update({ verified: true })
    .eq('id', activityId);

  if (updateError) {
    console.error('[Kindness] 인증 처리 실패:', updateError);
    return false;
  }

  // 사용자 점수 업데이트
  await updateUserKindnessScore(activity.user_address, activity.points);

  return true;
}

/**
 * 사용자 Kindness Score 업데이트
 */
export async function updateUserKindnessScore(
  userAddress: string,
  pointsToAdd: number
): Promise<boolean> {
  // 현재 사용자 정보 조회
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('kindness_score, total_points')
    .eq('wallet_address', userAddress)
    .single();

  if (fetchError) {
    // 사용자가 없으면 생성
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        wallet_address: userAddress,
        kindness_score: pointsToAdd,
        total_points: pointsToAdd,
        level: 1,
      });

    if (insertError) {
      console.error('[Kindness] 사용자 생성 실패:', insertError);
      return false;
    }
    return true;
  }

  // 점수 업데이트
  const newScore = (user?.kindness_score || 0) + pointsToAdd;
  const newTotal = (user?.total_points || 0) + pointsToAdd;

  const { error: updateError } = await supabase
    .from('users')
    .update({
      kindness_score: newScore,
      total_points: newTotal,
    })
    .eq('wallet_address', userAddress);

  if (updateError) {
    console.error('[Kindness] 점수 업데이트 실패:', updateError);
    return false;
  }

  return true;
}

/**
 * 사용자의 친절 활동 목록 조회
 */
export async function getUserActivities(
  userAddress: string,
  options?: { limit?: number; verified?: boolean }
): Promise<DbKindnessActivity[]> {
  let query = supabase
    .from('kindness_activities')
    .select('*')
    .eq('user_address', userAddress)
    .order('created_at', { ascending: false });

  if (options?.verified !== undefined) {
    query = query.eq('verified', options.verified);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Kindness] 활동 목록 조회 실패:', error);
    return [];
  }

  return data || [];
}

/**
 * 사용자의 Kindness Score 조회
 */
export async function getUserKindnessScore(userAddress: string): Promise<{
  score: number;
  tier: AmbassadorTier;
  nextTier: AmbassadorTier | null;
  pointsToNextTier: number;
}> {
  const { data: user } = await supabase
    .from('users')
    .select('kindness_score')
    .eq('wallet_address', userAddress)
    .single();

  const score = user?.kindness_score || 0;

  // 티어 계산
  let tier: AmbassadorTier = 'friend';
  let nextTier: AmbassadorTier | null = 'ambassador';
  let pointsToNextTier = AMBASSADOR_TIERS.ambassador.minScore - score;

  if (score >= AMBASSADOR_TIERS.guardian.minScore) {
    tier = 'guardian';
    nextTier = null;
    pointsToNextTier = 0;
  } else if (score >= AMBASSADOR_TIERS.ambassador.minScore) {
    tier = 'ambassador';
    nextTier = 'guardian';
    pointsToNextTier = AMBASSADOR_TIERS.guardian.minScore - score;
  }

  // 밋업 주최 횟수 확인 (host 티어)
  const { data: hostedMeetups } = await supabase
    .from('meetups')
    .select('id')
    .eq('host_address', userAddress)
    .eq('status', 'completed');

  if (hostedMeetups && hostedMeetups.length >= 3 && tier === 'friend') {
    tier = 'host';
  }

  return { score, tier, nextTier, pointsToNextTier };
}

/**
 * 리더보드 조회
 */
export async function getKindnessLeaderboard(limit = 100): Promise<
  Array<{
    rank: number;
    walletAddress: string;
    nickname: string | null;
    kindnessScore: number;
    tier: AmbassadorTier;
  }>
> {
  const { data, error } = await supabase
    .from('users')
    .select('wallet_address, nickname, kindness_score')
    .order('kindness_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Kindness] 리더보드 조회 실패:', error);
    return [];
  }

  return (data || []).map((user, index) => {
    let tier: AmbassadorTier = 'friend';
    if (user.kindness_score >= AMBASSADOR_TIERS.guardian.minScore) {
      tier = 'guardian';
    } else if (user.kindness_score >= AMBASSADOR_TIERS.ambassador.minScore) {
      tier = 'ambassador';
    }

    return {
      rank: index + 1,
      walletAddress: user.wallet_address,
      nickname: user.nickname,
      kindnessScore: user.kindness_score,
      tier,
    };
  });
}

/**
 * 활동 통계 조회
 */
export async function getUserActivityStats(userAddress: string): Promise<{
  totalActivities: number;
  verifiedActivities: number;
  pendingActivities: number;
  meetupsAttended: number;
  meetupsHosted: number;
}> {
  // 전체 활동 수
  const { data: activities, error } = await supabase
    .from('kindness_activities')
    .select('verified, activity_type')
    .eq('user_address', userAddress);

  if (error) {
    console.error('[Kindness] 통계 조회 실패:', error);
    return {
      totalActivities: 0,
      verifiedActivities: 0,
      pendingActivities: 0,
      meetupsAttended: 0,
      meetupsHosted: 0,
    };
  }

  const verified = activities?.filter(a => a.verified).length || 0;
  const pending = activities?.filter(a => !a.verified).length || 0;
  const meetupsAttended = activities?.filter(a =>
    ['meetup_attend', 'first_meetup'].includes(a.activity_type)
  ).length || 0;
  const meetupsHosted = activities?.filter(a =>
    ['meetup_host', 'meetup_host_large'].includes(a.activity_type)
  ).length || 0;

  return {
    totalActivities: activities?.length || 0,
    verifiedActivities: verified,
    pendingActivities: pending,
    meetupsAttended,
    meetupsHosted,
  };
}

/**
 * 특정 유형의 활동 횟수 조회
 */
export async function getActivityCount(
  userAddress: string,
  activityType: KindnessActivityType
): Promise<number> {
  const { count, error } = await supabase
    .from('kindness_activities')
    .select('*', { count: 'exact', head: true })
    .eq('user_address', userAddress)
    .eq('activity_type', activityType)
    .eq('verified', true);

  if (error) {
    console.error('[Kindness] 활동 횟수 조회 실패:', error);
    return 0;
  }

  return count || 0;
}

/**
 * 일일 한도 체크 (Twitter 등)
 */
export async function checkDailyLimit(
  userAddress: string,
  activityType: KindnessActivityType,
  maxPerDay: number
): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('kindness_activities')
    .select('*', { count: 'exact', head: true })
    .eq('user_address', userAddress)
    .eq('activity_type', activityType)
    .gte('created_at', today.toISOString());

  if (error) {
    console.error('[Kindness] 일일 한도 체크 실패:', error);
    return false;
  }

  return (count || 0) < maxPerDay;
}
