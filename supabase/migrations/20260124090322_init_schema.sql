-- ===========================================
-- AlmaNEO Database Schema
-- ===========================================

-- Users 테이블
CREATE TABLE users (
  wallet_address TEXT PRIMARY KEY,
  nickname TEXT,
  avatar_url TEXT,
  kindness_score INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  language TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game States 테이블
CREATE TABLE game_states (
  wallet_address TEXT PRIMARY KEY REFERENCES users(wallet_address) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  energy INTEGER DEFAULT 100,
  max_energy INTEGER DEFAULT 100,
  tap_power INTEGER DEFAULT 1,
  auto_farm INTEGER DEFAULT 0,
  energy_regen INTEGER DEFAULT 1,
  offline_earnings INTEGER DEFAULT 0,
  daily_quests JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  last_saved TIMESTAMPTZ DEFAULT NOW()
);

-- Kindness Activities 테이블
CREATE TABLE kindness_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetups 테이블 (Kindness Protocol)
CREATE TABLE meetups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  host_address TEXT REFERENCES users(wallet_address) ON DELETE SET NULL,
  location TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  max_participants INTEGER DEFAULT 20,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetup Participants 테이블
CREATE TABLE meetup_participants (
  meetup_id UUID REFERENCES meetups(id) ON DELETE CASCADE,
  user_address TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  points_earned INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (meetup_id, user_address)
);

-- NFT Listings 테이블
CREATE TABLE nft_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  seller_address TEXT REFERENCES users(wallet_address) ON DELETE SET NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'ALMAN',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sold_at TIMESTAMPTZ
);

-- Leaderboard View
CREATE VIEW leaderboard AS
SELECT
  wallet_address,
  nickname,
  total_points,
  kindness_score,
  level,
  updated_at
FROM users
ORDER BY total_points DESC;

-- 인덱스
CREATE INDEX idx_users_kindness ON users(kindness_score DESC);
CREATE INDEX idx_users_points ON users(total_points DESC);
CREATE INDEX idx_activities_user ON kindness_activities(user_address);
CREATE INDEX idx_activities_type ON kindness_activities(activity_type);
CREATE INDEX idx_meetups_date ON meetups(meeting_date);
CREATE INDEX idx_meetups_status ON meetups(status);
CREATE INDEX idx_listings_status ON nft_listings(status);
CREATE INDEX idx_listings_seller ON nft_listings(seller_address);

-- Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE kindness_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_listings ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can read game_states" ON game_states FOR SELECT USING (true);
CREATE POLICY "Anyone can read kindness_activities" ON kindness_activities FOR SELECT USING (true);
CREATE POLICY "Anyone can read meetups" ON meetups FOR SELECT USING (true);
CREATE POLICY "Anyone can read meetup_participants" ON meetup_participants FOR SELECT USING (true);
CREATE POLICY "Anyone can read nft_listings" ON nft_listings FOR SELECT USING (true);

-- RLS 정책: 쓰기 권한 (Web3Auth 연동 전 임시로 모두 허용)
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Anyone can manage game_states" ON game_states FOR ALL USING (true);
CREATE POLICY "Anyone can insert activities" ON kindness_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can manage meetups" ON meetups FOR ALL USING (true);
CREATE POLICY "Anyone can manage participants" ON meetup_participants FOR ALL USING (true);
CREATE POLICY "Anyone can manage listings" ON nft_listings FOR ALL USING (true);

-- Updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
