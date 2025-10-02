-- Allow candidates to insert their own applications
CREATE POLICY "Anyone can create applications"
ON public.applications
FOR INSERT
WITH CHECK (true);

-- Allow users to view their own submitted applications
CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
USING (candidate_email = (SELECT email FROM auth.users WHERE id = auth.uid()));