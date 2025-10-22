const { MongoClient } = require('mongodb');

// Simulate the exact data structure that the admin frontend creates
const simulateAdminFrontendData = () => {
  // This simulates what the admin frontend actually sends
  const blogData = {
    title: "Real Admin Blog Test",
    slug: "real-admin-blog-test",
    content: [
      {
        id: "1",
        type: "heading",
        content: "Introduction to Next.js 14",
        metadata: {
          level: 1
        }
      },
      {
        id: "2",
        type: "paragraph",
        content: "Next.js 14 is the latest version of the popular React framework that brings significant improvements in performance, developer experience, and new features.",
        metadata: {}
      },
      {
        id: "3",
        type: "heading",
        content: "Key Features",
        metadata: {
          level: 2
        }
      },
      {
        id: "4",
        type: "list",
        content: "App Router\nServer Components\nTurbopack\nImproved performance",
        metadata: {
          listType: "unordered"
        }
      },
      {
        id: "5",
        type: "code",
        content: "npm create next-app@latest my-app\ncd my-app\nnpm run dev",
        metadata: {
          language: "bash"
        }
      },
      {
        id: "6",
        type: "quote",
        content: "Next.js 14 represents a significant step forward in the React ecosystem, making it easier than ever to build fast, scalable web applications.",
        metadata: {}
      },
      {
        id: "7",
        type: "image",
        content: "/nextjs-14-logo.png",
        metadata: {
          caption: "Next.js 14 Logo",
          alt: "Next.js 14 framework logo"
        }
      }
    ],
    excerpt: "Explore the exciting new features and improvements in Next.js 14, the latest version of the popular React framework.",
    heroImage: "/nextjs-14-hero.jpg",
    author: {
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/admin-avatar.jpg"
    },
    publishedAt: new Date(),
    status: "published",
    featured: true,
    category: "Web Development",
    tags: ["nextjs", "react", "web-development", "frontend"],
    seo: {
      metaTitle: "Next.js 14: Complete Guide to New Features and Improvements",
      metaDescription: "Learn about the latest features in Next.js 14 including App Router, Server Components, and performance improvements.",
      keywords: ["nextjs", "react", "web development", "frontend", "framework"],
      socialTitle: "Next.js 14: What's New and Exciting",
      socialDescription: "Discover the powerful new features in Next.js 14 that will transform your web development workflow.",
      socialImage: "/nextjs-14-social.jpg"
    }
  };

  return blogData;
};

async function testRealAdminFlow() {
  try {
    console.log('🚀 Testing Real Admin Frontend Data Flow...\n');
    
    const adminData = simulateAdminFrontendData();
    
    console.log('📝 Blog Title:', adminData.title);
    console.log('🔗 Slug:', adminData.slug);
    console.log('📊 Content Blocks:', adminData.content.length);
    
    // Analyze content block structure
    console.log('\n📦 Content Block Analysis:');
    adminData.content.forEach((block, index) => {
      const hasMetadata = block.metadata && Object.keys(block.metadata).length > 0;
      const metadataInfo = hasMetadata ? `✅ ${JSON.stringify(block.metadata)}` : '❌ No metadata';
      
      console.log(`   Block ${index + 1}: ${block.type} - ${metadataInfo}`);
      console.log(`      Content: ${block.content.substring(0, 60)}${block.content.length > 60 ? '...' : ''}`);
    });
    
    console.log('\n🏷️  Tags:', adminData.tags);
    console.log('📂 Category:', adminData.category);
    console.log('⭐ Featured:', adminData.featured);
    console.log('🔍 SEO Keywords:', adminData.seo.keywords);
    
    // Test MongoDB connection and data insertion
    console.log('\n🗄️  Testing MongoDB connection and data insertion...');
    
    const uri = "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings";
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const blogsCollection = db.collection('blogs');
    
    // Check if test blog already exists
    const existingBlog = await blogsCollection.findOne({ slug: adminData.slug });
    if (existingBlog) {
      console.log('⚠️  Test blog already exists, updating instead...');
      
      // Calculate reading time (same logic as backend)
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
      console.log('✅ Test blog updated successfully!');
    } else {
      // Calculate reading time (same logic as backend)
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
      console.log('✅ Test blog created successfully!');
      console.log('Blog ID:', result.insertedId);
    }
    
    // Test what the public API would fetch
    console.log('\n🔍 Testing Public API Data Access...');
    
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
      console.log('✅ Public API can access the blog data');
      console.log('📊 Content blocks available:', publicBlog.content.length);
      console.log('🔍 SEO data available:', !!publicBlog.seo);
      console.log('📈 Reading time calculated:', publicBlog.readingTime);
      console.log('👁️  Views count:', publicBlog.views);
      
      // Verify content block metadata preservation
      console.log('\n🔍 Content Block Metadata Verification:');
      publicBlog.content.forEach((block, index) => {
        const hasMetadata = block.metadata && Object.keys(block.metadata).length > 0;
        const metadataInfo = hasMetadata ? `✅ ${JSON.stringify(block.metadata)}` : '❌ No metadata';
        console.log(`   Block ${index + 1}: ${block.type} - ${metadataInfo}`);
      });
    } else {
      console.log('❌ Public API cannot access the blog data');
    }
    
    console.log('\n📝 You can now view your test blog at:');
    console.log(`http://localhost:3000/blogs`);
    console.log(`http://localhost:3000/post/${adminData.slug}`);
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error testing real admin flow:', error.message);
  }
}

// Run the test
testRealAdminFlow();
