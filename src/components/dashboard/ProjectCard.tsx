import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface Project {
  id: string;
  role_title: string;
  status: string;
  payment_status: string;
  candidate_count: number;
  created_at: string;
  tier_name?: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  const getStatusBadge = () => {
    if (project.payment_status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Awaiting Payment</Badge>;
    }
    if (project.status === 'ready') {
      return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Shortlist Ready</Badge>;
    }
    return <Badge variant="secondary">In Progress</Badge>;
  };

  const getProgressInfo = () => {
    if (project.status === 'scoring' || project.status === 'ready') {
      // Placeholder logic - will be replaced with actual candidate completion data
      const completed = Math.floor(Math.random() * project.candidate_count);
      return {
        show: true,
        completed,
        total: project.candidate_count,
        percentage: (completed / project.candidate_count) * 100
      };
    }
    return { show: false };
  };

  const progressInfo = getProgressInfo();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/workspace/project/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-foreground line-clamp-2">
            {project.role_title}
          </h3>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {progressInfo.show && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {progressInfo.completed}/{progressInfo.total} Candidates Completed
              </span>
            </div>
            <Progress value={progressInfo.percentage} className="h-2" />
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Created on {format(new Date(project.created_at), 'MMM d, yyyy')}</span>
        </div>

        {project.tier_name && (
          <div className="text-sm text-muted-foreground">
            Tier: <span className="font-medium text-foreground">{project.tier_name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
