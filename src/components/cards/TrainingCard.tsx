import React from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, BarChart2, CheckCircle, ArrowRight } from 'lucide-react';
import { TrainingProgram } from '../../models/types';

interface TrainingCardProps {
  program: TrainingProgram;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({ program }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between group hover:border-indigo-300 hover:shadow-xl transition-all duration-200">
      <div className="space-y-4">
        {/* Top Meta Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            {program.category}
          </span>

          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <BarChart2 className="w-3.5 h-3.5" />
            {program.level}
          </span>
        </div>

        {/* Title & Description */}
        <NavLink to={`/training/${program.slug}`} className="block space-y-2">
          <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
            {program.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {program.shortDescription}
          </p>
        </NavLink>

        {/* Key Outcomes */}
        {program.outcomes && program.outcomes.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              What you will learn:
            </span>
            <ul className="space-y-1.5">
              {program.outcomes.slice(0, 2).map((outcome, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Info & Prominent CTA Button */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>{program.duration}</span>
        </div>

        <NavLink
          to={`/training/${program.slug}`}
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
        >
          <span>Explore Program</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>
    </div>
  );
};
