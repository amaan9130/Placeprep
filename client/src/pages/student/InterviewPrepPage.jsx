import React, { useState, useEffect } from 'react';
import { 
  Layers, UserCheck, CheckCircle2, ChevronDown, ChevronUp, 
  Sparkles, Award, Search, BookOpen, Star 
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

export default function InterviewPrepPage() {
  const { updateLocalProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('technical');
  const [techQuestions, setTechQuestions] = useState([]);
  const [hrQuestions, setHrQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTechCategory, setSelectedTechCategory] = useState('All');

  const techCategories = ['All', 'JavaScript', 'React', 'Node.js', 'DBMS', 'Operating Systems', 'OOP'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [techRes, hrRes] = await Promise.all([
        API.get('/practice/interview/technical'),
        API.get('/practice/interview/hr')
      ]);
      if (techRes.data.success) setTechQuestions(techRes.data.data);
      if (hrRes.data.success) setHrQuestions(hrRes.data.data);
    } catch (err) {
      console.error('Error fetching interview prep data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusToggle = async (qId, type, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Practicing' : 'Completed';
    try {
      const res = await API.post('/practice/interview/practice-status', {
        questionId: qId,
        questionType: type,
        status: nextStatus
      });
      if (res.data.success) {
        if (type === 'Technical') {
          setTechQuestions(prev => prev.map(q => q._id === qId ? { ...q, practiceStatus: nextStatus } : q));
        } else {
          setHrQuestions(prev => prev.map(q => q._id === qId ? { ...q, practiceStatus: nextStatus } : q));
        }
        const pRes = await API.get('/student/profile');
        if (pRes.data.success) updateLocalProfile(pRes.data.data);
      }
    } catch (err) {
      console.error('Error updating practice status:', err);
    }
  };

  const filteredTechQuestions = selectedTechCategory === 'All' 
    ? techQuestions 
    : techQuestions.filter(q => q.category === selectedTechCategory);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Preparation Hub</h1>
        <p className="text-xs text-slate-500 mt-1">Core CS Technical question banks & STAR framework behavioral interview guides.</p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('technical')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'technical' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Technical CS Q&A ({techQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab('hr')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'hr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          HR Behavioral (STAR) ({hrQuestions.length})
        </button>
      </div>

      {/* TECHNICAL QUESTIONS VIEW */}
      {activeTab === 'technical' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {techCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTechCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedTechCategory === cat ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader text="Loading technical questions..." />
          ) : (
            filteredTechQuestions.map((q) => {
              const isExpanded = expandedId === q._id;
              const isDone = q.practiceStatus === 'Completed';

              return (
                <div key={q._id} className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : q._id)}
                    className="p-5 cursor-pointer flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusToggle(q._id, 'Technical', q.practiceStatus);
                        }}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                          isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-brand-500'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{q.question}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{q.category}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{q.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50 space-y-3">
                      <p className="font-medium text-slate-800">{q.answer}</p>
                      {q.codeSnippet && (
                        <pre className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                          {q.codeSnippet}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* HR BEHAVIORAL QUESTIONS VIEW */}
      {activeTab === 'hr' && (
        <div className="space-y-4">
          {hrQuestions.map((hr, idx) => {
            const isExpanded = expandedId === (hr._id || idx);
            const isDone = hr.practiceStatus === 'Completed';

            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : (hr._id || idx))}
                  className="p-5 cursor-pointer flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(hr._id || idx, 'HR', hr.practiceStatus);
                      }}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-brand-500'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{hr.question}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{hr.category || 'Behavioral STAR'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">Recommended STAR Model Answer:</span>
                      <p className="text-slate-700 leading-relaxed">{hr.sampleAnswer}</p>
                    </div>

                    {hr.tips?.length > 0 && (
                      <div className="text-[11px] text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                        <span className="font-bold block mb-1">💡 Interviewer Tips:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {hr.tips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
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
