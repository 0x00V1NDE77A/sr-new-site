const fs = require('fs');
const path = require('path');

const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration (if needed)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Node.js Configuration
NODE_OPTIONS=--max-old-space-size=4096
`;

const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

function createEnvFile() {
  console.log('🔧 Setting up environment variables...\n');
  
  // Try to create .env.local first
  try {
    if (!fs.existsSync(envLocalPath)) {
      fs.writeFileSync(envLocalPath, envContent);
      console.log('✅ Created .env.local file');
    } else {
      console.log('⚠️  .env.local already exists');
    }
  } catch (error) {
    console.log('❌ Could not create .env.local:', error.message);
    
    // Fallback to .env
    try {
      if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Created .env file');
      } else {
        console.log('⚠️  .env already exists');
      }
    } catch (error2) {
      console.log('❌ Could not create .env file:', error2.message);
      console.log('\n📝 Please manually create a .env.local file with the following content:');
      console.log('=' .repeat(60));
      console.log(envContent);
      console.log('=' .repeat(60));
    }
  }
  
  console.log('\n🚀 Environment setup complete!');
  console.log('📝 Next steps:');
  console.log('1. Restart your development server');
  console.log('2. Run: npm run dev');
  console.log('3. Test MongoDB connection: node scripts/test-mongodb-connection.js');
}

createEnvFile();
