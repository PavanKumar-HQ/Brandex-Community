import React, { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BarChart, CheckCircle2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useRegistration } from '../contexts/RegistrationContext';
import { getTrainingProgramBySlug, getTrainingPrograms } from '../repositories/repository';
import { TrainingProgram } from '../models/types';
import { EmptyState } from '../components/ui/EmptyState';
import { TrainingCard } from '../components/cards/TrainingCard';
import { BackButton } from '../components/ui/BackButton';

export const TrainingDetailPage: React.FC = () => {
  const { openModal } = useRegistration();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [related, setRelated] = useState<TrainingProgram[]>([]);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      const data = await getTrainingProgramBySlug(slug);
      setProgram(data);

      if (data) {
        if (data.modules && data.modules.length > 0) {
          setOpenModuleId(data.modules[0].id);
        }
        const all = await getTrainingPrograms();
        setRelated(all.filter(p => p.id !== data.id).slice(0, 2));
      }
    }
    loadData();
  }, [slug]);

  if (!program) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center bg-white">
        <EmptyState
          title="TRAINING PROGRAM NOT FOUND"
          description="The program slug you requested does not exist or has been archived."
          actionText="Back to Training Catalog"
          onAction={() => navigate('/training')}
        />
      </div>
    );
  }

  const toggleModule = (id: string) => {
    setOpenModuleId(openModuleId === id ? null : id);
  };

  const instructorName = typeof program.instructor === 'object' ? program.instructor.name : program.instructor;
  const instructorRole = typeof program.instructor === 'object' ? program.instructor.role : 'Lead Instructor';
  const instructorBio = typeof program.instructor === 'object' ? program.instructor.bio : 'Instructor and domain specialist at Brandex.';
  const instructorAvatar = (typeof program.instructor === 'object' && program.instructor.avatar) ? program.instructor.avatar : '/brandex-logo.webp';

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 pt-20 bg-white">
      
      {/* Top Back Link */}
      <BackButton />

      {/* Hero Header */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24">
        <div className="border border-slate-200 bg-white p-8 sm:p-12 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 font-semibold rounded">
                [{program.category}]
              </span>
              <span className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 font-semibold rounded flex items-center gap-1.5">
                <BarChart className="w-3.5 h-3.5 text-slate-500" />
                {program.level}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {program.duration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 max-w-5xl leading-tight">
              {program.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
              {program.description}
            </p>
          </div>

          <div className="shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <button
              onClick={() => openModal('enroll')}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-indigo-600 text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
              <span>Enroll in Cohort</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Detail Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Outcomes & Syllabus */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Outcomes */}
          {program.outcomes && program.outcomes.length > 0 && (
            <div className="border border-slate-200 bg-white p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
              <h2 className="font-display font-bold text-xl text-slate-900 border-b border-slate-200 pb-3">
                Key Learning Outcomes
              </h2>

              <ul className="space-y-3">
                {program.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Syllabus Accordion */}
          {program.modules && program.modules.length > 0 && (
            <div className="border border-slate-200 bg-white p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <h2 className="font-display font-bold text-xl text-slate-900">
                  Course Syllabus & Modules
                </h2>
                <span className="text-xs text-slate-500 font-semibold">
                  {program.modules.length} Modules
                </span>
              </div>

              <div className="space-y-3">
                {program.modules.map((mod) => {
                  const isOpen = openModuleId === mod.id;
                  return (
                    <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 text-left flex items-center justify-between font-display font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        <span className="pr-4">{mod.title}</span>
                        {isOpen ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-0 border-t border-slate-200 space-y-2 bg-white">
                          <p className="text-xs text-slate-600 leading-relaxed pt-2">
                            {mod.description}
                          </p>

                          <div className="pt-2">
                            <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-1">
                              Topics Covered:
                            </span>
                            <div className="flex flex-wrap gap-1 text-[11px] text-slate-700">
                              {mod.topics.map((topic, i) => (
                                <span key={i} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                  • {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Instructor & Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Instructor Card */}
          <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-4 shadow-sm">
            <span className="text-[10px] uppercase text-indigo-600 font-semibold tracking-wider block">
              LEAD INSTRUCTOR
            </span>

            <div className="flex items-center gap-4">
              <img
                src={instructorAvatar}
                alt={instructorName}
                className="w-12 h-12 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  {instructorName}
                </h3>
                <span className="text-xs text-slate-500 font-semibold block">
                  {instructorRole}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {instructorBio}
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};
