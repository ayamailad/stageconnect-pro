-- Create storage bucket for applications
INSERT INTO storage.buckets (id, name, public) VALUES ('applications', 'applications', false);

-- Create storage policies for applications bucket
CREATE POLICY "Users can upload their own application files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'applications' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own application files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'applications' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all application files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'applications' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));