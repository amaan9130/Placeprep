import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Printer, Save, CheckCircle2, 
  Sparkles, User, Mail, Phone, MapPin, Globe, Github 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

export default function ResumeBuilderPage() {
  const { user, profile, updateLocalProfile } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState('ats');

  const [resumeData, setResumeData] = useState({
    name: user?.name || 'Aditya Sharma',
    email: user?.email || 'student@placeprep.edu',
    phone: user?.phone || '+91 98765 43210',
    location: profile?.location || 'Bengaluru, India',
    github: profile?.resumeData?.github || 'https://github.com/your-username',
    linkedin: profile?.resumeData?.linkedin || 'https://linkedin.com/in/your-username',
    summary: profile?.resumeData?.summary || 'Dedicated Computer Science student with strong foundations in Data Structures, Algorithms, and Full-Stack MERN Engineering. Experienced in building responsive React interfaces and high-throughput Node.js microservices.',
    skills: profile?.skills?.map(s => s.name) || ['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Java', 'Data Structures', 'SQL', 'Docker', 'Git'],
    education: profile?.education || [
      { degree: 'B.Tech in Computer Science & Engineering', institution: 'Institute of Engineering & Technology', grade: '8.65 CGPA', startYear: 2022, endYear: 2026 }
    ],
    projects: profile?.projects || [
      {
        title: 'PlacePrep - Placement & Career Portal',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
        description: 'Engineered full-stack placement portal with timed aptitude tests, LeetCode-style coding sandbox, and candidate management.'
      },
      {
        title: 'Distributed Cloud Storage Engine',
        technologies: ['Go', 'gRPC', 'Docker', 'Raft'],
        description: 'Architected fault-tolerant chunked file storage system implementing Raft consensus for state replication.'
      }
    ],
    experience: profile?.experience || [
      {
        title: 'Software Engineering Intern',
        company: 'FinTech Innovations Lab',
        startDate: 'May 2025',
        endDate: 'July 2025',
        description: 'Developed RESTful payment reconciliation microservices and optimized query indexing reducing latency by 32%.'
      }
    ]
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setResumeData(prev => ({
        ...prev,
        location: profile.location || prev.location,
        github: profile.resumeData?.github || prev.github,
        linkedin: profile.resumeData?.linkedin || prev.linkedin,
        summary: profile.resumeData?.summary || prev.summary,
        skills: profile.skills?.map(s => s.name) || prev.skills,
        education: profile.education || prev.education,
        projects: profile.projects || prev.projects,
        experience: profile.experience || prev.experience
      }));
    }
  }, [profile]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToProfile = async () => {
    setSaving(true);
    try {
      const res = await API.put('/student/profile', {
        phone: resumeData.phone,
        location: resumeData.location,
        skills: resumeData.skills.map(s => ({ name: s, level: 'Advanced' })),
        education: resumeData.education,
        projects: resumeData.projects,
        experience: resumeData.experience,
        resumeData: { 
          summary: resumeData.summary,
          github: resumeData.github,
          linkedin: resumeData.linkedin
        }
      });
      if (res.data.success) {
        updateLocalProfile(res.data.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving resume data:', err);
    } finally {
      setSaving(false);
    }
  };

  // Render the Selected Resume Template layout
  const renderResumeContent = () => {
    if (selectedTemplate === 'sidebar') {
      // Modern Two-Column Layout
      return (
        <div className="grid grid-cols-12 gap-6 print:gap-6 text-slate-800 font-sans">
          {/* Header (Top Span) */}
          <div className="col-span-12 border-b border-slate-200 pb-4 mb-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{resumeData.name}</h1>
            <p className="text-xs text-brand-600 font-bold tracking-wider uppercase mt-1">Computer Science & Engineering Student</p>
          </div>

          {/* Left Column (Sidebar - Contact, Skills, Education) */}
          <div className="col-span-4 space-y-6 border-r border-slate-100 pr-4 print:col-span-4">
            {/* Contact */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Contact</h4>
              <div className="text-[11px] text-slate-600 space-y-1.5 break-all">
                <div>Email: {resumeData.email}</div>
                <div>Phone: {resumeData.phone}</div>
                <div>Loc: {resumeData.location}</div>
                <div className="font-semibold text-brand-600">GitHub: {resumeData.github}</div>
                <div className="font-semibold text-brand-600">LinkedIn: {resumeData.linkedin}</div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Technical Skills</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resumeData.skills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 text-[10px] font-medium px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Education</h4>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="text-[11px] space-y-0.5">
                  <div className="font-bold text-slate-800">{edu.degree}</div>
                  <div className="text-slate-500">{edu.institution}</div>
                  <div className="font-semibold text-slate-700">{edu.grade}</div>
                  <div className="text-slate-400 text-[10px]">{edu.startYear} - {edu.endYear}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Experience, Projects, Summary) */}
          <div className="col-span-8 space-y-6 print:col-span-8">
            {/* Summary */}
            {resumeData.summary && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Professional Profile</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Professional Experience</h3>
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800">{exp.title}</span>
                      <span className="text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">{exp.company}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Technical Projects</h3>
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{proj.title}</span>
                    {proj.technologies && (
                      <span className="text-[10px] text-brand-600 font-bold">[{proj.technologies.join(', ')}]</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (selectedTemplate === 'academic') {
      // Academic / TPO Layout (Bold accents, left-aligned)
      return (
        <div className="space-y-5 text-slate-800 font-sans border-t-4 border-brand-600 pt-4">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">{resumeData.name}</h1>
              <p className="text-xs text-slate-500 font-medium">B.Tech - Computer Science & Engineering</p>
            </div>
            <div className="text-right text-[11px] text-slate-600 space-y-0.5">
              <div>Email: {resumeData.email}</div>
              <div>Phone: {resumeData.phone} | {resumeData.location}</div>
              <div className="font-semibold text-brand-600">Github: {resumeData.github}</div>
              <div className="font-semibold text-brand-600">Linkedin: {resumeData.linkedin}</div>
            </div>
          </div>

          {/* Summary */}
          {resumeData.summary && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                Career Summary
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed px-1">{resumeData.summary}</p>
            </div>
          )}

          {/* Education */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
              Academic Background
            </h3>
            <div className="space-y-2 px-1">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                    <p className="text-slate-500">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">{edu.grade}</span>
                    <p className="text-[10px] text-slate-400 mt-1">{edu.startYear} - {edu.endYear}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
              Skills Checklist
            </h3>
            <div className="flex flex-wrap gap-1 px-1 pt-1">
              {resumeData.skills.map((skill, idx) => (
                <span key={idx} className="border border-slate-200 text-slate-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          {resumeData.experience?.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                Professional Experience
              </h3>
              <div className="space-y-2 px-1">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{exp.title}</span>
                      <span className="text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{exp.company}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
              Project Sandbox Highlights
            </h3>
            <div className="space-y-2 px-1">
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{proj.title}</span>
                    {proj.technologies && (
                      <span className="text-[10px] text-slate-500 italic">[{proj.technologies.join(', ')}]</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Default: Classic ATS Template
    return (
      <div className="space-y-6 text-slate-900 font-sans">
        {/* Header */}
        <div className="text-center border-b border-slate-300 pb-5 space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{resumeData.name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 font-medium">
            <span>{resumeData.email}</span>
            <span>•</span>
            <span>{resumeData.phone}</span>
            <span>•</span>
            <span>{resumeData.location}</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-brand-700 font-semibold pt-1">
            <span>GitHub: {resumeData.github}</span>
            <span>•</span>
            <span>LinkedIn: {resumeData.linkedin}</span>
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Professional Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Education */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Education
          </h3>
          {resumeData.education.map((edu, idx) => (
            <div key={idx} className="flex items-start justify-between text-xs">
              <div>
                <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                <p className="text-slate-600">{edu.institution}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800">{edu.grade}</span>
                <p className="text-slate-500 text-[11px]">{edu.startYear} - {edu.endYear}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Technical Skills
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>Core Technologies:</strong> {resumeData.skills.join(', ')}
          </p>
        </div>

        {/* Experience */}
        {resumeData.experience?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Work Experience
            </h3>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-start justify-between text-xs">
                  <h4 className="font-bold text-slate-900">{exp.title} - <span className="font-semibold text-slate-700">{exp.company}</span></h4>
                  <span className="text-[11px] text-slate-500 font-medium">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Key Engineering Projects
          </h3>
          {resumeData.projects.map((proj, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-start justify-between text-xs">
                <h4 className="font-bold text-slate-900">{proj.title}</h4>
                {proj.technologies && (
                  <span className="text-[10px] text-slate-500 italic">[{proj.technologies.join(', ')}]</span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ATS Resume Builder</h1>
          <p className="text-xs text-slate-500 mt-1">Generate a clean, professional ATS-optimized PDF resume ready for campus drives.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveToProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4 text-slate-500" />
            {saving ? 'Saving...' : 'Save Resume Details'}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resume details synchronized with your profile!
        </div>
      )}

      {/* 2-Column: Editor Controls (no-print) & Live Resume Paper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Controls */}
        <div className="lg:col-span-4 space-y-6 no-print max-h-[85vh] overflow-y-auto pr-2 pb-6">
          
          {/* Template Selector Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Select Template Style</h3>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setSelectedTemplate('ats')}
                className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                  selectedTemplate === 'ats' 
                    ? 'border-brand-600 bg-brand-50 text-brand-700' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Classic ATS
              </button>
              <button 
                onClick={() => setSelectedTemplate('sidebar')}
                className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                  selectedTemplate === 'sidebar' 
                    ? 'border-brand-600 bg-brand-50 text-brand-700' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Two-Column
              </button>
              <button 
                onClick={() => setSelectedTemplate('academic')}
                className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                  selectedTemplate === 'academic' 
                    ? 'border-brand-600 bg-brand-50 text-brand-700' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Academic TPO
              </button>
            </div>
          </div>

          {/* Details Editor Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Customize Details</h3>

            {/* Profile Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">General Info</h4>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Summary</label>
                <textarea
                  rows={5}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile Link</label>
                <input
                  type="url"
                  value={resumeData.github}
                  onChange={(e) => setResumeData({ ...resumeData, github: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  placeholder="https://github.com/your-username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile Link</label>
                <input
                  type="url"
                  value={resumeData.linkedin}
                  onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  placeholder="https://linkedin.com/in/your-username"
                />
              </div>
            </div>

            {/* Technical Skills */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technical Skills</h4>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Core Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={resumeData.skills.join(', ')}
                  onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-brand-500"
                />
              </div>
            </div>

            {/* Education List Editor */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Education Details</h4>
                <button
                  type="button"
                  onClick={() => setResumeData({
                    ...resumeData,
                    education: [...resumeData.education, { degree: '', institution: '', grade: '', startYear: 2022, endYear: 2026 }]
                  })}
                  className="text-[10px] text-brand-600 font-extrabold hover:underline"
                >
                  + Add Edu
                </button>
              </div>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...resumeData.education];
                      updated.splice(idx, 1);
                      setResumeData({ ...resumeData, education: updated });
                    }}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                  >
                    Delete
                  </button>
                  <input
                    type="text"
                    placeholder="Degree / Course"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[idx].degree = e.target.value;
                      setResumeData({ ...resumeData, education: updated });
                    }}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[idx].institution = e.target.value;
                      setResumeData({ ...resumeData, education: updated });
                    }}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Grade / CGPA"
                      value={edu.grade}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].grade = e.target.value;
                        setResumeData({ ...resumeData, education: updated });
                      }}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                    />
                    <input
                      type="number"
                      placeholder="Start Yr"
                      value={edu.startYear}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].startYear = Number(e.target.value);
                        setResumeData({ ...resumeData, education: updated });
                      }}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                    />
                    <input
                      type="number"
                      placeholder="End Yr"
                      value={edu.endYear}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].endYear = Number(e.target.value);
                        setResumeData({ ...resumeData, education: updated });
                      }}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Experience List Editor */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Experience</h4>
                <button
                  type="button"
                  onClick={() => setResumeData({
                    ...resumeData,
                    experience: [...resumeData.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }]
                  })}
                  className="text-[10px] text-brand-600 font-extrabold hover:underline"
                >
                  + Add Exp
                </button>
              </div>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...resumeData.experience];
                      updated.splice(idx, 1);
                      setResumeData({ ...resumeData, experience: updated });
                    }}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                  >
                    Delete
                  </button>
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => {
                      const updated = [...resumeData.experience];
                      updated[idx].title = e.target.value;
                      setResumeData({ ...resumeData, experience: updated });
                    }}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...resumeData.experience];
                      updated[idx].company = e.target.value;
                      setResumeData({ ...resumeData, experience: updated });
                    }}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Start (e.g. May 2025)"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[idx].startDate = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                    />
                    <input
                      type="text"
                      placeholder="End (e.g. July 2025)"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[idx].endDate = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Job Description..."
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...resumeData.experience];
                      updated[idx].description = e.target.value;
                      setResumeData({ ...resumeData, experience: updated });
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500 leading-relaxed"
                  />
                </div>
              ))}
            </div>

            {/* Projects List Editor */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Engineering Projects</h4>
                <button
                  type="button"
                  onClick={() => setResumeData({
                    ...resumeData,
                    projects: [...resumeData.projects, { title: '', technologies: [], description: '' }]
                  })}
                  className="text-[10px] text-brand-600 font-extrabold hover:underline"
                >
                  + Add Proj
                </button>
              </div>
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...resumeData.projects];
                      updated.splice(idx, 1);
                      setResumeData({ ...resumeData, projects: updated });
                    }}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                  >
                    Delete
                  </button>
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[idx].title = e.target.value;
                      setResumeData({ ...resumeData, projects: updated });
                    }}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    value={proj.technologies?.join(', ') || ''}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[idx].technologies = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setResumeData({ ...resumeData, projects: updated });
                    }}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500"
                  />
                  <textarea
                    rows={3}
                    placeholder="Project Description..."
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[idx].description = e.target.value;
                      setResumeData({ ...resumeData, projects: updated });
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-500 leading-relaxed"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Live Resume Document Paper Preview */}
        <div className="lg:col-span-8 bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200 text-slate-900 max-w-3xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none print:col-span-12">
          {renderResumeContent()}
        </div>
      </div>
    </div>
  );
}