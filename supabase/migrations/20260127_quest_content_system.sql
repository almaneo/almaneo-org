-- ===========================================
-- Quest Content System - DB Migration
-- Moves hardcoded quest/culture data to Supabase
-- Supports: multi-language, versioning, appeal system
-- ===========================================

-- ========== REGIONS ==========
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,                    -- 'east_asia', 'southeast_asia', ...
  emoji TEXT NOT NULL,                    -- '🏯'
  color TEXT NOT NULL,                    -- '#FF6B6B'
  unlock_requirement INT DEFAULT 0,       -- total stars needed to unlock
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========== COUNTRIES ==========
CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,                    -- 'kr', 'jp', 'cn', ...
  region_id TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  flag TEXT NOT NULL,                     -- '🇰🇷'
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========== QUESTS ==========
CREATE TABLE IF NOT EXISTS quests (
  id TEXT PRIMARY KEY,                    -- 'kr-q1', 'jp-q2', ...
  country_id TEXT NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cultural_scenario', 'trivia_quiz', 'cultural_practice', 'history_lesson')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points INT NOT NULL DEFAULT 50,
  quest_data JSONB NOT NULL,             -- type-specific data (default/en)
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  version INT DEFAULT 1,                 -- version tracking for AI MCP
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========== CONTENT TRANSLATIONS ==========
-- Unified translation table for regions, countries, and quests
CREATE TABLE IF NOT EXISTS content_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('region', 'country', 'quest')),
  content_id TEXT NOT NULL,               -- references regions.id / countries.id / quests.id
  language TEXT NOT NULL,                 -- 'ko', 'en', 'zh', 'ja', ...
  translations JSONB NOT NULL,           -- language-specific text fields
  verified BOOLEAN DEFAULT false,
  verified_by TEXT,                       -- reviewer wallet address
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(content_type, content_id, language)
);

-- ========== CONTENT APPEALS ==========
-- Users can report incorrect cultural information and suggest corrections
CREATE TABLE IF NOT EXISTS content_appeals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,             -- submitter wallet address
  content_type TEXT NOT NULL CHECK (content_type IN ('region', 'country', 'quest')),
  content_id TEXT NOT NULL,               -- target content id
  language TEXT NOT NULL DEFAULT 'en',    -- target language
  field_path TEXT NOT NULL,               -- field being corrected (e.g. 'quest_data.question')
  current_value TEXT,                     -- current (incorrect) value
  suggested_value TEXT NOT NULL,          -- proposed correction
  reason TEXT NOT NULL,                   -- explanation why it's wrong
  source_url TEXT,                        -- reference URL for correction
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'duplicate')),
  reviewer_address TEXT,                  -- admin who reviewed
  reviewer_note TEXT,                     -- review comment
  kindness_points_rewarded INT DEFAULT 0, -- Kindness Score reward (approved)
  game_points_rewarded INT DEFAULT 0,     -- Game points reward (approved)
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_countries_region ON countries(region_id);
CREATE INDEX IF NOT EXISTS idx_quests_country ON quests(country_id);
CREATE INDEX IF NOT EXISTS idx_quests_type ON quests(type);
CREATE INDEX IF NOT EXISTS idx_quests_active ON quests(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON content_translations(content_type, content_id, language);
CREATE INDEX IF NOT EXISTS idx_translations_language ON content_translations(language);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON content_appeals(status);
CREATE INDEX IF NOT EXISTS idx_appeals_user ON content_appeals(user_address);
CREATE INDEX IF NOT EXISTS idx_appeals_content ON content_appeals(content_type, content_id);

-- ========== RLS POLICIES ==========
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_appeals ENABLE ROW LEVEL SECURITY;

-- Read access: public (anyone can read content)
CREATE POLICY "regions_read" ON regions FOR SELECT USING (true);
CREATE POLICY "countries_read" ON countries FOR SELECT USING (true);
CREATE POLICY "quests_read" ON quests FOR SELECT USING (true);
CREATE POLICY "translations_read" ON content_translations FOR SELECT USING (true);
CREATE POLICY "appeals_read" ON content_appeals FOR SELECT USING (true);

-- Write access: authenticated users can submit appeals
CREATE POLICY "appeals_insert" ON content_appeals FOR INSERT WITH CHECK (true);

-- Update access: only admin can modify content and review appeals
-- (For now, permissive - will restrict with auth later)
CREATE POLICY "regions_write" ON regions FOR ALL USING (true);
CREATE POLICY "countries_write" ON countries FOR ALL USING (true);
CREATE POLICY "quests_write" ON quests FOR ALL USING (true);
CREATE POLICY "translations_write" ON content_translations FOR ALL USING (true);
CREATE POLICY "appeals_update" ON content_appeals FOR UPDATE USING (true);

-- ========== TRIGGERS ==========
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER regions_updated_at
  BEFORE UPDATE ON regions
  FOR EACH ROW EXECUTE FUNCTION update_content_timestamp();

CREATE TRIGGER countries_updated_at
  BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_content_timestamp();

CREATE TRIGGER quests_updated_at
  BEFORE UPDATE ON quests
  FOR EACH ROW EXECUTE FUNCTION update_content_timestamp();

CREATE TRIGGER translations_updated_at
  BEFORE UPDATE ON content_translations
  FOR EACH ROW EXECUTE FUNCTION update_content_timestamp();

-- Auto-increment quest version on data change
CREATE OR REPLACE FUNCTION increment_quest_version()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.quest_data IS DISTINCT FROM NEW.quest_data THEN
    NEW.version = OLD.version + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quests_version_increment
  BEFORE UPDATE ON quests
  FOR EACH ROW EXECUTE FUNCTION increment_quest_version();

-- ========== COMMENTS (AI MCP metadata) ==========
COMMENT ON TABLE regions IS 'World regions for cultural travel game. 8 regions spanning all continents.';
COMMENT ON TABLE countries IS 'Countries with cultural data. Each belongs to one region.';
COMMENT ON TABLE quests IS 'Cultural quests: scenarios, quizzes, practices, history lessons. AI-trainable cultural knowledge.';
COMMENT ON TABLE content_translations IS 'Multi-language translations for all content. JSONB structure varies by content_type.';
COMMENT ON TABLE content_appeals IS 'User-submitted corrections to cultural content. Community-verified knowledge improvement.';
COMMENT ON COLUMN quests.version IS 'Auto-incremented when quest_data changes. For AI training data versioning.';
COMMENT ON COLUMN quests.quest_data IS 'Type-specific quest content in default language (en). Structure depends on quest type.';
