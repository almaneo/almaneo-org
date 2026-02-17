-- V0.3 Phase 3: Meetup Recordings & Data Collection
-- Extends meetup lifecycle and adds recording storage

-- 1. Extend meetups.status CHECK constraint to include 'in_progress' and 'ended'
--    Lifecycle: upcoming → in_progress → ended → completed (or cancelled at any point)
ALTER TABLE meetups DROP CONSTRAINT IF EXISTS meetups_status_check;
ALTER TABLE meetups ADD CONSTRAINT meetups_status_check
  CHECK (status IN ('upcoming', 'in_progress', 'ended', 'completed', 'cancelled'));

-- 2. Add lifecycle timestamp columns to meetups
ALTER TABLE meetups ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE meetups ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;

-- 3. Create meetup_recordings table
CREATE TABLE IF NOT EXISTS meetup_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meetup_id UUID NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
  recorder_id TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  duration_seconds INT DEFAULT 0,
  file_size_bytes BIGINT DEFAULT 0,
  format TEXT DEFAULT 'aac',
  status TEXT DEFAULT 'uploading' CHECK (status IN ('uploading', 'uploaded', 'failed', 'processing', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_meetup_recordings_meetup_id ON meetup_recordings (meetup_id);
CREATE INDEX IF NOT EXISTS idx_meetup_recordings_recorder_id ON meetup_recordings (recorder_id);

-- 5. RLS for meetup_recordings
ALTER TABLE meetup_recordings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meetup_recordings' AND policyname = 'Anyone can read recordings') THEN
    CREATE POLICY "Anyone can read recordings" ON meetup_recordings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meetup_recordings' AND policyname = 'Anyone can insert recordings') THEN
    CREATE POLICY "Anyone can insert recordings" ON meetup_recordings FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meetup_recordings' AND policyname = 'Anyone can update recordings') THEN
    CREATE POLICY "Anyone can update recordings" ON meetup_recordings FOR UPDATE USING (true);
  END IF;
END $$;

-- 6. Create meetup-recordings storage bucket (150MB limit, AAC/M4A/WAV)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'meetup-recordings',
  'meetup-recordings',
  true,
  157286400,  -- 150MB
  ARRAY['audio/aac', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/mpeg']
)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage RLS policies for meetup-recordings bucket
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can read meetup recordings') THEN
    CREATE POLICY "Anyone can read meetup recordings"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'meetup-recordings');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can upload meetup recordings') THEN
    CREATE POLICY "Anyone can upload meetup recordings"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'meetup-recordings');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can update meetup recordings') THEN
    CREATE POLICY "Anyone can update meetup recordings"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'meetup-recordings');
  END IF;
END $$;
