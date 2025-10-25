const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const { 
  User, 
  Recruiter, 
  Project, 
  TalentProfile, 
  AnalyticsEvent,
  AdminWhitelist 
} = require('./models.js');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kariukikennedy288_db_user:A3s9dMvjARBd3RY3@cluster0.91lanxz.mongodb.net/vettedai?retryWrites=true&w=majority';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log(' Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    database: mongoose.connection.name,
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      roles: ['recruiter']
    });

    // Create recruiter profile
    const recruiter = await Recruiter.create({
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      status: 'active'
    });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles
      },
      token,
      recruiterId: recruiter._id
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Get recruiter profile
    const recruiter = await Recruiter.findOne({ userId: user._id });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles
      },
      token,
      recruiterId: recruiter?._id
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    const recruiter = await Recruiter.findOne({ userId: user._id });
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles
      },
      recruiterId: recruiter?._id
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
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
      .sort({ createdAt: -1 });

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

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const recruiterCount = await Recruiter.countDocuments();
    const projectCount = await Project.countDocuments();
    
    res.json({
      message: 'Database connection successful',
      collections: {
        users: userCount,
        recruiters: recruiterCount,
        projects: projectCount
      },
      connectionState: mongoose.connection.readyState,
      database: mongoose.connection.name
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Helper functions
function generateProjectCode() {
  return 'PRJ-' + Date.now().toString(36).toUpperCase();
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Database test: http://localhost:${PORT}/api/test-db`);
  console.log(`Auth endpoints available at /api/auth/*`);
  console.log(`Project endpoints available at /api/projects`);
});
