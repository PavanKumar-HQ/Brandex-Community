import { useSEO } from '../hooks/useSEO';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, BookOpen, Award, Layers, ArrowRight, Clock, CheckCircle2, School, Building2, Download } from 'lucide-react';
import { useRegistration } from '../contexts/RegistrationContext';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { getWorkshops, getResources } from '../repositories/repository';
import { Workshop, Resource } from '../models/types';

export const EducationPage: React.FC = () => {
  useSEO("Education Pathways", "Discover structured educational paths - Geniusphere secondary school workshops, college bootcamps, and professional cohorts.");
  const { openModal } = useRegistration();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    async function loadEduData() {
      const wData = await getWorkshops();
      setWorkshops(wData);

      const rData = await getResources();
      setResources(rData);
    }
    loadEduData();
  }, []);

  const pathways = [
    {
      number: '01',
      tag: 'School & Youth Tracks',
      title: 'School & Youth Programs',
      icon: School,
      desc: 'Introductory programming logic, robotics foundation, and algorithmic thinking for secondary school students (e.g. Geniusphere Series).',
      outcomes: ['Algorithmic Logic Foundations', 'Web & App Prototyping', 'Team Mentorship'],
      ctaText: 'Inquire for School Cohort',
      accentBg: 'bg-indigo-50/70 border-indigo-100',
      badgeBg: 'bg-indigo-600 text-white',
    },
    {
      number: '02',
      tag: 'College Initiatives',
      title: 'College & University Initiatives',
      icon: GraduationCap,
      desc: 'Advanced research partnerships, open-source thesis mentorship, and high-performance computing lab collaborations.',
      outcomes: ['Research Paper Mentorship', 'Open Source Contributions', 'Lab Architecture'],
      ctaText: 'Explore University Track',
      accentBg: 'bg-blue-50/70 border-blue-100',
      badgeBg: 'bg-blue-600 text-white',
    },
    {
      number: '03',
      tag: 'Professional Skills',
      title: 'Professional Skills Academy',
      icon: Award,
      desc: 'Upskilling cohorts for software engineers, cybersecurity professionals, and design leads looking to master production engineering.',
      outcomes: ['Production Architecture', 'Zero-Trust Hardening', 'System Concurrency'],
      ctaText: 'View Professional Courses',
      accentBg: 'bg-purple-50/70 border-purple-100',
      badgeBg: 'bg-purple-600 text-white',
    },
    {
      number: '04',
      tag: 'Hands-on Workshops',
      title: 'Hands-on Workshops & Buildathons',
      icon: BookOpen,
      desc: 'Intensive single-day and multi-hour practical build sessions with expert feedback and live coding teardowns.',
      outcomes: ['Live System Teardowns', 'Code Review Feedback', 'Runnable Portfolio Artifacts'],
      ctaText: 'Register for Workshops',
      accentBg: 'bg-emerald-50/70 border-emerald-100',
      badgeBg: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="space-y-6 pb-12 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <Breadcrumb items={[{ label: 'Education Pathways' }]} />

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-b border-slate-200 pb-16">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider border border-indigo-100">
            Brandex Education Pathways
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.1]">
            Structured Education for Tomorrow's Builders
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            From secondary school technology foundation workshops to university research mentorship and professional engineering cohorts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <NavLink
              to="/training"
              className="inline-flex items-center gap-2.5 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              <span>View Available Training</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>

            <button
              onClick={() => openModal('enroll')}
              className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 border border-slate-200 px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              <span>Inquire for Institution Cohort</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Right Side */}
        <div className="lg:col-span-5 bg-slate-900 text-white border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 mix-blend-screen pointer-events-none"></div>
          <div className="space-y-3 relative z-10">
            <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
              Educational Impact
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              Geniusphere School Initiative
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bringing interactive technology foundation labs to over 180+ secondary school students at Vignan Public High School.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-indigo-300">NEXT SESSION: 18 AUGUST 2026</span>
            <NavLink
              to="/events/geniusphere-school-series-2026"
              className="inline-flex items-center gap-1.5 bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm border border-slate-200"
            >
              <span>View Event Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      </div>

      {/* Organic Feature Row Layout */}
      <section className="space-y-12">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">LEARNING TRACKS</span>
          <h2 className="text-3xl font-display font-bold text-slate-900">Four Distinct Educational Pathways</h2>
          <p className="text-sm text-slate-600">Tailored curriculum and hands-on build tracks designed for distinct stages of growth.</p>
        </div>

        <div className="space-y-8">
          {pathways.map((pw, idx) => (
            <div
              key={pw.number}
              className={`p-8 rounded-2xl border ${pw.accentBg} transition-all duration-300 hover:shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}
            >
              {/* Left Column: Number & Icon */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400">TRACK #{pw.number}</span>
                  <span className="text-xs font-semibold px-3 py-1 bg-white text-slate-700 rounded-full border border-slate-200">
                    {pw.tag}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${pw.badgeBg} flex items-center justify-center shadow-md`}>
                    <pw.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900">
                    {pw.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {pw.desc}
                </p>
              </div>

              {/* Middle Column: Outcomes List */}
              <div className="lg:col-span-5 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Core Track Outcomes:
                </span>
                <ul className="space-y-2">
                  {pw.outcomes.map((oc, i) => (
                    <li key={i} className="text-xs text-slate-800 flex items-center gap-2.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{oc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Prominent CTA Button */}
              <div className="lg:col-span-3 flex justify-start lg:justify-end">
                <button
                  onClick={() => openModal('enroll')}
                  className="btn-primary"
                >
                  <span>{pw.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Workshops Section */}
      <section className="space-y-8 pt-6 border-t border-slate-200">
        <SectionHeading
          tag="WORKSHOPS"
          title="Upcoming Hands-on Workshops"
          subtitle="Single-day intensive practical build sessions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workshops.map((ws) => (
            <div key={ws.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="text-indigo-700 font-semibold bg-indigo-100/70 px-2.5 py-1 rounded-md">
                    {ws.category}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {ws.duration}
                  </span>
                </div>

                <h4 className="font-display font-bold text-lg text-slate-900 leading-snug">
                  {ws.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ws.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Instructor: <strong className="text-slate-900">{ws.instructor}</strong></span>
                <button
                  onClick={() => openModal('enroll')}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <span>Register Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blueprints & Research Papers */}
      <div className="bg-slate-50/50 py-10 -mx-4 sm:-mx-8 lg:-mx-12 xl:-mx-24 px-4 sm:px-8 lg:px-12 xl:px-24">
        <section className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">OPEN ARCHITECTURE</span>
            <h2 className="text-3xl font-display font-bold text-slate-900">Downloadable Blueprints & Research Papers</h2>
            <p className="text-sm text-slate-600">Open-source reference architecture guides, vector DB benchmarks, and zero-trust audit checklists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <div key={res.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover-lift">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                      {res.type}
                    </span>
                    <span className="text-slate-500 font-medium">{res.fileSize}</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-slate-900">{res.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => openModal('enroll')}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Free Blueprint</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
};
