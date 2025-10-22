#!/usr/bin/env node

/**
 * Script to create an admin user for SR Holding
 * Usage: node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Configuration
const ADMIN_EMAIL = 'admin@srholding.org';
const ADMIN_PASSWORD = 'SrHolding2024!@#'; // Strong password
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings"

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not available');
  console.log('Please set your MongoDB connection string');
  process.exit(1);
}

async function createAdminUser() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      console.log(`   Last Login: ${existingAdmin.lastLogin || 'Never'}`);
      
      const update = confirm('Do you want to update the password? (y/N): ');
      if (!update) {
        console.log('✅ Script completed without changes');
        return;
      }
    }
    
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    
    const adminUser = {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: null,
      role: 'admin' // Optional: add role field
    };
    
    if (existingAdmin) {
      // Update existing admin
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
      // Create new admin
      await usersCollection.insertOne(adminUser);
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n🔒 Please save these credentials securely!');
    console.log('   You can now login at: /login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Helper function for user input (simple version)
function confirm(message) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Run the script
createAdminUser().catch(console.error);
