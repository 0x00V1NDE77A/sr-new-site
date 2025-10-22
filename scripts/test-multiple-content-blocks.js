const { MongoClient } = require('mongodb');

// Test script to verify multiple content blocks are working
const createTestBlog = () => {
  const testBlog = {
    title: "Multiple Content Blocks Test",
    slug: "multiple-content-blocks-test",
    content: [
      {
        id: "1",
        type: "heading",
        content: "Main Heading",
        metadata: { level: 1 }
      },
      {
        id: "2",
        type: "paragraph",
        content: "This is the first paragraph with some content.",
        metadata: {}
      },
      {
        id: "3",
        type: "heading",
        content: "Sub Heading",
        metadata: { level: 2 }
      },
      {
        id: "4",
        type: "paragraph",
        content: "This is the second paragraph with more content.",
        metadata: {}
      },
      {
        id: "5",
        type: "list",
        content: "Item 1\nItem 2\nItem 3",
        metadata: { listType: "unordered" }
      },
      {
        id: "6",
        type: "code",
        content: "console.log('Hello World');",
        metadata: { language: "javascript" }
      },
      {
        id: "7",
        type: "image",
        content: "/test-image.jpg",
        metadata: { caption: "Test Image", alt: "Test" }
      }
    ],
    excerpt: "Testing multiple content blocks functionality",
    heroImage: "/test-hero.jpg",
    author: {
      name: "Test User",
      email: "test@example.com",
      avatar: "/test-avatar.jpg"
    },
    publishedAt: new Date(),
    status: "published",
    featured: false,
    category: "Testing",
    tags: ["test", "content", "blocks"],
    seo: {
      metaTitle: "Multiple Content Blocks Test",
      metaDescription: "Testing multiple content blocks",
      keywords: ["test", "content"],
      socialTitle: "Content Blocks Test",
      socialDescription: "Test description",
      socialImage: "/test-social.jpg"
    }
  };

  return testBlog;
};

async function testMultipleContentBlocks() {
  try {
    console.log('🚀 Testing Multiple Content Blocks...\n');
    
    const testBlog = createTestBlog();
    
    console.log('1️⃣ Test Blog Structure:');
    console.log('   Title:', testBlog.title);
    console.log('   Content blocks:', testBlog.content.length);
    console.log('   Content types:', testBlog.content.map(b => b.type));
    
    console.log('\n2️⃣ Content Block Details:');
    testBlog.content.forEach((block, index) => {
      console.log(`   Block ${index + 1}:`);
      console.log(`     ID: ${block.id}`);
      console.log(`     Type: ${block.type}`);
      console.log(`     Content: ${block.content.substring(0, 50)}${block.content.length > 50 ? '...' : ''}`);
      console.log(`     Metadata:`, block.metadata);
    });
    
    console.log('\n3️⃣ JSON Serialization Test:');
    try {
      const jsonString = JSON.stringify(testBlog);
      console.log('   ✅ JSON.stringify successful');
      console.log('   📏 JSON length:', jsonString.length, 'characters');
      
      // Test parsing back
      const parsedBack = JSON.parse(jsonString);
      console.log('   ✅ JSON.parse successful');
      console.log('   📊 Parsed content blocks:', parsedBack.content.length);
      
      // Verify all blocks are preserved
      const allBlocksPreserved = parsedBack.content.length === testBlog.content.length;
      console.log('   🔍 All blocks preserved:', allBlocksPreserved ? '✅' : '❌');
      
      if (!allBlocksPreserved) {
        console.log('   🚨 BLOCK LOSS DETECTED!');
        console.log(`   Expected: ${testBlog.content.length}, Got: ${parsedBack.content.length}`);
      }
      
    } catch (error) {
      console.log('   ❌ JSON serialization failed:', error.message);
      return;
    }
    
    console.log('\n4️⃣ MongoDB Test:');
    
    const uri = "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings";
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log('   ✅ Connected to MongoDB');
    
    const db = client.db();
    const blogsCollection = db.collection('blogs');
    
    // Check if test blog exists
    const existingBlog = await blogsCollection.findOne({ slug: testBlog.slug });
    if (existingBlog) {
      console.log('   ⚠️  Test blog exists, updating...');
      
      // Calculate reading time
      const wordCount = testBlog.content
        .filter(block => block.type === "paragraph")
        .reduce((count, block) => count + block.content.split(" ").length, 0);
      const readingTime = Math.ceil(wordCount / 200);
      
      const updatedBlog = {
        ...testBlog,
        readingTime,
        updatedAt: new Date(),
        publishedAt: new Date()
      };
      
      await blogsCollection.updateOne(
        { slug: testBlog.slug },
        { $set: updatedBlog }
      );
      console.log('   ✅ Test blog updated successfully!');
    } else {
      // Calculate reading time
      const wordCount = testBlog.content
        .filter(block => block.type === "paragraph")
        .reduce((count, block) => count + block.content.split(" ").length, 0);
      const readingTime = Math.ceil(wordCount / 200);
      
      const newBlog = {
        ...testBlog,
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
    
    const savedBlog = await blogsCollection.findOne({ slug: testBlog.slug });
    if (savedBlog) {
      console.log('   ✅ Blog found in database');
      console.log('   📊 Content blocks saved:', savedBlog.content.length);
      console.log('   🔍 Content types preserved:', savedBlog.content.map(b => b.type));
      
      // Check if all blocks were saved
      if (savedBlog.content.length === testBlog.content.length) {
        console.log('   🎉 SUCCESS: All content blocks were saved!');
      } else {
        console.log('   ❌ FAILURE: Content blocks were lost!');
        console.log(`   Expected: ${testBlog.content.length}, Saved: ${savedBlog.content.length}`);
      }
      
      // Show each saved block
      console.log('\n   📦 Saved Content Blocks:');
      savedBlog.content.forEach((block, index) => {
        console.log(`     Block ${index + 1}: ${block.type} - ID: ${block.id}`);
        console.log(`       Content: ${block.content.substring(0, 40)}${block.content.length > 40 ? '...' : ''}`);
        console.log(`       Metadata: ${JSON.stringify(block.metadata)}`);
      });
      
    } else {
      console.log('   ❌ Blog not found in database');
    }
    
    console.log('\n📝 Test Results:');
    console.log(`   You can now view your test blog at:`);
    console.log(`   http://localhost:3000/blogs`);
    console.log(`   http://localhost:3000/post/${testBlog.slug}`);
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error testing multiple content blocks:', error.message);
  }
}

// Run the test
testMultipleContentBlocks();
