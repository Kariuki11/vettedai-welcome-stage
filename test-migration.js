// Test script to verify MongoDB migration
import connectDB from './src/integrations/mongodb/client.js';
import { User, Recruiter, Project } from './src/integrations/mongodb/models.js';
import bcrypt from 'bcryptjs';

async function testMigration() {
  try {
    console.log('Testing MongoDB Atlas connection...');
    
    // Connect to MongoDB Atlas
    await connectDB();
    console.log('✅ Connected to MongoDB Atlas');

    // Test user creation
    const hashedPassword = await bcrypt.hash('testpassword', 12);
    const user = new User({
      email: 'test@example.com',
      password: hashedPassword,
      fullName: 'Test User',
      roles: ['recruiter']
    });
    
    await user.save();
    console.log('✅ User created:', user.email);

    // Test recruiter creation
    const recruiter = new Recruiter({
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      status: 'active'
    });
    
    await recruiter.save();
    console.log('✅ Recruiter created:', recruiter.email);

    // Test project creation
    const project = new Project({
      projectCode: 'TEST-' + Date.now(),
      recruiterId: recruiter._id,
      roleTitle: 'Test Developer',
      tierId: 1,
      tierName: 'Basic',
      candidateSource: 'own',
      status: 'awaiting',
      paymentStatus: 'pending'
    });
    
    await project.save();
    console.log('✅ Project created:', project.projectCode);

    // Test queries
    const userCount = await User.countDocuments();
    const recruiterCount = await Recruiter.countDocuments();
    const projectCount = await Project.countDocuments();
    
    console.log('📊 Database stats:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Recruiters: ${recruiterCount}`);
    console.log(`   Projects: ${projectCount}`);

    // Clean up test data
    await Project.deleteOne({ _id: project._id });
    await Recruiter.deleteOne({ _id: recruiter._id });
    await User.deleteOne({ _id: user._id });
    console.log('✅ Test data cleaned up');

    console.log('🎉 MongoDB migration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration test failed:', error);
  } finally {
    process.exit(0);
  }
}

testMigration();
