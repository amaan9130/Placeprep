import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle2, AlertCircle, ArrowRight, 
  HelpCircle, FileCode2, Layers, FileText, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';

export default function ReadinessScorePage() {
  const { profile } = useAuth();
  const readiness = profile?.readiness || {
    overall: 81,
    aptitude: 82,
    coding: 78,
    technical: 84,
    interview: 70,
    resume: 92,
    profileCompletion: 95,
    recommendations: [
      'Practice HR behavioral questions using the STAR framework to raise interview readiness above 80%.',
      'Solve 5 medium-level Dynamic Programming questions this week.'
    ]
  };

  const weights = [
    { title: 'Aptitude Practice', score: readiness.aptitude, weight: '20%', desc: 'Derived from timed quantitative, logical, and verbal accuracy.' },
    { title: 'Coding & DSA', score: readiness.coding, weight: '20%', desc: 'Based on problems solved across arrays, strings, trees, and DP.' },
    { title: 'Technical CS Core', score: readiness.technical, weight: '20%', desc: 'Assessed from DBMS, OS, Computer Networks, and OOP mastery.' },
    { title: 'HR Behavioral Interview', score: readiness.interview, weight: '15%', desc: 'Structured STAR responses and practice completion.' },
    { title: 'ATS Resume Match', score: readiness.resume, weight: '15%', desc: 'Verified project portfolio, certifications, and ATS format.' },
    { title: 'Profile Completeness', score: readiness.profileCompletion, weight: '10%', desc: 'Academic CGPA, branch details, and verified GitHub links.' }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Readiness Score Analysis</h1>
        <p className="text-xs text-slate-500 mt-1">Multi-parameter weighted formula evaluating your placement readiness.</p>
      </div>

      {/* Main Big Score Card */}
      <div className="bg-gradient-to-tr from-brand-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Target Goal: &gt; 80% Tier-1 Dream Offer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Overall Readiness: {readiness.overall}%</h2>
          <p className="text-xs sm:text-sm text-brand-100 max-w-lg leading-relaxed">
            Your readiness score is automatically recalculated with every aptitude test taken, coding problem solved, and profile update.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center shrink-0 w-full sm:w-auto">
          <div className="text-3xl font-black text-amber-300">{readiness.overall >= 80 ? 'Tier-1 Ready' : 'In Progress'}</div>
          <p className="text-xs text-brand-100 mt-1">Placement Tier Status</p>
        </div>
      </div>

      {/* Recommendations Box */}
      {readiness.recommendations?.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" /> Actionable Recommendations to Boost Your Score
          </h3>
          <div className="space-y-2">
            {readiness.recommendations.map((rec, i) => (
              <div key={i} className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-medium">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weighted Category Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weights.map((cat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900">{cat.title}</h4>
                <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Weight: {cat.weight}</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-2">{cat.score}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                <div className="bg-brand-600 h-full rounded-full" style={{ width: `${cat.score}%` }} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
