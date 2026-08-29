import { useSEO } from '../hooks/useSEO';
import React from 'react';
import { Briefcase, Heart, Cpu, Globe, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { BackButton } from '../components/ui/BackButton';
import { SectionHeading } from '../components/ui/SectionHeading';

export const CareersPage: React.FC = () => {
  useSEO("Careers & Team", "Join our team. Work remotely and help build the future of tech education.");
  return (
    <div className="space-y-6 pb-16 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <BackButton />
      
      {/* Hero Section */}
      <PageHero 
        tag="CAREERS AT BRANDEX"
        title="Join Our Mission to Build the Future of Tech Education."
        description="We're always looking for passionate engineers, designers, and community builders to help us scale the Brandex Showcase Ecosystem."
        widgetTitle="Brandex.Team"
        widgetStatLabel="Global Members"
        widgetStatValue="Growing"
        widgetStatusLabel="Hiring Status"
        widgetStatusText="Open Roles Below"
        gradientFrom="text-indigo-600"
        gradientTo="bg-indigo-50"
      />

      {/* Why Join Us */}
      <section className="space-y-6">
        <SectionHeading
          tag="WHY BRANDEX"
          title="Build With Purpose"
          description="We are building the definitive ecosystem for technology education and community building."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Globe,
              title: "Remote-First",
              desc: "Work from anywhere. We value output and creativity over office hours."
            },
            {
              icon: Cpu,
              title: "Cutting-Edge Tech",
              desc: "We experiment with the latest in AI, systems, and digital frameworks."
            },
            {
              icon: Heart,
              title: "Community Driven",
              desc: "Everything we build is designed to empower and connect people."
            },
            {
              icon: Briefcase,
              title: "Growth Potential",
              desc: "Take ownership of massive projects and scale your career rapidly."
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                <benefit.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">{benefit.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Roles */}
      <section className="space-y-6 pt-8 border-t border-slate-200">
        <SectionHeading
          tag="OPEN POSITIONS"
          title="Explore Open Roles"
          description="Find your next opportunity at Brandex."
        />
        
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-2 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Open Roles Right Now</h3>
          <p className="text-slate-600 max-w-md">
            We aren't actively hiring at this exact moment, but we are always on the lookout for exceptional talent. Check back soon or follow us on our socials for updates!
          </p>
          <a href="mailto:careers@brandex.network" className="inline-flex items-center gap-2 mt-4 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            Send us your resume anyway
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
};
