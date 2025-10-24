// Standalone Express server for VettedAI
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'vettedai-super-secret-jwt-key-2024';

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kariukikennedy288_db_user:A3s9dMvjARBd3RY3@cluster0.91lanxz.mongodb.net/vettedai?retryWrites=true&w=majority';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'ops_manager', 'recruiter'], default: ['recruiter'] }],
}, {
  timestamps: true,
});

const recruiterSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  organizationId: { type: String, ref: 'Organization' },
  companyName: String,
  companySize: String,
  userRole: String,
  referralSource: String,
  status: { type: String, default: 'active' },
}, {
  timestamps: true,
});

const projectSchema = new mongoose.Schema({
  projectCode: { type: String, required: true, unique: true },
  recruiterId: { type: String, required: true, ref: 'Recruiter' },
  organizationId: { type: String, ref: 'Organization' },
  roleTitle: { type: String, required: true },
  jobDescription: String,
  jobSummary: String,
  tierId: { type: Number, required: true, enum: [1, 2, 3] },
  tierName: { type: String, required: true },
  anchorPrice: Number,
  pilotPrice: Number,
  candidateSource: { type: String, required: true, enum: ['own', 'network'] },
  candidateCount: { type: Number, default: 0 },
  candidatesCompleted: Number,
  completionPercentage: Number,
  totalCandidates: Number,
  status: { 
    type: String, 
    required: true, 
    default: 'awaiting',
    enum: ['awaiting', 'scoring', 'ready', 'pending_activation', 'activation_in_progress']
  },
  paymentStatus: { 
    type: String, 
    required: true, 
    default: 'pending',
    enum: ['paid', 'pending']
  },
  slaDeadline: Date,
  hoursElapsed: { type: Number, default: 0 },
  completedAt: Date,
}, {
  timestamps: true,
});

const analyticsEventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  userId: { type: String, ref: 'User' },
  projectId: { type: String, ref: 'Project' },
  metadata: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

// Create models
const User = mongoose.model('User', userSchema);
const Recruiter = mongoose.model('Recruiter', recruiterSchema);
const Project = mongoose.model('Project', projectSchema);
const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || (!user.roles.includes('admin') && !user.roles.includes('ops_manager'))) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'VettedAI API is running!' });
});

// Parse job description
app.post('/api/parse-job-description', authenticateToken, async (req, res) => {
  try {
    const { jd_text } = req.body;

    if (!jd_text || typeof jd_text !== 'string') {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    if (jd_text.length < 50) {
      return res.status(400).json({ error: 'Job description must be at least 50 characters' });
    }

    // Simple AI parsing
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

// Create project
app.post('/api/projects', authenticateToken, async (req, res) => {
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
app.get('/api/projects', authenticateToken, async (req, res) => {
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
app.get('/api/admin/metrics', authenticateToken, requireAdmin, async (req, res) => {
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
function extractJobTitle(text) {
  const lines = text.split('\n');
  const firstLine = lines[0].trim();
  return firstLine.length > 60 ? firstLine.substring(0, 60) : firstLine;
}

function extractCompanyName(text) {
  const companyMatch = text.match(/(?:at|@)\s+([A-Z][a-zA-Z\s&]+)/i);
  return companyMatch ? companyMatch[1].trim() : 'Company';
}

function extractJobSummary(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 2).join('. ').trim() + '.';
}

function extractSkills(text) {
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git'
  ];
  
  const foundSkills = skills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.slice(0, 7);
}

function extractExperienceLevel(text) {
  if (text.toLowerCase().includes('senior') || text.toLowerCase().includes('5+')) {
    return '5+ years';
  } else if (text.toLowerCase().includes('mid') || text.toLowerCase().includes('3+')) {
    return '3-5 years';
  } else if (text.toLowerCase().includes('junior') || text.toLowerCase().includes('entry')) {
    return 'Entry-level';
  }
  return 'Mid-level';
}

function generateProjectCode() {
  return 'PRJ-' + Date.now().toString(36).toUpperCase();
}

app.listen(PORT, () => {
  console.log(`🚀 VettedAI API server running on port ${PORT}`);
  console.log(`📊 MongoDB Atlas connected successfully`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
});
