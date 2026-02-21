-- ===========================================
-- Session 129: Fix partner owner_user_id
-- ===========================================

-- 1. Ensure user exists in users table (auto-created by stream-token API going forward)
INSERT INTO users (wallet_address, nickname)
VALUES ('0x2243ce77226d283ccc519fbbaaccb88764ff7e02', 'Ruca Lee')
ON CONFLICT (wallet_address) DO NOTHING;

-- 2. Fix any partners created by this user that have null owner_user_id
-- (The AlmaChat app previously stored Stream Chat ID which didn't match users.wallet_address FK)
UPDATE partners
SET owner_user_id = '0x2243ce77226d283ccc519fbbaaccb88764ff7e02'
WHERE owner_user_id IS NULL
  AND created_at >= '2026-02-21'::date;
