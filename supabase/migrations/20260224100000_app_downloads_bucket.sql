-- App Downloads Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-downloads',
  'app-downloads',
  true,
  104857600,  -- 100MB limit
  ARRAY['application/vnd.android.package-archive', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Public read access (anyone can download)
CREATE POLICY "Public download access"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-downloads');

-- Only service role can upload (manual upload via CLI/Dashboard)
CREATE POLICY "Service role upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'app-downloads' AND auth.role() = 'service_role');
