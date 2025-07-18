// Simple test script to validate API endpoints
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📍 URL: ${BASE_URL}${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error response: ${errorText}`);
      return false;
    }
    
    const data = await response.json();
    console.log(`✅ Success! Response size: ${JSON.stringify(data).length} chars`);
    return true;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log(`🚀 Testing API endpoints at: ${BASE_URL}`);
  
  const tests = [
    ['/api/items/18832', 'Item API - Flask of Stamina'],
    ['/api/guild/benediction/cartesian/roster', 'Guild Roster API'],
    ['/api/guild/benediction/cartesian/activity', 'Guild Activity API'],
    ['/api/character/benediction/testchar/profile', 'Character Profile API']
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const [endpoint, description] of tests) {
    const success = await testEndpoint(endpoint, description);
    if (success) passed++;
  }
  
  console.log(`\n📋 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed');
    process.exit(1);
  }
}

runTests().catch(console.error);
