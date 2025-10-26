import fetch from 'node-fetch';

// Test the base URL first
const BASE_URL = 'https://crypto-bot-landing-page.vercel.app';
//const API_URL = `${BASE_URL}/api/cryptobot/send`;
const API_URL = 'http://localhost:3000/api/cryptobot/send';

async function testApi() {
  try {
    console.log('🚀 Testing production endpoint...');
    
    // First check if the base URL is accessible
    console.log('\n🔍 Testing base URL:', BASE_URL);
    const baseResponse = await fetch(BASE_URL);
    console.log('Base URL Status:', baseResponse.status);
    
    // Now test the API endpoint
    console.log('\n📍 Testing API URL:', API_URL);
    
    // Test the POST request
    console.log('\n🔍 Testing POST request...');
    const postData = {
      recipient: '0x3f6bb1bdaaacafd020194d452a5a1afce89114cd5fafa3aebc9b214e83aa2ef2',
      amount: 0.001
    };
    console.log('POST Data:', JSON.stringify(postData, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });

    console.log('POST Status:', response.status);
    console.log('POST Headers:', response.headers);
    
    const text = await response.text();
    console.log('POST Response:', text);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${text}`);
    }

    try {
      const data = JSON.parse(text);
      console.log('\n✅ Parsed Response:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('❌ Could not parse response as JSON');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testApi();