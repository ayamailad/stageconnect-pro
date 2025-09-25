-- Insert 20 test users with different roles for testing
-- Note: These are test users with weak passwords for development only

-- Create auth users first (using service role key functionality)
-- Admin users (3)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  (gen_random_uuid(), 'admin1@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "admin", "first_name": "Admin", "last_name": "One"}'),
  (gen_random_uuid(), 'admin2@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "admin", "first_name": "Admin", "last_name": "Two"}'),
  (gen_random_uuid(), 'admin3@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "admin", "first_name": "Admin", "last_name": "Three"}');

-- Supervisor users (5)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  (gen_random_uuid(), 'supervisor1@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "supervisor", "first_name": "Supervisor", "last_name": "One"}'),
  (gen_random_uuid(), 'supervisor2@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "supervisor", "first_name": "Supervisor", "last_name": "Two"}'),
  (gen_random_uuid(), 'supervisor3@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "supervisor", "first_name": "Supervisor", "last_name": "Three"}'),
  (gen_random_uuid(), 'supervisor4@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "supervisor", "first_name": "Supervisor", "last_name": "Four"}'),
  (gen_random_uuid(), 'supervisor5@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "supervisor", "first_name": "Supervisor", "last_name": "Five"}');

-- Intern users (8)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  (gen_random_uuid(), 'intern1@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "intern", "first_name": "Intern", "last_name": "One"}'),
  (gen_random_uuid(), 'intern2@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "intern", "first_name": "Intern", "last_name": "Two"}'),
  (gen_random_uuid(), 'intern3@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "intern", "first_name": "Intern", "last_name": "Three"}'),
  (gen_random_uuid(), 'intern4@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "intern", "first_name": "Intern", "last_name": "Four"}'),
  (gen_random_uuid(), 'intern5@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "intern", "first_name": "Intern", "last_name": "Five"}'),
  (gen_random_uuid(), 'intern6@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "intern", "first_name": "Intern", "last_name": "Six"}'),
  (gen_random_uuid(), 'intern7@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "intern", "first_name": "Intern", "last_name": "Seven"}'),
  (gen_random_uuid(), 'intern8@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "intern", "first_name": "Intern", "last_name": "Eight"}');

-- Candidate users (4) 
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  (gen_random_uuid(), 'candidate1@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "candidate", "first_name": "Candidate", "last_name": "One"}'),
  (gen_random_uuid(), 'candidate2@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "candidate", "first_name": "Candidate", "last_name": "Two"}'),
  (gen_random_uuid(), 'candidate3@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "candidate", "first_name": "Candidate", "last_name": "Three"}'),
  (gen_random_uuid(), 'candidate4@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"role": "candidate", "first_name": "Candidate", "last_name": "Four"}');