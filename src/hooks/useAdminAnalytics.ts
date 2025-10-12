import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectStats {
  total: number;
  awaiting: number;
  in_progress: number;
  completed: number;
  last7Days: number;
}

interface RevenueStats {
  total: number;
  byTier: { [key: string]: number };
  averageValue: number;
}

interface CandidateStats {
  totalCandidates: number;
  averagePerProject: number;
  completionRate: number;
}

interface SignupFunnel {
  totalSignups: number;
  activeRecruiters: number;
  conversionRate: number;
  recruitersWithProjects: number;
}

export const useAdminAnalytics = () => {
  const projectStats = useQuery({
    queryKey: ['admin-project-stats'],
    queryFn: async (): Promise<ProjectStats> => {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('status, created_at, payment_status');

      if (error) throw error;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return {
        total: projects?.length || 0,
        awaiting: projects?.filter(p => p.status === 'awaiting').length || 0,
        in_progress: projects?.filter(p => p.status === 'in_progress').length || 0,
        completed: projects?.filter(p => p.status === 'completed').length || 0,
        last7Days: projects?.filter(p => 
          new Date(p.created_at) >= sevenDaysAgo
        ).length || 0
      };
    }
  });

  const revenueStats = useQuery({
    queryKey: ['admin-revenue-stats'],
    queryFn: async (): Promise<RevenueStats> => {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('pilot_price, tier_name, payment_status')
        .eq('payment_status', 'paid');

      if (error) throw error;

      const total = projects?.reduce((sum, p) => sum + (p.pilot_price || 0), 0) || 0;
      
      const byTier: { [key: string]: number } = {};
      projects?.forEach(p => {
        if (!byTier[p.tier_name]) byTier[p.tier_name] = 0;
        byTier[p.tier_name] += p.pilot_price || 0;
      });

      return {
        total,
        byTier,
        averageValue: projects?.length ? total / projects.length : 0
      };
    }
  });

  const candidateStats = useQuery({
    queryKey: ['admin-candidate-stats'],
    queryFn: async (): Promise<CandidateStats> => {
      const { data: profiles, error: profilesError } = await supabase
        .from('talent_profiles')
        .select('project_id');

      if (profilesError) throw profilesError;

      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, candidates_completed, total_candidates');

      if (projectsError) throw projectsError;

      const totalCandidates = profiles?.length || 0;
      const averagePerProject = projects?.length 
        ? totalCandidates / projects.length 
        : 0;

      const totalCompleted = projects?.reduce((sum, p) => sum + (p.candidates_completed || 0), 0) || 0;
      const totalExpected = projects?.reduce((sum, p) => sum + (p.total_candidates || 0), 0) || 0;
      const completionRate = totalExpected ? (totalCompleted / totalExpected) * 100 : 0;

      return {
        totalCandidates,
        averagePerProject,
        completionRate
      };
    }
  });

  const signupFunnel = useQuery({
    queryKey: ['admin-signup-funnel'],
    queryFn: async (): Promise<SignupFunnel> => {
      const { data: recruiters, error } = await supabase
        .from('recruiters')
        .select('id, status, user_id');

      if (error) throw error;

      const { data: projectCounts, error: projectError } = await supabase
        .from('projects')
        .select('recruiter_id');

      if (projectError) throw projectError;

      const totalSignups = recruiters?.length || 0;
      const activeRecruiters = recruiters?.filter(r => r.status === 'active').length || 0;
      const conversionRate = totalSignups ? (activeRecruiters / totalSignups) * 100 : 0;
      
      const uniqueRecruitersWithProjects = new Set(
        projectCounts?.map(p => p.recruiter_id)
      ).size;

      return {
        totalSignups,
        activeRecruiters,
        conversionRate,
        recruitersWithProjects: uniqueRecruitersWithProjects
      };
    }
  });

  return {
    projectStats: projectStats.data,
    revenueStats: revenueStats.data,
    candidateStats: candidateStats.data,
    signupFunnel: signupFunnel.data,
    isLoading: projectStats.isLoading || revenueStats.isLoading || 
               candidateStats.isLoading || signupFunnel.isLoading
  };
};
