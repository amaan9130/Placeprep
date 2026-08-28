export const calculateReadiness = (profile, testResults = [], codingSubmissions = [], interviewPractices = []) => {
  let profilePoints = 0;
  if (profile.rollNumber) profilePoints += 15;
  if (profile.skills && profile.skills.length >= 3) profilePoints += 25;
  if (profile.education && profile.education.length >= 1) profilePoints += 20;
  if (profile.projects && profile.projects.length >= 1) profilePoints += 25;
  if (profile.certifications && profile.certifications.length >= 1) profilePoints += 15;
  const profileScore = Math.min(100, Math.max(0, profilePoints));

  let aptitudeScore = 0;
  if (testResults.length > 0) {
    const avg = testResults.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) / testResults.length;
    aptitudeScore = Math.round(avg);
  } else if (profile.readiness?.aptitude) {
    aptitudeScore = profile.readiness.aptitude;
  }

  let codingScore = 0;
  const passed = codingSubmissions.filter(s => s.status === 'Accepted');
  if (passed.length > 0) {
    codingScore = Math.min(100, 50 + (passed.length * 6));
  } else if (profile.readiness?.coding) {
    codingScore = profile.readiness.coding;
  }

  let technicalScore = 0;
  const techDone = interviewPractices.filter(p => p.questionType === 'Technical' && p.status === 'Completed');
  if (techDone.length > 0) {
    technicalScore = Math.min(100, 60 + (techDone.length * 5));
  } else if (profile.readiness?.technical) {
    technicalScore = profile.readiness.technical;
  }

  let interviewScore = 0;
  const hrDone = interviewPractices.filter(p => p.questionType === 'HR' && p.status === 'Completed');
  if (hrDone.length > 0) {
    interviewScore = Math.min(100, 55 + (hrDone.length * 7));
  } else if (profile.readiness?.interview) {
    interviewScore = profile.readiness.interview;
  }

  let resumeScore = 0;
  if (profile.resumeData?.summary && profile.projects?.length >= 2 && profile.skills?.length >= 5) {
    resumeScore = 95;
  } else if (profile.projects?.length > 0 && profile.skills?.length > 0) {
    resumeScore = 85;
  } else if (profile.resumeData?.github || profile.resumeData?.linkedin) {
    resumeScore = 40;
  }

  // Weighted Total: 20% Aptitude, 20% Coding, 20% Technical, 15% Interview, 15% Resume, 10% Profile
  const overall = Math.round(
    (aptitudeScore * 0.20) +
    (codingScore * 0.20) +
    (technicalScore * 0.20) +
    (interviewScore * 0.15) +
    (resumeScore * 0.15) +
    (profileScore * 0.10)
  );

  const recommendations = [];
  if (codingScore < 75) {
    recommendations.push('Your coding score is below target. Solve 5 medium-level DSA problems in Arrays, Trees & DP.');
  }
  if (aptitudeScore < 75) {
    recommendations.push('Take 15-minute daily timed aptitude tests in Quantitative and Logical reasoning.');
  }
  if (technicalScore < 75) {
    recommendations.push('Review core CS subjects: DBMS (Indexing, Normalization) and Operating Systems.');
  }
  if (interviewScore < 75) {
    recommendations.push('Practice structured behavioral answers using the STAR method for top HR questions.');
  }
  if (profileScore < 85) {
    recommendations.push('Add GitHub repositories and live project URLs to improve profile visibility.');
  }
  if (resumeScore < 85) {
    recommendations.push('Use the Resume Builder to generate and download an ATS-optimized PDF resume.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Excellent readiness! Keep participating in placement drives and mock interviews.');
  }

  return {
    overall,
    aptitude: aptitudeScore,
    coding: codingScore,
    technical: technicalScore,
    interview: interviewScore,
    resume: resumeScore,
    profileCompletion: profileScore,
    recommendations
  };
};