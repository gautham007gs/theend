
# Authentication Setup Guide

## Supabase RLS Policies for Admin Protection

To secure your admin endpoints, set up Row Level Security policies in Supabase:

### 1. Create Admin Users Table

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read admin_users
CREATE POLICY "Admins can read admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());
```

### 2. Secure app_configurations Table

```sql
-- Enable RLS on app_configurations
ALTER TABLE app_configurations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read configurations (for AI profile, etc.)
CREATE POLICY "Public read access"
  ON app_configurations FOR SELECT
  TO public
  USING (true);

-- Policy: Only admins can insert/update configurations
CREATE POLICY "Admin write access"
  ON app_configurations FOR INSERT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admin update access"
  ON app_configurations FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
```

### 3. Secure Storage Buckets

```sql
-- In Supabase Dashboard > Storage > Policies

-- For media-images bucket:
-- INSERT policy: Only authenticated admins
-- UPDATE policy: Only authenticated admins
-- DELETE policy: Only authenticated admins
-- SELECT policy: Public read access
```

### 4. Create Your First Admin User

```sql
-- After creating a user via Supabase Auth, add them to admin_users:
INSERT INTO admin_users (id, email)
VALUES ('YOUR_USER_UUID', 'admin@example.com');
```

## Frontend Implementation

The authentication system now:
- Uses Supabase Auth for login
- Verifies sessions server-side on API routes
- Protects admin routes with proper authentication checks
- Stores minimal session info client-side

## Testing

1. Login at `/admin/login` with your Supabase admin credentials
2. Try accessing protected endpoints - should require valid session
3. Logout and try again - should be denied

## Security Notes

- Never commit `.env.local` with real credentials
- Use Supabase's built-in session management
- RLS policies provide defense-in-depth
- Rate limiting is still active for all endpoints
