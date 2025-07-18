// Local test to verify API structure
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock Vercel request/response for testing
class MockRequest {
  constructor(url, method = 'GET') {
    this.url = url;
    this.method = method;
    
    // Parse URL to extract query params like Vercel would
    const urlParts = url.split('/');
    const apiIndex = urlParts.indexOf('api');
    const pathAfterApi = urlParts.slice(apiIndex + 1);
    
    if (pathAfterApi[0] === 'guild') {
      // /api/guild/realm/guild/endpoint -> params = [realm, guild, endpoint]
      this.query = {
        params: pathAfterApi.slice(1) // Remove 'guild' from the path
      };
    } else if (pathAfterApi[0] === 'character') {
      // /api/character/realm/character/endpoint -> params = [realm, character, endpoint]
      this.query = {
        params: pathAfterApi.slice(1) // Remove 'character' from the path
      };
    }
  }
}

class MockResponse {
  constructor() {
    this.headers = {};
    this.statusCode = 200;
    this.body = null;
  }
  
  setHeader(key, value) {
    this.headers[key] = value;
  }
  
  status(code) {
    this.statusCode = code;
    return this;
  }
  
  json(data) {
    this.body = JSON.stringify(data);
    console.log(`Response ${this.statusCode}:`, data);
    return this;
  }
  
  end() {
    console.log('Response ended');
  }
}

// Test URLs
const testUrls = [
  '/api/guild/benediction/cartesian/roster',
  '/api/guild/benediction/cartesian/activity',
  '/api/character/benediction/testchar/profile'
];

console.log('🧪 Testing URL parsing...\n');

testUrls.forEach(url => {
  console.log(`\n📍 Testing: ${url}`);
  const req = new MockRequest(url);
  console.log('Parsed query:', req.query);
  
  if (req.query.params) {
    const [param1, param2, param3] = req.query.params;
    console.log('Extracted params:', { param1, param2, param3 });
  }
});

console.log('\n✅ URL parsing test complete!');
