#!/usr/bin/env node

/**
 * Script to test the contact API endpoint
 * Usage: node scripts/test-contact-api.js
 */

const testData = {
  firstName: "John",
  lastName: "Doe", 
  email: "john.doe@example.com",
  phone: "+1234567890",
  topic: "general-inquiry",
  message: "This is a test message to verify the contact API is working correctly."
};

async function testContactAPI() {
  try {
    console.log('🧪 Testing contact API...');
    console.log('📤 Sending test data:', testData);
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', result);
    
    if (response.ok && result.success) {
      console.log('✅ Contact API test successful!');
    } else {
      console.log('❌ Contact API test failed!');
      console.log('Error details:', result);
    }
    
  } catch (error) {
    console.error('❌ Error testing contact API:', error.message);
    console.log('💡 Make sure your Next.js server is running on localhost:3000');
  }
}

// Run the test
testContactAPI();
