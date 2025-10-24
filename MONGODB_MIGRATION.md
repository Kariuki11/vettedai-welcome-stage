# MongoDB Migration Guide

This project has been migrated from Supabase to MongoDB. Here's what changed and how to set it up.

## What Changed

### Database
- **From**: Supabase (PostgreSQL) with Row Level Security
- **To**: MongoDB with Mongoose ODM

### Authentication
- **From**: Supabase Auth with JWT tokens
- **To**: Custom JWT-based authentication with MongoDB user storage

### Storage
- **From**: Supabase Storage
- **To**: MongoDB GridFS (or AWS S3 for production)

### Real-time
- **From**: Supabase Real-time subscriptions
- **To**: Socket.io or Server-Sent Events (simplified implementation)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# macOS with Homebrew:
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or start manually:
mongod --config /usr/local/etc/mongod.conf
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB Configuration
VITE_MONGODB_URI=mongodb://localhost:27017/vettedai
VITE_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: If using MongoDB Atlas
# VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vettedai
```

### 4. Run the Application

```bash
npm run dev
```

## Database Schema

The MongoDB collections mirror the original Supabase tables:

- `users` - User accounts and authentication
- `organizations` - Company information
- `recruiters` - Recruiter profiles
- `projects` - Job postings and project management
- `talent_profiles` - Candidate resumes and scores
- `payments` - Payment tracking
- `evaluations` - Admin evaluations
- `analytics_events` - User activity tracking
- `user_roles` - Role-based access control
- `admin_whitelist` - Admin user whitelist

## Key Differences from Supabase

### 1. Authentication
- Users are stored in MongoDB instead of Supabase Auth
- JWT tokens are managed manually
- Password hashing uses bcryptjs

### 2. Database Queries
- MongoDB queries instead of PostgreSQL
- Mongoose ODM for type safety
- Simplified query interface that mimics Supabase

### 3. Real-time Features
- Simplified real-time implementation
- Uses polling instead of WebSocket subscriptions
- Can be enhanced with Socket.io for production

### 4. File Storage
- Basic file handling (can be enhanced with GridFS or S3)
- Simplified upload/download interface

## Migration Benefits

1. **Cost**: MongoDB Atlas free tier vs Supabase paid plans
2. **Flexibility**: Full control over database schema and queries
3. **Scalability**: MongoDB scales horizontally better than PostgreSQL
4. **Document Storage**: Better for storing complex, nested data structures

## Production Considerations

1. **Security**: Use strong JWT secrets and implement proper authentication middleware
2. **File Storage**: Implement proper file storage with GridFS or AWS S3
3. **Real-time**: Add Socket.io for proper real-time features
4. **Monitoring**: Add MongoDB monitoring and logging
5. **Backup**: Implement regular database backups

## API Compatibility

The migration maintains API compatibility with the original Supabase implementation. All existing hooks and components should work without changes:

- `useAuth()` - Authentication hook
- `useProjects()` - Project management
- `useUserProjects()` - User-specific projects
- All Supabase client methods are preserved

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running locally or Atlas cluster is accessible
- Check connection string format
- Verify network connectivity

### Authentication Issues
- Check JWT secret configuration
- Verify user creation in MongoDB
- Check localStorage for auth tokens

### Query Issues
- MongoDB queries are case-sensitive
- Use proper MongoDB query syntax
- Check collection names and field names
