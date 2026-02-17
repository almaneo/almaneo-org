-- V0.3: Add channel_id to meetups for Stream Chat integration
-- When a meetup is created, a corresponding Stream Chat channel is auto-created.

ALTER TABLE meetups ADD COLUMN IF NOT EXISTS channel_id TEXT;
CREATE INDEX IF NOT EXISTS idx_meetups_channel_id ON meetups (channel_id);
