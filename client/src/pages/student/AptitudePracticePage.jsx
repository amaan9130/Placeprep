import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Clock, CheckCircle2, XCircle, RotateCcw, 
  ArrowRight, Award, BarChart3, AlertCircle, Sparkles 
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

export default function AptitudePracticePage() {
  const { updateLocalProfile } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Active Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const categories = ['All', 'Quantitative', 'Logical', 'Verbal', 'Data Interpretation'];

  const fetchQuestions = async (cat = selectedCategory) => {
    setLoading(true);
    try {
      const url = cat === 'All' ? '/practice/aptitude/questions?limit=20' : `/practice/aptitude/questions?category=${cat}&limit=20`;
      const res = await API.get(url);
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    let interval = null;
    if (quizActive && !testResult) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizActive, testResult]);

  const startQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setTimerSeconds(0);
    setTestResult(null);
    setQuizActive(true);
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    try {
      const answersPayload = questions.map(q => ({
        questionId: q._id,
        selectedOption: userAnswers[q._id] !== undefined ? userAnswers[q._id] : -1
      }));

      const res = await API.post('/practice/aptitude/submit', {
        category: selectedCategory === 'All' ? 'Mixed Aptitude Assessment' : selectedCategory,
        answers: answersPayload,
        timeTakenSeconds: timerSeconds
      });

      if (res.data.success) {
        setTestResult(res.data.data);
        setQuizActive(false);
        const pRes = await API.get('/student/profile');
        if (pRes.data.success) updateLocalProfile(pRes.data.data);
      }
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Aptitude Practice Hub</h1>
          <p className="text-xs text-slate-500 mt-1">Timed assessments in Quantitative, Logical Reasoning, Verbal Ability & DI.</p>
        </div>

        {!quizActive && !testResult && (
          <button
            onClick={startQuiz}
            disabled={questions.length === 0}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow transition-all"
          >
            <Clock className="w-4 h-4" /> Start Timed Assessment
          </button>
        )}
      </div>

      {/* Categories Bar */}
      {!quizActive && !testResult && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* QUIZ ACTIVE VIEW */}
      {quizActive && questions.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Question {currentIndex + 1} of {questions.length}</span>
              <Badge variant="primary" size="sm">{questions[currentIndex].category}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl font-mono">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>{formatTime(timerSeconds)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 leading-relaxed mb-6">
              {questions[currentIndex].question}
            </h3>

            <div className="space-y-3">
              {questions[currentIndex].options.map((opt, optIdx) => {
                const isSelected = userAnswers[questions[currentIndex]._id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(questions[currentIndex]._id, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-100 font-bold' 
                        : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow"
              >
                {submitting ? 'Evaluating...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TEST RESULT VIEW */}
      {testResult && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
          <div className="text-center pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Assessment Completed!</h2>
            <p className="text-xs text-slate-500 mt-1">Your aptitude score has been logged to your placement readiness profile.</p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-2xl font-extrabold text-slate-900">{testResult.score} / {testResult.totalQuestions}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Score</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-2xl font-extrabold text-brand-600">{testResult.accuracy}%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Accuracy</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-2xl font-extrabold text-slate-900">{formatTime(testResult.timeTakenSeconds)}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Time</div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Question-by-Question Review & Solutions</h3>
            {testResult.answers?.map((ans, aIdx) => (
              <div key={aIdx} className={`p-4 rounded-2xl border ${ans.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs font-bold text-slate-900">
                    Q{aIdx + 1}: {ans.questionText}
                  </p>
                  {ans.isCorrect ? (
                    <span className="text-emerald-700 bg-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">Correct</span>
                  ) : (
                    <span className="text-rose-700 bg-rose-100 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">Incorrect</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200/50 mt-2">
                  <strong className="text-slate-800">Explanation:</strong> {ans.explanation || 'Option ' + String.fromCharCode(65 + ans.correctOption) + ' is correct.'}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => { setTestResult(null); setQuizActive(false); fetchQuestions(); }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Practice Another Set
            </button>
          </div>
        </div>
      )}

      {/* Question Library Preview */}
      {!quizActive && !testResult && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Practice Question Library ({questions.length})</h3>
          {questions.map((q, qIdx) => (
            <div key={q._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">{q.category} · {q.subcategory}</Badge>
                <span className="text-[10px] font-bold text-slate-400 capitalize">{q.difficulty}</span>
              </div>
              <p className="text-xs font-bold text-slate-900 leading-relaxed">{q.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {q.options.map((op, oIdx) => (
                  <div key={oIdx} className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {String.fromCharCode(65 + oIdx)}. {op}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
