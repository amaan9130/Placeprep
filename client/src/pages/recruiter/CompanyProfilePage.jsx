import React, { useState, useEffect } from 'react';
import { Building, Save, CheckCircle2, Globe, MapPin } from 'lucide-react';
import API from '../../services/api';
import Loader from '../../components/common/Loader';

export default function CompanyProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Google',
    website: 'https://careers.google.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    description: 'Leading global technology company specialized in search, cloud computing, and artificial intelligence.',
    industry: 'Cloud & AI Technology',
    location: 'Bengaluru / Hyderabad',
    packageRange: '32 - 48 LPA'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await API.get('/recruiter/company');
        if (res.data.success && res.data.data) {
          setFormData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching company:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/recruiter/company', formData);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error updating company:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading company profile..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Company Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage brand branding, industry details, and compensation brackets visible to students.</p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Company profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Logo Image URL</label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
