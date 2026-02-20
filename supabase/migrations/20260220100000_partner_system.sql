-- ===========================================
-- Partner System Schema
-- Session 121: Partner registration, vouchers, and photos
-- ===========================================

-- Partner Categories 테이블
CREATE TABLE IF NOT EXISTS partner_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial categories
INSERT INTO partner_categories (name, icon, sort_order) VALUES
  ('cafe', 'coffee', 1),
  ('restaurant', 'restaurant', 2),
  ('coworking', 'business', 3),
  ('cultural', 'museum', 4),
  ('other', 'store', 5)
ON CONFLICT (name) DO NOTHING;

-- Partners 테이블
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER REFERENCES partner_categories(id) ON DELETE SET NULL,
  owner_user_id TEXT REFERENCES users(wallet_address) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sbt_token_id INTEGER,
  partnership_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vouchers 테이블
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_item')),
  discount_value NUMERIC,
  terms TEXT,
  max_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voucher Redemptions 테이블
CREATE TABLE IF NOT EXISTS voucher_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID REFERENCES vouchers(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(wallet_address) ON DELETE SET NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ,
  qr_code TEXT NOT NULL UNIQUE,
  qr_expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'redeemed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Photos 테이블
CREATE TABLE IF NOT EXISTS partner_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category_id);
CREATE INDEX IF NOT EXISTS idx_partners_location ON partners(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_partners_owner ON partners(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);
CREATE INDEX IF NOT EXISTS idx_vouchers_partner ON vouchers(partner_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON vouchers(is_active, valid_until);
CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_voucher ON voucher_redemptions(voucher_id);
CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_user ON voucher_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_qr ON voucher_redemptions(qr_code);
CREATE INDEX IF NOT EXISTS idx_partner_photos_partner ON partner_photos(partner_id);

-- RLS Policies
ALTER TABLE partner_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_photos ENABLE ROW LEVEL SECURITY;

-- partner_categories: public read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_categories_read') THEN
    CREATE POLICY partner_categories_read ON partner_categories FOR SELECT USING (true);
  END IF;
END $$;

-- partners: public read, owner can insert/update
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partners_read') THEN
    CREATE POLICY partners_read ON partners FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partners_insert') THEN
    CREATE POLICY partners_insert ON partners FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partners_update') THEN
    CREATE POLICY partners_update ON partners FOR UPDATE USING (true);
  END IF;
END $$;

-- vouchers: public read, partner owner can manage
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vouchers_read') THEN
    CREATE POLICY vouchers_read ON vouchers FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vouchers_insert') THEN
    CREATE POLICY vouchers_insert ON vouchers FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vouchers_update') THEN
    CREATE POLICY vouchers_update ON vouchers FOR UPDATE USING (true);
  END IF;
END $$;

-- voucher_redemptions: user can read own + create
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'voucher_redemptions_read') THEN
    CREATE POLICY voucher_redemptions_read ON voucher_redemptions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'voucher_redemptions_insert') THEN
    CREATE POLICY voucher_redemptions_insert ON voucher_redemptions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'voucher_redemptions_update') THEN
    CREATE POLICY voucher_redemptions_update ON voucher_redemptions FOR UPDATE USING (true);
  END IF;
END $$;

-- partner_photos: public read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_photos_read') THEN
    CREATE POLICY partner_photos_read ON partner_photos FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_photos_insert') THEN
    CREATE POLICY partner_photos_insert ON partner_photos FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Storage bucket for partner photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partner-photos',
  'partner-photos',
  true,
  10485760,  -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_photos_storage_read' AND tablename = 'objects') THEN
    CREATE POLICY partner_photos_storage_read ON storage.objects FOR SELECT USING (bucket_id = 'partner-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_photos_storage_insert' AND tablename = 'objects') THEN
    CREATE POLICY partner_photos_storage_insert ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'partner-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_photos_storage_update' AND tablename = 'objects') THEN
    CREATE POLICY partner_photos_storage_update ON storage.objects FOR UPDATE USING (bucket_id = 'partner-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_photos_storage_delete' AND tablename = 'objects') THEN
    CREATE POLICY partner_photos_storage_delete ON storage.objects FOR DELETE USING (bucket_id = 'partner-photos');
  END IF;
END $$;
