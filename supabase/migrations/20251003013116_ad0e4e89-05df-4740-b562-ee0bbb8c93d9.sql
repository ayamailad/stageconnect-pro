-- Drop the old duration check constraint
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_duration_months_check;

-- Add new constraint allowing 1-6 months
ALTER TABLE applications ADD CONSTRAINT applications_duration_months_check 
  CHECK (duration_months >= 1 AND duration_months <= 6);

-- Add user_id column to link applications to users
ALTER TABLE applications ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);