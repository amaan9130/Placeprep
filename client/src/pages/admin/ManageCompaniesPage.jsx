import React, { useState, useEffect } from 'react';
import { Building, Globe, MapPin, Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

export default function ManageCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'companies'

  const fetchJobsAndCompanies = async () => {
    try {
      const res = await API.get('/jobs');
      if (res.data.success) {
        setJobs(res.data.data);
        const comps = res.data.data.map(j => j.company).filter(Boolean);
        const uniqueComps = Array.from(new Map(comps.map(c => [c._id, c])).values());
        setCompanies(uniqueComps);
      }
    } catch (err) {
      console.error('Error fetching jobs/companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndCompanies();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job opening? This will remove all student applications submitted to it.")) return;
    try {
      const res = await API.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        alert('Job opening deleted successfully!');
        // Refresh local data
        fetchJobsAndCompanies();
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job opening.');
    }
  };

  if (loading) return <Loader text="Loading recruiter SDE postings..." />;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recruiters & Job Postings</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor campus recruiter companies and SDE job openings posted across portals.</p>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-100 p-1 rounded-xl border flex items-center gap-1">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'jobs' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active Job Openings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'companies' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Partner Companies ({companies.length})
          </button>
        </div>
      </div>

      {/* Render Active Job Openings Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
              No SDE job openings have been posted by recruiters yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between gap-5 hover:shadow transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.company?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company?.name || 'Recruiter')}&background=0284c7&color=fff`}
                          alt={job.company?.name}
                          className="w-10 h-10 rounded-xl bg-white p-1 border object-contain"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{job.title}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">{job.company?.name}</p>
                        </div>
                      </div>
                      <Badge variant="primary" size="sm">{job.jobType}</Badge>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex justify-between">
                        <span>Compensation:</span>
                        <strong className="text-slate-800">{job.package?.formatted || `${job.package?.ctc} LPA`}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>CGPA Cutoff:</span>
                        <strong className="text-slate-800">{job.eligibility?.minCgpa} CGPA</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Backlogs Allowed:</span>
                        <strong className="text-slate-800">{job.eligibility?.maxBacklogs}</strong>
                      </div>
                      <div className="border-t border-slate-200/60 pt-1.5 mt-1.5">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Eligible Branches:</span>
                        <span className="text-slate-700 line-clamp-1">{job.eligibility?.allowedBranches?.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold px-3.5 py-2 rounded-xl border border-rose-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Render Partner Companies Tab */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.length === 0 ? (
            <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
              No recruiter companies found. Post a job to add a company.
            </div>
          ) : (
            companies.map((comp) => (
              <div key={comp._id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4 hover:shadow transition-shadow">
                <div className="flex items-start justify-between">
                  <img
                    src={comp.logo}
                    alt={comp.name}
                    className="w-12 h-12 rounded-2xl bg-white p-1.5 border object-contain"
                  />
                  <Badge variant={comp.tier?.includes('Dream') ? 'dream' : 'primary'} size="sm">
                    {comp.tier || 'Tier 1 (Dream)'}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
                  <p className="text-xs text-slate-500">{comp.industry || 'Information Technology'}</p>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{comp.description}</p>
                <div className="pt-3 border-t text-xs font-semibold text-brand-700 flex items-center justify-between">
                  <span>Package: {comp.packageRange || '14 - 45 LPA'}</span>
                  <a href={comp.website} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-600">
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}