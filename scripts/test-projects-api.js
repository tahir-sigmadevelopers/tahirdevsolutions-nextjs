/**
 * Projects API Test Script
 * This script tests the projects API endpoint directly
 */

async function testProjectsAPI() {
  try {
    console.log('🧪 Testing Projects API...\n');
    
    const baseUrl = 'http://localhost:3000';
    
    // Test API endpoint
    console.log('📡 Calling /api/projects...');
    const response = await fetch(`${baseUrl}/api/projects`);
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ API Response Success:');
      console.log('   - Projects count:', data.projects?.length || 0);
      console.log('   - Pagination:', data.pagination);
      
      if (data.projects?.length > 0) {
        console.log('\n📋 First Project:');
        console.log('   - Title:', data.projects[0].title);
        console.log('   - Category:', data.projects[0].category);
        console.log('   - Featured:', data.projects[0].featured);
      }
    } else {
      const errorData = await response.text();
      console.log('\n❌ API Response Error:');
      console.log('   - Status:', response.status);
      console.log('   - Error:', errorData);
    }
    
  } catch (error) {
    console.error('\n🚨 Network Error:', error.message);
  }
}

// For Node.js environment
if (typeof fetch === 'undefined') {
  console.log('⚠️  This script requires Node.js 18+ or a fetch polyfill');
  console.log('💡 Run this in browser console instead or visit:');
  console.log('   http://localhost:3000/api/projects');
  process.exit(1);
}

testProjectsAPI();