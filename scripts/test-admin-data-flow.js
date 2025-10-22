const { MongoClient } = require('mongodb');

// Test the data structure that should be sent from admin frontend
const testAdminData = {
  title: "Test Admin Blog Post",
  slug: "test-admin-blog-post",
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
      content: "This is a test paragraph content.",
      metadata: {}
    },
    {
      id: "3",
      type: "list",
      content: "Item 1\nItem 2\nItem 3",
      metadata: {
        listType: "unordered"
      }
    },
    {
      id: "4",
      type: "code",
      content: "console.log('Hello World');",
      metadata: {
        language: "javascript"
      }
    },
    {
      id: "5",
      type: "image",
      content: "/test-image.jpg",
      metadata: {
        caption: "Test Image Caption",
        alt: "Test Image Alt Text"
      }
    },
    {
      id: "6",
      type: "quote",
      content: "This is a test quote with proper metadata.",
      metadata: {}
    }
  ],
  excerpt: "This is a test excerpt for the admin blog post.",
  heroImage: "/test-hero-image.jpg",
  author: {
    name: "Test Author",
    email: "test@example.com",
    avatar: "/test-avatar.jpg"
  },
  publishedAt: new Date(),
  status: "published",
  featured: true,
  category: "Testing",
  tags: ["test", "admin", "blog"],
  seo: {
    metaTitle: "Test Admin Blog Post - SEO Title",
    metaDescription: "This is a test meta description for SEO purposes.",
    keywords: ["test", "admin", "blog", "seo"],
    socialTitle: "Test Admin Blog Post - Social Title",
    socialDescription: "This is a test social description for social media sharing.",
    socialImage: "/test-social-image.jpg"
  }
};

async function testAdminDataFlow() {
  try {
    console.log('🚀 Testing Admin Data Flow...');
    console.log('📝 Blog Title:', testAdminData.title);
    console.log('🔗 Slug:', testAdminData.slug);
    console.log('📊 Content Blocks:', testAdminData.content.length);
    
    // Test content block structure
    testAdminData.content.forEach((block, index) => {
      console.log(`\n📦 Block ${index + 1}:`);
      console.log(`   Type: ${block.type}`);
      console.log(`   Content: ${block.content.substring(0, 50)}${block.content.length > 50 ? '...' : ''}`);
      console.log(`   Metadata:`, block.metadata);
    });
    
    console.log('\n🏷️  Tags:', testAdminData.tags);
    console.log('📂 Category:', testAdminData.category);
    console.log('⭐ Featured:', testAdminData.featured);
    console.log('🔍 SEO Keywords:', testAdminData.seo.keywords);
    
    // Test what the backend would receive
    console.log('\n📤 Data being sent to backend:');
    console.log(JSON.stringify(testAdminData, null, 2));
    
    // Test MongoDB connection and data insertion
    console.log('\n🗄️  Testing MongoDB connection...');
    
    const uri = "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings";
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const blogsCollection = db.collection('blogs');
    
    // Check if test blog already exists
    const existingBlog = await blogsCollection.findOne({ slug: testAdminData.slug });
    if (existingBlog) {
      console.log('⚠️  Test blog already exists, updating instead...');
      await blogsCollection.updateOne(
        { slug: testAdminData.slug },
        { 
          $set: { 
            ...testAdminData, 
            updatedAt: new Date(),
            publishedAt: new Date()
          } 
        }
      );
      console.log('✅ Test blog updated successfully!');
    } else {
      // Calculate reading time (same logic as backend)
      const wordCount = testAdminData.content
        .filter(block => block.type === "paragraph")
        .reduce((count, block) => count + block.content.split(" ").length, 0);
      const readingTime = Math.ceil(wordCount / 200);
      
      const newBlog = {
        ...testAdminData,
        readingTime,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      };
      
      const result = await blogsCollection.insertOne(newBlog);
      console.log('✅ Test blog created successfully!');
      console.log('Blog ID:', result.insertedId);
    }
    
    console.log('\n📝 You can now view your test blog at:');
    console.log(`http://localhost:3000/blogs`);
    console.log(`http://localhost:3000/post/${testAdminData.slug}`);
    
    // Test the public API to see if data is accessible
    console.log('\n🔍 Testing public API access...');
    
    // Simulate what the public API would fetch
    const publicBlog = await blogsCollection.findOne(
      { slug: testAdminData.slug, status: "published" },
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
      console.log('✅ Public API can access the blog data');
      console.log('📊 Content blocks available:', publicBlog.content.length);
      console.log('🔍 SEO data available:', !!publicBlog.seo);
      console.log('📈 Reading time calculated:', publicBlog.readingTime);
    } else {
      console.log('❌ Public API cannot access the blog data');
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error testing admin data flow:', error.message);
  }
}

// Run the test
testAdminDataFlow();
