const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings";

async function createAdminUser() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@srholding.org' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('SrHolding2024!@#', 12);
    
    const adminUser = {
      email: 'admin@srholding.org',
      password: hashedPassword,
      role: 'admin',
      name: 'Admin User',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    
    const result = await usersCollection.insertOne(adminUser);
    console.log('Admin user created successfully:', {
      id: result.insertedId,
      email: adminUser.email,
      role: adminUser.role
    });
    
    console.log('\nAdmin Login Credentials:');
    console.log('Email: admin@srholding.org');
    console.log('Password: SrHolding2024!@#');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

createAdminUser();
