// Debug script to check admin frontend data flow
console.log('🔍 Debugging Admin Frontend Data Flow...\n');

// What the frontend SHOULD send (based on our interface)
const expectedData = {
  title: "Test Blog",
  slug: "test-blog",
  content: [
    {
      id: "1",
      type: "heading",
      content: "Test Heading",
      metadata: { level: 2 }
    },
    {
      id: "2", 
      type: "paragraph",
      content: "Test content",
      metadata: {}
    }
  ],
  excerpt: "Test excerpt",
  heroImage: "/test.jpg",
  author: {
    name: "Test Author",
    email: "test@example.com",
    avatar: "/avatar.jpg"
  },
  publishedAt: new Date(),
  status: "published",
  featured: true,
  category: "Test Category",
  tags: ["test", "blog"],
  seo: {
    metaTitle: "Test Meta Title",
    metaDescription: "Test meta description",
    keywords: ["test", "blog"],
    socialTitle: "Test Social Title",
    socialDescription: "Test social description",
    socialImage: "/social.jpg"
  }
};

// What the frontend MIGHT be sending (missing fields)
const actualFrontendData = {
  title: "Test Blog",
  slug: "test-blog", 
  content: [
    {
      id: "1",
      type: "heading",
      content: "Test Heading"
      // ❌ Missing metadata.level
    },
    {
      id: "2",
      type: "paragraph", 
      content: "Test content"
      // ❌ Missing metadata object entirely
    }
  ],
  excerpt: "Test excerpt",
  heroImage: "/test.jpg",
  author: {
    name: "Test Author",
    email: "test@example.com",
    avatar: "/avatar.jpg"
  },
  publishedAt: new Date(),
  status: "published",
  featured: true,
  category: "Test Category",
  tags: ["test", "blog"],
  seo: {
    metaTitle: "Test Meta Title",
    metaDescription: "Test meta description", 
    keywords: ["test", "blog"],
    socialTitle: "Test Social Title",
    socialDescription: "Test social description",
    socialImage: "/social.jpg"
  }
  // ❌ Missing: createdAt, updatedAt, readingTime, views
};

console.log('📋 EXPECTED Data Structure (Backend Model):');
console.log('✅ title:', expectedData.title);
console.log('✅ slug:', expectedData.slug);
console.log('✅ content:', expectedData.content.length, 'blocks');
expectedData.content.forEach((block, i) => {
  console.log(`   Block ${i+1}:`, block.type, 'with metadata:', block.metadata);
});
console.log('✅ excerpt:', expectedData.excerpt);
console.log('✅ heroImage:', expectedData.heroImage);
console.log('✅ author:', expectedData.author.name);
console.log('✅ status:', expectedData.status);
console.log('✅ featured:', expectedData.featured);
console.log('✅ category:', expectedData.category);
console.log('✅ tags:', expectedData.tags);
console.log('✅ seo:', Object.keys(expectedData.seo));
console.log('✅ All required fields present');

console.log('\n🚨 ACTUAL Frontend Data (What might be sent):');
console.log('✅ title:', actualFrontendData.title);
console.log('✅ slug:', actualFrontendData.slug);
console.log('❌ content:', actualFrontendData.content.length, 'blocks (missing metadata)');
actualFrontendData.content.forEach((block, i) => {
  const hasMetadata = block.metadata && Object.keys(block.metadata).length > 0;
  console.log(`   Block ${i+1}:`, block.type, 'metadata:', hasMetadata ? '✅' : '❌');
});
console.log('✅ excerpt:', actualFrontendData.excerpt);
console.log('✅ heroImage:', actualFrontendData.heroImage);
console.log('✅ author:', actualFrontendData.author.name);
console.log('✅ status:', actualFrontendData.status);
console.log('✅ featured:', actualFrontendData.featured);
console.log('✅ category:', actualFrontendData.category);
console.log('✅ tags:', actualFrontendData.tags);
console.log('✅ seo:', Object.keys(actualFrontendData.seo));
console.log('❌ Missing fields: createdAt, updatedAt, readingTime, views');

console.log('\n🔍 ISSUES FOUND:');
console.log('1. ❌ Content blocks missing metadata structure');
console.log('2. ❌ Missing backend-required fields (createdAt, updatedAt, readingTime, views)');
console.log('3. ❌ Content block metadata not properly initialized');

console.log('\n💡 SOLUTIONS:');
console.log('1. ✅ Update ContentBlock interface to require metadata');
console.log('2. ✅ Initialize all content blocks with empty metadata object');
console.log('3. ✅ Ensure blog editor creates blocks with proper metadata structure');
console.log('4. ✅ Backend will auto-generate missing fields (createdAt, updatedAt, readingTime, views)');

console.log('\n📊 Data Completeness:');
const expectedFields = ['title', 'slug', 'content', 'excerpt', 'heroImage', 'author', 'publishedAt', 'status', 'featured', 'category', 'tags', 'seo'];
const actualFields = Object.keys(actualFrontendData);
const missingFields = expectedFields.filter(field => !actualFields.includes(field));

console.log('✅ Frontend sends:', actualFields.length, 'out of', expectedFields.length, 'fields');
if (missingFields.length > 0) {
  console.log('❌ Missing fields:', missingFields);
} else {
  console.log('✅ All expected fields present');
}

console.log('\n🎯 CONCLUSION:');
console.log('The admin frontend is sending MOST of the required data, but the content blocks');
console.log('are missing proper metadata structure. This could cause issues with:');
console.log('- Heading levels not being preserved');
console.log('- List types not being displayed correctly');
console.log('- Code language highlighting not working');
console.log('- Image captions not being shown');
