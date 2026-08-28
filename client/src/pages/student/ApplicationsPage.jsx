import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Calendar, Video, MapPin, 
  ArrowRight, FileText, AlertCircle, Sparkles 
} from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await API.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, []);

  const stages = [
    'Applied',
    'Shortlisted',
    'Aptitude Test',
    'Technical Interview',
    'HR Interview',
    'Selected'
  ];

  const getStageIndex = (status) => {
    if (status === 'Rejected') return -1;
    return stages.indexOf(status);
  };

  if (loading) return <Loader text="Loading your application status..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Application Tracker</h1>
        <p className="text-xs text-slate-500 mt-1">Track recruitment progress, upcoming interview dates, and offer letters.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Applications Submitted</h3>
          <p className="text-xs text-slate-500 mt-1">Explore campus drives and apply to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const curStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div key={app._id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={app.job?.company?.logo || 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=64'}
                      alt={app.job?.company?.name}
                      className="w-12 h-12 rounded-2xl bg-white p-1.5 border border-slate-200 object-contain"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{app.job?.title}</h3>
                      <p className="text-xs text-slate-500">{app.job?.company?.name} · Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Badge 
                    variant={
                      app.status === 'Selected' ? 'success' :
                      isRejected ? 'danger' :
                      app.status.includes('Interview') ? 'purple' :
                      app.status === 'Shortlisted' ? 'primary' : 'default'
                    }
                    size="lg"
                  >
                    {app.status}
                  </Badge>
                </div>

                {/* Stage Timeline */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
                    {stages.map((stageName, sIdx) => {
                      const isCompleted = curStageIdx >= sIdx;
                      const isCurrent = curStageIdx === sIdx;

                      return (
                        <div key={sIdx} className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCompleted ? 'bg-brand-600 text-white shadow' :
                            isCurrent ? 'bg-amber-500 text-white ring-4 ring-amber-100' :
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {sIdx + 1}
                          </div>
                          <span className={`text-[10px] font-semibold mt-2 hidden sm:block ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                            {stageName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interview Schedule Details */}
                {app.interviewSchedule?.date && (
                  <div className="bg-purple-50/70 border border-purple-200/80 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>{app.interviewSchedule.stage || 'Interview Scheduled'}</span>
                    </div>
                    <div className="text-xs text-purple-800 flex flex-wrap items-center gap-4">
                      <span>Date: {new Date(app.interviewSchedule.date).toLocaleDateString()}</span>
                      <span>Time: {app.interviewSchedule.time || '11:00 AM IST'}</span>
                    </div>
                    {app.interviewSchedule.meetingLink && (
                      <a
                        href={app.interviewSchedule.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-white px-3 py-1.5 rounded-lg border border-purple-200 shadow-sm hover:bg-purple-100 transition-colors mt-1"
                      >
                        <Video className="w-3.5 h-3.5" /> Join Virtual Interview
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
