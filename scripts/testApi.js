import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local with override
dotenv.config({
  path: resolve(__dirname, '..', '.env.local'),
  override: true
});

async function testApi() {
  try {
    console.log('🚀 Testing /api/cryptobot/send endpoint...')
    
    const response = await fetch('http://localhost:3000/api/cryptobot/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: '0x3f6bb1bdaaacafd020194d452a5a1afce89114cd5fafa3aebc9b214e83aa2ef2',
        amount: '0.001'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Response not OK:', response.status);
      console.error('Response body:', errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
    
    if (data.digest) {
      console.log('');
      console.log('📝 Transaction hash:', data.digest);
      console.log('💰 From:', data.from);
      console.log('📬 To:', data.to);
      console.log('💵 Amount:', data.amount, 'SUI');
      console.log('🔗 Explorer:', data.explorer);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('💡 Make sure your Next.js server is running on port 3000');
    process.exit(1);
  }
}

// Run the test
testApi();
