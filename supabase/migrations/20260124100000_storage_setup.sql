-- ===========================================
-- AlmaNEO Storage Setup
-- Meetup Photos Bucket & RLS Policies
-- ===========================================

-- 1. meetup-photos 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'meetup-photos',
  'meetup-photos',
  true,  -- 공개 버킷 (누구나 읽기 가능)
  5242880,  -- 5MB 제한
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS 정책 활성화
-- (storage.objects 테이블에 이미 RLS가 활성화되어 있음)

-- 3. 읽기 정책: 누구나 meetup-photos 버킷의 파일 읽기 가능
CREATE POLICY "Anyone can view meetup photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'meetup-photos');

-- 4. 업로드 정책: 인증된 사용자만 업로드 가능
-- (현재 Web3Auth 연동 전이므로 임시로 모두 허용)
CREATE POLICY "Anyone can upload meetup photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'meetup-photos');

-- 5. 업데이트 정책: 자신이 업로드한 파일만 수정 가능
-- (임시로 모두 허용)
CREATE POLICY "Anyone can update meetup photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'meetup-photos');

-- 6. 삭제 정책: 자신이 업로드한 파일만 삭제 가능
-- (임시로 모두 허용)
CREATE POLICY "Anyone can delete meetup photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'meetup-photos');

-- 7. Meetups 테이블에 검증 관련 컬럼 추가
ALTER TABLE meetups ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE meetups ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE meetups ADD COLUMN IF NOT EXISTS verified_by TEXT;
ALTER TABLE meetups ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- 8. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_meetups_verified ON meetups(verified);
