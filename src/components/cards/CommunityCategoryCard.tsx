import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Users, MessageSquare } from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';
import { CommunityCategory } from '../../models/types';

interface CommunityCategoryCardProps {
  category: CommunityCategory;
}

export const CommunityCategoryCard: React.FC<CommunityCategoryCardProps> = ({ category }) => {
  const { openModal } = useRegistration();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between group hover:border-indigo-300 hover:shadow-xl transition-all duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {category.name}
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
            {category.name} Community
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            {(category.memberCount || 0).toLocaleString()} Members
          </span>
        </div>

        <button
          onClick={() => openModal('community')}
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
        >
          <span>Join Circle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
