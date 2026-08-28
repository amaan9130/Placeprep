import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Award, Briefcase, FileCode2, 
  HelpCircle, FileText, BarChart3, ChevronRight, GraduationCap, 
  Building2, Calendar, CheckCircle2, MessageSquare, Star, Code2, Cpu, BarChart
} from 'lucide-react';

export default function LandingPage() {
  const [activePortalTab, setActivePortalTab] = useState('student');
  
  // Auto-cycle tabs for dynamic animation feel
  useEffect(() => {
    const tabs = ['student', 'recruiter', 'admin'];
    const interval = setInterval(() => {
      setActivePortalTab((current) => {
        const nextIndex = (tabs.indexOf(current) + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Coding Sandbox mock states
  const [codeStep, setCodeStep] = useState(0);
  const codeSnippets = [
    { code: 'def solve(graph, start):\n  visited = set()\n  queue = [start]', desc: 'Initializing DSA Search BFS...' },
    { code: 'def solve(graph, start):\n  visited = set()\n  queue = [start]\n  while queue:', desc: 'Exploring graph nodes queue...' },
    { code: 'def solve(graph, start):\n  visited = set()\n  queue = [start]\n  while queue:\n    node = queue.pop(0)', desc: 'Pop node, evaluating neighbors...' },
    { code: '⚡ Executing: python3 solution.py\n🚀 Running 3 Test Cases...\n\n✅ Test Case 1: Passed\n✅ Test Case 2: Passed\n✅ Test Case 3: Passed\n\n🎉 Optimal SDE Solution Found!', desc: 'Success!' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCodeStep((prev) => (prev + 1) % codeSnippets.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const clientLogos = [
    { name: 'Google', logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=80&h=80&fit=crop&q=80', package: '45.0 LPA' },
    { name: 'Microsoft', logo: 'https://images.unsplash.com/photo-1625014020903-e329f586c990?w=80&h=80&fit=crop&q=80', package: '42.5 LPA' },
    { name: 'Amazon', logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=80&h=80&fit=crop&q=80', package: '38.0 LPA' },
    { name: 'Deloitte', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&h=80&fit=crop&q=80', package: '15.0 LPA' },
    { name: 'TCS', logo: 'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=80&h=80&fit=crop&q=80', package: '9.0 LPA' },
    { name: 'Infosys', logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=80&h=80&fit=crop&q=80', package: '9.5 LPA' }
  ];

  const features = [
    {
      icon: Briefcase,
      title: 'Placement Opportunities',
      desc: 'Browse tier-1 dream companies and check automated eligibility parameters based on CGPA and branch rules.',
      color: 'from-blue-600 to-cyan-500',
      badge: 'Real-time Matching'
    },
    {
      icon: HelpCircle,
      title: 'Aptitude Vault',
      desc: 'Timed mocks with comprehensive quantitative, logical, and verbal question sheets and structured solutions.',
      color: 'from-purple-600 to-indigo-500',
      badge: '40+ Daily Quizzes'
    },
    {
      icon: FileCode2,
      title: 'Coding Sandbox',
      desc: 'Compile solutions with multi-language code editors verifying edge cases on advanced data structures.',
      color: 'from-emerald-600 to-teal-500',
      badge: 'Auto Evaluator'
    }
  ];

  const steps = [
    { step: '01', title: 'Verify Academics', desc: 'Sync your CGPA, logs, and build an ATS-grade resume.' },
    { step: '02', title: 'Complete Sandboxes', desc: 'Unlock readiness points in aptitude and coding mocks.' },
    { step: '03', title: 'Unlock Offers', desc: 'Apply in 1-click to matching corporate campus drives.' }
  ];

  return (
    <div className="space-y-28 pb-28 bg-slate-50/50 text-slate-800 relative overflow-hidden font-sans">
      
      {/* GRID SCROLL & FLOATING ANIMATIONS */}
      <style>{`
        @keyframes bg-grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes orbit-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1.5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-28px) rotate(-2.5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(1.5deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.15; }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(99, 102, 241, 0.15); }
          50% { border-color: rgba(59, 130, 246, 0.4); }
        }

        .bg-grid-glow {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(15, 23, 42, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.02) 1px, transparent 1px);
          animation: bg-grid-scroll 30s linear infinite;
        }

        .animate-orbit-1 { animation: orbit-rotate 45s linear infinite; }
        .animate-orbit-2 { animation: orbit-rotate 65s linear infinite reverse; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4.5s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 6s ease-in-out infinite; }
        .animate-glow-border { animation: border-glow 5s linear infinite; }
      `}</style>

      {/* Grid Overlay Layer */}
      <div className="absolute inset-0 bg-grid-glow opacity-90 pointer-events-none z-0" />

      {/* Interactive Glowing Blurs */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] bg-gradient-to-tr from-brand-600/10 to-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-15%] w-[65%] h-[65%] bg-gradient-to-bl from-brand-500/10 to-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* DYNAMIC ORBIT PARTICLES */}
      <div className="absolute top-[25%] left-[5%] w-[500px] h-[500px] border border-slate-200/50 rounded-full animate-orbit-1 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-brand-500 rounded-full absolute top-10 left-10 shadow-md shadow-brand-500/30" />
        <div className="w-2 h-2 bg-blue-400 rounded-full absolute bottom-20 right-10 shadow-md" />
      </div>

      {/* MAIN HERO & FLOATING PLAYGROUND */}
      <section id="sandbox" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Hero Core */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200/80 px-4 py-2 rounded-full text-xs font-bold text-brand-600 shadow-sm tracking-wide uppercase hover:border-brand-500/30 transition-all cursor-pointer">
              <Sparkles className="w-4 h-4 text-brand-500 animate-spin-slow" />
              <span>Next-Gen Placement Governance System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight text-slate-900">
              Accelerate Your <br />
              <span className="bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Career Pathing
              </span> <br />
              With PlacePrep.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              A high-fidelity placement preparation platform. Master coding sandboxes, test logical aptitude, build ATS-ready profiles, and unlock transparent corporate hiring pipelines.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register/student"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl border border-slate-200 shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span>Login Portal</span>
              </Link>
            </div>

            {/* Premium Client Grid */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center lg:justify-start gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Seeded Recruitment Partners
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {clientLogos.map((client, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl py-3.5 shadow-sm hover:shadow transition-shadow"
                  >
                    <img src={client.logo} alt={client.name} className="w-6 h-6 rounded-md object-cover mb-1.5" />
                    <span className="text-[10px] font-black text-slate-800">{client.name}</span>
                    <span className="text-[8px] text-brand-600 font-bold mt-0.5">{client.package}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Fully Animated Interactive Sandbox Playground */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[500px]">
            
            {/* Glowing Orbit Rings */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full border border-slate-200 animate-pulse-ring z-0" />
            <div className="absolute w-[340px] h-[340px] rounded-full border border-slate-200 animate-orbit-1 z-0" />

            {/* Central Main Interactive Code Compiler Canvas */}
            <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative z-10 animate-glow-border">
              {/* Header Mac Buttons */}
              <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] font-mono text-slate-600 select-none">BFS_Pathfinder.py</div>
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
              </div>
              
              {/* Live Code Compiler Animation */}
              <div className="p-5 font-mono text-[11px] leading-relaxed text-slate-300 min-h-[160px]">
                <pre className="text-brand-400 font-black"># Auto Evaluating Solution...</pre>
                <pre className="mt-2 text-white overflow-hidden text-ellipsis whitespace-pre-wrap">
                  {codeSnippets[codeStep].code}
                </pre>
                <div className="mt-4 pt-3 border-t border-slate-800 text-slate-500 text-[10px] italic">
                  💡 Status: {codeSnippets[codeStep].desc}
                </div>
              </div>
            </div>

            {/* FLOATING CARD 1: Live drive Scheduler Card */}
            <div className="absolute top-[-10px] right-2 sm:right-6 bg-white border border-slate-200 p-4 rounded-2xl shadow-xl z-20 w-44 animate-float-slow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-bold text-slate-900">Google Drive 2026</div>
              </div>
              <div className="space-y-1.5 text-[9px] text-slate-500">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>CGPA Required:</span>
                  <span className="font-bold text-slate-800">8.0+</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-bold text-slate-800">Bengaluru / Hybrid</span>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Dynamic Timeline Card */}
            <div className="absolute bottom-[-10px] left-2 bg-white border border-slate-200 p-4 rounded-2xl shadow-xl z-20 w-44 animate-float-medium">
              <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-2">Pipeline tracker</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] text-slate-600">Resume Screen Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-slate-900 font-bold">Tech Interview 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTALS INTERACTIVE DEMO ACCORDION */}
      <section id="portals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Workspace Modules</h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Role-Based Integrated Portals</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center max-w-md mx-auto bg-slate-100 border border-slate-200 p-1.5 rounded-2xl">
          {['student', 'recruiter', 'admin'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePortalTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all capitalize ${
                activePortalTab === tab 
                  ? 'bg-gradient-to-r from-brand-600 to-blue-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'admin' ? 'TPO Officer' : tab}
            </button>
          ))}
        </div>

        {/* Tab Display Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl max-w-4xl mx-auto">
          {activePortalTab === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Badge variant="indigo" size="sm">Preparation & Applications</Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Practice mocks, sync CGPA, and track deadlines.</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Students access custom dashboards analyzing their overall readiness. Revise core CS topics, build ATS resumes, and view upcoming drives matching eligibility constraints.
                </p>
                <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline">
                  Sign in Student Demo <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="text-[10px] text-slate-500 font-mono mb-2 flex justify-between">
                  <span>StudentDashboard.jsx</span>
                  <span className="text-emerald-400">🟢 Connected</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between text-xs text-white">
                    <span className="text-slate-300">Readiness Score</span>
                    <span className="font-bold">81% Overall</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white">
                    <span className="text-slate-300 block mb-1">Recommended practice path</span>
                    <span className="text-[10px] text-brand-300 font-bold">★ Solve 5 Medium Tree Questions</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePortalTab === 'recruiter' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Badge variant="amber" size="sm">Recruitment Funnel</Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Publish roles, verify parameters, and conduct tests.</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Corporate partners can register, create job openings, inspect student profiles/resumes, and advance applicants through online rounds or schedule Google Meet interview stages.
                </p>
                <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline">
                  Sign in Recruiter Demo <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="text-[10px] text-slate-500 font-mono mb-2 flex justify-between">
                  <span>RecruiterDashboard.jsx</span>
                  <span className="text-emerald-400">🟢 Connected</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between text-xs text-white">
                    <span className="text-slate-300">Active Job Roles</span>
                    <span className="font-bold">4 Published</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white">
                    <span className="text-slate-300 block mb-1">Pending Application Reviews</span>
                    <span className="text-[10px] text-amber-400 font-bold">⌛ 12 Candidates await screening</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePortalTab === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Badge variant="purple" size="sm">Governance & Metrics</Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Schedule drive venues and monitor statistics.</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Placement cell admins maintain overall campus placement lists, schedule drives, publish broadcasts, moderate student profiles, and extract accreditation audits.
                </p>
                <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline">
                  Sign in Admin Demo <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="text-[10px] text-slate-500 font-mono mb-2 flex justify-between">
                  <span>TPO_Dashboard.jsx</span>
                  <span className="text-emerald-400">🟢 Connected</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between text-xs text-white">
                    <span className="text-slate-300">Campus Placement Rate</span>
                    <span className="font-bold">81% Placed</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white">
                    <span className="text-slate-300 block mb-1">Scheduled Recruitment Drives</span>
                    <span className="text-[10px] text-purple-300 font-bold">📢 3 Upcoming Drives Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CORE PLATFORM CAPABILITIES */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Integrated Features</h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Everything Required For Placement Success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-lg hover:-translate-y-1.5 transition-all group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:rotate-6 transition-all`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black uppercase tracking-wider mb-2.5 inline-block">
                    {feat.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STEP-BY-STEP FLOW PIPELINE */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 border-t border-slate-200 pt-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Step-by-step onboarding</h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">How It Works</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, i) => (
            <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-md relative">
              <div className="text-3xl font-black text-brand-200 mb-3">{st.step}</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">{st.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// Simple internal Badge component
function Badge({ children, variant = 'primary', size = 'md' }) {
  const variantStyles = {
    primary: 'bg-brand-50/80 text-brand-700 border border-brand-200',
    indigo: 'bg-indigo-50/80 text-indigo-700 border border-indigo-200',
    amber: 'bg-amber-50/80 text-amber-700 border border-amber-200',
    purple: 'bg-purple-50/80 text-purple-700 border border-purple-200',
    success: 'bg-emerald-50/80 text-emerald-700 border border-emerald-200'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-lg ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
}