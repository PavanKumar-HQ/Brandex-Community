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
      <section className="max-w-3xl space-y-4">
        <div className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold uppercase tracking-widest text-xs rounded-full">
          THE BRANDEX MISSION
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 leading-tight">
          Empowering builders with practical engineering skills and a supportive network.
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
            Brandex was built to avoid the difficulties of traditional, static technology education and enhance direct, real-world knowledge sharing. We wanted to create a space where developers, researchers, and students are well-aware of modern engineering tools, meet to network, and actively exchange their knowledge.
          </p>

          <p className="text-slate-900 font-semibold text-lg border-l-4 border-purple-600 pl-4 py-1 italic bg-purple-50/50 rounded-r-lg">
            "We conduct various practical activities—from cybersecurity wargames to AI agent sprints—to ensure that high-fidelity technology knowledge is readily available to everyone."
          </p>

          <p>
            As part of our commitment to public welfare, we actively develop open-source projects. For example, our custom high school technology syllabus and coding workshop series, <strong>Geniusphere</strong>, has been completely open-sourced and deployed live for public use at <a href="https://geniusphere.tech" target="_blank" rel="noreferrer" className="text-purple-600 font-bold hover:underline">geniusphere.tech</a>.
          </p>
        </div>

      </section>

      {/* Founders & Leadership Section */}
      <section className="space-y-6 pt-8 border-t border-slate-200">
        <SectionHeading
          tag="LEADERSHIP"
          title="Meet the Founders"
          subtitle="The visionary team behind Brandex, bridging the gap between education and real-world technology engineering."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Founder 1: Pavan Kumar.S */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/20 flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:border-indigo-200 hover:shadow-indigo-100/40 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-900 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
              <img src="/brandex-dp.png" alt="Pavan Kumar.S" className="w-full h-full object-cover p-3 bg-slate-950" />
            </div>
            
            <div className="space-y-4 text-center sm:text-left flex-1 relative z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-widest mb-2">Co-Founder & CEO</span>
                <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">Pavan Kumar.S</h3>
                <p className="text-indigo-600 font-semibold text-xs mt-1 uppercase tracking-wider">Co-Founder & Chief Executive Officer</p>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Driving Brandex's platform engineering, agentic AI research, and scalable community architecture. Devoted to avoiding academic barriers and creating practical builder ecosystems.
              </p>
              
              {/* Profile Links */}
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-slate-500">
                <a href="https://www.linkedin.com/in/pavankumarofficialcareers/" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all shadow-sm group/btn" title="LinkedIn Profile">
                  <Linkedin className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                </a>
                <a href="mailto:contact@brandex.co.in" className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all shadow-sm group/btn" title="Email Founder">
                  <Mail className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                </a>
              </div>
            </div>
          </div>

          {/* Founder 2: Sathvik.N */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/20 flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:border-indigo-200 hover:shadow-indigo-100/40 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-900 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
              <img src="/brandex-dp.png" alt="Sathvik.N" className="w-full h-full object-cover p-3 bg-slate-950" />
            </div>
            
            <div className="space-y-4 text-center sm:text-left flex-1 relative z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-widest mb-2">Founder & CTO</span>
                <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">Sathvik.N</h3>
                <p className="text-purple-600 font-semibold text-xs mt-1 uppercase tracking-wider">Founder & Chief Technology Officer</p>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pioneering technology education initiatives, institutional partnerships, and Geniusphere workshop series across high schools and university networks. Specialize in operationalizing CTFs and interactive labs.
              </p>
              
              {/* Profile Links */}
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-slate-500">
                <a href="https://www.linkedin.com/in/sathvik-nagesh/" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all shadow-sm group/btn" title="LinkedIn Profile">
                  <Linkedin className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                </a>
                <a href="mailto:contact@brandex.co.in" className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all shadow-sm group/btn" title="Email Founder">
                  <Mail className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                </a>
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
