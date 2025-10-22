const fetch = require('node-fetch');

// Test blog data
const testBlog = {
  title: "Advanced React Patterns for Modern Applications",
  excerpt: "Explore advanced React patterns and techniques that will help you build more maintainable, performant, and scalable applications.",
  content: [
    {
      id: "1",
      type: "heading",
      content: "Advanced React Patterns",
      metadata: {
        level: 1
      }
    },
    {
      id: "2",
      type: "paragraph",
      content: "React has evolved significantly over the years, and with it, the patterns and best practices have matured. In this comprehensive guide, we'll explore advanced React patterns that will help you build more maintainable, performant, and scalable applications."
    },
    {
      id: "3",
      type: "heading",
      content: "Custom Hooks Pattern",
      metadata: {
        level: 2
      }
    },
    {
      id: "4",
      type: "paragraph",
      content: "Custom hooks are one of the most powerful features in React. They allow you to extract component logic into reusable functions."
    },
    {
      id: "5",
      type: "code",
      content: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`,
      metadata: {
        language: "javascript"
      }
    },
    {
      id: "6",
      type: "heading",
      content: "Render Props Pattern",
      metadata: {
        level: 2
      }
    },
    {
      id: "7",
      type: "paragraph",
      content: "Render props is a pattern where you pass a function as a prop to a component, allowing the component to render content based on its internal state."
    },
    {
      id: "8",
      type: "code",
      content: `function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return render(position);
}

// Usage
<Mouse render={({ x, y }) => (
  <h1>The mouse position is ({x}, {y})</h1>
)} />`,
      metadata: {
        language: "javascript"
      }
    },
    {
      id: "9",
      type: "heading",
      content: "Compound Components",
      metadata: {
        level: 2
      }
    },
    {
      id: "10",
      type: "paragraph",
      content: "Compound components allow you to create components that work together to form a cohesive UI while maintaining flexibility in their arrangement."
    },
    {
      id: "11",
      type: "code",
      content: `const Select = ({ children, value, onChange }) => {
  return (
    <div className="select">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onChange });
        }
        return child;
      })}
    </div>
  );
};

Select.Option = ({ children, value, onChange, optionValue }) => {
  return (
    <div 
      className={\`option \${value === optionValue ? 'selected' : ''}\`}
      onClick={() => onChange(optionValue)}
    >
      {children}
    </div>
  );
};`,
      metadata: {
        language: "javascript"
      }
    },
    {
      id: "12",
      type: "heading",
      content: "Performance Optimization",
      metadata: {
        level: 2
      }
    },
    {
      id: "13",
      type: "paragraph",
      content: "Performance optimization in React is crucial for building fast applications. Here are some key techniques:"
    },
    {
      id: "14",
      type: "list",
      content: "React.memo for component memoization\nuseMemo for expensive calculations\nuseCallback for function memoization\nCode splitting with React.lazy\nVirtual scrolling for large lists",
      metadata: {
        listType: "unordered"
      }
    },
    {
      id: "15",
      type: "heading",
      content: "Conclusion",
      metadata: {
        level: 2
      }
    },
    {
      id: "16",
      type: "paragraph",
      content: "Advanced React patterns help you write more maintainable and performant code. By understanding and implementing these patterns, you'll be able to build better applications and solve complex problems more elegantly."
    }
  ],
  heroImage: "/blog image 2.jpg",
  author: {
    name: "SR Holding Team",
    email: "team@srholding.org",
    avatar: "/placeholder-user.jpg"
  },
  category: "React Development",
  tags: ["React", "JavaScript", "Web Development", "Performance", "Patterns"],
  status: "published",
  featured: true,
  seo: {
    metaTitle: "Advanced React Patterns for Modern Applications",
    metaDescription: "Learn advanced React patterns including custom hooks, render props, compound components, and performance optimization techniques.",
    keywords: ["React", "JavaScript", "Web Development", "Performance", "Patterns"],
    socialTitle: "Advanced React Patterns: Build Better Applications",
    socialDescription: "Master advanced React patterns for building maintainable, performant, and scalable applications.",
    socialImage: "/blog image 2.jpg"
  }
};

async function testAdminAPI() {
  try {
    console.log('🚀 Testing admin API route...');
    console.log('📝 Blog Title:', testBlog.title);
    console.log('🔗 Expected Slug:', testBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    
    const response = await fetch('http://localhost:3000/api/admin/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: This will fail without authentication
        // You need to either:
        // 1. Login to admin panel first and get session cookie
        // 2. Temporarily disable auth for testing
        // 3. Use the direct MongoDB approach instead
      },
      body: JSON.stringify(testBlog)
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Blog created successfully through admin API!');
      console.log('Blog ID:', result.blogId);
      console.log('\n📝 You can now view your blog at:');
      console.log(`http://localhost:3000/blogs`);
      console.log(`http://localhost:3000/post/${testBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`);
    } else {
      const error = await response.text();
      console.error('❌ Failed to create blog through admin API');
      console.error('Status:', response.status);
      console.error('Error:', error);
      
      if (response.status === 401) {
        console.log('\n🔐 Authentication required!');
        console.log('To test the admin API, you need to:');
        console.log('1. Start your development server: npm run dev');
        console.log('2. Go to http://localhost:3000/admin');
        console.log('3. Login with admin credentials');
        console.log('4. Get the session cookie from browser dev tools');
        console.log('5. Add it to the request headers');
        console.log('\n💡 Alternative: Use the direct MongoDB script instead');
        console.log('Run: node scripts/create-test-blog.js');
      }
    }
  } catch (error) {
    console.error('❌ Error testing admin API:', error.message);
    console.log('\n💡 Make sure your development server is running: npm run dev');
  }
}

// Run the test
testAdminAPI();
