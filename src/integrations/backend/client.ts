// Simple client to test backend communication
class BackendClient {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth methods
  async signup(email, password, fullName) {
    try {
      const result = await this.makeRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName })
      });
      
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
      }
      
      return {
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            user_metadata: { full_name: result.user.fullName },
            app_metadata: { roles: result.user.roles }
          },
          session: {
            access_token: result.token,
            user: {
              id: result.user.id,
              email: result.user.email,
              user_metadata: { full_name: result.user.fullName },
              app_metadata: { roles: result.user.roles }
            }
          }
        },
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: { message: error.message }
      };
    }
  }

  async login(email, password) {
    try {
      const result = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
      }
      
      return {
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            user_metadata: { full_name: result.user.fullName },
            app_metadata: { roles: result.user.roles }
          },
          session: {
            access_token: result.token,
            user: {
              id: result.user.id,
              email: result.user.email,
              user_metadata: { full_name: result.user.fullName },
              app_metadata: { roles: result.user.roles }
            }
          }
        },
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: { message: error.message }
      };
    }
  }

  async getCurrentUser() {
    try {
      const result = await this.makeRequest('/api/auth/me');
      return {
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            user_metadata: { full_name: result.user.fullName },
            app_metadata: { roles: result.user.roles }
          }
        },
        error: null
      };
    } catch (error) {
      return { data: { user: null }, error };
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    return { error: null };
  }

  // Project methods
  async createProject(projectData) {
    return await this.makeRequest('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async getProjects() {
    return await this.makeRequest('/api/projects');
  }

  // Health check
  async healthCheck() {
    return await this.makeRequest('/api/health');
  }

  async testDatabase() {
    return await this.makeRequest('/api/test-db');
  }
}

export const backendClient = new BackendClient();

// Mock supabase-like auth interface for compatibility
export const supabaseBackend = {
  auth: {
    signInWithPassword: ({ email, password }) => backendClient.login(email, password),
    signUp: ({ email, password, options }) => 
      backendClient.signup(email, password, options?.data?.full_name || ''),
    signOut: () => backendClient.logout(),
    getSession: async () => {
      const result = await backendClient.getCurrentUser();
      return {
        data: {
          session: result.data.user ? {
            user: result.data.user,
            access_token: localStorage.getItem('auth_token')
          } : null
        },
        error: result.error
      };
    },
    getUser: async () => await backendClient.getCurrentUser(),
    onAuthStateChange: (callback) => {
      // Simple implementation - check periodically
      const checkAuth = async () => {
        const { data } = await backendClient.getCurrentUser();
        if (data.user) {
          callback('SIGNED_IN', {
            user: data.user,
            access_token: localStorage.getItem('auth_token')
          });
        } else {
          callback('SIGNED_OUT', null);
        }
      };

      checkAuth();
      const interval = setInterval(checkAuth, 30000); // Check every 30 seconds

      return {
        data: {
          subscription: {
            unsubscribe: () => clearInterval(interval)
          }
        }
      };
    }
  },

  from: (table) => ({
    select: () => ({
      then: async (callback) => {
        if (table === 'projects') {
          const projects = await backendClient.getProjects();
          callback({ data: projects, error: null });
        } else {
          callback({ data: [], error: null });
        }
      }
    }),
    insert: async (data) => {
      if (table === 'projects') {
        const project = await backendClient.createProject(data);
        return { data: project, error: null };
      } else if (table === 'recruiters') {
        // Recruiter profile creation is handled automatically during signup
        return { data: data, error: null };
      }
      return { data: null, error: { message: 'Not implemented' } };
    },
    upsert: async (data, options) => {
      if (table === 'recruiters') {
        // Recruiter profile updates are handled automatically
        return { data: data, error: null };
      }
      return { data: null, error: { message: 'Not implemented' } };
    }
  }),

  rpc: (functionName) => ({
    then: async (callback) => {
      try {
        if (functionName === 'get_projects_for_current_user') {
          const projects = await backendClient.getProjects();
          // Transform projects to match expected format
          const transformedProjects = projects.map(project => ({
            id: project._id,
            role_title: project.roleTitle,
            status: project.status,
            payment_status: project.paymentStatus,
            candidate_count: project.candidateCount,
            created_at: project.createdAt,
            tier_name: project.tierName
          }));
          callback({ data: transformedProjects, error: null });
        } else if (functionName === 'is_admin') {
          const { data } = await backendClient.getCurrentUser();
          const isAdmin = data.user?.app_metadata?.roles?.includes('admin') || 
                         data.user?.app_metadata?.roles?.includes('ops_manager');
          callback({ data: isAdmin, error: null });
        } else {
          callback({ data: null, error: null });
        }
      } catch (error) {
        callback({ data: null, error });
      }
    }
  }),

  // Real-time subscriptions (mock implementation for compatibility)
  channel: (channelName) => ({
    on: (event, filter, callback) => ({
      subscribe: () => {
        // Mock subscription - in a real implementation you'd use WebSocket or Server-Sent Events
        console.log(`Mock subscription created for channel: ${channelName}`);
        return {
          unsubscribe: () => {
            console.log(`Mock subscription unsubscribed from channel: ${channelName}`);
          }
        };
      }
    })
  }),

  removeChannel: (channel) => {
    // Mock implementation
    console.log('Mock removeChannel called');
  }
};

export default supabaseBackend;
