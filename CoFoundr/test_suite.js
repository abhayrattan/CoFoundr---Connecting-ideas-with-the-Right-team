async function testSuite() {
  const emailBase = 'test_suite_' + Date.now() + '@example.com';
  
  console.log('=== TEST 1: New Account ===');
  let res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: emailBase, password: 'password123', role: 'student' })
  });
  console.log('Register status:', res.status, (await res.json()).success);
  
  res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailBase, password: 'password123' })
  });
  console.log('Login status:', res.status, (await res.json()).success);
  
  console.log('\n=== TEST 2: Wrong Password ===');
  res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailBase, password: 'wrongpassword' })
  });
  let data = await res.json();
  console.log('Login status:', res.status, data.message);
  
  console.log('\n=== TEST 3: Wrong Email ===');
  res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent_' + Date.now() + '@example.com', password: 'password123' })
  });
  data = await res.json();
  console.log('Login status:', res.status, data.message);
  
  console.log('\n=== TEST 4: Duplicate Email ===');
  res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: emailBase, password: 'password123', role: 'student' })
  });
  data = await res.json();
  console.log('Register status:', res.status, data.message);
  
  console.log('\n=== TEST 5: Email Case ===');
  res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Case', email: 'TestCase@Example.com', password: 'password123', role: 'student' })
  });
  // might already exist from previous run, ignore if so
  res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'testcase@example.com', password: 'password123' })
  });
  data = await res.json();
  console.log('Login with lowercase status:', res.status, data.success);
  
  console.log('\n=== TEST 6: Email Spaces ===');
  const spaceEmail = '  spaced_' + Date.now() + '@example.com  ';
  res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Space', email: spaceEmail, password: 'password123', role: 'student' })
  });
  res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: spaceEmail.trim(), password: 'password123' })
  });
  data = await res.json();
  console.log('Login with trimmed status:', res.status, data.success);

}
testSuite();
