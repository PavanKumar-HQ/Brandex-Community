import React, { useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { ShareButton } from '../components/ui/ShareButton';
import { createEnquiry } from '../repositories/repository';
import { EnquiryType } from '../models/types';
import {
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  HeartHandshake,
  Users
} from 'lucide-react';

interface EnquiryCategoryOption {
  type: EnquiryType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}

export const WorkWithBrandexPage: React.FC = () => {
  useSEO(
    'Work With Brandex — Institutional & Corporate Partnerships',
    'Partner with Brandex for school technology syllabus integration, corporate cybersecurity training tracks, workshop hosting, and event sponsorships.'
  );

  const [selectedType, setSelectedType] = useState<EnquiryType>('school');
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    additionalRequirements: '',
    honeypot: '' // Spam protection trap
  });

  const [mountTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories: EnquiryCategoryOption[] = [
    {
      type: 'school',
      title: 'School / College Partnership',
      subtitle: 'Introduce the Geniusphere coding syllabus, campus cybersecurity wargames, or setup an official student chapter.',
      icon: GraduationCap,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: 'Academic & Schools'
    },
    {
      type: 'corporate',
      title: 'Corporate Training & Upskilling',
      subtitle: 'Custom team cohorts in modern AI agent construction, secure coding, and cloud incident simulations.',
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      badge: 'Enterprise & Startups'
    },
    {
      type: 'workshop',
      title: 'Workshop / Hackathon Hosting',
      subtitle: 'Collaborate on multi-day technology bootcamps, Capture The Flag competitions, or UI/UX design workshops.',
      icon: Layers,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      badge: 'Events & Labs'
    },
    {
      type: 'sponsorship',
      title: 'Event & Prize Sponsorship',
      subtitle: 'Sponsor Brandex summits, provide cloud/compute credits to student builders, or support prize tracks.',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: 'Sponsors & Grants'
    },
    {
      type: 'partnership',
      title: 'Strategic Partnership',
      subtitle: 'Co-brand curriculum tracks, open-source tooling collaborations, and long-term ecosystem integration.',
      icon: HeartHandshake,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'Institutions'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Spam Protection — Honeypot Check
    if (formData.honeypot.trim() !== '') {
      // Bot trapped
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedRef('ENQ-SPAM-PREVENTED');
      }, 1000);
      return;
    }

    // 2. Spam Protection — Minimum Submission Duration (3 seconds)
    const elapsed = Date.now() - mountTime;
    if (elapsed < 3000) {
      setErrorMessage('Form submitted too rapidly. Please review your entries and try again.');
      return;
    }

    // 3. Rate Limiting Check (max 3 enquiries per session)
    const count = parseInt(sessionStorage.getItem('enquiry_submit_count') || '0', 10);
    if (count >= 3) {
      setErrorMessage('Submission limit reached for this browser session. Please reach out to us directly at brandexhq@gmail.com.');
      return;
    }

    setIsSubmitting(true);

    try {
      const enq = await createEnquiry({
        type: selectedType,
        orgName: formData.orgName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        message: `${formData.message} ${formData.additionalRequirements ? `\n[Notes: ${formData.additionalRequirements}]` : ''}`,
        adminNotes: `Source: /work-with-us page. Category: ${selectedType}`
      });

      sessionStorage.setItem('enquiry_submit_count', (count + 1).toString());
      setIsSubmitting(false);
      setSubmittedRef(enq.id);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('There was an issue logging your enquiry. Please check your network connection.');
    }
  };

  return (
    <div className="space-y-10 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: 'Work With Brandex' }]} className="mb-0" />
        <ShareButton title="Work With Brandex — Institutional & Corporate Partnerships" />
      </div>

      {/* Hero Header */}
      <PageHero
        tag="BUSINESS & INSTITUTIONAL PARTNERSHIPS"
        title="Work With Brandex"
        description="Partner with Brandex to deploy open-source technology curricula in schools, conduct corporate team wargames, or sponsor our developer summits."
        widgetTitle="Partner.Desk"
        widgetStatLabel="Response Time"
        widgetStatValue="< 24 Hours"
        widgetStatusLabel="Partnership Window"
        widgetStatusText="Now Open for 2026-27"
      />

      {/* Clear Distinction Banner */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-slate-900">Looking to join as an individual builder?</h4>
            <p className="text-xs text-slate-600">
              If you are a student or developer wanting to join circles, head over to our Community Portal instead.
            </p>
          </div>
        </div>
        <a
          href="#/community"
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 inline-flex items-center gap-1.5"
        >
          <span>Join Community Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Why Partner With Brandex Section */}
      <section className="py-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Why Partner With Brandex?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We are building the most active and capable developer ecosystem in the country. Our partners gain direct access to top-tier technical talent and innovative learning models.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Open-Source Syllabus</h3>
            <p className="text-sm text-slate-600">Access our proven, field-tested AI and cybersecurity curriculum used by leading secondary schools.</p>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Talent Pipeline</h3>
            <p className="text-sm text-slate-600">Engage directly with passionate student builders and emerging engineers through workshops and hackathons.</p>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Corporate Upskilling</h3>
            <p className="text-sm text-slate-600">Elevate your team's capabilities with hands-on, scenario-based wargames and technical training cohorts.</p>
          </div>
        </div>
      </section>

      {/* STEP 1: SELECT ENQUIRY TYPE */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">STEP 1</span>
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Select Your Partnership Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedType === cat.type;
            return (
              <button
                key={cat.type}
                type="button"
                onClick={() => setSelectedType(cat.type)}
                className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                    {cat.badge}
                  </span>
                  <h3 className="font-display font-bold text-sm text-slate-900 leading-snug">
                    {cat.title}
                  </h3>
                </div>

                <div className="pt-2">
                  <span className={`text-[11px] font-bold inline-flex items-center gap-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Selected' : 'Select category'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 2: ENQUIRY SUBMISSION FORM */}
      <section className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-6">
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">STEP 2</span>
          <h3 className="font-display font-bold text-2xl text-slate-900">
            Submit Your Partnership Request
          </h3>
          <p className="text-xs text-slate-600">
            Enquiry Category: <strong className="text-indigo-700 capitalize">{categories.find(c => c.type === selectedType)?.title}</strong>. Our executive desk will review and contact you within 24 hours.
          </p>
        </div>

        {submittedRef ? (
          <div className="py-10 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900">
              Enquiry Logged Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.contactName}</strong> from <strong className="text-slate-900">{formData.orgName}</strong>. Your reference ID is <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{submittedRef}</span>.
            </p>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto text-xs text-slate-600 text-left space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Lean Privacy Guarantee:</span>
              </div>
              <p>
                We do not create permanent accounts or sell commercial data. Your enquiry record will be handled directly by our team and automatically scheduled for retention closure.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmittedRef(null);
                setFormData({
                  orgName: '',
                  contactName: '',
                  email: '',
                  phone: '',
                  message: '',
                  additionalRequirements: '',
                  honeypot: ''
                });
              }}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
            >
              <span>Submit Another Request</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Honeypot Trap (Hidden from users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_url_check">Leave this field blank</label>
              <input
                id="website_url_check"
                type="text"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Organization / School / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Institute of Tech / Acme Corp"
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Primary Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priya Sharma"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="priya@institution.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contact Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 99868 80072"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Partnership Scope & Objectives *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your student cohort size, proposed dates, target curriculum focus (e.g. Geniusphere, AI models, Cyber defence), or sponsorship tier..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Logging Partnership Request...' : 'Submit Partnership Enquiry'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px] text-center pt-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Spam-protected & rate-limited. Direct administrative response guarantee.</span>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
