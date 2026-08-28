import React, { useState, useEffect } from 'react';
import { Calendar, PlusCircle, CheckCircle2, Trash2, MapPin, Users } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/common/Badge';

export default function ManageDrivesPage() {
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [formData, setFormData] = useState({
    title: 'Google Campus Placement Drive 2026',
    companyId: '',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    venue: 'Main Auditorium & Virtual Lab 3',
    description: 'On-campus recruitment drive for 2026 graduating B.Tech CSE/IT/ECE students.',
    eligibleBranches: 'Computer Science & Engineering, Information Technology, Electronics & Communication',
    instructions: 'Carry updated printed resume\nCollege ID card mandatory\nFormal attire required'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchDrives = async () => {
    try {
      const res = await API.get('/admin/drives');
      if (res.data.success) {
        setDrives(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching drives:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await API.get('/admin/companies-list');
      if (res.data.success) {
        setCompanies(res.data.data);
        if (res.data.data.length > 0) {
          setFormData(prev => ({ ...prev, companyId: res.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchDrives();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/admin/drives', formData);
      if (res.data.success) {
        setSuccess(true);
        fetchDrives();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error creating drive:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrive = async (id) => {
    if (!window.confirm('Are you sure you want to delete this placement drive?')) return;
    try {
      const res = await API.delete(`/admin/drives/${id}`);
      if (res.data.success) {
        fetchDrives();
      }
    } catch (err) {
      console.error('Error deleting drive:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Drives</h1>
        <p className="text-xs text-slate-500 mt-1">Schedule campus recruitment drives, broadcast student notices, and manage calendars.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Placement drive scheduled and broadcasted to campus!</span>
        </div>
      )}

      {/* Grid: Schedule Form & Scheduled List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Schedule Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-3 mb-4">Schedule Placement Drive</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700">Drive Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700">Company Partner</label>
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none font-medium"
              >
                <option value="">-- Generic/No Associated Company --</option>
                {companies.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Drive Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Campus Venue</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700">Eligible Branches</label>
              <input
                type="text"
                value={formData.eligibleBranches}
                onChange={(e) => setFormData({ ...formData, eligibleBranches: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700">Instructions</label>
              <textarea
                rows={3}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              {loading ? 'Scheduling...' : 'Schedule & Broadcast Drive'}
            </button>
          </form>
        </div>

        {/* Scheduled Drives Directory */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-3 mb-4">Manage Scheduled Drives ({drives.length})</h3>

          {drives.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center">No drives scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {drives.map((drive) => (
                <div key={drive._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{drive.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded">
                          {drive.company?.name || 'On-Campus'}
                        </span>
                        <span className="text-[10px] text-slate-500">{new Date(drive.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {drive.venue}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-slate-400" /> {drive.eligibleBranches?.length || 0} branches</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDrive(drive._id)}
                    className="p-2 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border transition-colors shadow-sm"
                    title="Delete Drive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}