import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import dotenv from 'dotenv';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Load environment variables
dotenv.config();

// Import models (these will be compiled TypeScript)
import { 
  User, 
  Recruiter, 
  Project, 
  TalentProfile, 
  AnalyticsEvent,
  AdminWhitelist 
} from './src/integrations/mongodb/models.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kariukikennedy288_db_user:A3s9dMvjARBd3RY3@cluster0.91lanxz.mongodb.net/vettedai?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth middleware
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.roles.includes('admin') && !user.roles.includes('ops_manager')) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Parse job description (replaces Supabase Edge Function)
app.post('/api/parse-job-description', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { jd_text } = req.body;

    if (!jd_text || typeof jd_text !== 'string') {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    if (jd_text.length < 50) {
      return res.status(400).json({ error: 'Job description must be at least 50 characters' });
    }

    // Simple AI parsing - in production you'd use OpenAI or similar
    const parsedData = {
      role_title: extractJobTitle(jd_text),
      company_name: extractCompanyName(jd_text),
      job_summary: extractJobSummary(jd_text),
      key_skills: extractSkills(jd_text),
      experience_level: extractExperienceLevel(jd_text)
    };

    res.json(parsedData);
  } catch (error) {
    console.error('Parse job description error:', error);
    res.status(500).json({ error: 'Failed to parse job description' });
  }
});

// Secure file upload (replaces Supabase Edge Function)
app.post('/api/upload-shortlist', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { project_id } = req.body;

    if (!project_id) {
      return res.status(400).json({ error: 'project_id is required' });
    }

    // Verify user has access to project
    const user = await User.findById(req.user.userId);
    const recruiter = await Recruiter.findOne({ userId: user?._id });
    
    if (!recruiter) {
      return res.status(403).json({ error: 'Recruiter profile not found' });
    }

    const project = await Project.findOne({ 
      _id: project_id, 
      recruiterId: recruiter._id 
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    // In production, you'd handle file upload here
    // For now, return a mock response
    const filePath = `${project_id}/shortlist_${Date.now()}.csv`;
    
    res.json({ 
      file_path: filePath, 
      sanitized_name: 'shortlist.csv' 
    });
  } catch (error) {
    console.error('Upload shortlist error:', error);
    res.status(500).json({ error: 'Failed to upload shortlist' });
  }
});

// Create project
app.post('/api/projects', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.userId);
    const recruiter = await Recruiter.findOne({ userId: user?._id });
    
    if (!recruiter) {
      return res.status(403).json({ error: 'Recruiter profile not found' });
    }

    const projectData = {
      ...req.body,
      recruiterId: recruiter._id,
      projectCode: generateProjectCode()
    };

    const project = await Project.create(projectData);
    
    // Log analytics event
    await AnalyticsEvent.create({
      eventType: 'project_created',
      userId: user?._id,
      projectId: project._id,
      metadata: { tier: project.tierName }
    });

    res.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get user projects
app.get('/api/projects', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.userId);
    const recruiter = await Recruiter.findOne({ userId: user?._id });
    
    if (!recruiter) {
      return res.json([]);
    }

    const projects = await Project.find({ recruiterId: recruiter._id })
      .sort({ createdAt: -1 })
      .populate('recruiter', 'fullName email')
      .populate('organization', 'name');

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

// Admin dashboard metrics
app.get('/api/admin/metrics', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalSignups = await User.countDocuments();
    const projectsCreated = await Project.countDocuments();
    const callsBooked = await Project.countDocuments({ status: 'activation_in_progress' });
    const awaitingActivation = await Project.countDocuments({ status: 'pending_activation' });

    res.json({
      total_signups: totalSignups,
      projects_created: projectsCreated,
      calls_booked: callsBooked,
      awaiting_activation: awaitingActivation
    });
  } catch (error) {
    console.error('Admin metrics error:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// Helper functions
function extractJobTitle(text: string): string {
  const lines = text.split('\n');
  const firstLine = lines[0].trim();
  return firstLine.length > 60 ? firstLine.substring(0, 60) : firstLine;
}

function extractCompanyName(text: string): string {
  const companyMatch = text.match(/(?:at|@)\s+([A-Z][a-zA-Z\s&]+)/i);
  return companyMatch ? companyMatch[1].trim() : 'Company';
}

function extractJobSummary(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 2).join('. ').trim() + '.';
}

function extractSkills(text: string): string[] {
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git'
  ];
  
  const foundSkills = skills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.slice(0, 7);
}

function extractExperienceLevel(text: string): string {
  if (text.toLowerCase().includes('senior') || text.toLowerCase().includes('5+')) {
    return '5+ years';
  } else if (text.toLowerCase().includes('mid') || text.toLowerCase().includes('3+')) {
    return '3-5 years';
  } else if (text.toLowerCase().includes('junior') || text.toLowerCase().includes('entry')) {
    return 'Entry-level';
  }
  return 'Mid-level';
}

function generateProjectCode(): string {
  return 'PRJ-' + Date.now().toString(36).toUpperCase();
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
