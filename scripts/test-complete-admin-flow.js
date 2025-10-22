const { MongoClient } = require('mongodb');

// Simulate the exact data flow from admin panel to backend
const simulateCompleteAdminFlow = () => {
  // This simulates what the admin panel sends
  const adminPanelData = {
    title: "Complete Admin Flow Test",
    slug: "complete-admin-flow-test",
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
        content: "This is a test paragraph to verify the complete data flow from admin panel to backend database.",
        metadata: {}
      },
      {
        id: "3",
        type: "list",
        content: "First item\nSecond item\nThird item",
        metadata: {
          listType: "unordered"
        }
      },
      {
        id: "4",
        type: "code",
        content: "const test = 'content';\nconsole.log(test);",
        metadata: {
          language: "javascript"
        }
      }
    ],
    excerpt: "Testing the complete admin panel data flow to ensure content is properly saved.",
    heroImage: "/test-hero.jpg",
    author: {
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/admin-avatar.jpg"
    },
    publishedAt: new Date(),
    status: "published",
    featured: true,
    category: "Testing",
    tags: ["test", "admin", "flow", "content"],
    seo: {
      metaTitle: "Complete Admin Flow Test",
      metaDescription: "Testing complete admin panel data flow",
      keywords: ["test", "admin", "flow"],
      socialTitle: "Admin Flow Test",
      socialDescription: "Test description",
      socialImage: "/test-social.jpg"
    }
  };

  return adminPanelData;
};

async function testCompleteAdminFlow() {
  try {
    console.log('🚀 Testing Complete Admin Panel Data Flow...\n');
    
    const adminData = simulateCompleteAdminFlow();
    
    console.log('1️⃣ Admin Panel Data Structure:');
    console.log('   Title:', adminData.title);
    console.log('   Content blocks:', adminData.content.length);
    console.log('   Content types:', adminData.content.map(b => b.type));
    
    console.log('\n2️⃣ Content Block Analysis:');
    adminData.content.forEach((block, index) => {
      console.log(`   Block ${index + 1}:`);
      console.log(`     Type: ${block.type}`);
      console.log(`     Content: ${block.content.substring(0, 50)}${block.content.length > 50 ? '...' : ''}`);
      console.log(`     Metadata:`, block.metadata);
    });
    
    console.log('\n3️⃣ JSON Serialization Test:');
    try {
      const jsonString = JSON.stringify(adminData);
      console.log('   ✅ JSON.stringify successful');
      console.log('   📏 JSON length:', jsonString.length, 'characters');
      
      // Test parsing back
      const parsedBack = JSON.parse(jsonString);
      console.log('   ✅ JSON.parse successful');
      console.log('   📊 Parsed content blocks:', parsedBack.content.length);
      
      // Verify content integrity
      const contentIntact = parsedBack.content.every((block, index) => {
        const original = adminData.content[index];
        return block.type === original.type && 
               block.content === original.content &&
               JSON.stringify(block.metadata) === JSON.stringify(original.metadata);
      });
      
      console.log('   🔍 Content integrity preserved:', contentIntact ? '✅' : '❌');
      
    } catch (error) {
      console.log('   ❌ JSON serialization failed:', error.message);
      return;
    }
    
    console.log('\n4️⃣ MongoDB Connection Test:');
    
    const uri = "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings";
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log('   ✅ Connected to MongoDB');
    
    const db = client.db();
    const blogsCollection = db.collection('blogs');
    
    // Check if test blog exists
    const existingBlog = await blogsCollection.findOne({ slug: adminData.slug });
    if (existingBlog) {
      console.log('   ⚠️  Test blog exists, updating...');
      
      // Calculate reading time (same as backend)
      const wordCount = adminData.content
        .filter(block => block.type === "paragraph")
        .reduce((count, block) => count + block.content.split(" ").length, 0);
      const readingTime = Math.ceil(wordCount / 200);
      
      const updatedBlog = {
        ...adminData,
        readingTime,
        updatedAt: new Date(),
        publishedAt: new Date()
      };
      
      await blogsCollection.updateOne(
        { slug: adminData.slug },
        { $set: updatedBlog }
      );
      console.log('   ✅ Test blog updated successfully!');
    } else {
      // Calculate reading time (same as backend)
      const wordCount = adminData.content
        .filter(block => block.type === "paragraph")
        .reduce((count, block) => count + block.content.split(" ").length, 0);
      const readingTime = Math.ceil(wordCount / 200);
      
      const newBlog = {
        ...adminData,
        readingTime,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      };
      
      const result = await blogsCollection.insertOne(newBlog);
      console.log('   ✅ Test blog created successfully!');
      console.log('   Blog ID:', result.insertedId);
    }
    
    // Verify the blog was saved correctly
    console.log('\n5️⃣ Database Verification:');
    
    const savedBlog = await blogsCollection.findOne({ slug: adminData.slug });
    if (savedBlog) {
      console.log('   ✅ Blog found in database');
      console.log('   📊 Content blocks saved:', savedBlog.content.length);
      console.log('   🔍 Content types preserved:', savedBlog.content.map(b => b.type));
      console.log('   📈 Reading time calculated:', savedBlog.readingTime);
      console.log('   👁️  Views count:', savedBlog.views);
      
      // Verify content block metadata
      console.log('\n   📦 Content Block Metadata Verification:');
      savedBlog.content.forEach((block, index) => {
        const hasMetadata = block.metadata && Object.keys(block.metadata).length > 0;
        const metadataInfo = hasMetadata ? `✅ ${JSON.stringify(block.metadata)}` : '❌ No metadata';
        console.log(`     Block ${index + 1}: ${block.type} - ${metadataInfo}`);
      });
      
    } else {
      console.log('   ❌ Blog not found in database');
    }
    
    // Test public API access
    console.log('\n6️⃣ Public API Access Test:');
    
    const publicBlog = await blogsCollection.findOne(
      { slug: adminData.slug, status: "published" },
      {
        projection: {
          _id: 1,
          title: 1,
          slug: 1,
          content: 1,
          excerpt: 1,
          heroImage: 1,
          author: 1,
          category: 1,
          tags: 1,
          publishedAt: 1,
          readingTime: 1,
          views: 1,
          featured: 1,
          seo: 1
        }
      }
    );
    
    if (publicBlog) {
      console.log('   ✅ Public API can access the blog');
      console.log('   📊 Content blocks accessible:', publicBlog.content.length);
      console.log('   🔍 SEO data accessible:', !!publicBlog.seo);
    } else {
      console.log('   ❌ Public API cannot access the blog');
    }
    
    console.log('\n📝 Test Results:');
    console.log(`   You can now view your test blog at:`);
    console.log(`   http://localhost:3000/blogs`);
    console.log(`   http://localhost:3000/post/${adminData.slug}`);
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error testing complete admin flow:', error.message);
  }
}

// Run the test
testCompleteAdminFlow();
