
-- Performance optimization indexes for analytics queries
-- Run this in Supabase SQL Editor to speed up analytics

-- Index for messages_log queries
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON messages_log(sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_created_sender ON messages_log(created_at DESC, sender_type);

-- Index for user_sessions queries
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON user_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON user_sessions(is_active) WHERE is_active = true;

-- Index for daily_activity_log
CREATE INDEX IF NOT EXISTS idx_daily_activity_date ON daily_activity_log(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user ON daily_activity_log(user_pseudo_id);

-- Index for user_journey_steps
CREATE INDEX IF NOT EXISTS idx_journey_completed_at ON user_journey_steps(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_journey_step_name ON user_journey_steps(step_name);

-- Index for user_analytics
CREATE INDEX IF NOT EXISTS idx_user_analytics_device ON user_analytics(device_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_country ON user_analytics(country_name);

-- Index for page_views
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);

-- Index for ad_interactions
CREATE INDEX IF NOT EXISTS idx_ad_interactions_timestamp ON ad_interactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ad_interactions_action ON ad_interactions(action_type);

-- Analyze tables to update statistics
ANALYZE messages_log;
ANALYZE user_sessions;
ANALYZE daily_activity_log;
ANALYZE user_journey_steps;
ANALYZE user_analytics;
ANALYZE page_views;
ANALYZE ad_interactions;
