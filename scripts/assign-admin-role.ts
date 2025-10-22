#!/usr/bin/env tsx

/**
 * TypeScript script to assign admin role to existing users
 * Usage: npm run assign-admin-role
 */

import { MongoClient } from 'mongodb';
import * as readline from 'readline';

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings"

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not available');
  console.log('Please set your MongoDB connection string');
  process.exit(1);
}

async function assignAdminRole() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    
    if (users.length === 0) {
      console.log('⚠️  No users found in the database');
      return;
    }
    
    console.log(`\n📋 Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (Role: ${user.role || 'user'})`);
    });
    
    const email = await prompt('Enter the email of the user to make admin: ');
    
    if (!email) {
      console.log('❌ No email provided');
      return;
    }
    
    // Check if user exists
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log(`\n👤 User found: ${user.email}`);
    console.log(`   Current role: ${user.role || 'user'}`);
    
    const confirm = await prompt('Are you sure you want to make this user an admin? (y/N): ');
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      return;
    }
    
    // Update user role to admin
    await usersCollection.updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          role: 'admin',
          updatedAt: new Date()
        } 
      }
    );
    
    console.log('✅ User role updated to admin successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   New role: admin`);
    
  } catch (error: any) {
    console.error('❌ Error assigning admin role:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Helper function for user input
function prompt(message: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Run the script
assignAdminRole().catch(console.error);
