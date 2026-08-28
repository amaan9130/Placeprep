import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, Briefcase, Users, CheckCircle2, 
  Calendar, ArrowRight, PlusCircle, Award, BarChart3, Trash2 
} from 'lucide-react';
import API from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/recruiter/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching recruiter dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job opening? This will also delete all student applications submitted to it.")) return;
    try {
      const res = await API.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        setData(prev => ({
          ...prev,
          jobs: prev.jobs.filter(j => j._id !== jobId),
          stats: {
            ...prev.stats,
            activeJobs: Math.max(0, prev.stats.activeJobs - 1)
          }
        }));
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job opening.');
    }
  };

  if (loading) return <Loader text="Loading recruitment dashboard..." />;

  const stats = data?.stats || {
    totalJobs: 2,
    activeJobs: 2,
    totalApplicants: 18,
    shortlisted: 6,
    inInterview: 4,
    selected: 2,
    rejected: 1
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recruiter Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active campus job postings and candidate recruitment pipeline.</p>
        </div>

        <Link
          to="/recruiter/post-job"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Post New Job Opening
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Openings" value={stats.activeJobs} subtitle="Campus Job Posts" icon={Briefcase} color="brand" />
        <StatCard title="Total Applicants" value={stats.totalApplicants} subtitle="Candidates Applied" icon={Users} color="purple" />
        <StatCard title="In Interviews" value={stats.inInterview} subtitle="Tech & HR Rounds" icon={Calendar} color="amber" />
        <StatCard title="Offers Extended" value={stats.selected} subtitle="Selected Candidates" icon={CheckCircle2} color="emerald" />
      </div>

      {/* 2-Column: Active Jobs & Recent Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Posted Jobs */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" /> Active Job Openings
            </h3>
            <Link to="/recruiter/post-job" className="text-xs font-semibold text-brand-600 hover:underline">
              + Post New
            </Link>
          </div>

          <div className="space-y-3">
            {data?.jobs?.map((job) => (
              <div key={job._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{job.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{job.package?.formatted} · {job.jobType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/recruiter/applicants?jobId=${job._id}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-brand-700 hover:bg-brand-50 transition-colors animate-in fade-in zoom-in-95"
                  >
                    View Applicants
                  </Link>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="p-1.5 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" /> Recent Candidate Pipeline
            </h3>
            <Link to="/recruiter/applicants" className="text-xs font-semibold text-brand-600 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentApplicants?.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No applicants yet.</p>
            ) : (
              data?.recentApplicants?.slice(0, 5).map((app) => (
                <div key={app._id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.student?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.student?.name}`}
                      alt={app.student?.name}
                      className="w-9 h-9 rounded-full border bg-white object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{app.student?.name}</h4>
                      <p className="text-[11px] text-slate-500">{app.studentProfile?.cgpa} CGPA · {app.student?.department}</p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">{app.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
