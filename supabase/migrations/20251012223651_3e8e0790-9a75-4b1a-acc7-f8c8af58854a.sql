-- Create function to fetch projects for current user
CREATE OR REPLACE FUNCTION public.get_projects_for_current_user()
RETURNS TABLE (
  id uuid,
  role_title text,
  status text,
  payment_status text,
  candidate_count integer,
  created_at timestamptz,
  tier_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.role_title,
    p.status,
    p.payment_status,
    COALESCE(p.candidate_count, 0) as candidate_count,
    p.created_at,
    p.tier_name
  FROM public.projects p
  JOIN public.recruiters r ON r.id = p.recruiter_id
  WHERE r.user_id = auth.uid()
  ORDER BY p.created_at DESC NULLS LAST
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_projects_for_current_user() TO anon, authenticated;