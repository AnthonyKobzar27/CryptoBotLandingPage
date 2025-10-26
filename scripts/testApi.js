import fetch from 'node-fetch';

const API_URL = 'https://crypto-bot-landing-page.vercel.app/api/cryptobot/send';

async function testApi() {
  try {
    console.log('🚀 Testing production API endpoint...');
    console.log('📍 URL:', API_URL);
    
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