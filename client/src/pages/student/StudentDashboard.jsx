import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Briefcase, HelpCircle, FileCode2, 
  Layers, FileText, Award, Calendar, CheckCircle2, 
  AlertCircle, ChevronRight, Clock, MapPin, Building 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/student/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader text="Loading your placement dashboard..." />;

  const readiness = data?.readiness || {
    overall: 78,
    aptitude: 82,
    coding: 74,
    technical: 80,
    interview: 68,
    resume: 90,
    profileCompletion: 85,
    recommendations: []
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Class of {user?.graduationYear || 2026} · {user?.department || 'Computer Science'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {user?.name || 'Student'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl leading-relaxed">
            Welcome back to your placement prep headquarters. Check upcoming drives and practice daily assessments to maximize your job readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/jobs"
            className="bg-white hover:bg-brand-50 text-brand-700 font-bold text-xs px-5 py-3 rounded-2xl shadow transition-colors flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> Explore Jobs
          </Link>
          <Link
            to="/student/resume"
            className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-5 py-3 rounded-2xl border border-white/20 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Resume Builder
          </Link>
        </div>
      </div>

      {/* Main Placement Readiness Gauge & Category Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Circular Indicator */}
          <div className="flex flex-col items-center justify-center text-center shrink-0">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-brand-600 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - readiness.overall / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{readiness.overall}%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Readiness</span>
              </div>
            </div>
            <span className={`mt-3 text-xs font-bold px-3 py-1 rounded-full ${readiness.overall >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {readiness.overall >= 80 ? '🟢 Tier-1 Placement Ready' : '🟡 Above Average Candidate'}
            </span>
          </div>

          {/* Breakdown Categories */}
          <div className="flex-1 w-full space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Placement Skill Breakdown</h3>
              <Link to="/student/readiness" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View detailed analysis <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'Aptitude Practice', score: readiness.aptitude, weight: '20%', icon: HelpCircle, color: 'bg-purple-500' },
                { name: 'Coding Algorithms', score: readiness.coding, weight: '20%', icon: FileCode2, color: 'bg-emerald-500' },
                { name: 'Technical CS Core', score: readiness.technical, weight: '20%', icon: Layers, color: 'bg-blue-500' },
                { name: 'Interview Prep', score: readiness.interview, weight: '15%', icon: Award, color: 'bg-amber-500' },
                { name: 'Resume ATS Match', score: readiness.resume, weight: '15%', icon: FileText, color: 'bg-rose-500' },
                { name: 'Profile Completion', score: readiness.profileCompletion, weight: '10%', icon: CheckCircle2, color: 'bg-indigo-500' },
              ].map((cat, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-700 truncate">{cat.name}</span>
                    <span className="text-xs font-bold text-slate-900">{cat.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full transition-all duration-700`} style={{ width: `${cat.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      {readiness.recommendations?.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200/80 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Recommended Next Actions</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {readiness.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200/50">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Section: Upcoming Drives & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Placement Drives */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">Upcoming Placement Drives</h3>
              </div>
              <Link to="/student/jobs" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {data?.upcomingDrives?.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No upcoming campus drives scheduled.</p>
              ) : (
                data?.upcomingDrives?.map((drive) => (
                  <div key={drive._id} className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={drive.company?.logo || 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=64'}
                        alt={drive.company?.name}
                        className="w-11 h-11 rounded-xl bg-white p-1.5 border border-slate-200 object-contain"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{drive.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="font-semibold text-brand-600">{drive.company?.name}</span>
                          <span>•</span>
                          <span>{new Date(drive.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={drive.company?.tier?.includes('Dream') ? 'dream' : 'primary'} size="sm">
                      {drive.company?.packageRange || '12-24 LPA'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Applications Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
              </div>
              <Link to="/student/applications" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                Track all
              </Link>
            </div>

            <div className="space-y-3">
              {data?.recentApplications?.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-slate-500 mb-3">You haven't submitted any job applications yet.</p>
                  <Link
                    to="/student/jobs"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                  >
                    Browse available jobs <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                data?.recentApplications?.map((app) => (
                  <div key={app._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white p-1.5 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                        {app.job?.company?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{app.job?.title || 'Software Engineer'}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{app.job?.company?.name}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        app.status === 'Selected' ? 'success' :
                        app.status.includes('Interview') ? 'purple' :
                        app.status === 'Shortlisted' ? 'primary' :
                        app.status === 'Rejected' ? 'danger' : 'default'
                      }
                      size="sm"
                    >
                      {app.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Practice Launcher Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: 'Aptitude Tests', desc: '40+ MCQs & Timed Tests', icon: HelpCircle, path: '/student/aptitude', color: 'from-purple-500 to-indigo-500' },
          { title: 'Coding Hub', desc: 'DSA LeetCode Problems', icon: FileCode2, path: '/student/coding', color: 'from-emerald-500 to-teal-500' },
          { title: 'Interview Q&A', desc: 'Core CS & STAR Behavioral', icon: Layers, path: '/student/interview', color: 'from-blue-500 to-cyan-500' },
          { title: 'Resume Builder', desc: 'ATS Clean PDF Generator', icon: FileText, path: '/student/resume', color: 'from-rose-500 to-pink-500' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.path}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-sm mb-3 group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{item.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
