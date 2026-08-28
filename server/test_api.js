import app from './server.js';

console.log('Testing server health endpoint...');
setTimeout(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/health');
    const data = await res.json();
    console.log('Health Response:', data);

    const demoLoginRes = await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'student' })
    });
    const loginData = await demoLoginRes.json();
    console.log('Demo Student Login:', loginData.success, 'User:', loginData.user?.name);

    const jobsRes = await fetch('http://localhost:5000/api/jobs', {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    const jobsData = await jobsRes.json();
    console.log('Jobs fetched:', jobsData.count, 'jobs');

    console.log('🎉 Server and APIs fully operational!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}, 2000);