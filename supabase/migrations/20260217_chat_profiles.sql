-- Chat user profiles (keyed by Stream Chat user ID)
-- Source of truth for profile images, decoupled from Stream SDK

CREATE TABLE IF NOT EXISTS chat_profiles (
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

DROP TRIGGER IF EXISTS chat_profiles_updated_at ON chat_profiles;
CREATE TRIGGER chat_profiles_updated_at
  BEFORE UPDATE ON chat_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_profiles_updated_at();

-- RLS
ALTER TABLE chat_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_profiles' AND policyname = 'Anyone can read profiles') THEN
    CREATE POLICY "Anyone can read profiles" ON chat_profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_profiles' AND policyname = 'Anyone can insert profiles') THEN
    CREATE POLICY "Anyone can insert profiles" ON chat_profiles FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_profiles' AND policyname = 'Anyone can update profiles') THEN
    CREATE POLICY "Anyone can update profiles" ON chat_profiles FOR UPDATE USING (true);
  END IF;
END $$;

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_chat_profiles_user_id ON chat_profiles (user_id);
