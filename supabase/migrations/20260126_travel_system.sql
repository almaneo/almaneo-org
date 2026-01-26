-- ===========================================
-- World Travel System - Migration
-- Adds travel_state JSONB column to game_states
-- ===========================================

-- Add travel_state column to game_states
-- Stores: countryProgress, startingRegion, totalStars
ALTER TABLE game_states
ADD COLUMN IF NOT EXISTS travel_state JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN game_states.travel_state IS 'World Travel game state: { countryProgress, startingRegion, totalStars }';
