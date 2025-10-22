// Debug script to check what content data is actually being sent
console.log('🔍 Debugging Content Data Sending...\n');

// Simulate the exact data structure that should be sent
const simulateAdminContentData = () => {
  return {
    title: "Debug Content Test",
    slug: "debug-content-test",
    content: [
      {
        id: "1",
        type: "heading",
        content: "Test Heading",
        metadata: {
          level: 1
        }
      },
      {
        id: "2",
        type: "paragraph",
        content: "This is a test paragraph with some content to verify it's being sent properly.",
        metadata: {}
      },
      {
        id: "3",
        type: "list",
        content: "Item 1\nItem 2\nItem 3\nItem 4",
        metadata: {
          listType: "unordered"
        }
      },
      {
        id: "4",
        type: "code",
        content: "console.log('Hello World');\nconst test = 'content';",
        metadata: {
          language: "javascript"
        }
      }
    ],
    excerpt: "Test excerpt for debugging content sending",
    heroImage: "/test-hero.jpg",
    author: {
      name: "Debug User",
      email: "debug@example.com",
      avatar: "/debug-avatar.jpg"
    },
    publishedAt: new Date(),
    status: "published",
    featured: false,
    category: "Debug",
    tags: ["debug", "test", "content"],
    seo: {
      metaTitle: "Debug Content Test",
      metaDescription: "Testing content data sending",
      keywords: ["debug", "test"],
      socialTitle: "Debug Test",
      socialDescription: "Debug description",
      socialImage: "/debug-social.jpg"
    }
  };
};

// Test what happens when we JSON.stringify the content
const testContentSerialization = () => {
  console.log('📦 Testing Content Serialization...\n');
  
  const blogData = simulateAdminContentData();
  
  console.log('1️⃣ Original Blog Data Structure:');
  console.log('   Title:', blogData.title);
  console.log('   Content blocks:', blogData.content.length);
  console.log('   Content types:', blogData.content.map(b => b.type));
  
  console.log('\n2️⃣ Content Block Details:');
  blogData.content.forEach((block, index) => {
    console.log(`   Block ${index + 1}:`);
    console.log(`     Type: ${block.type}`);
    console.log(`     Content length: ${block.content.length} characters`);
    console.log(`     Has metadata: ${!!block.metadata}`);
    console.log(`     Metadata keys: ${Object.keys(block.metadata || {}).join(', ') || 'none'}`);
  });
  
  console.log('\n3️⃣ JSON.stringify Test:');
  try {
    const jsonString = JSON.stringify(blogData);
    console.log('   ✅ JSON.stringify successful');
    console.log('   📏 JSON length:', jsonString.length, 'characters');
    
    // Test if we can parse it back
    const parsedBack = JSON.parse(jsonString);
    console.log('   ✅ JSON.parse successful');
    console.log('   📊 Parsed content blocks:', parsedBack.content.length);
    
    // Check if content blocks are preserved
    const contentPreserved = parsedBack.content.every((block, index) => {
      const original = blogData.content[index];
      return block.type === original.type && 
             block.content === original.content &&
             JSON.stringify(block.metadata) === JSON.stringify(original.metadata);
    });
    
    console.log('   🔍 Content blocks preserved:', contentPreserved ? '✅' : '❌');
    
    if (!contentPreserved) {
      console.log('   🚨 Content blocks were corrupted during serialization!');
      console.log('   Original vs Parsed comparison:');
      blogData.content.forEach((original, index) => {
        const parsed = parsedBack.content[index];
        console.log(`     Block ${index + 1}:`);
        console.log(`       Type match: ${original.type === parsed.type ? '✅' : '❌'}`);
        console.log(`       Content match: ${original.content === parsed.content ? '✅' : '❌'}`);
        console.log(`       Metadata match: ${JSON.stringify(original.metadata) === JSON.stringify(parsed.metadata) ? '✅' : '❌'}`);
      });
    }
    
  } catch (error) {
    console.log('   ❌ JSON.stringify failed:', error.message);
  }
  
  console.log('\n4️⃣ Simulated API Call:');
  console.log('   This is what would be sent to /api/admin/blogs:');
  console.log('   Method: POST');
  console.log('   Headers: { "Content-Type": "application/json" }');
  console.log('   Body: JSON.stringify(blogData)');
  
  // Simulate the actual fetch call
  const simulateFetch = () => {
    const requestBody = JSON.stringify(blogData);
    console.log('\n   📤 Request Body Preview:');
    console.log('   First 200 chars:', requestBody.substring(0, 200) + '...');
    console.log('   Last 200 chars:', '...' + requestBody.substring(requestBody.length - 200));
    
    // Check for any problematic characters
    const hasSpecialChars = /[^\x00-\x7F]/.test(requestBody);
    console.log('   Has non-ASCII characters:', hasSpecialChars ? '❌' : '✅');
    
    // Check content block integrity in the request
    const contentBlocksInRequest = JSON.parse(requestBody).content;
    console.log('   Content blocks in request:', contentBlocksInRequest.length);
    
    return requestBody;
  };
  
  const requestBody = simulateFetch();
  
  console.log('\n5️⃣ Potential Issues:');
  console.log('   - Type mismatch between frontend and API hook');
  console.log('   - Content blocks not properly structured');
  console.log('   - Metadata missing or corrupted');
  console.log('   - JSON serialization issues');
  
  console.log('\n6️⃣ Recommendations:');
  console.log('   ✅ Ensure ContentBlock interface matches in all files');
  console.log('   ✅ Verify content blocks have proper metadata structure');
  console.log('   ✅ Check browser console for serialization errors');
  console.log('   ✅ Verify network tab shows correct request payload');
  
  return { blogData, requestBody };
};

// Run the debug test
const result = testContentSerialization();

console.log('\n🎯 Debug Summary:');
console.log('   Content blocks created:', result.blogData.content.length);
console.log('   Request body size:', result.requestBody.length, 'characters');
console.log('   Ready to test with actual admin panel');
