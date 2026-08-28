import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, CheckCircle2, XCircle, 
  Calendar, Video, FileText, ChevronDown 
} from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

export default function ManageApplicantsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Schedule Interview Modal
  const [scheduleModal, setScheduleModal] = useState(false);
  const [targetApplicant, setTargetApplicant] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    stage: 'Technical Interview',
    date: '',
    time: '11:00 AM IST',
    meetingLink: 'https://meet.google.com/xyz-recruiter-demo'
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/recruiter/dashboard');
        if (res.data.success && res.data.data.jobs?.length > 0) {
          setJobs(res.data.data.jobs);
          setSelectedJobId(res.data.data.jobs[0]._id);
        }
      } catch (err) {
        console.error('Error fetching recruiter jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  const fetchApplicants = async () => {
    if (!selectedJobId) return;
    setLoading(true);
    try {
      const res = await API.get(`/applications/job/${selectedJobId}`);
      if (res.data.success) {
        setApplicants(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching job applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [selectedJobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const res = await API.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!targetApplicant) return;
    try {
      const res = await API.put(`/applications/${targetApplicant._id}/status`, {
        status: interviewDetails.stage,
        interviewSchedule: interviewDetails
      });
      if (res.data.success) {
        setScheduleModal(false);
        fetchApplicants();
      }
    } catch (err) {
      console.error('Error scheduling interview:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Applicant Pipeline</h1>
          <p className="text-xs text-slate-500 mt-1">Review candidates, shortlist profiles, and advance recruitment stages.</p>
        </div>

        {jobs.length > 0 && (
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 shadow-sm outline-none"
          >
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>{j.title}</option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {loading ? (
          <Loader text="Loading applicants..." />
        ) : applicants.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No applicants received for this job opening yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Academic CGPA</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.student?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.student?.name}`}
                          alt={app.student?.name}
                          className="w-9 h-9 rounded-full border object-cover bg-white"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{app.student?.name}</div>
                          <div className="text-[11px] text-slate-500">{app.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-700">
                      {app.studentProfile?.cgpa || 8.0} CGPA
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {app.student?.department}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'danger' : 'primary'} size="sm">
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          disabled={updatingId === app._id}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlist</option>
                          <option value="Aptitude Test">Aptitude Test</option>
                          <option value="Technical Interview">Tech Interview</option>
                          <option value="HR Interview">HR Interview</option>
                          <option value="Selected">Select / Offer</option>
                          <option value="Rejected">Reject</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            setTargetApplicant(app);
                            setScheduleModal(true);
                          }}
                          className="p-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200"
                          title="Schedule Interview"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={scheduleModal}
        onClose={() => setScheduleModal(false)}
        title="Schedule Candidate Interview"
      >
        {targetApplicant && (
          <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
            <p className="text-slate-600">Scheduling interview round for <strong>{targetApplicant.student?.name}</strong>.</p>
            <div>
              <label className="block font-semibold mb-1">Interview Round</label>
              <select
                value={interviewDetails.stage}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, stage: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              >
                <option value="Technical Interview">Technical Interview</option>
                <option value="HR Interview">HR Interview</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                required
                value={interviewDetails.date}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Virtual Meeting Link</label>
              <input
                type="url"
                required
                value={interviewDetails.meetingLink}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, meetingLink: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setScheduleModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl font-bold shadow">Save & Notify</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
