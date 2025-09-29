
-- Run this in your Supabase SQL editor
-- Function to increment message count in user sessions

CREATE OR REPLACE FUNCTION increment_session_messages(session_id_param TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.user_sessions 
  SET messages_sent = COALESCE(messages_sent, 0) + 1
  WHERE session_id = session_id_param;
  
  -- If no session exists, this won't do anything (which is fine)
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_session_messages(TEXT) TO anon;
