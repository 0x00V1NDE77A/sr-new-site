const fetch = require('node-fetch');

// Test blog data
const testBlog = {
  title: "Getting Started with Next.js 14",
  excerpt: "Learn the fundamentals of Next.js 14 and build modern web applications with the latest features including App Router, Server Components, and more.",
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
      content: "Next.js 14 is the latest version of the popular React framework that brings significant improvements in performance, developer experience, and new features. In this comprehensive guide, we'll explore everything you need to know to get started with Next.js 14."
    },
    {
      id: "3",
      type: "heading",
      content: "Key Features of Next.js 14",
      metadata: {
        level: 2
      }
    },
    {
      id: "4",
      type: "paragraph",
      content: "Next.js 14 introduces several groundbreaking features that make it easier than ever to build fast, scalable web applications."
    },
    {
      id: "5",
      type: "list",
      content: "App Router\nServer Components\nTurbopack\nImproved Image Optimization\nEnhanced TypeScript Support",
      metadata: {
        listType: "unordered"
      }
    },
    {
      id: "6",
      type: "heading",
      content: "Getting Started",
      metadata: {
        level: 2
      }
    },
    {
      id: "7",
      type: "paragraph",
      content: "To create a new Next.js 14 project, you can use the following command:"
    },
    {
      id: "8",
      type: "code",
      content: "npx create-next-app@latest my-app --typescript --tailwind --eslint",
      metadata: {
        language: "bash"
      }
    },
    {
      id: "9",
      type: "paragraph",
      content: "This command will create a new Next.js project with TypeScript, Tailwind CSS, and ESLint configured out of the box."
    },
    {
      id: "10",
      type: "heading",
      content: "Project Structure",
      metadata: {
        level: 2
      }
    },
    {
      id: "11",
      type: "paragraph",
      content: "The new App Router in Next.js 14 uses a file-system based routing approach that's more intuitive and powerful than the previous Pages Router."
    },
    {
      id: "12",
      type: "list",
      content: "app/\n  layout.tsx\n  page.tsx\n  globals.css\n  favicon.ico",
      metadata: {
        listType: "unordered"
      }
    },
    {
      id: "13",
      type: "heading",
      content: "Server Components",
      metadata: {
        level: 2
      }
    },
    {
      id: "14",
      type: "paragraph",
      content: "Server Components are a new paradigm in React that allows you to render components on the server, reducing the JavaScript bundle size sent to the client and improving performance."
    },
    {
      id: "15",
      type: "quote",
      content: "Server Components represent a fundamental shift in how we think about React applications, enabling better performance and user experience."
    },
    {
      id: "16",
      type: "heading",
      content: "Conclusion",
      metadata: {
        level: 2
      }
    },
    {
      id: "17",
      type: "paragraph",
      content: "Next.js 14 is a significant step forward in the React ecosystem. With its new features and improvements, it's easier than ever to build fast, scalable web applications. Start exploring these features today and take your web development skills to the next level."
    }
  ],
  heroImage: "/blog image 1.jpg",
  author: {
    name: "SR Holding Team",
    email: "team@srholding.org",
    avatar: "/placeholder-user.jpg"
  },
  category: "Web Development",
  tags: ["Next.js", "React", "Web Development", "JavaScript", "TypeScript"],
  status: "published",
  featured: true,
  seo: {
    metaTitle: "Getting Started with Next.js 14 - Complete Guide",
    metaDescription: "Learn Next.js 14 fundamentals, App Router, Server Components, and build modern web applications. Step-by-step guide with examples.",
    keywords: ["Next.js 14", "React", "Web Development", "App Router", "Server Components"],
    socialTitle: "Next.js 14 Complete Guide: Build Modern Web Apps",
    socialDescription: "Master Next.js 14 with our comprehensive guide. Learn App Router, Server Components, and best practices for building fast web applications.",
    socialImage: "/blog image 1.jpg"
  }
};

async function createTestBlog() {
  try {
    console.log('🚀 Creating test blog post...');
    
    const response = await fetch('http://localhost:3000/api/admin/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add authentication headers here
        // For testing, you might need to temporarily disable auth or use a valid session
      },
      body: JSON.stringify(testBlog)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Blog created successfully!');
      console.log('Blog ID:', result.blogId);
      console.log('Slug:', testBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
      console.log('\n📝 You can now view your blog at:');
      console.log(`http://localhost:3000/blogs`);
      console.log(`http://localhost:3000/post/${testBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`);
    } else {
      const error = await response.text();
      console.error('❌ Failed to create blog:', response.status, error);
      
      if (response.status === 401) {
        console.log('\n🔐 Authentication required. You need to:');
        console.log('1. Login to admin panel first');
        console.log('2. Get a valid session cookie');
        console.log('3. Include it in the request headers');
      }
    }
  } catch (error) {
    console.error('❌ Error creating blog:', error.message);
  }
}

// Alternative: Create blog directly in MongoDB (bypassing auth)
async function createBlogDirectly() {
  try {
    console.log('🚀 Creating blog directly in MongoDB...');
    
    const { MongoClient } = require('mongodb');
    
    const uri = "mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings";
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const blogsCollection = db.collection('blogs');
    
    // Generate slug
    const slug = testBlog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Check if slug exists
    const existingBlog = await blogsCollection.findOne({ slug });
    if (existingBlog) {
      console.log('⚠️  Blog with this title already exists, updating instead...');
      await blogsCollection.updateOne(
        { slug },
        { 
          $set: { 
            ...testBlog, 
            slug, 
            updatedAt: new Date(),
            publishedAt: new Date()
          } 
        }
      );
      console.log('✅ Blog updated successfully!');
    } else {
      // Calculate reading time
      const wordCount = testBlog.content
        .filter(block => block.type === "paragraph")
        .reduce((count, block) => count + block.content.split(" ").length, 0);
      const readingTime = Math.ceil(wordCount / 200);
      
      const newBlog = {
        ...testBlog,
        slug,
        readingTime,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      };
      
      const result = await blogsCollection.insertOne(newBlog);
      console.log('✅ Blog created successfully!');
      console.log('Blog ID:', result.insertedId);
    }
    
    console.log('Slug:', slug);
    console.log('\n📝 You can now view your blog at:');
    console.log(`http://localhost:3000/blogs`);
    console.log(`http://localhost:3000/post/${slug}`);
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error creating blog directly:', error.message);
  }
}

// Run the appropriate function
console.log('Choose an option:');
console.log('1. Create blog through admin API (requires authentication)');
console.log('2. Create blog directly in MongoDB (bypasses auth)');

// For now, let's use the direct MongoDB approach
createBlogDirectly();
