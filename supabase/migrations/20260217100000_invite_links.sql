-- Invite Links System for AlmaChat
-- V0.3 Phase 2: 초대 링크 시스템

-- 초대 링크 테이블
CREATE TABLE IF NOT EXISTS invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  channel_id TEXT NOT NULL,
  channel_type TEXT DEFAULT 'messaging',
  created_by TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  max_uses INT DEFAULT 0,  -- 0 = unlimited
  use_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_invite_links_code ON invite_links (code);
CREATE INDEX IF NOT EXISTS idx_invite_links_channel ON invite_links (channel_id);
CREATE INDEX IF NOT EXISTS idx_invite_links_created_by ON invite_links (created_by);

-- RLS
ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read invite links"
  ON invite_links FOR SELECT USING (true);

CREATE POLICY "Anyone can insert invite links"
  ON invite_links FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update invite links"
  ON invite_links FOR UPDATE USING (true);
