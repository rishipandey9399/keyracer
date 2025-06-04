/**
 * Test script for CodeRacer API endpoints
 * Run this after starting the server and seeding the database
 * Usage: node test-api.js
 */

const http = require('http');

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

async function testEndpoints() {
  const baseUrl = 'http://localhost:3000';
  const tests = [
    {
      name: 'Get Leaderboard',
      path: '/api/leaderboard',
      expected: 'Array of users with rankings'
    },
    {
      name: 'Get Leaderboard with Filters',
      path: '/api/leaderboard?period=week&language=python&difficulty=easy',
      expected: 'Filtered leaderboard data'
    },
    {
      name: 'Get Challenges',
      path: '/api/challenges',
      expected: 'Array of coding challenges'
    },
    {
      name: 'Get Challenge by ID (first challenge)',
      path: '/api/challenges/1', // Will need to be updated with actual ID
      expected: 'Single challenge details'
    },
    {
      name: 'Get User Position (Alice)',
      path: '/api/leaderboard/user/alice_dev/position',
      expected: 'User ranking information'
    }
  ];

  console.log('🧪 Testing CodeRacer API Endpoints');
  console.log('====================================\n');

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`URL: ${baseUrl}${test.path}`);
      
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: test.path,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await makeRequest(options);
      
      if (response.statusCode === 200) {
        console.log('✅ Status: 200 OK');
        
        try {
          const jsonData = JSON.parse(response.data);
          console.log(`📊 Data type: ${Array.isArray(jsonData) ? 'Array' : typeof jsonData}`);
          
          if (Array.isArray(jsonData)) {
            console.log(`📏 Array length: ${jsonData.length}`);
            if (jsonData.length > 0) {
              console.log(`🔍 Sample item keys: ${Object.keys(jsonData[0]).join(', ')}`);
            }
          } else if (typeof jsonData === 'object') {
            console.log(`🔍 Object keys: ${Object.keys(jsonData).join(', ')}`);
          }
        } catch (parseError) {
          console.log('📄 Response (text):', response.data.substring(0, 200));
        }
      } else {
        console.log(`❌ Status: ${response.statusCode}`);
        console.log(`📄 Response: ${response.data.substring(0, 200)}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log('💡 Make sure the server is running on port 3000');
      }
    }
    
    console.log('─'.repeat(50));
  }

  console.log('\n🔧 Manual Testing Instructions:');
  console.log('1. Start server: node server/server.js');
  console.log('2. Seed database: node server/seeds/index.js');
  console.log('3. Visit: http://localhost:3000/coderacer-leaderboard.html');
  console.log('4. Test API: curl http://localhost:3000/api/leaderboard');
}

// Run tests
testEndpoints().catch(console.error);
