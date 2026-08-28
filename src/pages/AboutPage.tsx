import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Users, Target, Compass } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PageHero } from '../components/ui/PageHero';
import { BackButton } from '../components/ui/BackButton';

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
    <div className="space-y-12 sm:space-y-16 pb-12 pt-16 sm:pt-20 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <BackButton />
      
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

      {/* Founders & Leadership Section */}
      <section className="space-y-8 pt-10 border-t border-slate-200">
        <SectionHeading
          tag="LEADERSHIP"
          title="Meet the Founders"
          subtitle="The visionary team bridging the gap between education and production-level engineering."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Founder 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 hover:shadow-md transition-shadow">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-sm shrink-0 bg-indigo-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-indigo-300" />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <div>
                <h3 className="font-display font-bold text-2xl text-slate-900">Founder Name 1</h3>
                <span className="text-indigo-600 font-semibold text-sm">Co-Founder & Lead Engineer</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Visionary leader focused on building high-performance engineering teams and designing robust system architectures. Passionate about empowering the next generation of technologists.
              </p>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 hover:shadow-md transition-shadow">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-sm shrink-0 bg-blue-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-blue-300" />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <div>
                <h3 className="font-display font-bold text-2xl text-slate-900">Founder Name 2</h3>
                <span className="text-blue-600 font-semibold text-sm">Co-Founder & Head of Education</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Expert in curriculum design, community building, and bridging the gap between academic theory and practical, real-world application for students and professionals alike.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
