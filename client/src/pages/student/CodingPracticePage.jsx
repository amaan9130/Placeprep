import React, { useState, useEffect } from 'react';
import { 
  Code2, CheckCircle2, Play, ArrowRight, Lightbulb, 
  Clock, Terminal, Check, X, RotateCcw, Sparkles 
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

export default function CodingPracticePage() {
  const { updateLocalProfile } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [solutionModal, setSolutionModal] = useState(false);

  const categories = ['All', 'Arrays', 'Strings', 'Stacks', 'Trees', 'Dynamic Programming'];

  const fetchQuestions = async (cat = activeCategory) => {
    setLoading(true);
    try {
      const url = cat === 'All' ? '/practice/coding/questions' : `/practice/coding/questions?category=${cat}`;
      const res = await API.get(url);
      if (res.data.success) {
        setQuestions(res.data.data);
        if (!selectedQuestion && res.data.data.length > 0) {
          selectProblem(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching coding problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(activeCategory);
  }, [activeCategory]);

  const getStarterCodeForQuestion = (slug, lang, javascriptFallback) => {
    if (lang === 'javascript') return javascriptFallback || 'function solution() {\n  // Write your code here\n}';
    
    if (slug === 'two-sum') {
      if (lang === 'python') return "def twoSum(nums, target):\n    # Write your code here\n    # Example: return [0, 1]\n    return []";
      if (lang === 'java') return "public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};";
    }
    
    if (slug === 'valid-parentheses') {
      if (lang === 'python') return "def isValid(s):\n    # Write your code here\n    return False";
      if (lang === 'java') return "public class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n        return false;\n    }\n};";
    }
    
    if (slug === 'maximum-subarray') {
      if (lang === 'python') return "def maxSubArray(nums):\n    # Write your code here\n    return 0";
      if (lang === 'java') return "public class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};";
    }

    if (slug === 'reverse-string') {
      if (lang === 'python') return "def reverseString(s):\n    # Write your code here\n    # Modify s in-place or return s\n    s.reverse()\n    return s";
      if (lang === 'java') return "public class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n    }\n};";
    }
    
    if (slug === 'invert-binary-tree') {
      if (lang === 'python') return "def invertTree(root):\n    # Write your code here\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root";
      if (lang === 'java') return "public class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your code here\n        return root;\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your code here\n        return root;\n    }\n};";
    }
    
    if (slug === 'climbing-stairs') {
      if (lang === 'python') return "def climbStairs(n):\n    # Write your code here\n    return 0";
      if (lang === 'java') return "public class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n};";
    }

    if (slug === 'merge-sorted-array') {
      if (lang === 'python') return "def merge(nums1, m, nums2, n):\n    # Write your code here\n    # Modify nums1 in-place, do not return anything\n    pass";
      if (lang === 'java') return "public class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        // Write your code here\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        // Write your code here\n    }\n};";
    }

    if (slug === 'linked-list-cycle') {
      if (lang === 'python') return "def hasCycle(head):\n    # Write your code here\n    return False";
      if (lang === 'java') return "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your code here\n        return false;\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your code here\n        return false;\n    }\n};";
    }

    if (slug === 'longest-substring-without-repeating-characters') {
      if (lang === 'python') return "def lengthOfLongestSubstring(s):\n    # Write your code here\n    return 0";
      if (lang === 'java') return "public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your code here\n        return 0;\n    }\n};";
    }

    if (slug === 'binary-search') {
      if (lang === 'python') return "def search(nums, target):\n    # Write your code here\n    return -1";
      if (lang === 'java') return "public class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}";
      if (lang === 'cpp') return "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n        return -1;\n    }\n};";
    }

    if (lang === 'python') return "def solution():\n    # Write your code here\n    pass";
    if (lang === 'java') return "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}";
    if (lang === 'cpp') return "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}";
    
    return javascriptFallback || 'function solution() {\n  // Write your code here\n}';
  };

  const selectProblem = (q, lang = language) => {
    setSelectedQuestion(q);
    setCode(getStarterCodeForQuestion(q.slug, lang, q.starterCode?.javascript));
    setSubmissionResult(null);
  };

  const handleRunCode = async () => {
    if (!selectedQuestion) return;
    setSubmitting(true);
    setSubmissionResult(null);
    try {
      const res = await API.post('/practice/coding/submit', {
        questionId: selectedQuestion._id,
        code,
        language
      });
      if (res.data.success) {
        setSubmissionResult(res.data.data);
        // Refresh local profile
        const pRes = await API.get('/student/profile');
        if (pRes.data.success) updateLocalProfile(pRes.data.data);
      }
    } catch (err) {
      console.error('Error executing code:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Coding Practice Hub</h1>
        <p className="text-xs text-slate-500 mt-1">Master campus recruitment DSA patterns with interactive problem solving.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Split View: Problems List & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Browser */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <Loader text="Loading coding problems..." />
          ) : questions.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border text-center text-xs text-slate-500">
              No problems found in this category.
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q._id}
                onClick={() => selectProblem(q)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedQuestion?._id === q._id 
                    ? 'bg-brand-50/50 border-brand-500 shadow-sm ring-1 ring-brand-200' 
                    : 'bg-white hover:bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {q.isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    <h4 className="text-xs font-bold text-slate-900">{q.title}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                    q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{q.category} · {q.timeComplexity}</div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Code Editor & Problem Workspace */}
        {selectedQuestion && (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden space-y-4 p-6">
            {/* Problem Title & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedQuestion.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={selectedQuestion.difficulty === 'Easy' ? 'success' : 'warning'} size="sm">
                    {selectedQuestion.difficulty}
                  </Badge>
                  <span className="text-xs text-slate-500">{selectedQuestion.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSolutionModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" /> Approach & Hints
                </button>
                <select
                  value={language}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setLanguage(newLang);
                    if (selectedQuestion) {
                      setCode(getStarterCodeForQuestion(selectedQuestion.slug, newLang, selectedQuestion.starterCode?.javascript));
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              <p className="font-medium">{selectedQuestion.description}</p>

              {selectedQuestion.examples?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="font-bold text-slate-900 block">Example:</span>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                    <div><span className="text-slate-400">Input:</span> {selectedQuestion.examples[0].input}</div>
                    <div><span className="text-slate-400">Output:</span> {selectedQuestion.examples[0].output}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Code Editor TextArea */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-inner">
              <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 font-mono">
                <span>editor.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'cpp'}</span>
                <span className="text-[10px] text-emerald-400">● Live Code Workspace</span>
              </div>
              <textarea
                rows={12}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                placeholder="// Write your solution here..."
              />
            </div>

            {/* Execution Result Banner */}
            {submissionResult && (
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                submissionResult.status === 'Accepted' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    {submissionResult.status === 'Accepted' ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <X className="w-5 h-5 text-rose-600" />
                    )}
                    <span>Status: {submissionResult.status}</span>
                  </div>
                  <div className="text-xs font-semibold">
                    Test Cases: {submissionResult.passedTestCases} / {submissionResult.totalTestCases} ({submissionResult.runtimeMs}ms)
                  </div>
                </div>
                {submissionResult.message && (
                  <div className={`text-[11px] p-2.5 rounded-xl font-mono leading-relaxed border ${
                    submissionResult.status === 'Accepted'
                      ? 'bg-emerald-100/50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-100/60 border-rose-200 text-rose-800'
                  }`}>
                    {submissionResult.message}
                  </div>
                )}
              </div>
            )}

            {/* Run Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={handleRunCode}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                {submitting ? 'Running Test Cases...' : 'Run & Submit Code'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Solution Modal */}
      <Modal
        isOpen={solutionModal}
        onClose={() => setSolutionModal(false)}
        title={selectedQuestion?.title + " - Solution Approach"}
      >
        {selectedQuestion && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Algorithmic Approach</h4>
              <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">{selectedQuestion.solutionApproach || 'Use standard hash map or pointer approach to optimize time complexity to O(N).'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border">
                <span className="font-bold text-slate-900 block">Time Complexity</span>
                <span className="font-mono text-emerald-700 font-bold">{selectedQuestion.timeComplexity || 'O(N)'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border">
                <span className="font-bold text-slate-900 block">Space Complexity</span>
                <span className="font-mono text-blue-700 font-bold">{selectedQuestion.spaceComplexity || 'O(1)'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
