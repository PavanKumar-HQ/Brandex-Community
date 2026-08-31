import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { Globe, ShieldCheck, ArrowUpRight, Zap } from 'lucide-react';

export const BrandexHQPage: React.FC = () => {
  useSEO(
    'Brandex Official Portal | brandex.co.in',
    'Official corporate portal and parent ecosystem bridge for Brandex.'
  );

  return (
    <div className="space-y-12 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <Breadcrumb items={[{ label: 'Brandex Parent Ecosystem' }]} />

      {/* Hero Header */}
      <PageHero
        tag="OFFICIAL PARENT ECOSYSTEM"
        title="Brandex Corporate HQ & Innovation Group"
        description="Brandex is a multi-disciplinary technology collective building enterprise digital products, autonomous systems, and open developer education cohorts across India."
        widgetTitle="Ecosystem.Portal"
        widgetStatLabel="Primary Domain"
        widgetStatValue="brandex.co.in"
        widgetStatusLabel="Entity Status"
        widgetStatusText="Active Enterprise Parent"
      />

      {/* Main Light Bridge Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <span>Official Portal: brandex.co.in</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              The Engine Behind Next-Generation Digital Experiences.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
              Brandex Community operates as the open education and talent research wing of the <strong>Brandex Parent Organization</strong>. For commercial solutions, digital software development, and enterprise partnerships, visit our official corporate portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="https://www.brandex.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95"
            >
              <span>Visit Official Portal (brandex.co.in)</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <NavLink
              to="/work-with-us"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl transition-all"
            >
              <span>Partner With Us</span>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Ecosystem Architecture Cards */}
      <section className="space-y-6 pt-2">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-2xl font-display font-bold text-slate-900">
            Brandex Ecosystem Architecture
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Understanding the structure between our commercial venture and open community initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900">
                Commercial Studio
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Delivering high-scalability web systems, modern digital product design, and strategic technology solutions for fast-growing ventures.
              </p>
            </div>
            <a
              href="https://www.brandex.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-2"
            >
              <span>brandex.co.in</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900">
                Education & Community
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Workshops, Geniusphere student series, technical cohort training, cybersecurity capture-the-flag wargames, and public summits.
              </p>
            </div>
            <NavLink
              to="/education"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-2"
            >
              <span>View Education Pathways</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900">
                Verified Legal Entity
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Brandex is registered under Indian GST legislation (GSTIN: 29OGNPS8060K1Z5) based in Bengaluru, Karnataka.
              </p>
            </div>
            <NavLink
              to="/terms"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-2"
            >
              <span>Read Legal & Terms</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};
