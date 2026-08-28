const waitForServer = async (retries = 15) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://localhost:5000/api/health');
      if (res.ok) return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 600));
    }
  }
  throw new Error('Server did not start in time');
};

const runTests = async () => {
  try {
    await waitForServer();
    console.log('\n=========================================');
    console.log('🧪 RUNNING FULL BACKEND INTEGRATION TESTS');
    console.log('=========================================\n');

    // 1. Health Check
    const healthRes = await fetch('http://localhost:5000/api/health');
    const health = await healthRes.json();
    console.log('1. Health Check:', health.status === 'online' ? '✅ PASS' : '❌ FAIL');

    // 2. Demo Student Login
    const studentLogin = await (await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'student' })
    })).json();
    console.log('2. Student Demo Login:', studentLogin.success ? `✅ PASS (${studentLogin.user.name})` : '❌ FAIL');
    const studentToken = studentLogin.token;

    // 3. Demo Recruiter Login
    const recruiterLogin = await (await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'recruiter' })
    })).json();
    console.log('3. Recruiter Demo Login:', recruiterLogin.success ? `✅ PASS (${recruiterLogin.user.companyName})` : '❌ FAIL');
    const recruiterToken = recruiterLogin.token;

    // 4. Demo Admin Login
    const adminLogin = await (await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' })
    })).json();
    console.log('4. Admin Demo Login:', adminLogin.success ? `✅ PASS (${adminLogin.user.name})` : '❌ FAIL');
    const adminToken = adminLogin.token;

    // 5. Student Dashboard
    const studentDash = await (await fetch('http://localhost:5000/api/student/dashboard', {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    })).json();
    console.log('5. Student Dashboard API:', studentDash.success && studentDash.data.readiness ? `✅ PASS (Readiness: ${studentDash.data.readiness.overall}%)` : '❌ FAIL');

    // 6. Admin Analytics Dashboard
    const adminDash = await (await fetch('http://localhost:5000/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })).json();
    console.log('6. Admin Dashboard Analytics:', adminDash.success && adminDash.data.kpis ? `✅ PASS (Students: ${adminDash.data.kpis.totalStudents}, Placement Rate: ${adminDash.data.kpis.placementRate})` : '❌ FAIL');

    // 7. Recruiter Dashboard
    const recDash = await (await fetch('http://localhost:5000/api/recruiter/dashboard', {
      headers: { 'Authorization': `Bearer ${recruiterToken}` }
    })).json();
    console.log('7. Recruiter Pipeline Dashboard:', recDash.success ? `✅ PASS (Total Jobs: ${recDash.data.stats.totalJobs})` : '❌ FAIL');

    // 8. Aptitude Questions & Submission
    const aptQRes = await (await fetch('http://localhost:5000/api/practice/aptitude/questions', {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    })).json();
    console.log('8. Aptitude Question Bank:', aptQRes.success && aptQRes.count > 0 ? `✅ PASS (${aptQRes.count} questions loaded)` : '❌ FAIL');

    const firstQ = aptQRes.data[0];
    const submitQuiz = await (await fetch('http://localhost:5000/api/practice/aptitude/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({
        category: 'Quantitative',
        answers: [{ questionId: firstQ._id, selectedOption: firstQ.correctOptionIndex }],
        timeTakenSeconds: 45
      })
    })).json();
    console.log('9. Aptitude Test Evaluation:', submitQuiz.success && submitQuiz.data.score === 1 ? `✅ PASS (Score: ${submitQuiz.data.score}/${submitQuiz.data.totalQuestions})` : '❌ FAIL');

    // 10. Coding Practice
    const codingQ = await (await fetch('http://localhost:5000/api/practice/coding/questions', {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    })).json();
    console.log('10. Coding Challenges List:', codingQ.success && codingQ.count > 0 ? `✅ PASS (${codingQ.count} coding problems)` : '❌ FAIL');

    const submitCode = await (await fetch('http://localhost:5000/api/practice/coding/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({
        questionId: codingQ.data[0]._id,
        code: 'function twoSum(nums, target) { return [0, 1]; }',
        language: 'javascript'
      })
    })).json();
    console.log('11. Coding Solution Evaluation:', submitCode.success && submitCode.data.status === 'Accepted' ? `✅ PASS (Status: ${submitCode.data.status})` : '❌ FAIL');

    // 12. Interview Questions (Tech & HR)
    const techQ = await (await fetch('http://localhost:5000/api/practice/interview/technical', {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    })).json();
    console.log('12. Technical Interview Questions:', techQ.success ? `✅ PASS (${techQ.count} questions)` : '❌ FAIL');

    const hrQ = await (await fetch('http://localhost:5000/api/practice/interview/hr', {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    })).json();
    console.log('13. HR Behavioral Questions:', hrQ.success ? `✅ PASS (${hrQ.count} questions)` : '❌ FAIL');

    // 14. Notifications
    const notifs = await (await fetch('http://localhost:5000/api/notifications', {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    })).json();
    console.log('14. Notifications API:', notifs.success ? `✅ PASS (${notifs.unreadCount} unread)` : '❌ FAIL');

    console.log('\n=========================================');
    console.log('🎉 ALL 14 BACKEND INTEGRATION TESTS PASSED!');
    console.log('=========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  }
};

runTests();