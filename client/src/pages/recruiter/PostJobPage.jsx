import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, PlusCircle, Save, CheckCircle2, ArrowLeft } from 'lucide-react';
import API from '../../services/api';

export default function PostJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: 'Software Development Engineer',
    jobType: 'Full-time',
    location: 'Bengaluru / Hybrid',
    packageCtc: 18.0,
    packageFormatted: '18.0 LPA',
    packageBreakdown: 'Base: 15 LPA + Performance Bonus: 3 LPA',
    minCgpa: 7.5,
    maxBacklogs: 0,
    allowedBranches: 'Computer Science & Engineering, Information Technology, Electronics & Communication',
    vacancies: 10,
    description: 'We are seeking passionate software engineers to build scalable distributed cloud services and web applications.',
    responsibilities: 'Write robust, maintainable code in modern web frameworks.\nCollaborate across engineering teams to ship high-impact features.\nParticipate in code reviews and architectural discussions.',
    skillsRequired: 'Java, React, Node.js, Data Structures, Algorithms, SQL'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/jobs', formData);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/recruiter/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job opening.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Post New Campus Job Opening</h1>
        <p className="text-xs text-slate-500 mt-1">Define role responsibilities, package, and strict eligibility cutoffs.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Job opening published and broadcasted to eligible students! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Type</label>
            <select
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
            >
              <option>Full-time</option>
              <option>Internship</option>
              <option>FTE + Internship</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Package CTC (LPA)</label>
            <input
              type="number"
              step="0.5"
              required
              value={formData.packageCtc}
              onChange={(e) => setFormData({ ...formData, packageCtc: e.target.value, packageFormatted: `${e.target.value} LPA` })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none font-bold text-brand-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum CGPA Cutoff</label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.minCgpa}
              onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Max Active Backlogs Allowed</label>
            <input
              type="number"
              required
              value={formData.maxBacklogs}
              onChange={(e) => setFormData({ ...formData, maxBacklogs: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Allowed Branches (Comma separated)</label>
          <input
            type="text"
            value={formData.allowedBranches}
            onChange={(e) => setFormData({ ...formData, allowedBranches: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description</label>
          <textarea
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Key Responsibilities (One per line)</label>
          <textarea
            rows={3}
            value={formData.responsibilities}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
          <input
            type="text"
            value={formData.skillsRequired}
            onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/recruiter/dashboard')}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow"
          >
            {loading ? 'Publishing Job...' : 'Publish Job Opening'}
          </button>
        </div>
      </form>
    </div>
  );
}
