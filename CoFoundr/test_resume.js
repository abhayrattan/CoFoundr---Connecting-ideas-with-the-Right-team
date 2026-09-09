const fs = require('fs');
const path = require('path');

async function testUpload() {
  const email = 'resume_test_' + Date.now() + '@example.com';
  
  // Register user
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Resume Test', email, password: 'password123', role: 'student' })
  });
  const regData = await regRes.json();
  const token = regData.token;
  console.log('Registered, Token:', !!token);

  // Create a dummy PDF file
  const testFilePath = path.join(__dirname, 'test-resume.pdf');
  fs.writeFileSync(testFilePath, 'Dummy PDF content for testing');

  const formData = new FormData();
  const blob = new Blob([fs.readFileSync(testFilePath)], { type: 'application/pdf' });
  formData.append('resume', blob, 'test-resume.pdf');

  try {
    const uploadRes = await fetch('http://localhost:5000/api/users/profile/resume', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const uploadData = await uploadRes.json();
    console.log('Upload Result:', uploadRes.status, uploadData);
  } catch (err) {
    console.error('Upload Error:', err);
  }

  fs.unlinkSync(testFilePath);
}

testUpload();
