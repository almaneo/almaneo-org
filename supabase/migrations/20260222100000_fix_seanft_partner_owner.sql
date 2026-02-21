-- ===========================================
-- Session 129: Fix seanft.io@gmail.com partner owner_user_id
-- ===========================================

-- 1. Ensure user exists in users table
INSERT INTO users (wallet_address, nickname)
VALUES ('0x73c544e63bc19b4fed62cf47d659e2aea175c2aa', 'seanft.io')
ON CONFLICT (wallet_address) DO NOTHING;

-- 2. Fix partners with social login ID as owner_user_id
-- AlmaChat previously stored Stream Chat ID (email-based) instead of wallet address
UPDATE partners
SET owner_user_id = '0x73c544e63bc19b4fed62cf47d659e2aea175c2aa'
WHERE owner_user_id = 'seanft_io_gmail_com';
