import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Users, Target, Compass } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PageHero } from '../components/ui/PageHero';

export const AboutPage: React.FC = () => {
  const principles = [
    {
      title: 'Learn Openly',
      desc: 'Knowledge should not be hidden behind proprietary walls. We share research papers, architecture diagrams, and code snippets publicly.',
    },
    {
      title: 'Build Practically',
      desc: 'Theory without implementation is incomplete. Every Brandex workshop ends with runnable code or defensive configurations.',
    },
    {
      title: 'Share Knowledge',
      desc: 'Senior researchers and student developers learn side-by-side through code reviews and collaborative builds.',
    },
    {
      title: 'Explore Beyond Silos',
      desc: 'AI, Cybersecurity, Distributed Systems, and Swiss Design intersect. We break traditional departmental barriers.',
    },
    {
      title: 'Create Opportunities',
      desc: 'We connect talented learners directly with high-growth technology ventures and research labs.',
    },
    {
      title: 'Grow Together',
      desc: 'Community growth is measured by human connection, technical mastery, and shared success.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-24 sm:pt-28 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      
      {/* About Hero */}
      <PageHero 
        tag="ABOUT BRANDEX ECOSYSTEM"
        title="Building the Digital Home of an Emerging Technology Community."
        description="Brandex was founded to eliminate the disconnect between static computer science education and the rapid pace of real-world technology engineering."
        gradientFrom="text-indigo-600"
        gradientTo="bg-indigo-50"
      />

      {/* Centered Mission Statement */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <span className="text-indigo-600 font-bold uppercase tracking-wider block text-sm">// OUR MISSION</span>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 leading-tight">
          To equip developers, researchers, and creators with production-grade engineering skills and a supportive human network.
        </h2>
      </section>

      {/* Storytelling Layout with Image */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Image Placeholder */}
        <div className="w-full aspect-[4/3] bg-slate-100 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
          <div className="text-slate-400 font-medium flex flex-col items-center gap-2">
            <Compass className="w-12 h-12 text-slate-300" />
            <span>Team Collaboration Image</span>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-6 text-slate-700 text-base leading-relaxed">
          <h2 className="font-display font-bold text-3xl text-slate-900 border-b border-slate-200 pb-3">
            Why Brandex Exists
          </h2>

          <p>
            Modern technology moves at an unprecedented speed. While traditional institutions struggle to update static curricula, developers and researchers are left navigating fragmented documentation, noisy social feeds, and isolated tutorials.
          </p>

          <p className="text-slate-900 font-semibold text-lg border-l-4 border-indigo-600 pl-4 py-1 italic bg-indigo-50/50 rounded-r-lg">
            "Brandex is not just a company or a SaaS platform. It is an intentional community of people who learn, build, explore and share."
          </p>

          <p>
            We bring together four essential pillars under one ecosystem: peer-to-peer community networks, structured educational pathways, hands-on security & AI training, and real-world event summits.
          </p>
        </div>

      </section>

      {/* Principles Grid */}
      <section className="space-y-8">
        <SectionHeading
          tag="FOUNDATIONAL VALUES"
          title="The Six Brandex Principles"
          subtitle="Core rules that guide our workshops, events, community discussions, and platform code."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-indigo-300 hover:shadow-lg transition-all">
              <span className="text-xs text-indigo-600 font-bold font-mono">
                0{idx + 1}
              </span>
              <h3 className="font-display font-bold text-xl text-slate-900">
                {p.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
