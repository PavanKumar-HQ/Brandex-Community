import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  useSEO(
    'Privacy Policy',
    'Brandex Privacy Policy: Details on data transparency, minimal collection, encryption, and rights regarding your education and community data.'
  );

  return (
    <div className="w-full space-y-10 pb-20 pt-20 sm:pt-24 px-4 sm:px-8 lg:px-12 xl:px-16 bg-white text-slate-900 font-sans">
      
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <span>Data Protection & Privacy</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 tracking-tight leading-tight">
              Privacy Policy
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              We operate on a lean data collection philosophy. We collect only what is strictly required to deliver high-quality technology education, cohort admissions, and event passes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500 font-medium">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md font-mono text-slate-800">Effective: August 2026</span>
              <span>•</span>
              <span>Entity: Brandex (GSTIN: 29OGNPS8060K1Z5)</span>
              <span>•</span>
              <NavLink to="/terms" className="text-indigo-600 hover:underline font-semibold flex items-center gap-1">
                <span>View Terms of Service</span>
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
                <Shield className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">1. Information We Collect</h2>
            </div>
            <div className="text-sm sm:text-base text-slate-600 pl-11 space-y-2">
              <p>
                We only collect information directly submitted by you during program enrollment, event RSVPs, campus ambassador applications, or partnership inquiries:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li><strong>Identity & Contact:</strong> Full name, official email address, phone/WhatsApp number, and institution or school affiliation.</li>
                <li><strong>Application Data:</strong> Technical experience levels, domain interests (AI, Cybersecurity, UX, Systems), and educational intent.</li>
                <li><strong>Telemetry & Security:</strong> Non-identifying browser headers and rate-limiting IP logs used strictly for DDoS protection and spam prevention.</li>
              </ul>
            </div>
          </article>

          {/* Section 2 */}
          <article className="space-y-3">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">2. How We Use Your Information</h2>
            </div>
            <div className="text-sm sm:text-base text-slate-600 pl-11 space-y-2">
              <p>Your data is processed strictly for legitimate educational and community purposes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Processing cohort admissions and applicant placement',
                  'Issuing entrance passes for live summits & hackathons',
                  'Distributing course notes, labs, and certificates',
                  'Communicating directly regarding institutional partnerships'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Section 3 */}
          <article className="space-y-3">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">3. Zero Data Brokerage Guarantee</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 pl-11">
              Brandex does <strong>not</strong> sell, monetize, rent, or trade your personal information with any third-party advertisers, recruiters, or data brokers. Data is processed solely through secure infrastructure suppliers bound by strict non-disclosure and GDPR/CCPA standards.
            </p>
          </article>

          {/* Section 4 */}
          <article className="space-y-3">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">4. Your Rights & Data Deletion</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 pl-11">
              You maintain full ownership of your personal data. You may request access, modification, or permanent deletion of your records from our systems at any time by contacting our data protection officer.
            </p>
          </article>

          {/* Contact Privacy Officer */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg">Need to request data deletion or privacy assistance?</h3>
              <p className="text-xs sm:text-sm text-slate-400">Our Data Protection Officer will process your request within 48 hours.</p>
            </div>
            <a
              href="mailto:brandexhq@gmail.com?subject=Brandex%20Privacy%20Request"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-xs transition-colors shrink-0 shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Privacy Officer</span>
            </a>
          </div>

        </div>

    </div>
  );
};
