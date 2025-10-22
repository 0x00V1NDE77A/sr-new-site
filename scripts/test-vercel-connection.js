// scripts/test-vercel-connection.js
// Test script to verify MongoDB connection and debug Vercel deployment issues

const { MongoClient } = require('mongodb');

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  // Test both hardcoded and environment variable URIs
  const hardcodedUri = "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings";
  const envUri = process.env.MONGODB_URI;
  
  console.log('📋 Connection Details:');
  console.log(`Hardcoded URI: ${hardcodedUri ? '✅ Set' : '❌ Not set'}`);
  console.log(`Environment URI: ${envUri ? '✅ Set' : '❌ Not set'}`);
  console.log('');
  
  // Test with environment variable first, then fallback to hardcoded
  const uri = envUri || hardcodedUri;
  
  if (!uri) {
    console.error('❌ No MongoDB URI available');
    process.exit(1);
  }
  
  console.log('🔌 Attempting connection...');
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    
    console.log('⏳ Connecting to MongoDB...');
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    const db = client.db();
    console.log(`📊 Database: ${db.databaseName}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Test user collection access
    try {
      const usersCollection = db.collection('users');
      const userCount = await usersCollection.countDocuments();
      console.log(`👥 Users in database: ${userCount}`);
    } catch (error) {
      console.log('⚠️  Could not access users collection:', error.message);
    }
    
    await client.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Provide specific troubleshooting advice
    if (error.message.includes('Server selection timed out')) {
      console.log('\n🔍 Troubleshooting:');
      console.log('   This error usually means MongoDB Atlas is blocking connections');
      console.log('   from your current IP address or Vercel\'s servers.');
      console.log('');
      console.log('   Solutions:');
      console.log('   1. Check MongoDB Atlas Network Access settings');
      console.log('   2. Add your current IP to the whitelist');
      console.log('   3. For Vercel deployment, add Vercel\'s IP ranges');
      console.log('   4. Temporarily allow 0.0.0.0/0 for testing');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔍 Troubleshooting:');
      console.log('   DNS resolution failed. Check your connection string format.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔍 Troubleshooting:');
      console.log('   Connection refused. Check if MongoDB is running.');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection().catch(console.error);
