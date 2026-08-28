import React, { useState, useEffect } from 'react';
import { HelpCircle, Code2, Layers, Plus } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

export default function QuestionBankPage() {
  const [aptitude, setAptitude] = useState([]);
  const [coding, setCoding] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [aptRes, codRes] = await Promise.all([
          API.get('/practice/aptitude/questions?limit=50'),
          API.get('/practice/coding/questions')
        ]);
        if (aptRes.data.success) setAptitude(aptRes.data.data);
        if (codRes.data.success) setCoding(codRes.data.data);
      } catch (err) {
        console.error('Error loading question bank:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader text="Loading question bank repository..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus Assessment Question Bank</h1>
        <p className="text-xs text-slate-500 mt-1">Repository of verified Quantitative, Logical, and DSA coding challenges.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Aptitude Repository ({aptitude.length} Questions)</h3>
        <div className="space-y-3">
          {aptitude.map((q) => (
            <div key={q._id} className="bg-white p-4 rounded-2xl border shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">{q.category} · {q.subcategory}</Badge>
                <span className="text-[10px] text-slate-400 capitalize">{q.difficulty}</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{q.question}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
