// Simple CommonJS version for easier compatibility
const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'ops_manager', 'recruiter'], default: ['recruiter'] }],
}, {
  timestamps: true,
});

// Recruiter Schema
const RecruiterSchema = new mongoose.Schema({
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

// Project Schema
const ProjectSchema = new mongoose.Schema({
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

// Analytics Event Schema
const AnalyticsEventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  userId: { type: String, ref: 'User' },
  projectId: { type: String, ref: 'Project' },
  metadata: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

// Admin Whitelist Schema
const AdminWhitelistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  addedAt: { type: Date, default: Date.now },
  addedBy: { type: String, ref: 'User' },
  notes: String,
});

// Talent Profile Schema
const TalentProfileSchema = new mongoose.Schema({
  projectId: { type: String, required: true, ref: 'Project' },
  fileName: { type: String, required: true },
  filePath: String,
  fileSize: Number,
  parsedName: String,
  parsedEmail: String,
  status: { 
    type: String, 
    default: 'awaiting',
    enum: ['awaiting', 'scoring', 'scored']
  },
  shortlisted: { type: Boolean, default: false },
  score: Number,
  uploadedAt: { type: Date, default: Date.now },
  evaluatedAt: Date,
});

// Create models
const User = mongoose.model('User', UserSchema);
const Recruiter = mongoose.model('Recruiter', RecruiterSchema);
const Project = mongoose.model('Project', ProjectSchema);
const AnalyticsEvent = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
const AdminWhitelist = mongoose.model('AdminWhitelist', AdminWhitelistSchema);
const TalentProfile = mongoose.model('TalentProfile', TalentProfileSchema);

module.exports = {
  User,
  Recruiter,
  Project,
  AnalyticsEvent,
  AdminWhitelist,
  TalentProfile
};
