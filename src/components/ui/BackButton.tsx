import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="-mb-6 sm:-mb-10 relative z-20">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm hover:bg-slate-50 transition-all active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Go Back</span>
      </button>
    </div>
  );
};
