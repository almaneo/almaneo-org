-- =============================================
-- AlmaChat Translation Tables
-- Migration: 20260214100000
-- =============================================

-- 1. Translation Cache
-- SHA256 hash-based deduplication for 30-50% cost savings
CREATE TABLE IF NOT EXISTS translation_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  model_used TEXT DEFAULT 'unknown',
  hit_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_lang, target_lang, source_hash)
);

-- Indexes for fast cache lookups
CREATE INDEX IF NOT EXISTS idx_translation_cache_lookup
  ON translation_cache(source_lang, target_lang, source_hash);
CREATE INDEX IF NOT EXISTS idx_translation_cache_hits
  ON translation_cache(hit_count DESC);

-- RPC function to atomically increment cache hit count
CREATE OR REPLACE FUNCTION increment_cache_hit(
  p_source_lang TEXT,
  p_target_lang TEXT,
  p_source_hash TEXT
) RETURNS void AS $$
BEGIN
  UPDATE translation_cache
  SET hit_count = hit_count + 1,
      updated_at = now()
  WHERE source_lang = p_source_lang
    AND target_lang = p_target_lang
    AND source_hash = p_source_hash;
END;
$$ LANGUAGE plpgsql;

-- 2. Translation Feedback
-- User feedback on translation quality (good/bad/correction)
CREATE TABLE IF NOT EXISTS translation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  original_text TEXT NOT NULL,
  machine_translation TEXT NOT NULL,
  suggested_translation TEXT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('good', 'bad', 'correction')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_translation_feedback_user
  ON translation_feedback(user_address);
CREATE INDEX IF NOT EXISTS idx_translation_feedback_type
  ON translation_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_translation_feedback_langs
  ON translation_feedback(source_lang, target_lang);

-- 3. Slang Dictionary
-- Community-contributed slang/trend/culture terms
CREATE TABLE IF NOT EXISTS slang_dictionary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  lang TEXT NOT NULL,
  meaning TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('slang', 'trend', 'culture', 'abbreviation')),
  equivalent JSONB DEFAULT '{}',
  examples TEXT[] DEFAULT '{}',
  added_by TEXT DEFAULT 'system',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(term, lang)
);

CREATE INDEX IF NOT EXISTS idx_slang_dictionary_lang
  ON slang_dictionary(lang);
CREATE INDEX IF NOT EXISTS idx_slang_dictionary_category
  ON slang_dictionary(lang, category);
CREATE INDEX IF NOT EXISTS idx_slang_dictionary_term
  ON slang_dictionary(term);

-- 4. Chat Usage Tracking
-- Per-user monthly usage for quota management
CREATE TABLE IF NOT EXISTS chat_usage (
  user_address TEXT NOT NULL,
  month TEXT NOT NULL,
  messages_sent INTEGER DEFAULT 0,
  translations_used INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  PRIMARY KEY (user_address, month)
);

CREATE INDEX IF NOT EXISTS idx_chat_usage_month
  ON chat_usage(month);

-- =============================================
-- RLS Policies
-- =============================================

-- Translation cache: service role only (server-side access)
ALTER TABLE translation_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on translation_cache"
  ON translation_cache FOR ALL
  USING (auth.role() = 'service_role');

-- Translation feedback: users can insert their own, service role can read all
ALTER TABLE translation_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert feedback"
  ON translation_feedback FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Service role can read all feedback"
  ON translation_feedback FOR SELECT
  USING (auth.role() = 'service_role');

-- Slang dictionary: everyone can read, service role can modify
ALTER TABLE slang_dictionary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read slang dictionary"
  ON slang_dictionary FOR SELECT
  USING (true);
CREATE POLICY "Anyone can submit slang entries"
  ON slang_dictionary FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Service role can update slang dictionary"
  ON slang_dictionary FOR UPDATE
  USING (auth.role() = 'service_role');

-- Chat usage: service role only
ALTER TABLE chat_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on chat_usage"
  ON chat_usage FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- Seed initial slang dictionary entries
-- =============================================

INSERT INTO slang_dictionary (term, lang, meaning, category, equivalent, examples, added_by, verified)
VALUES
  -- Korean slang
  ('ㅋㅋ', 'ko', '웃음 소리 (하하)', 'slang', '{"en":"lol","ja":"笑","zh":"哈哈"}', ARRAY['ㅋㅋㅋ 진짜 웃겨'], 'system', true),
  ('ㅎㅎ', 'ko', '웃음 소리 (호호)', 'slang', '{"en":"hehe","ja":"ふふ"}', ARRAY['ㅎㅎ 귀엽다'], 'system', true),
  ('ㅠㅠ', 'ko', '슬픔/울음 표현', 'slang', '{"en":"T_T","ja":"泣"}', ARRAY['시험 망했어 ㅠㅠ'], 'system', true),
  ('ㄱㅅ', 'ko', '감사 (고마워)', 'abbreviation', '{"en":"thx","ja":"ありがとう"}', ARRAY['도와줘서 ㄱㅅ'], 'system', true),
  ('ㄹㅇ', 'ko', '리얼 (진짜)', 'slang', '{"en":"fr","ja":"マジ"}', ARRAY['ㄹㅇ 맛있다'], 'system', true),
  ('꿀잼', 'ko', '꿀 + 재미 = 매우 재미있다', 'trend', '{"en":"so fun","ja":"超おもろい"}', ARRAY['이 영화 꿀잼이야'], 'system', true),
  ('갑분싸', 'ko', '갑자기 분위기 싸해짐', 'trend', '{"en":"awkward silence","ja":"急に気まずい"}', ARRAY['그 얘기 하니까 갑분싸 됐어'], 'system', true),
  ('인싸', 'ko', '인사이더, 사교적인 사람', 'trend', '{"en":"social butterfly","ja":"リア充"}', ARRAY['넌 완전 인싸야'], 'system', true),

  -- English slang
  ('bruh', 'en', 'Expression of disbelief or exasperation', 'slang', '{"ko":"어이없다","ja":"マジか"}', ARRAY['Bruh, did that just happen?'], 'system', true),
  ('no cap', 'en', 'Not lying, for real', 'slang', '{"ko":"진짜로","ja":"ガチで"}', ARRAY['That was amazing, no cap'], 'system', true),
  ('slay', 'en', 'To do something exceptionally well', 'trend', '{"ko":"찢었다","ja":"最高"}', ARRAY['She absolutely slayed that performance'], 'system', true),
  ('bussin', 'en', 'Really good, usually about food', 'slang', '{"ko":"존맛","ja":"激ウマ"}', ARRAY['This ramen is bussin'], 'system', true),
  ('sus', 'en', 'Suspicious, untrustworthy', 'slang', '{"ko":"수상해","ja":"怪しい"}', ARRAY['That guy is acting real sus'], 'system', true),

  -- Japanese slang
  ('草', 'ja', '笑い（wwwの代わり）', 'slang', '{"en":"lol","ko":"ㅋㅋ","zh":"233"}', ARRAY['それは草'], 'system', true),
  ('エモい', 'ja', '感情的、ノスタルジック', 'trend', '{"en":"emotional","ko":"감성적"}', ARRAY['この曲エモい'], 'system', true),
  ('推し', 'ja', '一番好きな人・推しメン', 'trend', '{"en":"favorite/bias","ko":"최애"}', ARRAY['推しが尊い'], 'system', true),

  -- Chinese slang
  ('666', 'zh', '很厉害、很牛', 'slang', '{"en":"awesome","ko":"대박","ja":"すごい"}', ARRAY['你太666了'], 'system', true),
  ('yyds', 'zh', '永远的神 (Greatest of All Time)', 'abbreviation', '{"en":"GOAT","ko":"갓"}', ARRAY['梅西yyds'], 'system', true),

  -- Thai
  ('555', 'th', 'ฮาฮาฮา (5=ห้า=Ha)', 'slang', '{"en":"hahaha","ko":"ㅋㅋㅋ","ja":"www"}', ARRAY['ตลกมาก 555'], 'system', true),

  -- Spanish
  ('jaja', 'es', 'Risa (equivalente a haha)', 'slang', '{"en":"haha","ko":"ㅋㅋ"}', ARRAY['jajaja qué gracioso'], 'system', true)

ON CONFLICT (term, lang) DO NOTHING;
