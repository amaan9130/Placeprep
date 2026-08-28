import React from 'react';
import { Sparkles, Shield, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">PlacePrep</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-4">
              The complete campus placement preparation & recruitment management ecosystem empowering students, college placement cells, and corporate recruiters.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Secure</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> Top College Partner</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Preparation Suites</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/student/aptitude" className="hover:text-white transition-colors">Aptitude Tests</a></li>
              <li><a href="/student/coding" className="hover:text-white transition-colors">Coding Challenges</a></li>
              <li><a href="/student/interview" className="hover:text-white transition-colors">Technical Question Bank</a></li>
              <li><a href="/student/interview" className="hover:text-white transition-colors">HR Behavioral STAR Practice</a></li>
              <li><a href="/student/resume" className="hover:text-white transition-colors">ATS Resume Builder</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Portals & Access</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/login" className="hover:text-white transition-colors">Student Login</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Recruiter Portal</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Placement Officer Admin</a></li>
              <li><a href="/student/jobs" className="hover:text-white transition-colors">Campus Job Openings</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PlacePrep. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for placement excellence & recruitment tracking</p>
        </div>
      </div>
    </footer>
  );
}
