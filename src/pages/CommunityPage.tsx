import { useSEO } from '../hooks/useSEO';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  MessageSquare,
  Users,
  Shield,
  Send,
  Calendar,
  ExternalLink,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { CommunityCategoryCard } from '../components/cards/CommunityCategoryCard';
import { ShareButton } from '../components/ui/ShareButton';
import { useRegistration } from '../contexts/RegistrationContext';
import { getCommunities, getDiscussions, getOpportunities } from '../repositories/repository';
import { Community, Discussion, Opportunity } from '../models/types';

export const CommunityPage: React.FC = () => {
  useSEO("Technology Domain Circles", "Join specialized technology domain circles in AI, Cybersecurity, and UX to collaborate on coding projects.");
  const { openModal } = useRegistration();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function loadCommunityData() {
      const [comms, disc, opps] = await Promise.all([
        getCommunities(selectedCategory),
        getDiscussions(),
        getOpportunities()
      ]);
      setCommunities(comms);
      setDiscussions(disc);
      setOpportunities(opps);
    }
    loadCommunityData();
  }, [selectedCategory]);

  return (
    <div className="space-y-12 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: 'Community Circles' }]} className="mb-0" />
        <ShareButton title="Brandex Community — Domain Circles & Guilds" />
      </div>
      
      {/* Hero Header */}
      <PageHero 
        tag="Brandex Circles & Guilds"
        title="Specialized Technology Circles"
        description="Connect with developers, researchers, and creators across dedicated circles in Autonomous AI, Zero-Trust Cybersecurity, and High-Concurrency Systems."
        widgetTitle="Community.Guilds"
        widgetStatLabel="Total Discussions"
        widgetStatValue="3,492"
        widgetStatusLabel="Guild Activity"
        widgetStatusText="High engagement"
        gradientFrom="text-violet-600"
        gradientTo="bg-violet-50"
      />

      {/* 01. WHATSAPP + DISCORD JOIN GATEWAY */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  Official Channel
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  1,400+ Members
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900">
                Brandex WhatsApp Community
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive instant summit alerts, weekly circle reminders, workshop links, and direct community announcements on WhatsApp.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="https://whatsapp.com/channel/0029Vaexample"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-2 text-center"
              >
                <span>Join WhatsApp Group</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-slate-500 text-center sm:text-left">Moderated & Spam-Free</span>
            </div>
          </div>

          {/* Discord Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                  Developer Server
                </span>
                <span className="text-xs font-bold text-indigo-800">
                  2,850+ Online
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900">
                Brandex Discord Server
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Live voice channels for buildathons, pair programming rooms, cybersecurity wargame lobbies, and AI research channels.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="https://discord.gg/brandex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-2 text-center"
              >
                <span>Enter Discord Server</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-slate-500 text-center sm:text-left">24/7 Voice & Chat Rooms</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02. OPPORTUNITIES BOARD */}
      <section className="space-y-6">
        <SectionHeading
          tag="OPEN SLOTS"
          title="Community Opportunities Board"
          subtitle="Explore open circle seats, research slots, ambassador positions, and event volunteer opportunities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {opp.category}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {opp.seatsFilled}/{opp.seatsTotal} Seats Filled
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900">
                  {opp.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {opp.description}
                </p>

                {opp.requirements && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-slate-700">Prerequisites / Commitment:</span>
                    <ul className="text-xs text-slate-600 space-y-0.5 pl-3 list-disc">
                      {opp.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                {opp.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Deadline: {opp.deadline}</span>
                  </div>
                )}

                <button
                  onClick={() => openModal('community')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-sm ml-auto"
                >
                  <span>{opp.actionText || 'Apply for Slot'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03. DOMAIN CIRCLES GRID */}
      <section className="space-y-6">
        <SectionHeading
          tag="CIRCLES"
          title="Explore Domain Communities"
          subtitle="Join specialized working circles to participate in weekly coding labs, paper discussions, and open projects."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((comm) => (
            <CommunityCategoryCard key={comm.id} category={comm} />
          ))}
        </div>
      </section>

      {/* 04. ACTIVE DISCUSSIONS FEED */}
      <section className="space-y-6">
        <SectionHeading
          tag="DISCUSSIONS"
          title="Active Technical Discussions"
          subtitle="Real conversations happening right now across community circles."
        />

        <div className="space-y-4">
          {discussions.map((disc) => (
            <div
              key={disc.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
                    {disc.category}
                  </span>
                  <span className="text-slate-400">• {disc.lastActive}</span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 hover:text-indigo-600 cursor-pointer">
                  {disc.title}
                </h4>
                <p className="text-xs text-slate-500">
                  Posted by <strong className="text-slate-700">{disc.authorName}</strong> ({disc.authorRole})
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3.5 py-2 rounded-lg shrink-0 border border-slate-200">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>{disc.repliesCount} Replies</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05. COMMUNITY GUIDELINES CALLOUT */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-display font-bold text-lg text-white">
              Brandex Community Standards & Values
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Read our principles on inclusive technology education, ethical cybersecurity research conduct, and constructive code review.
          </p>
        </div>
        <NavLink
          to="/community/guidelines"
          className="w-full sm:w-auto justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 shrink-0 shadow-md text-center"
        >
          <span>Read Community Guidelines</span>
          <ArrowRight className="w-4 h-4" />
        </NavLink>
      </section>
    </div>
  );
};
