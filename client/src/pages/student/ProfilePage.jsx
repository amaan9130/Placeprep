import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, GraduationCap, Code, 
  Award, Briefcase, Plus, Trash2, Save, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

export default function ProfilePage() {
  const { user, profile, updateLocalProfile, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    rollNumber: profile?.rollNumber || '',
    cgpa: profile?.cgpa || 8.0,
    activeBacklogs: profile?.activeBacklogs || 0,
    historyOfBacklogs: profile?.historyOfBacklogs || 0,
    tenthPercentage: profile?.tenthPercentage || 85,
    twelfthPercentage: profile?.twelfthPercentage || 85,
    branch: profile?.branch || 'Computer Science & Engineering',
    bio: profile?.bio || '',
    skills: profile?.skills || [],
    projects: profile?.projects || []
  });

  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        rollNumber: profile.rollNumber || '',
        cgpa: profile.cgpa || 8.0,
        activeBacklogs: profile.activeBacklogs || 0,
        branch: profile.branch || 'Computer Science & Engineering',
        skills: profile.skills || [],
        projects: profile.projects || []
      }));
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await API.put('/student/profile', formData);
      if (res.data.success) {
        updateLocalProfile(res.data.data);
        if (formData.name !== user.name) updateUser({ name: formData.name });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, { ...newSkill }] }));
    setNewSkill({ name: '', level: 'Intermediate' });
  };

  const removeSkill = (index) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: 'New Engineering Project', description: '', technologies: ['React'], githubUrl: '', liveUrl: '' }]
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl border border-slate-200 object-cover bg-slate-100"
          />
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500">{formData.branch} · Batch of {user?.graduationYear || 2026}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="primary" size="sm">{formData.cgpa} CGPA</Badge>
              <Badge variant={formData.activeBacklogs === 0 ? 'success' : 'danger'} size="sm">
                {formData.activeBacklogs} Active Backlogs
              </Badge>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes and readiness score updated successfully!</span>
        </div>
      )}

      {/* Academic Information */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <GraduationCap className="w-4 h-4 text-brand-600" /> Academic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
            <input
              type="text"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="e.g. 22BCSE042"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA (0 - 10)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none font-bold text-brand-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Active Backlogs</label>
            <input
              type="number"
              min="0"
              value={formData.activeBacklogs}
              onChange={(e) => setFormData({ ...formData, activeBacklogs: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Code className="w-4 h-4 text-emerald-600" /> Skills
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {formData.skills.map((sk, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-full border border-slate-200">
              <span className="font-medium">{sk.name}</span>
              <span className="text-[10px] text-slate-500">({sk.level})</span>
              <button type="button" onClick={() => removeSkill(idx)} className="text-slate-400 hover:text-rose-500 ml-1">×</button>
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. React.js, Python, MongoDB"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
          />
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <button type="button" onClick={addSkill} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
            Add Skill
          </button>
        </div>
      </div>
    </form>
  );
}
