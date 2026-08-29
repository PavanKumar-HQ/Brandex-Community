import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { BackButton } from '../components/ui/BackButton';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ShareButton } from '../components/ui/ShareButton';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { useRegistration } from '../contexts/RegistrationContext';
import {
  getEvents,
  getStories,
  getAchievements,
  getTrainingPrograms,
  getCommunities
} from '../repositories/repository';
import { Event, Story, Achievement, TrainingProgram, Community } from '../models/types';
import {
  Activity,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Award,
  Layers,
  Flame,
  CheckCircle2,
  Eye
} from 'lucide-react';

export const NowPage: React.FC = () => {
  useSEO(
    'Live "Now" at Brandex — Real-Time Ecosystem Pulse',
    'Real-time pulse of Brandex: active cohorts, live summits, workshops, student breakthroughs, and open opportunities.'
  );

  const { openModal } = useRegistration();
  const [events, setEvents] = useState<Event[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<{ title: string; category?: string; content: React.ReactNode } | null>(null);

  useEffect(() => {
    async function loadNowData() {
      const [evts, st, ach, tr, comm] = await Promise.all([
        getEvents('upcoming'),
        getStories(),
        getAchievements(),
        getTrainingPrograms(),
        getCommunities()
      ]);
      setEvents(evts);
      setStories(st);
      setAchievements(ach);
      setTrainings(tr);
      setCommunities(comm);
    }
    loadNowData();
  }, []);

  return (
    <div className="space-y-10 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <BackButton />
        <ShareButton title="Live at Brandex — Real-Time Ecosystem Pulse" />
      </div>

      <Breadcrumb items={[{ label: 'Live Now' }]} />

      {/* Hero Header */}
      <PageHero
        tag="LIVE ECOSYSTEM PULSE"
        title="What's Happening at Brandex Right Now"
        description="A real-time snapshot of active workshops, upcoming summits, ongoing community circle sprints, and newly published educational milestones."
        widgetTitle="Live.Telemetry"
        widgetStatLabel="Current Active Cohorts"
        widgetStatValue="04 Tracks"
        widgetStatusLabel="System Status"
        widgetStatusText="All Circles Operational"
      />

      {/* 01. THIS WEEK AT BRANDEX STRIP */}
      <section className="bg-gradient-to-r from-indigo-50 via-purple-50/50 to-slate-50 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className="font-display font-bold text-lg text-slate-900">
              This Week at Brandex
            </h2>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-white/80 px-3 py-1 rounded-full border border-indigo-200/60 shadow-sm self-start sm:self-auto">
            Week of August 29 – September 05, 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.slice(0, 2).map((evt) => (
            <div
              key={evt.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  <span>{evt.category}</span>
                  <span className="text-slate-500 font-normal">{evt.type}</span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 leading-snug line-clamp-2">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {evt.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{evt.date}</span>
                </div>
                <button
                  onClick={() =>
                    setQuickViewItem({
                      title: evt.title,
                      category: evt.category,
                      content: (
                        <div className="space-y-4 text-xs text-slate-600">
                          <p>{evt.description}</p>
                          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                            <div><strong>Venue:</strong> {evt.venue}</div>
                            <div><strong>Time:</strong> {evt.time}</div>
                            <div><strong>Location:</strong> {evt.location}</div>
                          </div>
                          <NavLink
                            to={`/events/${evt.slug}`}
                            className="btn-primary w-full py-2.5 text-center block text-xs"
                          >
                            Go to Full Event Page
                          </NavLink>
                        </div>
                      )
                    })
                  }
                  className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Quick View</span>
                </button>
              </div>
            </div>
          ))}

          {/* Active Training Highlight */}
          {trainings.slice(0, 1).map((tr) => (
            <div
              key={tr.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                  <span>ACTIVE COHORT</span>
                  <span className="text-slate-500 font-normal">{tr.level}</span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 leading-snug line-clamp-2">
                  {tr.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {tr.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>{tr.duration}</span>
                </div>
                <NavLink
                  to={`/training/${tr.slug}`}
                  className="text-purple-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Curriculum</span>
                  <ArrowRight className="w-3 h-3" />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02. FEATURED SHOWCASE ROTATION */}
      <section className="space-y-6">
        <SectionHeading
          tag="FEATURED HIGHLIGHTS"
          title="Featured Community Initiatives"
          subtitle="Top programs, active domain circles, and ongoing school workshop series."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Geniusphere Hero Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Open Source Highlight
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                Geniusphere School Series
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                Brandex's custom school technology syllabus and hands-on coding workshop series. Open-sourced and running across secondary institutions.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3 relative z-10">
              <a
                href="https://geniusphere.tech"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-md"
              >
                <span>Visit geniusphere.tech</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <NavLink
                to="/education"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
              >
                School Curriculum
              </NavLink>
            </div>
          </div>

          {/* Active Circles Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-purple-600" />
                Active Domain Circles
              </span>
              <h3 className="font-display font-bold text-2xl text-slate-900">
                Join an Open Learning Circle
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect with domain groups in AI Models, Cybersecurity defense, and UX Design. Circles hold weekly virtual labs and peer discussions.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white border border-slate-200 p-2.5 rounded-xl">
                  <div className="font-bold text-slate-900">AI Circle</div>
                  <div className="text-[10px] text-slate-500">Weekly Sprints</div>
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-xl">
                  <div className="font-bold text-slate-900">Cyber Guild</div>
                  <div className="text-[10px] text-slate-500">CTF Wargames</div>
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-xl">
                  <div className="font-bold text-slate-900">UX Design</div>
                  <div className="text-[10px] text-slate-500">UI teardowns</div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => openModal('community')}
                  className="btn-primary flex-1 py-2.5 text-xs font-semibold rounded-xl text-center justify-center"
                >
                  Join a Circle Now
                </button>
                <NavLink
                  to="/community"
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Explore All
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. RECENTLY ADDED CONTENT */}
      <section className="space-y-6">
        <SectionHeading
          tag="FRESH UPDATES"
          title="Recently Added to Brandex"
          subtitle="The latest student stories, workshop achievements, and educational materials."
          actionText="View All Stories"
          actionPath="/stories"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stories.slice(0, 2).map((story) => (
            <div
              key={story.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                  Story
                </span>
                <h4 className="font-display font-bold text-sm text-slate-900 line-clamp-2">
                  {story.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {story.excerpt}
                </p>
              </div>
              <NavLink
                to={`/stories/${story.slug}`}
                className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1 pt-2 border-t border-slate-100"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3 h-3" />
              </NavLink>
            </div>
          ))}

          {achievements.slice(0, 2).map((ach) => (
            <div
              key={ach.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  Achievement
                </span>
                <h4 className="font-display font-bold text-sm text-slate-900 line-clamp-2">
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {ach.description}
                </p>
              </div>
              <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>{ach.recipientName}</span>
                <Award className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewItem && (
        <QuickViewModal
          isOpen={!!quickViewItem}
          onClose={() => setQuickViewItem(null)}
          title={quickViewItem.title}
          category={quickViewItem.category}
        >
          {quickViewItem.content}
        </QuickViewModal>
      )}
    </div>
  );
};
