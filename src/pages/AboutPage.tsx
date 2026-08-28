import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Users, Target, Compass, Linkedin, Twitter, Github, Mail } from 'lucide-react';
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
        widgetTitle="Brandex.Network"
        widgetStatLabel="Active Members"
        widgetStatValue="1,204"
        widgetStatusLabel="System Status"
        widgetStatusText="All systems operational"
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
          subtitle="The visionary team behind Brandex, bridging the gap between education and real-world technology engineering."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Founder 1 */}
          <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-md shrink-0 bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img src="/brandex-dp.png" alt="Pavan Kumar" className="w-full h-full object-cover p-2 bg-slate-950" />
            </div>
            <div className="space-y-4 text-center sm:text-left flex-1">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider mb-1">Co-Founder</span>
                <h3 className="font-display font-bold text-2xl text-slate-900">Pavan Kumar</h3>
                <span className="text-slate-500 font-medium text-xs">Chief Technology Officer & Lead Architect</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Visionary builder driving Brandex's platform engineering, agentic AI research, and scalable community architecture. Dedicated to creating real-world builder ecosystems.
              </p>
              
              {/* Profile Links */}
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-slate-400">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="LinkedIn Profile">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="Twitter / X">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://github.com/PavanKumar-HQ" target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href="mailto:contact@brandex.co.in" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="Email Founder">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-md shrink-0 bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img src="/brandex-dp.png" alt="Co-Founder" className="w-full h-full object-cover p-2 bg-slate-950" />
            </div>
            <div className="space-y-4 text-center sm:text-left flex-1">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider mb-1">Co-Founder</span>
                <h3 className="font-display font-bold text-2xl text-slate-900">Co-Founder & Director</h3>
                <span className="text-slate-500 font-medium text-xs">Head of Education & Ecosystem Operations</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Pioneering technology education initiatives, institutional partnerships, and Geniusphere workshop series across high schools and university networks.
              </p>
              
              {/* Profile Links */}
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-slate-400">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="LinkedIn Profile">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="Twitter / X">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href="mailto:contact@brandex.co.in" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="Email Founder">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
