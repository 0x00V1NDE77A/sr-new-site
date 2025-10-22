#!/usr/bin/env node

/**
 * Script to reset admin password for SR Holding
 * Usage: node scripts/reset-admin-password.js
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Configuration
const ADMIN_EMAIL = 'admin@srholding.org';
const NEW_PASSWORD = 'SrHolding2024!@#'; // New password
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings"

async function resetAdminPassword() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      connectTimeoutMS: 10000,
    });
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if admin user exists
    const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL });
    if (!existingAdmin) {
      console.log('❌ Admin user not found!');
      console.log('Creating new admin user...');
      
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);
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
      console.log('✅ New admin user created successfully!');
      console.log(`   ID: ${result.insertedId}`);
    } else {
      console.log('⚠️  Admin user found, updating password...');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Current Role: ${existingAdmin.role || 'user'}`);
      
      // Update the password
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);
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
      console.log('✅ Admin password updated successfully!');
    }
    
    console.log('\n📋 Admin Login Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log('\n🔒 You can now login at: /admin');
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error.message);
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('\n💡 SSL/TLS connection issue. Try:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify MongoDB URI is correct');
      console.log('   3. Try again in a few minutes');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
resetAdminPassword().catch(console.error);
