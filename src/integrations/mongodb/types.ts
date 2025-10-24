// MongoDB types that match Supabase interface
export interface Database {
  public: {
    Tables: {
      admin_whitelist: {
        Row: {
          added_at: string | null;
          added_by: string | null;
          email: string;
          id: string;
          notes: string | null;
        };
        Insert: {
          added_at?: string | null;
          added_by?: string | null;
          email: string;
          id?: string;
          notes?: string | null;
        };
        Update: {
          added_at?: string | null;
          added_by?: string | null;
          email?: string;
          id?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          created_at: string | null;
          event_type: string;
          id: string;
          metadata: any | null;
          project_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_type: string;
          id?: string;
          metadata?: any | null;
          project_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_type?: string;
          id?: string;
          metadata?: any | null;
          project_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      evaluations: {
        Row: {
          evaluated_at: string | null;
          evaluated_by: string | null;
          evaluation_notes: string | null;
          id: string;
          project_id: string;
          shortlist_file_path: string | null;
          talent_profile_id: string | null;
        };
        Insert: {
          evaluated_at?: string | null;
          evaluated_by?: string | null;
          evaluation_notes?: string | null;
          id?: string;
          project_id: string;
          shortlist_file_path?: string | null;
          talent_profile_id?: string | null;
        };
        Update: {
          evaluated_at?: string | null;
          evaluated_by?: string | null;
          evaluation_notes?: string | null;
          id?: string;
          project_id?: string;
          shortlist_file_path?: string | null;
          talent_profile_id?: string | null;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string | null;
          currency: string | null;
          id: string;
          paid_at: string | null;
          payment_provider: string | null;
          project_id: string;
          provider_reference: string | null;
          recruiter_id: string;
          status: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          currency?: string | null;
          id?: string;
          paid_at?: string | null;
          payment_provider?: string | null;
          project_id: string;
          provider_reference?: string | null;
          recruiter_id: string;
          status?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          currency?: string | null;
          id?: string;
          paid_at?: string | null;
          payment_provider?: string | null;
          project_id?: string;
          provider_reference?: string | null;
          recruiter_id?: string;
          status?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          anchor_price: number | null;
          candidate_count: number | null;
          candidate_source: string;
          candidates_completed: number | null;
          completed_at: string | null;
          completion_percentage: number | null;
          created_at: string | null;
          hours_elapsed: number | null;
          id: string;
          job_description: string | null;
          job_summary: string | null;
          organization_id: string | null;
          payment_status: string;
          pilot_price: number | null;
          project_code: string;
          recruiter_id: string;
          role_title: string;
          sla_deadline: string | null;
          status: string;
          tier_id: number;
          tier_name: string;
          total_candidates: number | null;
          updated_at: string | null;
        };
        Insert: {
          anchor_price?: number | null;
          candidate_count?: number | null;
          candidate_source: string;
          candidates_completed?: number | null;
          completed_at?: string | null;
          completion_percentage?: number | null;
          created_at?: string | null;
          hours_elapsed?: number | null;
          id?: string;
          job_description?: string | null;
          job_summary?: string | null;
          organization_id?: string | null;
          payment_status?: string;
          pilot_price?: number | null;
          project_code: string;
          recruiter_id: string;
          role_title: string;
          sla_deadline?: string | null;
          status?: string;
          tier_id: number;
          tier_name: string;
          total_candidates?: number | null;
          updated_at?: string | null;
        };
        Update: {
          anchor_price?: number | null;
          candidate_count?: number | null;
          candidate_source?: string;
          candidates_completed?: number | null;
          completed_at?: string | null;
          completion_percentage?: number | null;
          created_at?: string | null;
          hours_elapsed?: number | null;
          id?: string;
          job_description?: string | null;
          job_summary?: string | null;
          organization_id?: string | null;
          payment_status?: string;
          pilot_price?: number | null;
          project_code?: string;
          recruiter_id?: string;
          role_title?: string;
          sla_deadline?: string | null;
          status?: string;
          tier_id?: number;
          tier_name?: string;
          total_candidates?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      recruiters: {
        Row: {
          company_name: string | null;
          company_size: string | null;
          created_at: string | null;
          email: string;
          full_name: string;
          id: string;
          organization_id: string | null;
          referral_source: string | null;
          status: string;
          updated_at: string | null;
          user_id: string | null;
          user_role: string | null;
        };
        Insert: {
          company_name?: string | null;
          company_size?: string | null;
          created_at?: string | null;
          email: string;
          full_name: string;
          id?: string;
          organization_id?: string | null;
          referral_source?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
          user_role?: string | null;
        };
        Update: {
          company_name?: string | null;
          company_size?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          organization_id?: string | null;
          referral_source?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
          user_role?: string | null;
        };
        Relationships: [];
      };
      talent_profiles: {
        Row: {
          evaluated_at: string | null;
          file_name: string;
          file_path: string | null;
          file_size: number | null;
          id: string;
          parsed_email: string | null;
          parsed_name: string | null;
          project_id: string;
          score: number | null;
          shortlisted: boolean | null;
          status: string | null;
          uploaded_at: string | null;
        };
        Insert: {
          evaluated_at?: string | null;
          file_name: string;
          file_path?: string | null;
          file_size?: number | null;
          id?: string;
          parsed_email?: string | null;
          parsed_name?: string | null;
          project_id: string;
          score?: number | null;
          shortlisted?: boolean | null;
          status?: string | null;
          uploaded_at?: string | null;
        };
        Update: {
          evaluated_at?: string | null;
          file_name?: string;
          file_path?: string | null;
          file_size?: number | null;
          id?: string;
          parsed_email?: string | null;
          parsed_name?: string | null;
          project_id?: string;
          score?: number | null;
          shortlisted?: boolean | null;
          status?: string | null;
          uploaded_at?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          granted_at: string | null;
          granted_by: string | null;
          id: string;
          role: 'admin' | 'ops_manager' | 'recruiter';
          user_id: string;
        };
        Insert: {
          granted_at?: string | null;
          granted_by?: string | null;
          id?: string;
          role: 'admin' | 'ops_manager' | 'recruiter';
          user_id: string;
        };
        Update: {
          granted_at?: string | null;
          granted_by?: string | null;
          id?: string;
          role?: 'admin' | 'ops_manager' | 'recruiter';
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_project_for_current_user: {
        Args: {
          _anchor_price: number;
          _candidate_count: number;
          _candidate_source: string;
          _job_description: string;
          _job_summary: string;
          _pilot_price: number;
          _role_title: string;
          _tier_id: number;
          _tier_name: string;
        };
        Returns: string;
      };
      get_admin_dashboard_metrics: {
        Args: Record<PropertyKey, never>;
        Returns: {
          awaiting_activation: number;
          calls_booked: number;
          projects_created: number;
          total_signups: number;
        }[];
      };
      get_projects_for_current_user: {
        Args: Record<PropertyKey, never>;
        Returns: {
          candidate_count: number;
          created_at: string;
          id: string;
          payment_status: string;
          role_title: string;
          status: string;
          tier_name: string;
        }[];
      };
      grant_admin_role: {
        Args: { _email: string };
        Returns: undefined;
      };
      has_role: {
        Args: {
          _role: 'admin' | 'ops_manager' | 'recruiter';
          _user_id: string;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_email_whitelisted: {
        Args: { _email: string };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'admin' | 'ops_manager' | 'recruiter';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof Database['public']['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof Database['public']['CompositeTypes']
    ? Database['public']['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ['admin', 'ops_manager', 'recruiter'],
    },
  },
} as const;
