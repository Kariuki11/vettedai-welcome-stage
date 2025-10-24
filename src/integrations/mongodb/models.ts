import mongoose, { Schema, Document } from 'mongoose';

// User interface
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  fullName: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Organization interface
export interface IOrganization extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Recruiter interface
export interface IRecruiter extends Document {
  _id: string;
  userId: string;
  email: string;
  fullName: string;
  organizationId?: string;
  companyName?: string;
  companySize?: string;
  userRole?: string;
  referralSource?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project interface
export interface IProject extends Document {
  _id: string;
  projectCode: string;
  recruiterId: string;
  organizationId?: string;
  roleTitle: string;
  jobDescription?: string;
  jobSummary?: string;
  tierId: number;
  tierName: string;
  anchorPrice?: number;
  pilotPrice?: number;
  candidateSource: 'own' | 'network';
  candidateCount: number;
  candidatesCompleted?: number;
  completionPercentage?: number;
  totalCandidates?: number;
  status: 'awaiting' | 'scoring' | 'ready' | 'pending_activation' | 'activation_in_progress';
  paymentStatus: 'paid' | 'pending';
  slaDeadline?: Date;
  hoursElapsed?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Talent Profile interface
export interface ITalentProfile extends Document {
  _id: string;
  projectId: string;
  fileName: string;
  filePath?: string;
  fileSize?: number;
  parsedName?: string;
  parsedEmail?: string;
  status: 'awaiting' | 'scoring' | 'scored';
  shortlisted?: boolean;
  score?: number;
  uploadedAt: Date;
  evaluatedAt?: Date;
}

// Payment interface
export interface IPayment extends Document {
  _id: string;
  projectId: string;
  recruiterId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentProvider?: string;
  providerReference?: string;
  paidAt?: Date;
  createdAt: Date;
}

// Evaluation interface
export interface IEvaluation extends Document {
  _id: string;
  projectId: string;
  talentProfileId?: string;
  evaluationNotes?: string;
  shortlistFilePath?: string;
  evaluatedBy?: string;
  evaluatedAt: Date;
}

// Analytics Event interface
export interface IAnalyticsEvent extends Document {
  _id: string;
  eventType: string;
  userId?: string;
  projectId?: string;
  metadata?: any;
  createdAt: Date;
}

// User Role interface
export interface IUserRole extends Document {
  _id: string;
  userId: string;
  role: 'admin' | 'ops_manager' | 'recruiter';
  grantedAt: Date;
  grantedBy?: string;
}

// Admin Whitelist interface
export interface IAdminWhitelist extends Document {
  _id: string;
  email: string;
  addedAt?: Date;
  addedBy?: string;
  notes?: string;
}

// User Schema
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'ops_manager', 'recruiter'], default: ['recruiter'] }],
}, {
  timestamps: true,
});

// Organization Schema
const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
}, {
  timestamps: true,
});

// Recruiter Schema
const RecruiterSchema = new Schema<IRecruiter>({
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
const ProjectSchema = new Schema<IProject>({
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

// Talent Profile Schema
const TalentProfileSchema = new Schema<ITalentProfile>({
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

// Payment Schema
const PaymentSchema = new Schema<IPayment>({
  projectId: { type: String, required: true, ref: 'Project' },
  recruiterId: { type: String, required: true, ref: 'Recruiter' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'paid', 'failed', 'refunded']
  },
  paymentProvider: String,
  providerReference: String,
  paidAt: Date,
}, {
  timestamps: true,
});

// Evaluation Schema
const EvaluationSchema = new Schema<IEvaluation>({
  projectId: { type: String, required: true, ref: 'Project' },
  talentProfileId: { type: String, ref: 'TalentProfile' },
  evaluationNotes: String,
  shortlistFilePath: String,
  evaluatedBy: { type: String, ref: 'User' },
  evaluatedAt: { type: Date, default: Date.now },
});

// Analytics Event Schema
const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  eventType: { type: String, required: true },
  userId: { type: String, ref: 'User' },
  projectId: { type: String, ref: 'Project' },
  metadata: Schema.Types.Mixed,
}, {
  timestamps: true,
});

// User Role Schema
const UserRoleSchema = new Schema<IUserRole>({
  userId: { type: String, required: true, ref: 'User' },
  role: { 
    type: String, 
    required: true,
    enum: ['admin', 'ops_manager', 'recruiter']
  },
  grantedAt: { type: Date, default: Date.now },
  grantedBy: { type: String, ref: 'User' },
});

// Admin Whitelist Schema
const AdminWhitelistSchema = new Schema<IAdminWhitelist>({
  email: { type: String, required: true, unique: true },
  addedAt: { type: Date, default: Date.now },
  addedBy: { type: String, ref: 'User' },
  notes: String,
});

// Create indexes for better performance
UserSchema.index({ email: 1 });
RecruiterSchema.index({ userId: 1 });
RecruiterSchema.index({ email: 1 });
ProjectSchema.index({ recruiterId: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ slaDeadline: 1 });
TalentProfileSchema.index({ projectId: 1 });
PaymentSchema.index({ projectId: 1 });
PaymentSchema.index({ recruiterId: 1 });
AnalyticsEventSchema.index({ eventType: 1 });
AnalyticsEventSchema.index({ projectId: 1 });
UserRoleSchema.index({ userId: 1, role: 1 }, { unique: true });

// Export models
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Organization = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);
export const Recruiter = mongoose.models.Recruiter || mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);
export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const TalentProfile = mongoose.models.TalentProfile || mongoose.model<ITalentProfile>('TalentProfile', TalentProfileSchema);
export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export const Evaluation = mongoose.models.Evaluation || mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);
export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
export const UserRole = mongoose.models.UserRole || mongoose.model<IUserRole>('UserRole', UserRoleSchema);
export const AdminWhitelist = mongoose.models.AdminWhitelist || mongoose.model<IAdminWhitelist>('AdminWhitelist', AdminWhitelistSchema);
