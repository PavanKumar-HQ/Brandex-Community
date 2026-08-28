import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Filter, SlidersHorizontal, BookOpen, Clock, BarChart, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PageHero } from '../components/ui/PageHero';
import { TrainingCard } from '../components/cards/TrainingCard';
import { BackButton } from '../components/ui/BackButton';
import { EmptyState } from '../components/ui/EmptyState';
import { getTrainingPrograms } from '../repositories/repository';
import { TrainingProgram } from '../models/types';

export const TrainingPage: React.FC = () => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  useEffect(() => {
    async function loadPrograms() {
      const data = await getTrainingPrograms(selectedCategory, selectedLevel);
      setPrograms(data);
    }
    loadPrograms();
  }, [selectedCategory, selectedLevel]);

  const categories = [
    'All',
    'Artificial Intelligence',
    'Cybersecurity',
    'Digital Skills & Software',
    'Design & UX',
    'Business & Strategy',
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-24 sm:pt-28 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <BackButton />
      
      {/* Training Hero */}
      <PageHero 
        tag="Technical Training Catalog"
        title="Brandex Cohort Training Catalog"
        description="Rigorous, cohort-based courses engineered to take you from foundational concepts to production-grade engineering mastery across AI, Cybersecurity, Systems, and Swiss UX."
      />

      {/* Filter Bar & Controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Filter Training Programs</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-semibold">
              Level:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <section className="space-y-6">
        <SectionHeading
          tag="COURSES"
          title={`Available Programs (${programs.length})`}
          subtitle="Select a course to view detailed syllabus, outcomes, and enrollment schedule."
        />

        {programs.length === 0 ? (
          <EmptyState
            title="No training programs match your filters."
            description="Try resetting your category or level filters to view available Brandex courses."
            actionText="Reset Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <TrainingCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
