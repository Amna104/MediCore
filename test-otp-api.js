// Quick test script to verify OTP API error handling
// Run with: node test-otp-api.js

const testOTPAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com'
      })
    });

    const data = await response.json();
    
    console.log('\n=== OTP API Test Results ===');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success) {
      console.log('\n⚠️  Error detected (this is expected if env vars are missing):');
      console.log('Message:', data.message);
    } else {
      console.log('\n✅ OTP sent successfully!');
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
};

console.log('Testing OTP API endpoint...');
console.log('Make sure your dev server is running on http://localhost:3000\n');

testOTPAPI();

