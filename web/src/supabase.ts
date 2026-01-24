/**
 * AlmaNEO Supabase Configuration
 * Supabase 클라이언트 초기화
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://euchaicondbmdkomnilr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.warn('[Supabase] VITE_SUPABASE_ANON_KEY is not set');
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입 정의
export interface DbUser {
  wallet_address: string;
  nickname: string | null;
  avatar_url: string | null;
  kindness_score: number;
  total_points: number;
  level: number;
  language: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbGameState {
  wallet_address: string;
  points: number;
  energy: number;
  max_energy: number;
  tap_power: number;
  auto_farm: number;
  energy_regen: number;
  offline_earnings: number;
  daily_quests: unknown[];
  achievements: unknown[];
  last_saved: string;
}

export interface DbKindnessActivity {
  id: string;
  user_address: string;
  activity_type: string;
  description: string | null;
  points: number;
  verified: boolean;
  created_at: string;
}

export interface DbMeetup {
  id: string;
  title: string;
  description: string | null;
  host_address: string | null;
  location: string | null;
  meeting_date: string;
  max_participants: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  photo_url: string | null;
  created_at: string;
}

export interface DbMeetupParticipant {
  meetup_id: string;
  user_address: string;
  attended: boolean;
  points_earned: number;
  joined_at: string;
}

export interface DbNftListing {
  id: string;
  token_id: string;
  contract_address: string;
  seller_address: string | null;
  price: number;
  currency: string;
  status: 'active' | 'sold' | 'cancelled';
  created_at: string;
  sold_at: string | null;
}

export default supabase;
