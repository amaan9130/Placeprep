import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Search, Filter, MapPin, Building, 
  Calendar, CheckCircle2, XCircle, ArrowRight, DollarSign, 
  Award, ShieldAlert, Sparkles, ClipboardList, Info
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

export default function JobsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'drives'
  const [jobs, setJobs] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailModal, setJobDetailModal] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  // Drive detail modal
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [driveModal, setDriveModal] = useState(false);

  // Filters for jobs
  const [keyword, setKeyword] = useState('');
  const [jobType, setJobType] = useState('All');
  const [branch, setBranch] = useState('All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (jobType !== 'All') params.append('jobType', jobType);
      if (branch !== 'All') params.append('branch', branch);

      const res = await API.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await API.get('/student/drives');
      if (res.data.success) {
        setDrives(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    } else {
      fetchDrives();
    }
  }, [activeTab, jobType, branch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleViewJob = async (jobId) => {
    setApplySuccess('');
    setApplyError('');
    try {
      const res = await API.get(`/jobs/${jobId}`);
      if (res.data.success) {
        setSelectedJob(res.data.data.job);
        setEligibilityResult(res.data.data.eligibility);
        setJobDetailModal(true);
      }
    } catch (err) {
      console.error('Error loading job detail:', err);
    }
  };

  const handleViewDrive = (drive) => {
    setSelectedDrive(drive);
    setDriveModal(true);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    setApplySuccess('');
    setApplyError('');
    try {
      const res = await API.post(`/applications/apply/${selectedJob._id}`);
      if (res.data.success) {
        setApplySuccess('Application submitted successfully! Track status in My Applications.');
        fetchJobs();
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Opportunities</h1>
          <p className="text-xs text-slate-500 mt-1">Discover active job postings, check eligibility, and view scheduled campus recruitment drives.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0 border border-slate-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Job Openings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('drives')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'drives' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Campus Drives ({drives.length})
          </button>
        </div>
      </div>

      {/* JOBS TAB CONTENT */}
      {activeTab === 'jobs' && (
        <>
          {/* Search & Filters Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or required skill..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
                >
                  <option value="All">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>

                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
                >
                  <option value="All">All Branches</option>
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics & Communication">ECE</option>
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Filter
                </button>
              </div>
            </form>
          </div>

          {/* Jobs List */}
          {loading ? (
            <Loader text="Loading placement opportunities..." />
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No Job Openings Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try changing your search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <img
                        src={job.company?.logo || 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=64'}
                        alt={job.company?.name}
                        className="w-12 h-12 rounded-2xl bg-white p-1.5 border border-slate-200 object-contain"
                      />
                      <Badge variant={job.company?.tier?.includes('Dream') ? 'dream' : 'primary'} size="sm">
                        {job.package?.formatted || '12 LPA'}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">{job.title}</h3>
                    <p className="text-xs font-semibold text-brand-600 mb-3">{job.company?.name}</p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        Min CGPA: {job.eligibility?.minCgpa}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {job.jobType}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleViewJob(job._id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      View & Apply <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CAMPUS DRIVES TAB CONTENT */}
      {activeTab === 'drives' && (
        <>
          {loading ? (
            <Loader text="Loading placement drives..." />
          ) : drives.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No Placement Drives Scheduled</h3>
              <p className="text-xs text-slate-500 mt-1">Check back later for upcoming campus recruitment schedules.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drives.map((drive) => (
                <div
                  key={drive._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={drive.company?.logo || 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=64'}
                          alt={drive.company?.name || 'Generic Drive'}
                          className="w-12 h-12 rounded-xl bg-white p-1.5 border object-contain"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{drive.title}</h3>
                          <p className="text-[11px] font-semibold text-brand-600">{drive.company?.name || 'On-Campus Placement Cell'}</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">{drive.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Date</span>
                        <span className="font-semibold text-slate-800">{new Date(drive.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Venue</span>
                        <span className="font-semibold text-slate-800 truncate block">{drive.venue}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {drive.description || 'Recruitment drive including online test and interview rounds.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Eligible: {drive.eligibleBranches?.slice(0, 2).join(', ')}...
                    </span>
                    <button
                      onClick={() => handleViewDrive(drive)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
                    >
                      <Info className="w-3.5 h-3.5" /> Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Job Details Modal */}
      <Modal
        isOpen={jobDetailModal}
        onClose={() => setJobDetailModal(false)}
        title={selectedJob?.title || 'Job Details'}
        maxWidth="max-w-2xl"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedJob.company?.logo}
                  alt={selectedJob.company?.name}
                  className="w-12 h-12 rounded-xl bg-white p-1.5 border border-slate-200 object-contain"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedJob.company?.name}</h4>
                  <p className="text-xs text-slate-500">{selectedJob.location} · {selectedJob.jobType}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-brand-700">{selectedJob.package?.formatted}</div>
                <span className="text-[10px] text-slate-500">{selectedJob.package?.breakdown}</span>
              </div>
            </div>

            {/* Eligibility Banner */}
            {eligibilityResult && (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${eligibilityResult.isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                {eligibilityResult.isEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-xs font-bold">
                    {eligibilityResult.isEligible ? '🟢 You are eligible to apply!' : '🔴 You are not currently eligible'}
                  </h5>
                  {!eligibilityResult.isEligible && eligibilityResult.reasons?.length > 0 && (
                    <ul className="list-disc list-inside text-xs mt-1 space-y-0.5 opacity-90">
                      {eligibilityResult.reasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {applySuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                {applySuccess}
              </div>
            )}
            {applyError && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">
                {applyError}
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Role Description</h4>
              <p>{selectedJob.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setJobDetailModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              {eligibilityResult?.isEligible && !applySuccess && (
                <button
                  type="button"
                  disabled={applying}
                  onClick={handleApply}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2"
                >
                  {applying ? 'Applying...' : '1-Click Apply Now'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Drive Details Modal */}
      <Modal
        isOpen={driveModal}
        onClose={() => setDriveModal(false)}
        title={selectedDrive?.title || 'Drive Details'}
      >
        {selectedDrive && (
          <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-center gap-3.5 border-b pb-4">
              <img
                src={selectedDrive.company?.logo || 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=64'}
                alt={selectedDrive.company?.name || 'On-Campus'}
                className="w-11 h-11 rounded-xl bg-white p-1 border object-contain"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedDrive.company?.name || 'Placement Cell Event'}</h4>
                <p className="text-[11px] text-slate-500">Coordinator: {selectedDrive.coordinator || 'Prof. Placement Cell'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Date & Time</span>
                <span className="font-semibold text-slate-800">{new Date(selectedDrive.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Campus Venue</span>
                <span className="font-semibold text-slate-800">{selectedDrive.venue}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900 text-sm">Description</h5>
              <p className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {selectedDrive.description || 'No description provided.'}
              </p>
            </div>

            {selectedDrive.eligibleBranches?.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">Eligible Departments</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDrive.eligibleBranches.map((br, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 text-[10px] px-2.5 py-1 rounded-md font-semibold">
                      {br}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedDrive.instructions?.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">Instructions</h5>
                <ul className="list-disc list-inside space-y-1 bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-amber-900">
                  {selectedDrive.instructions.map((inst, idx) => (
                    <li key={idx} className="font-medium">{inst}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setDriveModal(false)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}