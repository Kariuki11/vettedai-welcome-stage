-- Create RPC to return aggregate metrics for the admin dashboard
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_metrics()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _metrics jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_signups', (SELECT COUNT(*) FROM auth.users),
    'projects_created', (SELECT COUNT(*) FROM public.projects),
    'calls_booked', (SELECT COUNT(*) FROM public.projects WHERE status = 'activation_in_progress'),
    'awaiting_activation', (SELECT COUNT(*) FROM public.projects WHERE status = 'pending_activation')
  )
  INTO _metrics;

  RETURN _metrics;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_metrics TO authenticated;
