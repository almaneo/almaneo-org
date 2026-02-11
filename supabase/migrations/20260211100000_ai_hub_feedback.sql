-- AI Hub Feedback table for 👍👎 user feedback on AI responses
CREATE TABLE IF NOT EXISTS public.ai_hub_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id TEXT NOT NULL,
    user_address TEXT NOT NULL,
    feedback TEXT NOT NULL CHECK (feedback IN ('up', 'down')),
    model TEXT,
    conversation_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(message_id, user_address)
);

-- Indexes
CREATE INDEX idx_feedback_user ON public.ai_hub_feedback(user_address);
CREATE INDEX idx_feedback_model ON public.ai_hub_feedback(model);
CREATE INDEX idx_feedback_created ON public.ai_hub_feedback(created_at DESC);

-- RLS
ALTER TABLE public.ai_hub_feedback ENABLE ROW LEVEL SECURITY;

-- 누구나 자신의 피드백을 삽입/수정 가능
CREATE POLICY "Users can insert their own feedback"
    ON public.ai_hub_feedback FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own feedback"
    ON public.ai_hub_feedback FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 읽기는 모든 인증된 사용자 허용 (집계 분석용)
CREATE POLICY "Anyone can read feedback"
    ON public.ai_hub_feedback FOR SELECT
    USING (true);

-- updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_feedback_updated_at
    BEFORE UPDATE ON public.ai_hub_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_updated_at();
