import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, Briefcase, FileText, CheckSquare, 
  Code, Award, Layers, Bell, Building, Users, Calendar, 
  BarChart3, HelpCircle, FileSpreadsheet, PlusCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, profile } = useAuth();

  if (!user) return null;

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Placement Jobs', path: '/student/jobs', icon: Briefcase },
    { label: 'My Applications', path: '/student/applications', icon: CheckSquare },
    { label: 'Aptitude Practice', path: '/student/aptitude', icon: HelpCircle },
    { label: 'Coding Practice', path: '/student/coding', icon: Code },
    { label: 'Interview Prep', path: '/student/interview', icon: Layers },
    { label: 'Resume Builder', path: '/student/resume', icon: FileText },
    { label: 'Readiness Score', path: '/student/readiness', icon: Award },
    { label: 'My Profile', path: '/student/profile', icon: User },
  ];

  const recruiterLinks = [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'Post Job Opening', path: '/recruiter/post-job', icon: PlusCircle },
    { label: 'Applicant Pipeline', path: '/recruiter/applicants', icon: Users },
    { label: 'Company Profile', path: '/recruiter/company', icon: Building },
  ];

  const adminLinks = [
    { label: 'Placement Analytics', path: '/admin/dashboard', icon: BarChart3 },
    { label: 'Manage Students', path: '/admin/students', icon: Users },
    { label: 'Manage Companies', path: '/admin/companies', icon: Building },
    { label: 'Placement Drives', path: '/admin/drives', icon: Calendar },
    { label: 'Reports & Stats', path: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Question Bank', path: '/admin/questions', icon: HelpCircle },
  ];

  let navLinks = studentLinks;
  if (user.role === 'recruiter') navLinks = recruiterLinks;
  if (user.role === 'admin') navLinks = adminLinks;

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {user.role === 'student' ? 'Student Workspace' : user.role === 'recruiter' ? 'Recruiter Portal' : 'Placement Admin'}
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                  ${isActive 
                    ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0 text-current" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {user.role === 'student' && profile?.readiness && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/60">
            <div className="bg-gradient-to-br from-brand-600 to-blue-700 rounded-2xl p-3.5 text-white shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-brand-100">Placement Score</span>
                <span className="text-xs font-extrabold bg-white/20 px-2 py-0.5 rounded-full">
                  {profile.readiness.overall}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 mb-2 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500" 
                  style={{ width: `${profile.readiness.overall}%` }}
                />
              </div>
              <p className="text-[10px] text-brand-100 leading-snug">
                {profile.readiness.overall >= 80 ? '🎯 Job-Ready Tier!' : '⚡ Practice to reach 80%+'}
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
