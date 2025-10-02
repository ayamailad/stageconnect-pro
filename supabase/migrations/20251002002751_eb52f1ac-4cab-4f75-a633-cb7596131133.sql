-- Drop the problematic policy that accesses auth.users
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;

-- Recreate it without accessing auth.users directly
-- Instead, users can view applications where their email matches
CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
USING (
  candidate_email = (
    SELECT email 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);