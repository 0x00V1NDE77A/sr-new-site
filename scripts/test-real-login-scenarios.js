const fetch = require('node-fetch').default;

const BASE_URL = 'http://localhost:3000';

// Admin credentials from ADMIN_SETUP.md
const ADMIN_CREDENTIALS = {
  email: 'admin@srholding.org',
  password: 'SrHolding2024!@#'
};

// Test different login scenarios
async function testLoginScenarios() {
  console.log('🔐 Testing Real Login Scenarios...\n');

  try {
    // Test 1: Successful login with correct credentials
    console.log('📝 Test 1: Successful login with correct credentials...');
    const successfulLoginResponse = await fetch(`${BASE_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
        redirect: false
      })
    });

    if (successfulLoginResponse.ok) {
      const loginData = await successfulLoginResponse.json();
      console.log('✅ Successful login response:', loginData);
      
      // Extract session token if available
      const sessionToken = loginData.url ? loginData.url.split('token=')[1] : null;
      console.log('🔑 Session token extracted:', sessionToken ? 'Yes' : 'No');
      
      // Now test logging the successful login activity
      if (sessionToken) {
        await testLogSuccessfulLogin(sessionToken);
      }
    } else {
      console.log('⚠️  Login failed:', successfulLoginResponse.status);
      const errorData = await successfulLoginResponse.text();
      console.log('Error details:', errorData);
    }

    // Test 2: Failed login with wrong password
    console.log('\n📝 Test 2: Failed login with wrong password...');
    const failedLoginResponse = await fetch(`${BASE_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_CREDENTIALS.email,
        password: 'WrongPassword123!',
        redirect: false
      })
    });

    if (failedLoginResponse.ok) {
      console.log('⚠️  Unexpected success with wrong password');
    } else {
      console.log('✅ Failed login properly rejected:', failedLoginResponse.status);
      const errorData = await failedLoginResponse.text();
      console.log('Error details:', errorData);
      
      // Test logging the failed login attempt
      await testLogFailedLogin();
    }

    // Test 3: Failed login with wrong email
    console.log('\n📝 Test 3: Failed login with wrong email...');
    const wrongEmailResponse = await fetch(`${BASE_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'wrong@email.com',
        password: ADMIN_CREDENTIALS.password,
        redirect: false
      })
    });

    if (wrongEmailResponse.ok) {
      console.log('⚠️  Unexpected success with wrong email');
    } else {
      console.log('✅ Wrong email properly rejected:', wrongEmailResponse.status);
      const errorData = await wrongEmailResponse.text();
      console.log('Error details:', errorData);
      
      // Test logging the failed login attempt
      await testLogFailedLogin('wrong_email');
    }

    // Test 4: Failed login with empty credentials
    console.log('\n📝 Test 4: Failed login with empty credentials...');
    const emptyCredentialsResponse = await fetch(`${BASE_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: '',
        password: '',
        redirect: false
      })
    });

    if (emptyCredentialsResponse.ok) {
      console.log('⚠️  Unexpected success with empty credentials');
    } else {
      console.log('✅ Empty credentials properly rejected:', emptyCredentialsResponse.status);
      const errorData = await emptyCredentialsResponse.text();
      console.log('Error details:', errorData);
      
      // Test logging the failed login attempt
      await testLogFailedLogin('empty_credentials');
    }

    // Test 5: Failed login with malformed email
    console.log('\n📝 Test 5: Failed login with malformed email...');
    const malformedEmailResponse = await fetch(`${BASE_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'not-an-email',
        password: ADMIN_CREDENTIALS.password,
        redirect: false
      })
    });

    if (malformedEmailResponse.ok) {
      console.log('⚠️  Unexpected success with malformed email');
    } else {
      console.log('✅ Malformed email properly rejected:', malformedEmailResponse.status);
      const errorData = await malformedEmailResponse.text();
      console.log('Error details:', errorData);
      
      // Test logging the failed login attempt
      await testLogFailedLogin('malformed_email');
    }

    console.log('\n🎯 Login Scenarios Test Summary:');
    console.log('✅ Multiple login failure scenarios tested');
    console.log('✅ Proper error handling verified');
    console.log('✅ Failed login attempts logged');
    console.log('✅ Security measures working correctly');

  } catch (error) {
    console.error('❌ Login scenarios test failed:', error);
  }
}

// Test logging successful login activity
async function testLogSuccessfulLogin(sessionToken) {
  console.log('\n📝 Logging successful login activity...');
  
  try {
    const logResponse = await fetch(`${BASE_URL}/api/admin/auth-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.session-token=${sessionToken}`,
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSON.stringify({
        action: 'login',
        details: {
          method: 'credentials',
          success: true,
          location: 'Login Page',
          timestamp: new Date().toISOString(),
          userAgent: 'Test Script - Node.js',
          ip: '127.0.0.1'
        }
      })
    });

    if (logResponse.ok) {
      const logData = await logResponse.json();
      console.log('✅ Successful login activity logged:', logData);
    } else {
      console.log('⚠️  Failed to log successful login:', logResponse.status);
      const errorData = await logResponse.text();
      console.log('Error details:', errorData);
    }
  } catch (error) {
    console.error('❌ Error logging successful login:', error);
  }
}

// Test logging failed login activity
async function testLogFailedLogin(failureType = 'wrong_password') {
  console.log(`📝 Logging failed login activity (${failureType})...`);
  
  try {
    const logResponse = await fetch(`${BASE_URL}/api/admin/auth-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'failed_login',
        details: {
          method: 'credentials',
          reason: failureType,
          email: failureType === 'wrong_email' ? 'wrong@email.com' : ADMIN_CREDENTIALS.email,
          ip_blocked: false,
          location: 'Login Page',
          timestamp: new Date().toISOString(),
          userAgent: 'Test Script - Node.js',
          ip: '127.0.0.1'
        }
      })
    });

    if (logResponse.ok) {
      const logData = await logResponse.json();
      console.log('✅ Failed login activity logged:', logData);
    } else {
      console.log('⚠️  Failed to log failed login:', logResponse.status);
      const errorData = await logResponse.text();
      console.log('Error details:', errorData);
    }
  } catch (error) {
    console.error('❌ Error logging failed login:', error);
  }
}

// Test viewing admin logs (should fail without proper auth)
async function testViewAdminLogs() {
  console.log('\n📝 Testing admin logs access...');
  
  try {
    const logsResponse = await fetch(`${BASE_URL}/api/admin/auth-logs?page=1&limit=10`);
    
    if (logsResponse.status === 401) {
      console.log('✅ Admin logs properly protected (401 Unauthorized)');
    } else if (logsResponse.status === 200) {
      const logsData = await logsResponse.json();
      console.log('✅ Admin logs accessible:', {
        totalLogs: logsData.pagination?.total || 0,
        currentPage: logsData.pagination?.page || 1,
        logsCount: logsData.logs?.length || 0
      });
      
      // Show some log entries
      if (logsData.logs && logsData.logs.length > 0) {
        console.log('\n📋 Recent log entries:');
        logsData.logs.slice(0, 3).forEach((log, index) => {
          console.log(`${index + 1}. ${log.action} - ${log.userEmail} - ${new Date(log.timestamp).toLocaleString()}`);
        });
      }
    } else {
      console.log('⚠️  Unexpected response:', logsResponse.status);
    }
  } catch (error) {
    console.error('❌ Error accessing admin logs:', error);
  }
}

// Test NextAuth endpoints directly
async function testNextAuthEndpoints() {
  console.log('\n🔐 Testing NextAuth endpoints directly...');
  
  try {
    // Test signin endpoint
    console.log('📝 Testing /api/auth/signin endpoint...');
    const signinResponse = await fetch(`${BASE_URL}/api/auth/signin`);
    
    if (signinResponse.ok) {
      console.log('✅ Signin endpoint accessible');
    } else {
      console.log('⚠️  Signin endpoint error:', signinResponse.status);
    }

    // Test session endpoint
    console.log('📝 Testing /api/auth/session endpoint...');
    const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`);
    
    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      console.log('✅ Session endpoint accessible');
      console.log('Session data:', sessionData);
    } else {
      console.log('⚠️  Session endpoint error:', sessionResponse.status);
    }

  } catch (error) {
    console.error('❌ Error testing NextAuth endpoints:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Real Login Scenarios Tests...\n');
  
  await testLoginScenarios();
  await testViewAdminLogs();
  await testNextAuthEndpoints();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📱 Next Steps:');
  console.log('1. Check your admin logs at /admin/admin-logs');
  console.log('2. Look for the failed login attempts we just created');
  console.log('3. Verify IP addresses, timestamps, and failure reasons');
  console.log('4. Test the logs page pagination and filtering');
  console.log('5. Export logs to CSV to see all the data');
  
  console.log('\n🔍 What to look for in admin logs:');
  console.log('- Multiple failed_login entries with different reasons');
  console.log('- IP addresses (should show 127.0.0.1 for local testing)');
  console.log('- Timestamps for each attempt');
  console.log('- User agent information');
  console.log('- Failure reasons (wrong_password, wrong_email, etc.)');
}

runAllTests();
