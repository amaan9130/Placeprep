import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building, Briefcase, Award, TrendingUp, 
  Calendar, CheckCircle2, DollarSign, PlusCircle, BarChart3 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import API from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcementModal, setAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'Normal',
    targetRole: 'All'
  });
  const [annSuccess, setAnnSuccess] = useState('');

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboard();
  }, []);

  const handleBroadcastAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/announcements', announcementForm);
      if (res.data.success) {
        setAnnSuccess('Announcement broadcasted to campus portal successfully!');
        setTimeout(() => {
          setAnnouncementModal(false);
          setAnnSuccess('');
          setAnnouncementForm({ title: '', content: '', priority: 'Normal', targetRole: 'All' });
        }, 1500);
      }
    } catch (err) {
      console.error('Error broadcasting announcement:', err);
    }
  };

  if (loading) return <Loader text="Loading placement analytics & reports..." />;

  const kpis = data?.kpis || {
    totalStudents: 16,
    totalCompanies: 6,
    activeJobs: 4,
    totalApplications: 12,
    placedCount: 8,
    placementRate: '81%',
    avgPackage: '14.8 LPA',
    highestPackage: '48 LPA'
  };

  const departmentData = data?.charts?.departmentStats || [
    { department: 'CSE', placed: 88, unplaced: 12 },
    { department: 'IT', placed: 84, unplaced: 16 },
    { department: 'ECE', placed: 74, unplaced: 26 },
    { department: 'Mech', placed: 58, unplaced: 42 }
  ];

  const companyStats = data?.charts?.companyStats || [
    { company: 'Google', applications: 45, selected: 8 },
    { company: 'Microsoft', applications: 38, selected: 6 },
    { company: 'Amazon', applications: 52, selected: 10 },
    { company: 'Deloitte', applications: 32, selected: 7 }
  ];

  const COLORS = ['#0284c7', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Cell Administration</h1>
          <p className="text-xs text-slate-500 mt-1">Campus recruitment analytics, batch placement rate, and company drives.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAnnouncementModal(true)}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow transition-colors"
          >
            📢 Broadcast Notice
          </button>
          <Link
            to="/admin/drives"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Schedule Drive
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={kpis.totalStudents} subtitle="Registered 2026 Batch" icon={Users} color="brand" />
        <StatCard title="Placement Rate" value={kpis.placementRate} subtitle="Offers Secured" icon={Award} color="emerald" trend="+12% YoY" />
        <StatCard title="Average Package" value={kpis.avgPackage} subtitle="CTC across offers" icon={DollarSign} color="purple" />
        <StatCard title="Highest Package" value={kpis.highestPackage} subtitle="Dream Tier 1" icon={TrendingUp} color="amber" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placement by Department Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Placement Rate by Department</h3>
              <p className="text-xs text-slate-500 mt-0.5">Percentage of placed students per branch</p>
            </div>
            <BarChart3 className="w-5 h-5 text-brand-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip />
                <Bar dataKey="placed" fill="#0284c7" radius={[6, 6, 0, 0]} name="Placed %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company Applications & Offers */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Applications & Offers by Company</h3>
              <p className="text-xs text-slate-500 mt-0.5">Top recruiting partners</p>
            </div>
            <Building className="w-5 h-5 text-purple-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyStats}>
                <XAxis dataKey="company" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="applications" fill="#93c5fd" radius={[6, 6, 0, 0]} name="Applications" />
                <Bar dataKey="selected" fill="#10b981" radius={[6, 6, 0, 0]} name="Selected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      <Modal
        isOpen={announcementModal}
        onClose={() => setAnnouncementModal(false)}
        title="Broadcast Campus Placement Notice"
      >
        <form onSubmit={handleBroadcastAnnouncement} className="space-y-4 text-xs">
          {annSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold border border-emerald-200">
              {annSuccess}
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1">Notice Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Google Drive Date Confirmed"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Notice Content</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed announcement for students..."
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Priority</label>
              <select
                value={announcementForm.priority}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              >
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Target Audience</label>
              <select
                value={announcementForm.targetRole}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, targetRole: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              >
                <option value="All">All Portal Users</option>
                <option value="student">Students Only</option>
                <option value="recruiter">Recruiters Only</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setAnnouncementModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl font-bold shadow">Broadcast Notice</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
