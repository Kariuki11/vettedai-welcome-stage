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
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        // First get recruiter ID
        const { data: recruiterData, error: recruiterError } = await supabase
          .from('recruiters')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (recruiterError || !recruiterData) {
          setProjects([]);
          setIsLoading(false);
          return;
        }

        // Then fetch projects for this recruiter
        const { data, error } = await supabase
          .from('projects')
          .select('id, role_title, status, payment_status, candidate_count, created_at, tier_name')
          .eq('recruiter_id', recruiterData.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
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
