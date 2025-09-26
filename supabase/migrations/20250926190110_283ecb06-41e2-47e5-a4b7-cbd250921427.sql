-- Remove the incorrectly created test users
DELETE FROM auth.users WHERE email LIKE '%@test.com';

-- We'll create users through the proper Supabase auth system instead
-- This migration just cleans up the incorrect entries