#!/usr/bin/env node

/**
 * Simple script to create admin user with specific MongoDB URI
 * Usage: node scripts/create-admin-simple.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Your specific MongoDB URI
const MONGODB_URI = "mongodb+srv://sharmakisor566_db_user:BzaAmyZBx1K5yede@cluster0.egzsncg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Admin credentials
const ADMIN_EMAIL = 'admin@srholding.org';
const ADMIN_PASSWORD = 'SrHolding2024!@#';

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    const db = client.db('test'); // Using the test database
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role || 'user'}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      
      // Update the password and role
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await usersCollection.updateOne(
        { email: ADMIN_EMAIL },
        { 
          $set: { 
            password: hashedPassword,
            role: 'admin',
            updatedAt: new Date()
          } 
        }
      );
      console.log('✅ Admin user password and role updated successfully!');
    } else {
      // Create new admin user
      console.log('🔐 Creating new admin user...');
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
      const adminUser = {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      };
      
      const result = await usersCollection.insertOne(adminUser);
      console.log('✅ Admin user created successfully!');
      console.log(`   ID: ${result.insertedId}`);
    }
    
    console.log('\n📋 Admin Login Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n🔒 You can now login at: /admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
createAdminUser().catch(console.error);



