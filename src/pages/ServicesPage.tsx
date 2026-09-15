import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { getOrCreateIdentity } from '../utils/identity';
import { queueOfflineAction } from '../utils/offlineDb';
import {
  Globe,
  Layout,
  Smartphone,
  Layers,
  Zap,
  Cpu,
  Wrench,
  Database,
  Compass,
  Presentation,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Building2,
  Mail,
  FileText,
  Clock,
  WifiOff,
  AlertCircle,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

export interface BrandexService {
  id: string;
  name: string;
  category: 'dev' | 'ai' | 'consulting' | 'ecosystem';
  icon: React.ElementType;
  tagline: string;
  coverage: string;
  isEcosystemLayer?: boolean;
}

export const BRANDEX_12_SERVICES: BrandexService[] = [
  {
    id: 'websites',
    name: 'Websites',
    category: 'dev',
    icon: Globe,
    tagline: 'High-Performance Web Presence',
    coverage: 'Business websites, landing pages, institutional sites, portfolios, and SEO-focused websites.'
  },
  {
    id: 'web-apps',
    name: 'Web Apps',
    category: 'dev',
    icon: Layout,
    tagline: 'Custom Web Platforms',
    coverage: 'Custom web applications, responsive client portals, and scalable cloud-native platforms.'
  },
  {
    id: 'mobile-apps',
    name: 'Mobile Apps',
    category: 'dev',
    icon: Smartphone,
    tagline: 'Native & Cross-Platform Mobile',
    coverage: 'Android, iOS, React Native, and Flutter applications with offline-first local persistence.'
  },
  {
    id: 'saas',
    name: 'SaaS Development',
    category: 'dev',
    icon: Layers,
    tagline: 'SaaS Products & MVPs',
    coverage: 'SaaS product development, rapid MVPs, multi-tenant analytics dashboards, and subscription engines.'
  },
  {
    id: 'automation',
    name: 'Automation',
    category: 'ai',
    icon: Zap,
    tagline: 'Workflow & Process Automation',
    coverage: 'Workflow automation, third-party API integrations, data scrapers, and repetitive-process robotics.'
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    category: 'ai',
    icon: Cpu,
    tagline: 'Production AI Capabilities',
    coverage: 'Adding LLMs, multi-agent workflows, semantic vector search (RAG), and tool-calling to existing products.'
  },
  {
    id: 'internal-tools',
    name: 'Internal Tools',
    category: 'ai',
    icon: Wrench,
    tagline: 'Operational Command Centers',
    coverage: 'Custom admin panels, ops dashboards, financial audit tools, and automated reporting pipelines.'
  },
  {
    id: 'crm',
    name: 'CRM Solutions',
    category: 'ai',
    icon: Database,
    tagline: 'Custom CRM & Pipeline Engines',
    coverage: 'Tailored CRM systems, lead pipeline management, automated drip messaging, and conversion telemetry.'
  },
  {
    id: 'consulting',
    name: 'Consulting',
    category: 'consulting',
    icon: Compass,
    tagline: 'Strategic Tech & Product Advisory',
    coverage: 'Technology architecture, product roadmap, AI readiness, scalability audits, and digital transformation.'
  },
  {
    id: 'workshops',
    name: 'Workshops',
    category: 'consulting',
    icon: Presentation,
    tagline: 'Hands-on Technical Masterclasses',
    coverage: 'Practical technology, generative AI, cybersecurity CTFs, and digital execution masterclasses.'
  },
  {
    id: 'training',
    name: 'Training',
    category: 'consulting',
    icon: BookOpen,
    tagline: 'Structured Institutional Curriculum',
    coverage: 'Tailored training programs for engineering colleges, schools, student cohorts, and corporate teams.'
  },
  {
    id: 'community',
    name: 'Community Ecosystem',
    category: 'ecosystem',
    icon: Users,
    tagline: 'Ecosystem Connection Layer',
    coverage: 'Brandex community initiatives, meetups, open-source collaborations, hackathons, and partnerships.',
    isEcosystemLayer: true
  }
];

export const ServicesPage: React.FC = () => {
  useSEO(
    'Brandex Core Services & Fast Quote Booking',
    'Explore our 12 core engineering services: Websites, Web Apps, Mobile, SaaS, Automation, AI Integration, CRM, Consulting, Workshops, Training & Community.'
  );

  const identity = getOrCreateIdentity();

  // Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>('web-apps');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Short & Concise Booking Form State (Zero account required!)
  const [contactName, setContactName] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [scopeDescription, setScopeDescription] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('Immediate (Next 2-4 weeks)');

  // Submission & Receipt State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [bookingReceipt, setBookingReceipt] = useState<{
    id: string;
    serviceName: string;
    status: string;
    isOfflineQueued: boolean;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const currentService =
    BRANDEX_12_SERVICES.find((s) => s.id === selectedServiceId) || BRANDEX_12_SERVICES[1];

  const filteredServices = BRANDEX_12_SERVICES.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  const handleSelectService = (s: BrandexService) => {
    setSelectedServiceId(s.id);
    setErrorMsg('');
    // Scroll down smoothly to the concise booking box on mobile
    const formEl = document.getElementById('booking-form-section');
    if (formEl && window.innerWidth < 1024) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactName.trim()) {
      setErrorMsg('Please provide your name or organization.');
      return;
    }
    if (!contactInfo.trim()) {
      setErrorMsg('Please provide your contact email, phone, or handle so we can dispatch the quote.');
      return;
    }
    if (scopeDescription.trim().length < 10) {
      setErrorMsg('Please briefly describe what you are looking to build (minimum 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `SRV-2026-${randomSuffix}`;

    const payload = {
      id: generatedId,
      userHandle: contactInfo.trim() || identity.handle,
      serviceId: currentService.id,
      serviceTitle: currentService.name,
      tier: 'Standard',
      organization: contactName.trim(),
      preferredSlot: timeline,
      scopeNotes: scopeDescription.trim()
    };

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }

      const res = await fetch('/api/pwa/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const receiptId = data.id || data.bookingId || generatedId;
      try {
        const existing = JSON.parse(localStorage.getItem('brandex_recent_refs') || '[]');
        const updated = Array.from(new Set([receiptId, ...existing])).slice(0, 5);
        localStorage.setItem('brandex_recent_refs', JSON.stringify(updated));
      } catch {}

      setBookingReceipt({
        id: receiptId,
        serviceName: currentService.name,
        status: data.status || 'Scheduled',
        isOfflineQueued: false
      });
    } catch {
      // Offline fallback: Queue in IndexedDB for Background Sync
      await queueOfflineAction('booking', '/api/pwa/bookings', payload);
      try {
        const existing = JSON.parse(localStorage.getItem('brandex_recent_refs') || '[]');
        const updated = Array.from(new Set([generatedId, ...existing])).slice(0, 5);
        localStorage.setItem('brandex_recent_refs', JSON.stringify(updated));
      } catch {}

      setBookingReceipt({
        id: generatedId,
        serviceName: currentService.name,
        status: 'Offline Queued (Will sync automatically)',
        isOfflineQueued: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReceiptId = () => {
    if (bookingReceipt) {
      navigator.clipboard.writeText(bookingReceipt.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-brand-canvas transition-colors pt-24 sm:pt-28 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Services & Booking' }
            ]}
          />
        </div>

        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            12 Core Services & Solutions
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            From websites and custom web/mobile platforms to AI integrations, internal tools, and institutional training. No account required to request a quote.
          </p>
        </div>

        {/* SUCCESS RECEIPT STATE */}
        {bookingReceipt ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Service Request Confirmed
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Your service quote inquiry has been registered in the Brandex database. We will review your scope and get in touch.
            </p>

            {bookingReceipt.isOfflineQueued && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
                <WifiOff className="w-4 h-4 shrink-0" />
                <span>Saved to IndexedDB Offline Queue. Automatic sync will dispatch once online.</span>
              </div>
            )}

            <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono tracking-wider mb-2">
                <span>Deterministic Reference ID</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold lowercase font-sans">
                  {bookingReceipt.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {bookingReceipt.id}
                </span>
                <button
                  onClick={copyReceiptId}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Selected Service:</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{bookingReceipt.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Target Timeline:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">{timeline}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <NavLink
                to={`/status?id=${bookingReceipt.id}`}
                className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Track Status in Real-Time</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>

              <button
                onClick={() => {
                  setBookingReceipt(null);
                  setContactName('');
                  setContactInfo('');
                  setScopeDescription('');
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: THE 12 CORE SERVICES (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Services (12)' },
                  { id: 'dev', label: 'Web & Apps' },
                  { id: 'ai', label: 'AI & Automation' },
                  { id: 'consulting', label: 'Consulting & Training' },
                  { id: 'ecosystem', label: 'Community' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === tab.id
                        ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 12 Services Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredServices.map((service) => {
                  const Icon = service.icon;
                  const isSelected = service.id === selectedServiceId;

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className={`p-4 sm:p-4.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-4 ring-indigo-500/10 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {service.isEcosystemLayer && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              Ecosystem Layer
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {service.name}
                        </h3>
                        <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mb-1.5">
                          {service.tagline}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {service.coverage}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                          {isSelected ? 'Selected ✓' : 'Click to select'}
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' : 'text-slate-300'} transition-transform`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ecosystem Layer Note */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-300">
                <Users className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                <div>
                  <span className="font-bold block">Community is an Ecosystem Layer</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Community connects all Brandex events, open-source projects, student workshops, and chapter partnerships. Account creation is required when joining circles.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SHORT & CONCISE BOOKING FORM (5 COLS) */}
            <div id="booking-form-section" className="lg:col-span-5 sticky top-24">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>No Account Required</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Request a Fast Quote
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Fill in these 3 essential details. We'll assess your requirements and dispatch quote receipt.
                  </p>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  {/* Selected Service Pill */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <currentService.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block">Selected Service</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{currentService.name}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Change ↗</span>
                  </div>

                  {/* 1. Name or Organization */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Your Name or Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Apex Labs or Rahul Verma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* 2. Contact Info */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Contact (Email / Phone / Telegram) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="e.g. contact@apex.io or @apex_team"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* 3. Short Scope Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        What Do You Need? <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">Short & concise</span>
                    </div>
                    <textarea
                      rows={3}
                      value={scopeDescription}
                      onChange={(e) => setScopeDescription(e.target.value)}
                      placeholder="Briefly state deliverables, tech stack, or problem you want us to solve..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>

                  {/* 4. Timeline */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Immediate (Next 2-4 weeks)">Immediate (Next 2-4 weeks)</option>
                      <option value="Within 1-2 Months">Within 1-2 Months</option>
                      <option value="Quarterly Exploration">Quarterly Exploration</option>
                      <option value="Flexible / Ongoing">Flexible / Ongoing</option>
                    </select>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating SRV Receipt...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4" />
                        <span>Submit Request & Get Quote</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Instant immutable receipt • Track anytime at /status</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
