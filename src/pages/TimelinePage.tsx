import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { BackButton } from '../components/ui/BackButton';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { ShareButton } from '../components/ui/ShareButton';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { getEvents, getStories, getAchievements } from '../repositories/repository';
import { Event, Story, Achievement } from '../models/types';
import {
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock,
  Filter
} from 'lucide-react';

interface TimelineItem {
  id: string;
  year: number;
  month: string; // e.g. "AUG", "SEP", "OCT"
  monthFull: string;
  dateStr: string;
  title: string;
  category: string;
  type: 'event' | 'story' | 'achievement' | 'milestone';
  description: string;
  outcomes?: string[];
  link?: string;
  venue?: string;
  image?: string;
  isLatest?: boolean;
}

export const TimelinePage: React.FC = () => {
  useSEO(
    'Brandex Timeline — Continuous Living History',
    'A continuously growing visual memory of Brandex milestones, school workshops, tech summits, and student breakthroughs.'
  );

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  // Static + dynamic milestones
  const timelineData: TimelineItem[] = [
    {
      id: 'time-1',
      year: 2026,
      month: 'OCT',
      monthFull: 'October 2026',
      dateStr: '14 October 2026',
      title: 'Brandex Autumn Technology Summit 2026',
      category: 'Summits',
      type: 'event',
      description: 'Flagship gathering bringing together engineers, researchers, students, and founders for architecture teardowns and keynote panels.',
      outcomes: [
        'Over 500+ attendees registered across student and professional tracks',
        'Keynote addresses by Dr. Aris Thorne & Elena Rostova',
        'Live student agentic project showcase session'
      ],
      venue: 'Main Campus Auditorium & Virtual Stream',
      link: '/events/brandex-autumn-technology-summit-2026',
      isLatest: true
    },
    {
      id: 'time-2',
      year: 2026,
      month: 'SEP',
      monthFull: 'September 2026',
      dateStr: '15 September 2026',
      title: 'Autonomous Multi-Agent AI Workshop & Sprint',
      category: 'AI & Workshops',
      type: 'event',
      description: 'Hands-on sprint where secondary school and university cohorts build real-time agent state machines using open toolsets.',
      outcomes: [
        'Hands-on build of 15+ student autonomous bots',
        'Introduction to LangGraph and tool calling patterns'
      ],
      venue: 'Virtual Developer Lab',
      link: '/training/practical-machine-learning'
    },
    {
      id: 'time-3',
      year: 2026,
      month: 'AUG',
      monthFull: 'August 2026',
      dateStr: '18 August 2026',
      title: 'Geniusphere School Series 2026',
      category: 'Education & Schools',
      type: 'event',
      description: 'Foundational coding workshop introducing high school students to programmatic logic and open-source web application design.',
      outcomes: [
        '120+ secondary students introduced to web development & AI',
        'Open-sourced full syllabus deployed at geniusphere.tech'
      ],
      venue: 'Vignan Public High School Auditorium',
      link: '/education'
    },
    {
      id: 'time-4',
      year: 2026,
      month: 'JUL',
      monthFull: 'July 2026',
      dateStr: '10 July 2026',
      title: 'Brandex Campus Ambassador Guild Launch',
      category: 'Community',
      type: 'milestone',
      description: 'Inauguration of the 28 campus hubs across regional schools and colleges, empowering student leaders to host local coding circles.',
      outcomes: [
        '28 active campus chapters established',
        'Direct sponsorship & workshop kits distributed'
      ],
      venue: 'Bangalore Hub',
      link: '/ambassador'
    },
    {
      id: 'time-5',
      year: 2026,
      month: 'APR',
      monthFull: 'April 2026',
      dateStr: '12 April 2026',
      title: 'Cyber Defence Capture-The-Flag Wargame',
      category: 'Cybersecurity',
      type: 'event',
      description: 'Simulated perimeter defence competition where student teams protected vulnerable microservices against active exploit vectors.',
      outcomes: [
        '18 teams competed in real-time red/blue wargames',
        'Telemetry debriefing and digital credentials awarded'
      ],
      venue: 'Brandex Security Cyber Range (Online)',
      link: '/events'
    },
    {
      id: 'time-6',
      year: 2025,
      month: 'NOV',
      monthFull: 'November 2025',
      dateStr: '20 November 2025',
      title: 'Brandex Ecosystem Foundation & Open Source Charter',
      category: 'Community',
      type: 'milestone',
      description: 'Brandex launched as a public technology education platform to make engineering, security, and AI learning open to all people without paywalls.',
      outcomes: [
        'Initial 3 domain circles formed (AI, Cyber, UX)',
        'First open-source syllabus prototype authored'
      ],
      venue: 'Bangalore Headquarters',
      link: '/about'
    }
  ];

  const categories = ['All', 'Summits', 'Education & Schools', 'AI & Workshops', 'Cybersecurity', 'Community'];

  const filteredItems = filterCategory === 'All'
    ? timelineData
    : timelineData.filter(item => item.category === filterCategory);

  // Group by Year
  const groupedByYear = filteredItems.reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = [];
    acc[item.year].push(item);
    return acc;
  }, {} as Record<number, TimelineItem[]>);

  const years = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-10 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <BackButton />
        <ShareButton title="Brandex Living History & Timeline" />
      </div>

      <Breadcrumb items={[{ label: 'Brandex Timeline' }]} />

      {/* Hero */}
      <PageHero
        tag="LIVING ECOSYSTEM ARCHIVE"
        title="Brandex Visual History & Timeline"
        description="A continuous, milestone-driven chronicle of our community workshops, student achievements, institutional wargames, and summit breakthroughs."
        widgetTitle="History.Archive"
        widgetStatLabel="Total Milestones"
        widgetStatValue={`${timelineData.length} Entries`}
        widgetStatusLabel="Continuity"
        widgetStatusText="Active & Growing"
      />

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TIMELINE TREE */}
      <div className="space-y-16 mt-8">
        {years.map((year) => (
          <div key={year} className="space-y-8">
            {/* Year Badge Header */}
            <div className="flex items-center gap-4">
              <span className="font-display font-black text-3xl sm:text-4xl text-slate-900 bg-slate-100 px-5 py-2 rounded-2xl border border-slate-200 shadow-sm">
                {year}
              </span>
              <div className="flex-1 h-[2px] bg-gradient-to-r from-slate-200 to-transparent" />
            </div>

            {/* Year Items */}
            <div className="relative border-l-2 border-indigo-200 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
              {groupedByYear[year].map((item) => (
                <div key={item.id} className="relative group">
                  {/* Tree Connecting Node Dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-transform group-hover:scale-125 ${
                      item.isLatest
                        ? 'bg-indigo-600 ring-4 ring-indigo-100'
                        : 'bg-slate-400 group-hover:bg-indigo-600'
                    }`}
                  >
                    {item.isLatest && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    )}
                  </div>

                  {/* Item Content Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 hover:bg-white hover:border-indigo-300 hover:shadow-lg transition-all space-y-4">
                    {/* Top Row: Month Badge & Category */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-lg uppercase tracking-wider">
                          {item.month}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.dateStr}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                        {item.description}
                      </p>
                    </div>

                    {/* Outcomes / Highlights */}
                    {item.outcomes && item.outcomes.length > 0 && (
                      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                        <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Outcomes & Key Breakthroughs</span>
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {item.outcomes.map((out, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-indigo-600 font-bold">•</span>
                              <span>{out}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/70 text-xs">
                      {item.venue && (
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{item.venue}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 ml-auto">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors"
                        >
                          Quick Details
                        </button>
                        {item.link && (
                          <NavLink
                            to={item.link}
                            className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:underline"
                          >
                            <span>Explore Page</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </NavLink>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Details Modal */}
      {selectedItem && (
        <QuickViewModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          category={selectedItem.category}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-indigo-900">
              <div><strong>Timeline Date:</strong> {selectedItem.dateStr}</div>
              {selectedItem.venue && <div><strong>Location:</strong> {selectedItem.venue}</div>}
            </div>

            <p className="leading-relaxed">{selectedItem.description}</p>

            {selectedItem.outcomes && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <strong className="text-slate-900">Documented Outcomes:</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {selectedItem.outcomes.map((out, idx) => (
                    <li key={idx}>{out}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedItem.link && (
              <NavLink
                to={selectedItem.link}
                className="btn-primary w-full py-2.5 text-center block text-xs mt-4"
              >
                Go to Dedicated Page
              </NavLink>
            )}
          </div>
        </QuickViewModal>
      )}
    </div>
  );
};
