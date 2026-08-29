import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { BackButton } from '../components/ui/BackButton';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { ShareButton } from '../components/ui/ShareButton';
import {
  Shield,
  Heart,
  Users,
  MessageSquare,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Mail,
  ArrowRight
} from 'lucide-react';

export const CommunityGuidelinesPage: React.FC = () => {
  useSEO(
    'Community Guidelines & Code of Conduct',
    'Brandex community principles: fostering an open, welcoming, and safe technology education space for students, researchers, and creators.'
  );

  return (
    <div className="space-y-10 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <BackButton />
        <ShareButton title="Brandex Community Guidelines & Code of Conduct" />
      </div>

      <Breadcrumb items={[{ label: 'Community', path: '/community' }, { label: 'Guidelines' }]} />

      {/* Hero */}
      <PageHero
        tag="VALUES & CODE OF CONDUCT"
        title="Brandex Community Guidelines"
        description="Brandex exists to make technology knowledge, mentorship, and buildathon collaboration accessible to all people. These guidelines keep our shared circles welcoming, safe, and productive."
        widgetTitle="Community.Safety"
        widgetStatLabel="Community Standards"
        widgetStatValue="Zero-Tolerance"
        widgetStatusLabel="Enforcement"
        widgetStatusText="Moderator Guard Active"
      />

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            1. Technology is for Everyone
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We welcome students, self-taught developers, researchers, and creators of all skill levels. We encourage questions, celebrate first-time breakthroughs, and avoid elitist gatekeeping.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            2. Responsible & Ethical Tech
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In our Cybersecurity CTFs and AI Model circles, skills must strictly be used for defensive engineering, public welfare, and authorized research. Never target unauthorized infrastructure.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            3. Constructive Collaboration
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Provide kind, actionable code reviews and project feedback. Disagreements on architectural choices should remain respectful, analytical, and centered on shared learning.
          </p>
        </div>
      </div>

      {/* Rules Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 max-w-4xl mx-auto">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">STANDARDS</span>
          <h3 className="font-display font-bold text-2xl text-slate-900">
            Rules of Engagement in Circles & Summits
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Share Open Source & Attribution</strong>
              Whenever sharing snippets, datasets, or designs, properly attribute the creators. We advocate for open source licensing wherever possible.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">No Unsolicited Commercial Solicitation</strong>
              Do not spam community circles, WhatsApp groups, or Discord channels with unrelated crypto promotions, spam links, or aggressive sales pitches.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Maintain Lean Privacy</strong>
              Do not post personal phone numbers, physical addresses, or private credentials in public discussion threads.
            </div>
          </div>
        </div>

        {/* Safety & Reporting */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <span>Reporting Violations & Contacting Moderators</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If you encounter harassment, hate speech, unethical security exploits, or policy violations, please alert our moderator desk immediately at <a href="mailto:brandexhq@gmail.com" className="text-indigo-600 font-bold hover:underline">brandexhq@gmail.com</a> or phone <a href="tel:9986880072" className="text-indigo-600 font-bold hover:underline">+91 99868 80072</a>.
          </p>
        </div>
      </section>
    </div>
  );
};
