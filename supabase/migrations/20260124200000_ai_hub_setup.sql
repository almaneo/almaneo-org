-- AI Hub 테이블 생성
-- 대화, 메시지, 일일 쿼터 관리

-- ============================================
-- 1. ai_hub_conversations 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS ai_hub_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat',
  model TEXT DEFAULT 'gemini-2.5-flash',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_ai_hub_conversations_user
  ON ai_hub_conversations(user_address);
CREATE INDEX IF NOT EXISTS idx_ai_hub_conversations_updated
  ON ai_hub_conversations(updated_at DESC);

-- RLS 활성화
ALTER TABLE ai_hub_conversations ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 대화만 접근 가능
CREATE POLICY "Users can view own conversations"
  ON ai_hub_conversations FOR SELECT
  USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can create own conversations"
  ON ai_hub_conversations FOR INSERT
  WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own conversations"
  ON ai_hub_conversations FOR UPDATE
  USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own conversations"
  ON ai_hub_conversations FOR DELETE
  USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- anon 사용자를 위한 정책 (wallet_address 기반)
CREATE POLICY "Anon users can view conversations by address"
  ON ai_hub_conversations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can create conversations"
  ON ai_hub_conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can update conversations by address"
  ON ai_hub_conversations FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Anon users can delete conversations by address"
  ON ai_hub_conversations FOR DELETE
  TO anon
  USING (true);

-- ============================================
-- 2. ai_hub_messages 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS ai_hub_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_hub_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_ai_hub_messages_conversation
  ON ai_hub_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_hub_messages_created
  ON ai_hub_messages(conversation_id, created_at ASC);

-- RLS 활성화
ALTER TABLE ai_hub_messages ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 대화 소유자만 메시지 접근 가능
CREATE POLICY "Users can view messages of own conversations"
  ON ai_hub_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM ai_hub_conversations
      WHERE user_address = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON ai_hub_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM ai_hub_conversations
      WHERE user_address = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- anon 사용자를 위한 정책
CREATE POLICY "Anon users can view messages"
  ON ai_hub_messages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can create messages"
  ON ai_hub_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================
-- 3. ai_hub_quota 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS ai_hub_quota (
  user_address TEXT PRIMARY KEY REFERENCES users(wallet_address) ON DELETE CASCADE,
  queries_used INTEGER DEFAULT 0,
  quota_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE ai_hub_quota ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 쿼터만 접근 가능
CREATE POLICY "Users can view own quota"
  ON ai_hub_quota FOR SELECT
  USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can create own quota"
  ON ai_hub_quota FOR INSERT
  WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own quota"
  ON ai_hub_quota FOR UPDATE
  USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- anon 사용자를 위한 정책
CREATE POLICY "Anon users can view quota"
  ON ai_hub_quota FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can upsert quota"
  ON ai_hub_quota FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can update quota"
  ON ai_hub_quota FOR UPDATE
  TO anon
  USING (true);

-- ============================================
-- 4. 트리거: updated_at 자동 업데이트
-- ============================================
CREATE OR REPLACE FUNCTION update_ai_hub_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ai_hub_conversations_updated_at
  BEFORE UPDATE ON ai_hub_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_hub_updated_at();

CREATE TRIGGER ai_hub_quota_updated_at
  BEFORE UPDATE ON ai_hub_quota
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_hub_updated_at();

-- ============================================
-- 5. 함수: 일일 쿼터 체크 및 증가
-- ============================================
CREATE OR REPLACE FUNCTION check_and_increment_quota(p_user_address TEXT, p_daily_limit INTEGER DEFAULT 50)
RETURNS TABLE(can_proceed BOOLEAN, current_used INTEGER, daily_limit INTEGER) AS $$
DECLARE
  v_quota_record ai_hub_quota%ROWTYPE;
BEGIN
  -- 기존 쿼터 조회 또는 생성
  SELECT * INTO v_quota_record FROM ai_hub_quota WHERE user_address = p_user_address;

  IF NOT FOUND THEN
    -- 새 사용자: 쿼터 레코드 생성
    INSERT INTO ai_hub_quota (user_address, queries_used, quota_date)
    VALUES (p_user_address, 1, CURRENT_DATE)
    RETURNING * INTO v_quota_record;

    RETURN QUERY SELECT true, 1, p_daily_limit;
    RETURN;
  END IF;

  -- 날짜가 다르면 리셋
  IF v_quota_record.quota_date < CURRENT_DATE THEN
    UPDATE ai_hub_quota
    SET queries_used = 1, quota_date = CURRENT_DATE
    WHERE user_address = p_user_address;

    RETURN QUERY SELECT true, 1, p_daily_limit;
    RETURN;
  END IF;

  -- 쿼터 체크
  IF v_quota_record.queries_used >= p_daily_limit THEN
    RETURN QUERY SELECT false, v_quota_record.queries_used, p_daily_limit;
    RETURN;
  END IF;

  -- 쿼터 증가
  UPDATE ai_hub_quota
  SET queries_used = queries_used + 1
  WHERE user_address = p_user_address;

  RETURN QUERY SELECT true, v_quota_record.queries_used + 1, p_daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. 30일 이후 대화 자동 삭제 (cron job용)
-- ============================================
CREATE OR REPLACE FUNCTION delete_old_conversations()
RETURNS void AS $$
BEGIN
  DELETE FROM ai_hub_conversations
  WHERE updated_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 코멘트 추가
COMMENT ON TABLE ai_hub_conversations IS 'AI Hub 대화 목록';
COMMENT ON TABLE ai_hub_messages IS 'AI Hub 대화 메시지';
COMMENT ON TABLE ai_hub_quota IS 'AI Hub 일일 사용 쿼터';
COMMENT ON FUNCTION check_and_increment_quota IS '일일 쿼터 체크 및 증가 함수';
COMMENT ON FUNCTION delete_old_conversations IS '30일 이상 오래된 대화 삭제 (cron job용)';
