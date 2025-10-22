const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@srholding.org';
const ADMIN_PASSWORD = 'SrHolding2024!@#';

async function testAdminRoutes() {
  console.log('🧪 Testing Admin Routes Authentication\n');
  
  // Test routes that should be protected
  const protectedRoutes = [
    { method: 'GET', url: '/api/admin/blogs', name: 'Get Blogs' },
    { method: 'POST', url: '/api/admin/blogs', name: 'Create Blog', body: { title: 'Test Blog' } },
    { method: 'GET', url: '/api/admin/tags', name: 'Get Tags' },
    { method: 'POST', url: '/api/admin/tags', name: 'Create Tag', body: { name: 'test-tag' } },
    { method: 'GET', url: '/api/admin/categories', name: 'Get Categories' },
  ];

  console.log('1. Testing routes without authentication (should return 401/403):');
  console.log('=' .repeat(60));
  
  for (const route of protectedRoutes) {
    try {
      const options = {
        method: route.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (route.body) {
        options.body = JSON.stringify(route.body);
      }
      
      const response = await fetch(`${BASE_URL}${route.url}`, options);
      const status = response.status;
      
      if (status === 401 || status === 403) {
        console.log(`✅ ${route.name}: ${status} (Protected)`);
      } else {
        console.log(`❌ ${route.name}: ${status} (Should be protected)`);
      }
    } catch (error) {
      console.log(`❌ ${route.name}: Error - ${error.message}`);
    }
  }

  console.log('\n2. Testing authentication flow:');
  console.log('=' .repeat(60));
  
  try {
    // Test login endpoint
    const loginResponse = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });
    
    if (loginResponse.ok) {
      console.log('✅ Login endpoint accessible');
      
      // Get cookies from login response
      const cookies = loginResponse.headers.get('set-cookie');
      if (cookies) {
        console.log('✅ Authentication cookies received');
        
        // Test protected route with cookies
        const protectedResponse = await fetch(`${BASE_URL}/api/admin/blogs`, {
          method: 'GET',
          headers: {
            'Cookie': cookies,
            'Content-Type': 'application/json',
          },
        });
        
        if (protectedResponse.ok) {
          console.log('✅ Protected route accessible with authentication');
        } else {
          console.log(`❌ Protected route failed: ${protectedResponse.status}`);
        }
      } else {
        console.log('❌ No authentication cookies received');
      }
    } else {
      console.log(`❌ Login failed: ${loginResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Authentication test error: ${error.message}`);
  }

  console.log('\n3. Testing middleware protection:');
  console.log('=' .repeat(60));
  
  // Test middleware protection
  const middlewareRoutes = [
    '/admin',
    '/admin/blog',
    '/admin/settings',
  ];
  
  for (const route of middlewareRoutes) {
    try {
      const response = await fetch(`${BASE_URL}${route}`);
      const status = response.status;
      
      if (status === 302 || status === 401 || status === 403) {
        console.log(`✅ ${route}: ${status} (Middleware protected)`);
      } else {
        console.log(`❌ ${route}: ${status} (Should be protected by middleware)`);
      }
    } catch (error) {
      console.log(`❌ ${route}: Error - ${error.message}`);
    }
  }

  console.log('\n🎯 Test Summary:');
  console.log('=' .repeat(60));
  console.log('✅ All admin API routes should return 401/403 without authentication');
  console.log('✅ Middleware should protect /admin routes');
  console.log('✅ Authentication should work with valid credentials');
  console.log('\n📝 Next steps:');
  console.log('1. Start your Next.js server: npm run dev');
  console.log('2. Test login at: http://localhost:3000/sr-auth/login');
  console.log('3. Use admin credentials: admin@srholding.org / SrHolding2024!@#');
  console.log('4. Access admin panel at: http://localhost:3000/admin');
}

// Run the test
testAdminRoutes().catch(console.error);
