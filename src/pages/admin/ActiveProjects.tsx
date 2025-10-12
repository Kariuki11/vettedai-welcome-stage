import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  role_title: string;
  candidates_completed: number;
  total_candidates: number;
  status: string;
  created_at: string;
}

export default function ActiveProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [updates, setUpdates] = useState<Record<string, { completed: number; total: number }>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, role_title, candidates_completed, total_candidates, status, created_at')
      .in('status', ['awaiting', 'scoring'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    setProjects(data || []);
    
    const initialUpdates: Record<string, { completed: number; total: number }> = {};
    data?.forEach(project => {
      initialUpdates[project.id] = {
        completed: project.candidates_completed || 0,
        total: project.total_candidates || 0
      };
    });
    setUpdates(initialUpdates);
  };

  const handleUpdate = async (projectId: string) => {
    const update = updates[projectId];
    
    if (!update || update.completed > update.total) {
      toast({
        title: "Invalid values",
        description: "Completed candidates cannot exceed total candidates",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('projects')
      .update({
        candidates_completed: update.completed,
        total_candidates: update.total
      })
      .eq('id', projectId);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Project updated",
      description: "Candidate engagement has been updated successfully"
    });

    fetchProjects();
  };

  const handleInputChange = (projectId: string, field: 'completed' | 'total', value: string) => {
    const numValue = parseInt(value) || 0;
    setUpdates(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: numValue
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/workspace')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Workspace
        </Button>
        
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-2">Active Projects - Admin Panel</h1>
          <p className="text-muted-foreground mb-6">
            Update candidate engagement for active projects
          </p>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No active projects found
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.role_title}</TableCell>
                    <TableCell>
                      <Badge>{project.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={updates[project.id]?.total || 50}
                        value={updates[project.id]?.completed || 0}
                        onChange={(e) => handleInputChange(project.id, 'completed', e.target.value)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={updates[project.id]?.total || 0}
                        onChange={(e) => handleInputChange(project.id, 'total', e.target.value)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleUpdate(project.id)}
                        size="sm"
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
