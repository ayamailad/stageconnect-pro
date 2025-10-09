-- Add policy to allow interns to view their own internship
CREATE POLICY "Interns can view their own internship"
ON internships
FOR SELECT
USING (
  intern_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);