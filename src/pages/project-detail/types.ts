import type { Database } from "@/integrations/supabase/types";

export type ProjectDetail = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  | "id"
  | "role_title"
  | "status"
  | "job_summary"
  | "candidate_source"
  | "tier_name"
  | "candidate_count"
  | "created_at"
>;
