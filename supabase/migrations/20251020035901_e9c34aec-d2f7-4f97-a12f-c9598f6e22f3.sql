-- First, delete the specific user's related records
DELETE FROM applications WHERE candidate_email = 'alielmouedden9@gmail.com';
DELETE FROM internships WHERE intern_id = 'f6a40fd1-0445-4c4f-8767-f84ad8b458da';
DELETE FROM profiles WHERE user_id = '64e827cb-adc4-4ae4-bb1d-2cd7af914cdd';

-- Now fix foreign key constraints for future deletions
-- Drop existing foreign keys and recreate with CASCADE
ALTER TABLE internships DROP CONSTRAINT IF EXISTS internships_intern_id_fkey;
ALTER TABLE internships DROP CONSTRAINT IF EXISTS internships_supervisor_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_intern_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_supervisor_id_fkey;
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_intern_id_fkey;

-- Add new foreign keys with CASCADE DELETE
ALTER TABLE internships 
  ADD CONSTRAINT internships_intern_id_fkey 
  FOREIGN KEY (intern_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE internships 
  ADD CONSTRAINT internships_supervisor_id_fkey 
  FOREIGN KEY (supervisor_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE tasks 
  ADD CONSTRAINT tasks_intern_id_fkey 
  FOREIGN KEY (intern_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE tasks 
  ADD CONSTRAINT tasks_supervisor_id_fkey 
  FOREIGN KEY (supervisor_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE attendance 
  ADD CONSTRAINT attendance_intern_id_fkey 
  FOREIGN KEY (intern_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create trigger to automatically delete profile when auth user is deleted
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.profiles WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();