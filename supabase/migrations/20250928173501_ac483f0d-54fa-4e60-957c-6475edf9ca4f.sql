-- Fix infinite recursion in RLS policies by creating security definer function
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Supervisors can view intern profiles" ON public.profiles;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Create new policies using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Supervisors can view intern profiles" 
ON public.profiles 
FOR SELECT 
USING (
  role = 'intern' AND 
  public.get_user_role(auth.uid()) IN ('supervisor', 'admin')
);

-- Also fix the applications policy that has the same issue
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;

CREATE POLICY "Admins can view all applications" 
ON public.applications 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin');