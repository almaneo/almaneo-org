-- ===========================================
-- Partner System Expansion
-- Session 123: Photo upload, edit/delete, voucher creation
-- ===========================================

-- 1. Add uploaded_by and caption to partner_photos
ALTER TABLE partner_photos ADD COLUMN IF NOT EXISTS uploaded_by TEXT;
ALTER TABLE partner_photos ADD COLUMN IF NOT EXISTS caption TEXT;

-- 2. Add missing RLS policies for partner_photos (UPDATE, DELETE)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_photos_update') THEN
    CREATE POLICY partner_photos_update ON partner_photos FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_photos_delete') THEN
    CREATE POLICY partner_photos_delete ON partner_photos FOR DELETE USING (true);
  END IF;
END $$;

-- 3. Add missing DELETE policy for vouchers
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'vouchers_delete') THEN
    CREATE POLICY vouchers_delete ON vouchers FOR DELETE USING (true);
  END IF;
END $$;

-- 4. Create increment_voucher_redemptions RPC (referenced but never created)
CREATE OR REPLACE FUNCTION increment_voucher_redemptions(voucher_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE vouchers
  SET current_redemptions = COALESCE(current_redemptions, 0) + 1
  WHERE id = voucher_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Auto-update updated_at trigger for partners
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'partners_updated_at_trigger') THEN
    CREATE TRIGGER partners_updated_at_trigger
      BEFORE UPDATE ON partners
      FOR EACH ROW EXECUTE FUNCTION update_partners_updated_at();
  END IF;
END $$;

-- 6. Add DELETE policy for partners (for deactivation updates already covered by update policy)
-- No additional policy needed - soft-delete uses UPDATE which is already allowed.
