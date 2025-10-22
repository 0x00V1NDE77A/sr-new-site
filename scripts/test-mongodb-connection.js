const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings";
  
  console.log('🔍 Testing MongoDB connection...');
  console.log('URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  try {
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    const db = client.db('sr-holding-navbar');
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    // Test users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    if (userCount > 0) {
      const sampleUser = await usersCollection.findOne({}, { projection: { email: 1, role: 1, _id: 0 } });
      console.log('📝 Sample user:', sampleUser);
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('Server selection timed out')) {
      console.error('🔍 This usually means MongoDB Atlas is blocking connections');
      console.error('🔍 Check MongoDB Atlas Network Access settings');
      console.error('🔍 Add your IP address or temporarily allow 0.0.0.0/0');
    } else if (error.message.includes('bad auth')) {
      console.error('🔍 Authentication failed - check MongoDB username/password');
    }
  } finally {
    await client.close();
  }
}

testConnection();
