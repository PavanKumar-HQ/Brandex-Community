import { useSEO } from '../hooks/useSEO';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Filter, SlidersHorizontal, BookOpen, Clock, BarChart, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PageHero } from '../components/ui/PageHero';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { TrainingCard } from '../components/cards/TrainingCard';
import { EmptyState } from '../components/ui/EmptyState';
import { getTrainingPrograms } from '../repositories/repository';
import { TrainingProgram } from '../models/types';

export const TrainingPage: React.FC = () => {
  useSEO("Rigorous Cohort Training", "Level up your technical skills with intensive, practical cohort-based training.");
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
    <div className="space-y-6 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <Breadcrumb items={[{ label: 'Technical Training' }]} />

      {/* Training Hero */}
      <PageHero 
        tag="Technical Training Catalog"
        title="Brandex Cohort Training Catalog"
        description="Rigorous, cohort-based courses engineered to take you from foundational concepts to production-grade engineering mastery across AI, Cybersecurity, Systems, and Swiss UX."
        widgetTitle="Training.Cohorts"
        widgetStatLabel="Active Students"
        widgetStatValue="450+"
        widgetStatusLabel="Enrollment Status"
        widgetStatusText="Accepting Applications"
      />

      {/* Filter Bar & Controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Filter Training Programs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="training-category" className="text-xs text-slate-500 font-medium">Category</label>
            <select
              id="training-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Level Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="training-level" className="text-xs text-slate-500 font-medium">Proficiency Level</label>
            <select
              id="training-level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === 'All' ? 'All Levels' : lvl}
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
