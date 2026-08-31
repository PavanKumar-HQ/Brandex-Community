import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { UserCheck, Award, ShieldAlert, Scale, Mail, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  useSEO(
    'Terms of Service & Conditions',
    'Official terms and conditions governing the Brandex Community platform, education cohorts, and intellectual property.'
  );

  return (
    <div className="w-full space-y-10 pb-20 pt-20 sm:pt-24 px-4 sm:px-8 lg:px-12 xl:px-16 bg-white text-slate-900 font-sans">
      
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Terms of Service' }]} />
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <span>Legal & Policy</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              Terms and Conditions & Terms of Service
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              These terms govern your access to the Brandex ecosystem, participation in cohort training, attendance at live tech summits, and access to open developer resources.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500 font-medium">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md font-mono text-slate-800">Effective: August 2026</span>
              <span>•</span>
              <span>Entity: Brandex (GSTIN: 29OGNPS8060K1Z5)</span>
              <span>•</span>
              <NavLink to="/privacy" className="text-indigo-600 hover:underline font-semibold flex items-center gap-1">
                <span>View Privacy Policy</span>
                <ArrowRight className="w-3 h-3" />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Structured Legal Content */}
        <div className="space-y-10 text-slate-700 leading-relaxed border-t border-slate-200 pt-8">
          
          {/* Section 1 */}
          <article className="space-y-3">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">1. Acceptance & Community Membership</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 pl-11">
              By accessing any part of the Brandex network, submitting applications for technical cohorts, or registering for summits, you agree to comply with these terms and our <NavLink to="/community/guidelines" className="text-indigo-600 underline font-semibold">Community Guidelines</NavLink>. Membership is open to all developers, students, researchers, and creators who provide accurate registration credentials.
            </p>
          </article>

          {/* Section 2 */}
          <article className="space-y-3">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">2. Intellectual Property & Student Work</h2>
            </div>
            <div className="text-sm sm:text-base text-slate-600 pl-11 space-y-2">
              <p>
                We believe in fostering open knowledge. Unless explicitly agreed under a custom sponsorship or NDA:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li><strong>Student Ownership:</strong> All code, software prototypes, and project repositories built by students during buildathons remain 100% the intellectual property of the student creators.</li>
                <li><strong>Brand Assets:</strong> The Brandex trademark, official logos, curriculum frameworks (including the Geniusphere Series), and verifiable certificates remain the protected property of Brandex.</li>
                <li><strong>Open Source Code:</strong> Public template repositories shared by Brandex instructors are released under Apache 2.0 or MIT open-source licenses.</li>
              </ul>
            </div>
          </article>

          {/* Section 3 */}
          <article className="space-y-3">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">3. Cybersecurity Labs & Responsible Research</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 pl-11">
              During cybersecurity workshops, Capture-The-Flag (CTF) wargames, and AI testing sessions, all activities must be conducted strictly within assigned lab domains and virtual sandbox containers. Any probing or malicious actions directed outside designated sandboxes will result in immediate termination of membership and notification of institutional administrators.
            </p>
          </article>

          {/* Section 4 */}
          <article className="space-y-3">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">4. Limitation of Liability & Disclaimer</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 pl-11">
              Brandex educational content, workshop roadmaps, and code snippets are provided on an "as-is" basis for training and education. While we strive to present cutting-edge engineering practices, Brandex shall not be liable for direct or indirect damages arising from third-party tooling or software implementations.
            </p>
          </article>

          {/* Section 5: Contact */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg">Questions regarding these terms?</h3>
              <p className="text-xs sm:text-sm text-slate-400">Our compliance and legal team is available to assist partner institutions.</p>
            </div>
            <a
              href="mailto:brandexhq@gmail.com?subject=Brandex%20Terms%20Inquiry"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-xs transition-colors shrink-0 shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Compliance</span>
            </a>
          </div>

        </div>

    </div>
  );
};
