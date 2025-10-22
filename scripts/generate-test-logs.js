const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sr-holding-navbar';

async function generateTestLogs() {
  console.log('📝 Generating Test Admin Logs...\n');

  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const authLogsCollection = db.collection('admin_auth_logs');

    // Clear existing test logs
    await authLogsCollection.deleteMany({ userEmail: 'test@example.com' });
    console.log('🧹 Cleared existing test logs');

    // Generate test log entries
    const testLogs = [
      {
        userId: 'test-user-1',
        userEmail: 'test@example.com',
        action: 'failed_login',
        details: {
          method: 'credentials',
          reason: 'wrong_password',
          email: 'admin@srholding.org',
          ip_blocked: false,
          location: 'Login Page'
        },
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referer: 'http://localhost:3000/login',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        createdAt: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        userId: 'test-user-2',
        userEmail: 'test@example.com',
        action: 'failed_login',
        details: {
          method: 'credentials',
          reason: 'wrong_email',
          email: 'wrong@email.com',
          ip_blocked: false,
          location: 'Login Page'
        },
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referer: 'http://localhost:3000/login',
        timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
        createdAt: new Date(Date.now() - 3 * 60 * 1000)
      },
      {
        userId: 'test-user-3',
        userEmail: 'test@example.com',
        action: 'login',
        details: {
          method: 'credentials',
          success: true,
          location: 'Admin Dashboard'
        },
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referer: 'http://localhost:3000/login',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        createdAt: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        userId: 'test-user-4',
        userEmail: 'test@example.com',
        action: 'failed_login',
        details: {
          method: 'credentials',
          reason: 'empty_credentials',
          email: '',
          ip_blocked: false,
          location: 'Login Page'
        },
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        referer: 'http://localhost:3000/login',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        createdAt: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        userId: 'test-user-5',
        userEmail: 'test@example.com',
        action: 'logout',
        details: {
          method: 'manual',
          session_duration: '45m',
          location: 'Admin Dashboard'
        },
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referer: 'http://localhost:3000/admin',
        timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
        createdAt: new Date(Date.now() - 1 * 60 * 1000)
      },
      {
        userId: 'test-user-6',
        userEmail: 'test@example.com',
        action: 'failed_login',
        details: {
          method: 'credentials',
          reason: 'malformed_email',
          email: 'not-an-email',
          ip_blocked: false,
          location: 'Login Page'
        },
        ip: '10.0.0.50',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        referer: 'http://localhost:3000/login',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        createdAt: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        userId: 'test-user-7',
        userEmail: 'test@example.com',
        action: 'login',
        details: {
          method: 'credentials',
          success: true,
          location: 'Admin Dashboard'
        },
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referer: 'http://localhost:3000/login',
        timestamp: new Date(), // Now
        createdAt: new Date()
      }
    ];

    // Insert test logs
    const result = await authLogsCollection.insertMany(testLogs);
    console.log(`✅ Generated ${result.insertedIds.length} test log entries`);

    // Verify the logs were created
    const totalLogs = await authLogsCollection.countDocuments();
    console.log(`📊 Total logs in database: ${totalLogs}`);

    // Show sample of created logs
    const recentLogs = await authLogsCollection
      .find({ userEmail: 'test@example.com' })
      .sort({ timestamp: -1 })
      .limit(3)
      .toArray();

    console.log('\n📋 Sample of generated logs:');
    recentLogs.forEach((log, index) => {
      console.log(`${index + 1}. ${log.action} - ${log.ip} - ${log.timestamp.toLocaleString()}`);
    });

    console.log('\n🎯 Test logs generated successfully!');
    console.log('📱 Now visit /admin/admin-logs to see them in the UI');
    console.log('🔍 You should see:');
    console.log('   - 7 test log entries');
    console.log('   - Different IP addresses');
    console.log('   - Various user agents');
    console.log('   - Different failure reasons');
    console.log('   - Proper timestamps');

    await client.close();
    console.log('✅ MongoDB connection closed');

  } catch (error) {
    console.error('❌ Error generating test logs:', error);
  }
}

// Run the script
generateTestLogs();
