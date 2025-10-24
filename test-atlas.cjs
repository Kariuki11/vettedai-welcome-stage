// Simple MongoDB Atlas connection test
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://kariukikennedy288_db_user:A3s9dMvjARBd3RY3@cluster0.91lanxz.mongodb.net/vettedai?retryWrites=true&w=majority';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'ops_manager', 'recruiter'], default: ['recruiter'] }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB Atlas connection...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    console.log('📊 Testing database operations...');
    
    // Test user creation
    const hashedPassword = await bcrypt.hash('testpassword123', 12);
    const testUser = new User({
      email: 'test@vettedai.com',
      password: hashedPassword,
      fullName: 'Test User',
      roles: ['recruiter']
    });
    
    await testUser.save();
    console.log('✅ User created successfully:', testUser.email);
    
    // Test user query
    const foundUser = await User.findOne({ email: 'test@vettedai.com' });
    console.log('✅ User query successful:', foundUser.fullName);
    
    // Test password verification
    const isValidPassword = await bcrypt.compare('testpassword123', foundUser.password);
    console.log('✅ Password verification:', isValidPassword ? 'PASSED' : 'FAILED');
    
    // Clean up test data
    await User.deleteOne({ _id: testUser._id });
    console.log('✅ Test data cleaned up');
    
    // Get database stats
    const userCount = await User.countDocuments();
    console.log('📈 Current users in database:', userCount);
    
    console.log('🎉 MongoDB Atlas connection test completed successfully!');
    console.log('🚀 Your VettedAI application is ready to run!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('💡 Make sure your MongoDB Atlas cluster is running and accessible');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  }
}

testConnection();
