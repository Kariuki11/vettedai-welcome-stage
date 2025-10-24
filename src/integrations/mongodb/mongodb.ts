import connectDB from './client';
import { 
  User, 
  Organization, 
  Recruiter, 
  Project, 
  TalentProfile, 
  Payment, 
  Evaluation, 
  AnalyticsEvent, 
  UserRole, 
  AdminWhitelist,
  IUser,
  IProject,
  ITalentProfile,
  IPayment,
  IAnalyticsEvent
} from './models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key';

// MongoDB client that mimics Supabase interface
class MongoDBClient {
  private currentUser: IUser | null = null;

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      await connectDB();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  }

  // Auth methods
  auth = {
    getSession: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return { data: { session: null }, error: null };
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = await User.findById(decoded.userId);
        if (!user) {
          localStorage.removeItem('auth_token');
          return { data: { session: null }, error: null };
        }

        this.currentUser = user;
        return { 
          data: { 
            session: { 
              user: {
                id: user._id,
                email: user.email,
                user_metadata: { full_name: user.fullName },
                app_metadata: { roles: user.roles }
              }
            } 
          }, 
          error: null 
        };
      } catch (error) {
        localStorage.removeItem('auth_token');
        return { data: { session: null }, error };
      }
    },

    getUser: async (token?: string) => {
      const authToken = token || localStorage.getItem('auth_token');
      if (!authToken) {
        return { data: { user: null }, error: null };
      }

      try {
        const decoded = jwt.verify(authToken, JWT_SECRET) as any;
        const user = await User.findById(decoded.userId);
        if (!user) {
          return { data: { user: null }, error: null };
        }

        this.currentUser = user;
        return { 
          data: { 
            user: {
              id: user._id,
              email: user.email,
              user_metadata: { full_name: user.fullName },
              app_metadata: { roles: user.roles }
            }
          }, 
          error: null 
        };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },

    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return { data: null, error: { message: 'Invalid credentials' } };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return { data: null, error: { message: 'Invalid credentials' } };
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        localStorage.setItem('auth_token', token);
        this.currentUser = user;

        return { 
          data: { 
            user: {
              id: user._id,
              email: user.email,
              user_metadata: { full_name: user.fullName },
              app_metadata: { roles: user.roles }
            },
            session: {
              access_token: token,
              user: {
                id: user._id,
                email: user.email,
                user_metadata: { full_name: user.fullName },
                app_metadata: { roles: user.roles }
              }
            }
          }, 
          error: null 
        };
      } catch (error) {
        return { data: null, error };
      }
    },

    signUp: async ({ email, password, options }: { 
      email: string; 
      password: string; 
      options?: { data?: { full_name?: string } } 
    }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return { data: null, error: { message: 'User already exists' } };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          email,
          password: hashedPassword,
          fullName: options?.data?.full_name || '',
          roles: ['recruiter']
        });

        await user.save();

        // Create recruiter profile
        const recruiter = new Recruiter({
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          status: 'active'
        });
        await recruiter.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        localStorage.setItem('auth_token', token);
        this.currentUser = user;

        return { 
          data: { 
            user: {
              id: user._id,
              email: user.email,
              user_metadata: { full_name: user.fullName },
              app_metadata: { roles: user.roles }
            },
            session: {
              access_token: token,
              user: {
                id: user._id,
                email: user.email,
                user_metadata: { full_name: user.fullName },
                app_metadata: { roles: user.roles }
              }
            }
          }, 
          error: null 
        };
      } catch (error) {
        return { data: null, error };
      }
    },

    signOut: async () => {
      localStorage.removeItem('auth_token');
      this.currentUser = null;
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simple implementation - in a real app you'd use WebSocket or polling
      const checkAuth = () => {
        const token = localStorage.getItem('auth_token');
        if (token && !this.currentUser) {
          this.auth.getSession().then(({ data }) => {
            if (data.session) {
              callback('SIGNED_IN', data.session);
            }
          });
        } else if (!token && this.currentUser) {
          callback('SIGNED_OUT', null);
        }
      };

      // Check on load
      checkAuth();

      // Check periodically
      const interval = setInterval(checkAuth, 5000);

      return {
        data: { subscription: { unsubscribe: () => clearInterval(interval) } }
      };
    }
  };

  // Database methods
  from = (table: string) => {
    return {
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            const model = this.getModel(table);
            const query: any = {};
            query[column] = value;
            const result = await model.findOne(query);
            return { data: result, error: null };
          },
          maybeSingle: async () => {
            const model = this.getModel(table);
            const query: any = {};
            query[column] = value;
            const result = await model.findOne(query);
            return { data: result, error: null };
          },
          order: (orderColumn: string, options?: { ascending?: boolean }) => ({
            limit: (count: number) => ({
              then: async (callback: (result: any) => void) => {
                const model = this.getModel(table);
                const query: any = {};
                query[column] = value;
                const sort: any = {};
                sort[orderColumn] = options?.ascending ? 1 : -1;
                const result = await model.find(query).sort(sort).limit(count);
                callback({ data: result, error: null });
              }
            }),
            then: async (callback: (result: any) => void) => {
              const model = this.getModel(table);
              const query: any = {};
              query[column] = value;
              const sort: any = {};
              sort[orderColumn] = options?.ascending ? 1 : -1;
              const result = await model.find(query).sort(sort);
              callback({ data: result, error: null });
            }
          }),
          then: async (callback: (result: any) => void) => {
            const model = this.getModel(table);
            const query: any = {};
            query[column] = value;
            const result = await model.find(query);
            callback({ data: result, error: null });
          }
        }),
        or: (condition: string) => ({
          order: (orderColumn: string, options?: { ascending?: boolean }) => ({
            then: async (callback: (result: any) => void) => {
              const model = this.getModel(table);
              // Simple OR condition parsing - in production you'd want more sophisticated parsing
              const regex = /(\w+)\.ilike\.%(.+)%/;
              const match = condition.match(regex);
              if (match) {
                const [, field, value] = match;
                const query: any = {};
                query[field] = new RegExp(value, 'i');
                const sort: any = {};
                sort[orderColumn] = options?.ascending ? 1 : -1;
                const result = await model.find(query).sort(sort);
                callback({ data: result, error: null });
              } else {
                callback({ data: [], error: null });
              }
            }
          }),
          then: async (callback: (result: any) => void) => {
            const model = this.getModel(table);
            const regex = /(\w+)\.ilike\.%(.+)%/;
            const match = condition.match(regex);
            if (match) {
              const [, field, value] = match;
              const query: any = {};
              query[field] = new RegExp(value, 'i');
              const result = await model.find(query);
              callback({ data: result, error: null });
            } else {
              callback({ data: [], error: null });
            }
          }
        }),
        order: (orderColumn: string, options?: { ascending?: boolean }) => ({
          then: async (callback: (result: any) => void) => {
            const model = this.getModel(table);
            const sort: any = {};
            sort[orderColumn] = options?.ascending ? 1 : -1;
            const result = await model.find().sort(sort);
            callback({ data: result, error: null });
          }
        }),
        then: async (callback: (result: any) => void) => {
          const model = this.getModel(table);
          const result = await model.find();
          callback({ data: result, error: null });
        }
      }),
      insert: async (data: any) => {
        const model = this.getModel(table);
        const result = await model.create(data);
        return { data: result, error: null };
      },
      upsert: async (data: any, options?: { onConflict?: string }) => {
        const model = this.getModel(table);
        const conflictField = options?.onConflict || 'userId';
        const existing = await model.findOne({ [conflictField]: data[conflictField] });
        
        if (existing) {
          const result = await model.findByIdAndUpdate(existing._id, data, { new: true });
          return { data: result, error: null };
        } else {
          const result = await model.create(data);
          return { data: result, error: null };
        }
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async () => {
              const model = this.getModel(table);
              const query: any = {};
              query[column] = value;
              const result = await model.findOneAndUpdate(query, data, { new: true });
              return { data: result, error: null };
            }
          }),
          then: async (callback: (result: any) => void) => {
            const model = this.getModel(table);
            const query: any = {};
            query[column] = value;
            const result = await model.updateMany(query, data);
            callback({ data: result, error: null });
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (callback: (result: any) => void) => {
            const model = this.getModel(table);
            const query: any = {};
            query[column] = value;
            const result = await model.deleteMany(query);
            callback({ data: result, error: null });
          }
        })
      })
    };
  };

  // RPC methods
  rpc = (functionName: string, args?: any) => {
    return {
      then: async (callback: (result: any) => void) => {
        try {
          let result;
          switch (functionName) {
            case 'is_admin':
              result = this.currentUser?.roles.includes('admin') || this.currentUser?.roles.includes('ops_manager');
              break;
            case 'get_projects_for_current_user':
              if (!this.currentUser) {
                result = [];
                break;
              }
              const recruiter = await Recruiter.findOne({ userId: this.currentUser._id });
              if (!recruiter) {
                result = [];
                break;
              }
              const projects = await Project.find({ recruiterId: recruiter._id })
                .sort({ createdAt: -1 })
                .select('_id roleTitle status paymentStatus candidateCount createdAt tierName');
              result = projects.map(p => ({
                id: p._id,
                role_title: p.roleTitle,
                status: p.status,
                payment_status: p.paymentStatus,
                candidate_count: p.candidateCount,
                created_at: p.createdAt,
                tier_name: p.tierName
              }));
              break;
            case 'get_admin_dashboard_metrics':
              const totalSignups = await User.countDocuments();
              const projectsCreated = await Project.countDocuments();
              const callsBooked = await Project.countDocuments({ status: 'activation_in_progress' });
              const awaitingActivation = await Project.countDocuments({ status: 'pending_activation' });
              result = {
                total_signups: totalSignups,
                projects_created: projectsCreated,
                calls_booked: callsBooked,
                awaiting_activation: awaitingActivation
              };
              break;
            default:
              result = null;
          }
          callback({ data: result, error: null });
        } catch (error) {
          callback({ data: null, error });
        }
      }
    };
  };

  // Storage methods (simplified - in production you'd use GridFS or S3)
  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: File | Uint8Array, options?: any) => {
        // In a real implementation, you'd upload to GridFS or S3
        // For now, we'll just return success
        return { data: { path }, error: null };
      },
      download: async (path: string) => {
        // In a real implementation, you'd download from GridFS or S3
        return { data: null, error: null };
      }
    })
  };

  // Real-time subscriptions (simplified)
  channel = (channelName: string) => ({
    on: (event: string, filter: any, callback: () => void) => ({
      subscribe: () => {
        // In a real implementation, you'd use Socket.io or Server-Sent Events
        // For now, we'll just return a mock subscription
        return {
          unsubscribe: () => {}
        };
      }
    })
  });

  removeChannel = (channel: any) => {
    // Mock implementation
  };

  // API methods for server-side operations
  api = {
    parseJobDescription: async (jdText: string) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/parse-job-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jd_text: jdText })
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse job description');
      }
      
      return response.json();
    },

    uploadShortlist: async (projectId: string, file: File) => {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('file', file);

      const response = await fetch('/api/upload-shortlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload shortlist');
      }
      
      return response.json();
    },

    createProject: async (projectData: any) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      return response.json();
    },

    getProjects: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get projects');
      }
      
      return response.json();
    },

    getAdminMetrics: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/metrics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get admin metrics');
      }
      
      return response.json();
    }
  };

  private getModel(table: string) {
    const models: any = {
      'users': User,
      'organizations': Organization,
      'recruiters': Recruiter,
      'projects': Project,
      'talent_profiles': TalentProfile,
      'payments': Payment,
      'evaluations': Evaluation,
      'analytics_events': AnalyticsEvent,
      'user_roles': UserRole,
      'admin_whitelist': AdminWhitelist
    };
    return models[table];
  }
}

// Create singleton instance
const mongodb = new MongoDBClient();

export default mongodb;
