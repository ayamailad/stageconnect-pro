-- Remove title and department columns from themes table to match specification
ALTER TABLE public.themes
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS department;

-- Make description NOT NULL since it's now the primary identifier
ALTER TABLE public.themes
ALTER COLUMN description SET NOT NULL;