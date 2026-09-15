import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Users,
  Code2,
  Briefcase,
  BookOpen,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';
import { isUserRegistered } from '../../utils/identity';
import { AppAuthModal } from '../ui/AppAuthModal';

export const BrandexUnifiedHub: React.FC = () => {
  const { openModal } = useRegistration();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleJoinCircle = () => {
    if (!isUserRegistered()) {
      setAuthModalOpen(true);
    } else {
      openModal('community');
    }
  };

  const verticals = [
    {
      id: 'services',
      tag: '12 Core Services',
      title: 'Services & Fast Quote',
      description: 'Websites, Web Apps, Mobile, SaaS, Automation, AI Integration, Internal Tools, CRM, Consulting, Workshops, Training & Community.',
      features: [
        'Web, Mobile, SaaS & Internal Tools',
        'AI Integration, Workflow Automation & CRM',
        'Zero account required • Fast 30-sec quote'
      ],
      link: '/services',
      actionText: 'Explore & Book Services',
      isPrimary: true,
      badge: '12 Core Services'
    },
    {
      id: 'community',
      tag: 'Autonomous Guilds',
      title: 'Join Community Circles',
      description: 'Collaborate with researchers and builders across AI Engineering, Offensive & Defensive Security, Distributed Systems, and Swiss Editorial UX.',
      features: [
        'Weekly CTF challenges & defense labs',
        'Model fine-tuning & vector search sprints',
        'Strict zero-PII pseudo-anonymous handles'
      ],
      link: '/community',
      actionText: 'Join a Domain Circle',
      onClick: handleJoinCircle,
      badge: 'Account Required'
    },
    {
      id: 'projects',
      tag: 'Public Repositories',
      title: 'Open-Source & PR Badges',
      description: 'Explore production-grade open source tools like Geniusphere and Swiss UI. Claim Good First Issues and verify merged PRs without GitHub OAuth.',
      features: [
        'Good First Issues for new contributors',
        'Public GitHub PR verification without auth',
        'Verified contributor credentials & points'
      ],
      link: '/projects',
      actionText: 'Explore Open-Source Repos',
      badge: 'Public Registry'
    },
    {
      id: 'careers',
      tag: 'Fellowships & Roles',
      title: 'Careers & Chapter Leadership',
      description: 'Apply for paid Core Systems Research Fellowships, Campus Ambassador Chapter Leads, or Open-Source Working Circle organizers.',
      features: [
        'Paid research fellowships in AI & systems',
        'Collegiate chapter coordinator opportunities',
        'Deterministic BX- status receipt tracking'
      ],
      link: '/careers',
      actionText: 'View Open Positions',
      badge: 'Intake Open'
    },
    {
      id: 'learning',
      tag: 'Offline-First Academy',
      title: 'Interactive Learning & Cohorts',
      description: 'Access modular CS syllabus, Dockerized lab assignments, and offline-cached study notes in IndexedDB for uninterrupted learning.',
      features: [
        'Hands-on system architecture diagrams',
        'Auto-graded lab sheets and coding exercises',
        'Offline reader caching directly in browser'
      ],
      link: '/training',
      actionText: 'Access Cohort Syllabus',
      badge: 'Offline Cached'
    },
    {
      id: 'tracker',
      tag: 'Deterministic Receipts',
      title: 'Application & Booking Tracker',
      description: 'Track your BX-2026 cohort admission, ambassador review, or SRV-2026 service booking receipt anonymously in real time.',
      features: [
        'Real-time SQLite database queries',
        'Private Discord & WhatsApp circle links upon approval',
        'Zero personal data or email requirement'
      ],
      link: '/status',
      actionText: 'Check Reference Status',
      badge: 'Live Status'
    }
  ];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Everything in One Installable PWA
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Book specialized engineering sprints, join domain circles, contribute to open source repositories, and follow interactive curriculum with zero invasive tracking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <NavLink
              to="/services"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book an Engineering Sprint</span>
            </NavLink>
          </div>
        </div>

        {/* 6-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verticals.map((v) => (
            <div
              key={v.id}
              className={`rounded-2xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between relative ${
                v.isPrimary
                  ? 'bg-gradient-to-b from-indigo-50/40 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-200 dark:border-indigo-800/80 shadow-md ring-1 ring-indigo-500/10'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div>
                {/* Top Badge & Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {v.tag}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                    {v.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                  {v.description}
                </p>

                {/* Features Checklist */}
                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  {v.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {v.onClick ? (
                  <button
                    onClick={v.onClick}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{v.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <NavLink
                    to={v.link}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      v.isPrimary
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{v.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NavLink>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Required Modal for Domain Circles */}
      <AppAuthModal
        isOpen={authModalOpen}
        intent="circle"
        onProceedToCircle={() => openModal('community')}
        onClose={() => setAuthModalOpen(false)}
      />
    </section>
  );
};
