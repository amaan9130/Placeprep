import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public & Auth Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import StudentRegisterPage from './pages/auth/StudentRegisterPage';
import RecruiterRegisterPage from './pages/auth/RecruiterRegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ProfilePage from './pages/student/ProfilePage';
import JobsPage from './pages/student/JobsPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import AptitudePracticePage from './pages/student/AptitudePracticePage';
import CodingPracticePage from './pages/student/CodingPracticePage';
import InterviewPrepPage from './pages/student/InterviewPrepPage';
import ResumeBuilderPage from './pages/student/ResumeBuilderPage';
import ReadinessScorePage from './pages/student/ReadinessScorePage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJobPage from './pages/recruiter/PostJobPage';
import ManageApplicantsPage from './pages/recruiter/ManageApplicantsPage';
import CompanyProfilePage from './pages/recruiter/CompanyProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudentsPage from './pages/admin/ManageStudentsPage';
import ManageCompaniesPage from './pages/admin/ManageCompaniesPage';
import ManageDrivesPage from './pages/admin/ManageDrivesPage';
import PlacementReportsPage from './pages/admin/PlacementReportsPage';
import QuestionBankPage from './pages/admin/QuestionBankPage';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register/student" element={<StudentRegisterPage />} />
              <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
              <Route path="/dashboard" element={<RoleRedirect />} />
            </Route>

            {/* Student Protected Routes */}
            <Route path="/student" element={<DashboardLayout allowedRoles={['student']} />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="aptitude" element={<AptitudePracticePage />} />
              <Route path="coding" element={<CodingPracticePage />} />
              <Route path="interview" element={<InterviewPrepPage />} />
              <Route path="resume" element={<ResumeBuilderPage />} />
              <Route path="readiness" element={<ReadinessScorePage />} />
            </Route>

            {/* Recruiter Protected Routes */}
            <Route path="/recruiter" element={<DashboardLayout allowedRoles={['recruiter', 'admin']} />}>
              <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="post-job" element={<PostJobPage />} />
              <Route path="applicants" element={<ManageApplicantsPage />} />
              <Route path="company" element={<CompanyProfilePage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<DashboardLayout allowedRoles={['admin']} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<ManageStudentsPage />} />
              <Route path="companies" element={<ManageCompaniesPage />} />
              <Route path="drives" element={<ManageDrivesPage />} />
              <Route path="reports" element={<PlacementReportsPage />} />
              <Route path="questions" element={<QuestionBankPage />} />
            </Route>

            {/* Catch All 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}