
-- Performance indexes for better query speed
CREATE INDEX IF NOT EXISTS idx_messages_log_chat_id ON messages_log(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_log_sender_type ON messages_log(sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_log_created_at ON messages_log(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity_log(user_pseudo_id, activity_date);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_messages_log_chat_sender_date ON messages_log(chat_id, sender_type, created_at);
CREATE INDEX IF NOT EXISTS idx_daily_activity_date_chat ON daily_activity_log(activity_date, chat_id);
