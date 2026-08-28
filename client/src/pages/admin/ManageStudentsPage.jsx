import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle2, XCircle, Power, ExternalLink } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

export default function ManageStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (branch !== 'All') params.append('branch', branch);

      const res = await API.get(`/admin/students?${params.toString()}`);
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [branch]);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await API.put(`/admin/students/${userId}/toggle-status`);
      if (res.data.success) {
        fetchStudents();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Management Directory</h1>
        <p className="text-xs text-slate-500 mt-1">Search, filter academic records, inspect readiness scores, and manage account statuses.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none"
          />
        </div>
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-none"
        >
          <option value="All">All Branches</option>
          <option value="Computer Science & Engineering">CSE</option>
          <option value="Information Technology">IT</option>
          <option value="Electronics & Communication">ECE</option>
        </select>
        <button
          onClick={fetchStudents}
          className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Search
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {loading ? (
          <Loader text="Loading student directory..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Placement Status</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.user?.name}`}
                          alt={st.user?.name}
                          className="w-9 h-9 rounded-full border bg-white object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{st.user?.name}</div>
                          <div className="text-[11px] text-slate-500">{st.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{st.branch}</td>
                    <td className="px-6 py-4 font-bold text-brand-700">{st.cgpa} CGPA</td>
                    <td className="px-6 py-4">
                      <Badge variant={st.placementStatus === 'Placed' ? 'success' : 'default'} size="sm">
                        {st.placementStatus || 'Not Placed'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${st.user?.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {st.user?.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(st.user?._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          st.user?.isActive ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {st.user?.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
