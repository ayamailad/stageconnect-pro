-- Add a column to store assigned internship IDs in the themes table
ALTER TABLE public.themes
ADD COLUMN IF NOT EXISTS member_internship_ids uuid[] DEFAULT ARRAY[]::uuid[];

COMMENT ON COLUMN public.themes.member_internship_ids IS 'Array of internship IDs assigned to this theme';