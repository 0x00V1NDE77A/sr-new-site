const fetch = require('node-fetch').default;

const BASE_URL = 'http://localhost:3000';

async function testPublicAPIs() {
  console.log('🧪 Testing Public API Endpoints...\n');

  try {
    // Test public categories endpoint
    console.log('📝 Testing /api/categories...');
    const categoriesResponse = await fetch(`${BASE_URL}/api/categories`);
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log('✅ Categories API working');
      console.log(`📊 Found ${categoriesData.categories?.length || 0} categories`);
      if (categoriesData.categories && categoriesData.categories.length > 0) {
        console.log('📋 Sample categories:');
        categoriesData.categories.slice(0, 3).forEach((cat, index) => {
          console.log(`  ${index + 1}. ${cat.name} (${cat.postCount || 0} posts)`);
        });
      }
    } else {
      console.log('❌ Categories API error:', categoriesResponse.status);
    }

    // Test public tags endpoint
    console.log('\n📝 Testing /api/tags...');
    const tagsResponse = await fetch(`${BASE_URL}/api/tags`);
    
    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json();
      console.log('✅ Tags API working');
      console.log(`📊 Found ${tagsData.tags?.length || 0} tags`);
      if (tagsData.tags && tagsData.tags.length > 0) {
        console.log('📋 Sample tags:');
        tagsData.tags.slice(0, 3).forEach((tag, index) => {
          console.log(`  ${index + 1}. ${tag.name} (${tag.postCount || 0} posts)`);
        });
      }
    } else {
      console.log('❌ Tags API error:', tagsResponse.status);
    }

    // Test public blogs endpoint
    console.log('\n📝 Testing /api/blogs...');
    const blogsResponse = await fetch(`${BASE_URL}/api/blogs?limit=5`);
    
    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json();
      console.log('✅ Blogs API working');
      console.log(`📊 Found ${blogsData.blogs?.length || 0} blogs`);
      if (blogsData.pagination) {
        console.log(`📄 Pagination: Page ${blogsData.pagination.page} of ${blogsData.pagination.pages}`);
      }
    } else {
      console.log('❌ Blogs API error:', blogsResponse.status);
    }

    console.log('\n🎯 Public API Test Summary:');
    console.log('✅ All public endpoints should now work without authentication');
    console.log('✅ BlogStats component should show real data');
    console.log('✅ Sidebar should display actual counts');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n💡 Make sure your Next.js app is running: npm run dev');
  }
}

// Run the test
testPublicAPIs();
