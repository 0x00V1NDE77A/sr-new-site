// Test script to demonstrate edge case handling
console.log('🚨 Testing Edge Cases in Content Block Conversion...\n');

// Simulate problematic content blocks (edge cases)
const problematicContent = [
  // Edge Case 1: Null block
  null,
  
  // Edge Case 2: Undefined block
  undefined,
  
  // Edge Case 3: Block with no type
  { id: "1", content: "Some content" },
  
  // Edge Case 4: Block with no content
  { id: "2", type: "paragraph" },
  
  // Edge Case 5: Block with empty content
  { id: "3", type: "paragraph", content: "" },
  
  // Edge Case 6: Block with whitespace-only content
  { id: "4", type: "paragraph", content: "   " },
  
  // Edge Case 7: Invalid heading level (0)
  { id: "5", type: "heading", content: "Invalid Heading", metadata: { level: 0 } },
  
  // Edge Case 8: Invalid heading level (10)
  { id: "6", type: "heading", content: "Invalid Heading", metadata: { level: 10 } },
  
  // Edge Case 9: Negative heading level
  { id: "7", type: "heading", content: "Invalid Heading", metadata: { level: -5 } },
  
  // Edge Case 10: Valid blocks mixed with invalid ones
  { id: "8", type: "paragraph", content: "This is valid content" },
  { id: "9", type: "heading", content: "Valid Heading", metadata: { level: 2 } },
  { id: "10", type: "image", content: "/valid-image.jpg", metadata: { caption: "Valid image" } }
];

console.log('1️⃣ Problematic Content Blocks:');
problematicContent.forEach((block, index) => {
  if (block) {
    console.log(`   Block ${index + 1}: ${block.type || 'NO TYPE'} - "${block.content || 'NO CONTENT'}"`);
  } else {
    console.log(`   Block ${index + 1}: ${block === null ? 'NULL' : 'UNDEFINED'}`);
  }
});

console.log('\n2️⃣ Testing OLD Function (Would Crash):');
console.log('   ❌ This would cause errors:');

// Simulate what the old function would do (dangerous!)
const oldFunctionSimulation = (content) => {
  return content
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p>${block.content}</p>`
        case "heading":
          const level = block.metadata?.level || 2
          return `<h${level}>${block.content}</h${level}>`
        case "image":
          return `<img src="${block.content}" />`
        default:
          return `<p>${block.content}</p>`
      }
    })
    .join('')
};

try {
  // This would crash with the old function!
  const oldResult = oldFunctionSimulation(problematicContent);
  console.log('   Result:', oldResult);
} catch (error) {
  console.log('   🚨 CRASHED with error:', error.message);
}

console.log('\n3️⃣ Testing NEW Function (Safe):');
console.log('   ✅ This handles all edge cases safely:');

// Our improved function
const improvedFunction = (content) => {
  if (!Array.isArray(content)) {
    return "<p>Content not available</p>"
  }

  return content
    .map((block) => {
      // Edge Case 1: Check if block exists and has required properties
      if (!block || !block.type || !block.content) {
        return ""
      }

      // Edge Case 2: Clean and validate content
      const cleanContent = String(block.content).trim()
      if (!cleanContent) return ""

      switch (block.type) {
        case "paragraph":
          return `<p class="mb-4 leading-relaxed text-gray-800">${cleanContent}</p>`
        
        case "heading":
          // Edge Case 3: Ensure heading level is valid (1-6)
          const level = Math.min(Math.max(block.metadata?.level || 2, 1), 6)
          const headingClass = level === 1 ? "text-4xl font-bold mb-8" : 
                              level === 2 ? "text-3xl font-semibold mb-6" :
                              "text-2xl font-semibold mb-4"
          return `<h${level} class="${headingClass}">${cleanContent}</h${level}>`
        
        case "image":
          const caption = block.metadata?.caption ? `<figcaption class="text-center text-sm text-gray-600 mt-2 italic">${block.metadata.caption}</figcaption>` : ""
          return `<figure class="my-6"><img src="${cleanContent}" alt="Blog image" class="w-full h-auto rounded-lg my-6 shadow-lg" />${caption}</figure>`
        
        default:
          return `<p class="mb-4 text-gray-700">${cleanContent}</p>`
      }
    })
    .filter(html => html.trim()) // Edge Case 4: Remove empty blocks
    .join('')
};

try {
  const newResult = improvedFunction(problematicContent);
  console.log('   ✅ Result generated successfully!');
  console.log('   📏 HTML length:', newResult.length, 'characters');
  console.log('   🔍 HTML preview:', newResult.substring(0, 200) + '...');
} catch (error) {
  console.log('   ❌ Still crashed:', error.message);
}

console.log('\n4️⃣ Edge Case Summary:');
console.log('   🚨 OLD FUNCTION:');
console.log('     - Crashes on null/undefined blocks');
console.log('     - Creates empty HTML elements');
console.log('     - Generates invalid HTML (h0, h10, etc.)');
console.log('     - No content validation');

console.log('   ✅ NEW FUNCTION:');
console.log('     - Handles null/undefined safely');
console.log('     - Skips empty content');
console.log('     - Validates heading levels (1-6)');
console.log('     - Filters out empty HTML');
console.log('     - Robust error handling');

console.log('\n🎯 The Result:');
console.log('   Your blog pages will now work reliably even with:');
console.log('   - Database inconsistencies');
console.log('   - Admin panel bugs');
console.log('   - Malformed content');
console.log('   - Missing metadata');
console.log('   - Empty content blocks');
