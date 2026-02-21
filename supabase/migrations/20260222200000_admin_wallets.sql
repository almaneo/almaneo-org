-- ===========================================
-- Session 129: Admin Wallets Management Table
-- ===========================================

-- Table for dynamic admin wallet access control
CREATE TABLE admin_wallets (
  wallet_address TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'verifier' CHECK (role IN ('foundation', 'verifier')),
  label TEXT,
  added_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed existing admin wallets
INSERT INTO admin_wallets (wallet_address, role, label) VALUES
  ('0x7BD8194c22b79B0BBa6B2AFDfe36c658707024FE', 'foundation', 'Foundation'),
  ('0x30073c2f47D41539dA6147324bb9257E0638144E', 'verifier', 'Verifier');

-- RLS: public read/write (client-side Foundation check enforced in UI)
ALTER TABLE admin_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin_wallets"
  ON admin_wallets FOR SELECT USING (true);

CREATE POLICY "Anyone can insert admin_wallets"
  ON admin_wallets FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete admin_wallets"
  ON admin_wallets FOR DELETE USING (true);
