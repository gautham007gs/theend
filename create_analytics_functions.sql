-- Create function to get daily message counts
CREATE OR REPLACE FUNCTION get_daily_message_counts(start_date DATE)
RETURNS TABLE(date DATE, messages BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as messages
  FROM messages_log 
  WHERE DATE(created_at) >= start_date
  GROUP BY DATE(created_at)
  ORDER BY DATE(created_at);
END;
$$ LANGUAGE plpgsql;

-- Create function to get daily active user counts
CREATE OR REPLACE FUNCTION get_daily_active_user_counts(start_date DATE)
RETURNS TABLE(date DATE, active_users BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    activity_date as date,
    COUNT(DISTINCT user_pseudo_id) as active_users
  FROM daily_activity_log 
  WHERE activity_date >= start_date
  GROUP BY activity_date
  ORDER BY activity_date;
END;
$$ LANGUAGE plpgsql;

-- Create daily_analytics table for aggregated metrics
CREATE TABLE IF NOT EXISTS daily_analytics (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  message_count INTEGER DEFAULT 0,
  response_time FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data if tables are empty
INSERT INTO daily_analytics (date, message_count, response_time) 
SELECT 
  CURRENT_DATE - INTERVAL '6 days' + (n || ' days')::INTERVAL,
  (20 + n * 5 + FLOOR(RANDOM() * 10))::INTEGER,
  (850 + FLOOR(RANDOM() * 200))::FLOAT
FROM generate_series(0, 6) n
ON CONFLICT (date) DO NOTHING;
