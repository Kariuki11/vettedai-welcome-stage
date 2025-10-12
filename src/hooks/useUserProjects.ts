import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Project {
  id: string;
  role_title: string;
  status: string;
  payment_status: string;
  candidate_count: number;
  created_at: string;
  tier_name?: string;
}

export const useUserProjects = () => {
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      console.log('No user authenticated, skipping project fetch');
      return [];
    }

    console.log('Fetching projects for user:', user.id);

    // First get recruiter ID
    const { data: recruiterData, error: recruiterError } = await supabase
      .from('recruiters')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (recruiterError) {
      console.error('Error fetching recruiter:', recruiterError);
      throw recruiterError;
    }

    if (!recruiterData) {
      console.error('No recruiter profile found for user:', user.id);
      return [];
    }

    console.log('Recruiter found:', recruiterData.id);

    // Then fetch projects for this recruiter
    const { data, error } = await supabase
      .from('projects')
      .select('id, role_title, status, payment_status, candidate_count, created_at, tier_name')
      .eq('recruiter_id', recruiterData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    console.log('Projects fetched:', data?.length || 0);
    return data || [];
  };

  const { data: projects = [], isLoading, refetch } = useQuery({
    queryKey: ['user-projects', user?.id],
    queryFn: fetchProjects,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription for projects
    const channel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        () => {
          console.log('Projects table changed, refetching...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return { projects, isLoading, refetch };
};
