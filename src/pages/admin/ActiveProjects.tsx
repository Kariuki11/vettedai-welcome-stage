import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Project {
  id: string;
  role_title: string;
  candidates_completed: number | null;
  total_candidates: number | null;
  status: string;
  created_at: string;
  tier_name?: string | null;
  sla_deadline?: string | null;
  recruiter?: {
    email: string | null;
  } | null;
}

const formatStatusLabel = (status: string) => {
  return status
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const formatSla = (deadline?: string | null) => {
  if (!deadline) {
    return "Coming Soon";
  }

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) {
    return "Coming Soon";
  }

  return date.toLocaleDateString();
};

export default function ActiveProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, role_title, candidates_completed, total_candidates, status, created_at, tier_name, sla_deadline, recruiter:recruiters(email)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return;
    }

    setProjects(data || []);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.role_title
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const statusOptions = useMemo(() => {
    const uniqueStatuses = new Set(projects.map((project) => project.status));
    return ["all", ...Array.from(uniqueStatuses)];
  }, [projects]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/workspace")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Workspace
        </Button>

        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Active Projects Ops Console</h1>
              <p className="text-muted-foreground">
                Search, filter, and review project progress in one place
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Input
                placeholder="Search by role title"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="md:w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((statusValue) => (
                    <SelectItem key={statusValue} value={statusValue}>
                      {statusValue === "all" ? "All Statuses" : formatStatusLabel(statusValue)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No projects match the selected filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.role_title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {project.recruiter?.email || "—"}
                    </TableCell>
                    <TableCell>{project.tier_name || "—"}</TableCell>
                    <TableCell>
                      <Badge>{formatStatusLabel(project.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatSla(project.sla_deadline)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{project.candidates_completed ?? 0}</TableCell>
                    <TableCell>{project.total_candidates ?? 0}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="secondary">
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
