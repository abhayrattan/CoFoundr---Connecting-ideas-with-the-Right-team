async function testDelete() {
  const email = 'resume_delete_' + Date.now() + '@example.com';
  

  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Delete Test', email, password: 'password123', role: 'student' })
  });
  const regData = await regRes.json();
  const token = regData.token;

 
  const formData = new FormData();
  const blob = new Blob(['Fake PDF content'], { type: 'application/pdf' });
  formData.append('resume', blob, 'to-delete.pdf');

  const uploadRes = await fetch('http://localhost:5000/api/users/profile/resume', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  const uploadData = await uploadRes.json();
  console.log('Upload Result:', uploadRes.status, uploadData.success);

  
  const deleteRes = await fetch('http://localhost:5000/api/users/profile/resume', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const deleteData = await deleteRes.json();
  console.log('Delete Result:', deleteRes.status, deleteData.message);
  console.log('User resume field after delete:', deleteData.user.resume);
}
testDelete();
