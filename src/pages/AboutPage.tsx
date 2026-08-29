import { useSEO } from '../hooks/useSEO';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Users, Target, Compass, Linkedin, Twitter, Github, Mail, BookOpen, Terminal, Share2, Layers, Briefcase, HeartHandshake } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PageHero } from '../components/ui/PageHero';
import { BackButton } from '../components/ui/BackButton';

export const AboutPage: React.FC = () => {
  useSEO("About Our Vision", "Learn the story of Brandex. Founded by Pavan Kumar.S and Sathvik.N to enhance real-world tech sharing and open-source welfare.");
  const principles = [
    {
      title: 'Learn Openly',
      icon: BookOpen,
      desc: 'Knowledge should not be hidden behind proprietary walls. We share research papers, architecture diagrams, and code snippets publicly.',
    },
    {
      title: 'Build Practically',
      icon: Terminal,
      desc: 'Theory without implementation is incomplete. Every Brandex workshop ends with runnable code or defensive configurations.',
    },
    {
      title: 'Share Knowledge',
      icon: Share2,
      desc: 'Senior researchers and student developers learn side-by-side through code reviews and collaborative builds.',
    },
    {
      title: 'Explore Beyond Silos',
      icon: Layers,
      desc: 'AI, Cybersecurity, Distributed Systems, and Swiss Design intersect. We break traditional departmental barriers.',
    },
    {
      title: 'Create Opportunities',
      icon: Briefcase,
      desc: 'We connect talented learners directly with high-growth technology ventures and research labs.',
    },
    {
      title: 'Grow Together',
      icon: HeartHandshake,
      desc: 'Community growth is measured by human connection, technical mastery, and shared success.',
    },
  ];

  return (
    <div className="space-y-6 pb-16 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
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

      {/* Mission Statement */}
      <section className="max-w-none space-y-4">
        <div className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold uppercase tracking-widest text-xs rounded-full">
          THE BRANDEX MISSION
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 leading-tight">
          Empowering builders with practical engineering skills and a supportive network.
        </h2>
      </section>

      {/* Story & Founders Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
        
        {/* Left Column: Why Brandex Exists Story */}
        <div className="lg:col-span-7 space-y-6 text-slate-700 text-base leading-relaxed">
          <div className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold uppercase tracking-widest text-xs rounded-full">
            OUR STORY
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Why Brandex Exists
          </h2>

          <p>
            Brandex was built to bring people together, breaking down the barriers of traditional education so that learning is open to everyone. We wanted to create a welcoming, friendly space where students, creators, and professionals of all backgrounds can gather, share their experiences, and grow together.
          </p>

          <p className="text-slate-900 font-semibold text-lg border-l-4 border-indigo-600 pl-4 py-1.5 italic bg-indigo-50/50 rounded-r-lg">
            "We bring people together to build, play, and learn—from coding battles to creating AI tools—to make sure technology belongs to everyone, not just a few."
          </p>

          <p>
            As part of our commitment to public welfare, we actively develop open-source projects. For example, our custom high school technology syllabus and coding workshop series, <strong>Geniusphere</strong>, has been completely open-sourced and deployed live for public use at <a href="https://geniusphere.tech" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">geniusphere.tech</a>.
          </p>
        </div>

        {/* Right Column: Meet the Founders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">LEADERSHIP</span>
            <h3 className="font-display font-bold text-2xl text-slate-900 mt-2">Meet the Founders</h3>
          </div>

          <div className="space-y-6">
            {/* Founder 1: Pavan Kumar.S */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex gap-6 hover:border-indigo-200 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow shrink-0 bg-slate-900 flex items-center justify-center">
                <img src="/brandex-dp.png" alt="Pavan Kumar.S" className="w-full h-full object-cover p-1.5 bg-slate-950" />
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 leading-tight">Pavan Kumar.S</h4>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-0.5">Co-Founder & CEO</p>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Driving Brandex's platform engineering, agentic AI research, and scalable community architecture. Devoted to avoiding academic barriers.
                </p>
                <div className="flex gap-2.5 text-slate-500 pt-1">
                  <a href="https://www.linkedin.com/in/pavankumarofficialcareers/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors" title="LinkedIn Profile">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="mailto:contact@brandex.co.in" className="text-slate-400 hover:text-indigo-600 transition-colors" title="Email Founder">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Founder 2: Sathvik.N */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex gap-6 hover:border-indigo-200 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow shrink-0 bg-slate-900 flex items-center justify-center">
                <img src="/brandex-dp.png" alt="Sathvik.N" className="w-full h-full object-cover p-1.5 bg-slate-950" />
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 leading-tight">Sathvik.N</h4>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-0.5">Founder & CTO</p>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Pioneering school technology education initiatives, institutional partnerships, and Geniusphere workshop series.
                </p>
                <div className="flex gap-2.5 text-slate-500 pt-1">
                  <a href="https://www.linkedin.com/in/sathvik-nagesh/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors" title="LinkedIn Profile">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="mailto:contact@brandex.co.in" className="text-slate-400 hover:text-indigo-600 transition-colors" title="Email Founder">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Principles Grid */}
      <section className="space-y-6 pt-8 border-t border-slate-200">
        <SectionHeading
          tag="FOUNDATIONAL VALUES"
          title="The Six Brandex Principles"
          subtitle="Core rules that guide our workshops, events, community discussions, and platform code."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-indigo-300 hover:shadow-lg transition-all group cursor-default">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                  <p.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-xs text-slate-400 font-bold font-mono">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                {p.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
