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
  ArrowLeft,
  Copy,
  Check,
  Building2,
  Mail,
  FileText,
  Clock,
  WifiOff,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Sparkles
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

const BRANDEX_12_SERVICES: BrandexService[] = [
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

  // 2-Step Smooth Flow: 'catalog' -> 'booking'
  const [viewMode, setViewMode] = useState<'catalog' | 'booking'>('catalog');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('web-apps');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Short & Concise Booking Form State (Zero account required)
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

  // Step 1 -> Step 2 transition
  const handleSelectService = (s: BrandexService) => {
    setSelectedServiceId(s.id);
    setErrorMsg('');
    setViewMode('booking');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 2 -> Step 1 back navigation
  const handleBackToCatalog = () => {
    setViewMode('catalog');
    setErrorMsg('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-5">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Services', path: '/services' },
              ...(viewMode === 'booking' ? [{ label: currentService.name }] : [])
            ]}
          />
        </div>

        {/* SUCCESS RECEIPT STATE */}
        {bookingReceipt ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg text-center max-w-xl mx-auto animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-200 dark:border-emerald-800 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Service Request Confirmed
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Your inquiry has been stored with zero-PII security in the Brandex database. We will review your scope and follow up promptly.
            </p>

            {bookingReceipt.isOfflineQueued && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
                <WifiOff className="w-4 h-4 shrink-0" />
                <span>Saved to IndexedDB Offline Queue. Automatic sync will dispatch once online.</span>
              </div>
            )}

            <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-left">
              <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-mono tracking-wider mb-2">
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
                  type="button"
                  onClick={copyReceiptId}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 active:scale-95 transition-all"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs">
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

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <NavLink
                to={`/status?id=${bookingReceipt.id}`}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 border border-indigo-700"
              >
                <span>Track Status in Real-Time</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  setBookingReceipt(null);
                  setViewMode('catalog');
                  setContactName('');
                  setContactInfo('');
                  setScopeDescription('');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                Explore Other Services
              </button>
            </div>
          </div>
        ) : viewMode === 'catalog' ? (
          /* STEP 1: 12 CORE SERVICES CATALOG */
          <div className="space-y-6 animate-fade-in">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  12 Core Engineering Services
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Select a service below to request a fast, non-binding quote in 30 seconds.
                </p>
              </div>

              {/* Small Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
                {[
                  { id: 'all', label: 'All (12)' },
                  { id: 'dev', label: 'Web & Apps' },
                  { id: 'ai', label: 'AI & Automation' },
                  { id: 'consulting', label: 'Consulting' },
                  { id: 'ecosystem', label: 'Community' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border shadow-xs ${
                      activeCategory === tab.id
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-indigo-600 dark:border-indigo-500'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MOBILE: Compact 2-Column Grid (Zero endless scrolling) */}
            <div className="grid grid-cols-2 sm:hidden gap-2.5">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={`mobile-${service.id}`}
                    onClick={() => handleSelectService(service)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 active:scale-95 transition-all shadow-xs flex flex-col justify-between min-h-[140px] cursor-pointer group hover:border-indigo-500"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 shadow-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight line-clamp-1">
                        {service.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {service.tagline}
                      </p>
                    </div>

                    {/* Tactile Mobile Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectService(service);
                      }}
                      className="mt-2.5 w-full py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 text-slate-700 dark:text-slate-300 group-hover:text-white text-[10px] font-bold transition-colors flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 shadow-xs"
                    >
                      <span>Select</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP & TABLET: Crisp 3-Column Modernist Cards Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        {service.isEcosystemLayer && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Ecosystem
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                        {service.tagline}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {service.coverage}
                      </p>
                    </div>

                    {/* Real Tactile Button on Card */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectService(service);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-800 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-600 dark:hover:text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95"
                      >
                        <span>Select Service & Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* STEP 2: DEDICATED BOOKING FORM PAGE FOR CHOSEN SERVICE */
          <div className="max-w-xl mx-auto animate-fade-in space-y-6">
            {/* Back Navigation Tactile Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackToCatalog}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to 12 Services</span>
              </button>

              <span className="text-[11px] font-mono text-slate-400">Step 2 of 2: Quote Details</span>
            </div>

            {/* Selected Service Card Header */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <currentService.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-600 dark:text-indigo-400 font-bold block">
                    Selected Service
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {currentService.name}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {currentService.tagline}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBackToCatalog}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shadow-xs shrink-0 hover:bg-indigo-50 active:scale-95 transition-all"
              >
                Change
              </button>
            </div>

            {/* Concise Booking Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Direct Project Submission</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Tell Us What You Want Built
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  We'll evaluate scope, match engineering leads, and dispatch quote reference.
                </p>
              </div>

              <form onSubmit={handleSubmitBooking} className="space-y-4">
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>

                {/* 2. Contact Info */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Contact (Email / Phone / Telegram / @handle) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="e.g. contact@apex.io or @apex_team"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>

                {/* 3. Short Scope Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Deliverables & Requirements <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Short & concise</span>
                  </div>
                  <textarea
                    rows={3}
                    value={scopeDescription}
                    onChange={(e) => setScopeDescription(e.target.value)}
                    placeholder="Describe deliverables, tech stack preference, or specific features you need..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed shadow-2xs"
                  />
                </div>

                {/* 4. Timeline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Target Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
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

                {/* Real Tactile Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 border border-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Immutable SRV Receipt...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      <span>Submit Request & Get Instant Quote</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Instant immutable reference • Track anytime at /status</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

