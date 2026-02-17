-- Chat user profiles (keyed by Stream Chat user ID)
-- Source of truth for profile images, decoupled from Stream SDK

CREATE TABLE chat_profiles (
  user_id TEXT PRIMARY KEY,
  profile_image_url TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_chat_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chat_profiles_updated_at
  BEFORE UPDATE ON chat_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_profiles_updated_at();

-- RLS
ALTER TABLE chat_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
  ON chat_profiles FOR SELECT USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON chat_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON chat_profiles FOR UPDATE USING (true);

-- Index for quick lookups
CREATE INDEX idx_chat_profiles_user_id ON chat_profiles (user_id);
