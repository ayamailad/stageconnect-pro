-- Add theme_id to internships table to link internships to themes
ALTER TABLE public.internships 
ADD COLUMN theme_id uuid REFERENCES public.themes(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_internships_theme_id ON public.internships(theme_id);

-- Update RLS policies to allow supervisors to view internships linked to their themes
CREATE POLICY "Supervisors can view internships linked to their themes"
ON public.internships
FOR SELECT
TO authenticated
USING (
  theme_id IN (
    SELECT id 
    FROM public.themes 
    WHERE supervisor_id IN (
      SELECT id 
      FROM public.profiles 
      WHERE user_id = auth.uid()
    )
  )
);