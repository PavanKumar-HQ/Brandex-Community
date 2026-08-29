import { useSEO } from '../hooks/useSEO';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, MessageSquare, Terminal, HeartHandshake, Shield, Users, Compass, Code, Layout, Blocks, Briefcase } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { BackButton } from '../components/ui/BackButton';
import { PageHero } from '../components/ui/PageHero';
import { CommunityCategoryCard } from '../components/cards/CommunityCategoryCard';
import { EmptyState } from '../components/ui/EmptyState';
import { getCommunities, getDiscussions } from '../repositories/repository';
import { Community, Discussion } from '../models/types';

export const CommunityPage: React.FC = () => {
  useSEO("Technology Domain Circles", "Join specialized technology domain circles in AI, Cybersecurity, and UX to collaborate on coding projects.");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function loadCommunityData() {
      const comms = await getCommunities(selectedCategory);
      setCommunities(comms);

      const disc = await getDiscussions();
      setDiscussions(disc);
    }
    loadCommunityData();
  }, [selectedCategory]);

  const categories = ['All', 'AI & Research', 'Cybersecurity', 'Technology', 'Digital Skills & Software'];

  return (
    <div className="space-y-6 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <BackButton />
      
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

      {/* Domain Circles Grid */}
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

      {/* Active Discussions Feed */}
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
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 hover:shadow-md transition-all"
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

    </div>
  );
};
