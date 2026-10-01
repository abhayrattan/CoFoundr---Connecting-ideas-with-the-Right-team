async function testAuth() {
  const email = 'test_unique_email_' + Date.now() + '@example.com';
  console.log('Testing with email:', email);

  try {
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email, password: 'password123', role: 'student' })
    });
    const regData = await regRes.json();
    console.log('Register Success:', regData.success);
    
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Success:', loginData.success);
    if (!loginData.success) {
      console.log('Login failed message:', loginData.message);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
testAuth();
