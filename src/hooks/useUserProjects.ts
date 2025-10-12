import { useEffect, useState } from "react";
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        console.log('No user authenticated, skipping project fetch');
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching projects for user:', user.id);

        // First get recruiter ID
        const { data: recruiterData, error: recruiterError } = await supabase
          .from('recruiters')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (recruiterError) {
          console.error('Error fetching recruiter:', recruiterError);
          setProjects([]);
          setIsLoading(false);
          return;
        }

        if (!recruiterData) {
          console.error('No recruiter profile found for user:', user.id);
          setProjects([]);
          setIsLoading(false);
          return;
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
        setProjects(data || []);
      } catch (error: any) {
        console.error('Error in fetchProjects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

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
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { projects, isLoading };
}
