-- Remove unnecessary columns from internships table
ALTER TABLE public.internships
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS requirements,
DROP COLUMN IF EXISTS department;