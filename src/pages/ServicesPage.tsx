import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { getOrCreateIdentity, addContributorPoints } from '../utils/identity';
import { queueOfflineAction } from '../utils/offlineDb';
import {
  ShieldAlert,
  Cpu,
  Terminal,
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Building2,
  ExternalLink,
  WifiOff,
  Sparkles,
  Layers,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface ServiceTier {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  icon: React.ElementType;
  deliverables: string[];
  estimatedTimeline: string;
  defaultDeliverables: string[];
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'architecture-audit',
    title: 'Architecture & High-Concurrency Scalability Audit',
    subtitle: 'Systematic bottlenecks identification, load testing, and kernel-level throughput optimization.',
    tag: 'Systems & Infrastructure',
    icon: Cpu,
    estimatedTimeline: '1 - 2 Weeks',
    deliverables: [
      'Simulated 50k+ req/sec stress tests (Go/Rust/Node)',
      'Database connection pool & indexing query audit',
      'Memory leak & goroutine profiling report',
      'Container & Kubernetes cluster resilience topology',
      'Executive remediation roadmap with benchmark graphs'
    ],
    defaultDeliverables: [
      'Simulated 50k+ req/sec stress tests (Go/Rust/Node)',
      'Database connection pool & indexing query audit',
      'Executive remediation roadmap with benchmark graphs'
    ]
  },
  {
    id: 'genai-workflow',
    title: 'Enterprise GenAI & Multi-Agent Workflow Implementation',
    subtitle: 'Production-grade agentic architectures, RAG pipelines, and deterministic tool-calling engines.',
    tag: 'Artificial Intelligence',
    icon: Terminal,
    estimatedTimeline: '2 - 3 Weeks',
    deliverables: [
      'Multi-agent state machines with fallback safety loops',
      'Hybrid semantic vector search + BM25 re-ranking pipeline',
      'Evaluation benchmarks for hallucination & latency (<400ms)',
      'Local model deployment (vLLM / Ollama / Llama 3) guide',
      'Enterprise API security & token budget control engine'
    ],
    defaultDeliverables: [
      'Multi-agent state machines with fallback safety loops',
      'Hybrid semantic vector search + BM25 re-ranking pipeline',
      'Evaluation benchmarks for hallucination & latency (<400ms)'
    ]
  },
  {
    id: 'security-sprint',
    title: 'Cybersecurity Penetration Test & Sandbox Defense Sprint',
    subtitle: 'Rigorous black-box and white-box penetration testing for cloud applications and code execution sandboxes.',
    tag: 'Offensive & Defensive Security',
    icon: ShieldAlert,
    estimatedTimeline: '5 - 10 Days',
    deliverables: [
      'API authentication & authorization exploit analysis',
      'Code execution sandbox escape vulnerability assessment',
      'OWASP Top 10 API & web application attack vectors check',
      'Cryptographic key storage & token handling review',
      'Prioritized CVSS-scored patch advisory and triage session'
    ],
    defaultDeliverables: [
      'API authentication & authorization exploit analysis',
      'OWASP Top 10 API & web application attack vectors check',
      'Prioritized CVSS-scored patch advisory and triage session'
    ]
  },
  {
    id: 'institutional-curriculum',
    title: 'Custom Institutional Coding Curriculum & Masterclasses',
    subtitle: 'Tailored high-impact syllabus, lab sheets, and live cohort delivery for universities and enterprise teams.',
    tag: 'Education & Masterclasses',
    icon: BookOpen,
    estimatedTimeline: 'Custom Cohort Timeline',
    deliverables: [
      'Modular 8-12 week syllabus designed for collegiate accreditation',
      'Dockerized auto-graded lab assignments and rubric suite',
      'Live technical masterclasses led by Brandex Fellows',
      'Industry-recognized Brandex verified credential program',
      'Dedicated Discord / Discourse mentor triage channel'
    ],
    defaultDeliverables: [
      'Modular 8-12 week syllabus designed for collegiate accreditation',
      'Dockerized auto-graded lab assignments and rubric suite',
      'Live technical masterclasses led by Brandex Fellows'
    ]
  }
];

const AVAILABLE_SLOTS = [
  { date: 'Oct 02, 2026', time: '10:00 AM - 11:30 AM IST', label: 'Morning Sprint Slot' },
  { date: 'Oct 05, 2026', time: '02:00 PM - 03:30 PM IST', label: 'Afternoon Architecture Review' },
  { date: 'Oct 09, 2026', time: '11:00 AM - 12:30 PM IST', label: 'Technical Scope Discovery' },
  { date: 'Oct 14, 2026', time: '04:00 PM - 05:30 PM IST', label: 'Global Async Handshake' },
  { date: 'Oct 20, 2026', time: '01:00 PM - 02:30 PM IST', label: 'Deep Dive Consultation' }
];

export const ServicesPage: React.FC = () => {
  useSEO(
    'Brandex Enterprise Services & Systems Audits',
    'Book specialized engineering audits, autonomous multi-agent deployments, and institutional masterclasses with zero PII overhead.'
  );

  const identity = getOrCreateIdentity();

  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [selectedTierId, setSelectedTierId] = useState<string>('architecture-audit');
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>(
    SERVICE_TIERS[0].defaultDeliverables
  );
  const [organization, setOrganization] = useState('');
  const [techStack, setTechStack] = useState('');
  const [scopeNotes, setScopeNotes] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(AVAILABLE_SLOTS[0]);
  const [contactHandle, setContactHandle] = useState(identity.handle);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState<{
    id: string;
    status: string;
    isOfflineQueued: boolean;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentTier = SERVICE_TIERS.find((t) => t.id === selectedTierId) || SERVICE_TIERS[0];

  const handleTierSelect = (tier: ServiceTier) => {
    setSelectedTierId(tier.id);
    setSelectedDeliverables(tier.defaultDeliverables);
  };

  const toggleDeliverable = (item: string) => {
    if (selectedDeliverables.includes(item)) {
      if (selectedDeliverables.length > 1) {
        setSelectedDeliverables(selectedDeliverables.filter((d) => d !== item));
      }
    } else {
      setSelectedDeliverables([...selectedDeliverables, item]);
    }
  };

  const validateStep2 = () => {
    if (!organization.trim()) {
      setErrorMsg('Please specify your organization, university, or lab name.');
      return false;
    }
    if (scopeNotes.trim().length < 30) {
      setErrorMsg('Please provide at least 30 characters outlining your project scope and bottlenecks.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (step === 2) {
      if (!validateStep2()) return;
    }
    setErrorMsg('');
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `SRV-2026-${randomSuffix}`;

    const payload = {
      id: generatedId,
      userHandle: contactHandle.trim() || identity.handle,
      serviceTitle: currentTier.title,
      organization: organization.trim(),
      preferredSlot: `${selectedSlot.date} @ ${selectedSlot.time}`,
      scopeNotes: `Tech Stack: ${techStack || 'Unspecified'} | Deliverables: ${selectedDeliverables.join('; ')} | Notes: ${scopeNotes}`
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
      addContributorPoints(40);
      setBookingReceipt({
        id: data.id,
        status: data.status || 'Scheduled',
        isOfflineQueued: false
      });
    } catch (err) {
      // Offline fallback: Queue in IndexedDB for Background Sync
      await queueOfflineAction('booking', '/api/pwa/bookings', payload);
      addContributorPoints(40);
      setBookingReceipt({
        id: generatedId,
        status: 'Offline Queued (Will sync when online)',
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
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-brand-canvas transition-colors pb-24">
      {/* Top Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-md sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Services & Audits' }
            ]}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Service Engine • Zero PII Required</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineering Audits & Institutional Deployments
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Select a specialized engineering sprint. Scope your architectural deliverables and reserve an advisory slot without invasive sign-ups.
          </p>
        </div>

        {/* Wizard Progress Bar */}
        {!bookingReceipt && (
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
              {[
                { num: 1, label: 'Service Tier' },
                { num: 2, label: 'Scope & Stack' },
                { num: 3, label: 'Slot Picker' },
                { num: 4, label: 'Receipt' }
              ].map((s) => (
                <div
                  key={s.num}
                  className={`py-2 px-1 border-b-2 transition-all ${
                    step === s.num
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                      : step > s.num
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <span>Step 0{s.num}: {s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success / Receipt Screen */}
        {bookingReceipt ? (
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm text-center max-w-2xl mx-auto animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Service Booking Request Confirmed
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Your service sprint has been registered in the Brandex Engine. Track your review progress anonymously anytime.
            </p>

            {bookingReceipt.isOfflineQueued && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span>Saved to IndexedDB Offline Queue. Automatic background sync will dispatch once connection is restored.</span>
              </div>
            )}

            <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-left">
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mb-1">
                Deterministic Booking Reference
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {bookingReceipt.id}
                </span>
                <button
                  onClick={copyReceiptId}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Assigned Service:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{currentTier.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Preferred Slot:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{selectedSlot.date}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <NavLink
                to={`/status?id=${bookingReceipt.id}`}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Track Status in Real-Time</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>

              <button
                onClick={() => {
                  setBookingReceipt(null);
                  setStep(1);
                  setScopeNotes('');
                  setOrganization('');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors"
              >
                Book Another Sprint
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* STEP 1: SERVICE TIER SELECTION */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    1. Select Service Sprint & Deliverables
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Choose the audit domain that aligns with your engineering needs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVICE_TIERS.map((tier) => {
                    const Icon = tier.icon;
                    const isSelected = tier.id === selectedTierId;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => handleTierSelect(tier)}
                        className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-4 ring-indigo-500/10'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {tier.estimatedTimeline}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {tier.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                          {tier.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Deliverables Checklist for Current Tier */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Deliverable Scope Checklist ({selectedDeliverables.length} selected)
                    </h4>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      Toggle deliverables to calibrate scope
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentTier.deliverables.map((item) => {
                      const checked = selectedDeliverables.includes(item);
                      return (
                        <label
                          key={item}
                          onClick={() => toggleDeliverable(item)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-colors text-xs sm:text-sm ${
                            checked
                              ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-800 dark:text-slate-200'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-medium">{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SCOPE & TECH STACK */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    2. Technical Scope & System Architecture
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Detail the infrastructure, tech stack, and primary bottlenecks for the audit.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Organization / University / Lab Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Apex Distributed Labs, IIT Madras AI Cell, Nexus FinTech"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Active Tech Stack & Cloud Infrastructure
                    </label>
                    <input
                      type="text"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      placeholder="e.g. Go 1.22, Rust, PostgreSQL, Kubernetes, Redis, AWS us-east-1"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Scope Description & Bottlenecks <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-[11px] font-mono ${scopeNotes.length < 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {scopeNotes.length}/30 characters minimum
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={scopeNotes}
                      onChange={(e) => setScopeNotes(e.target.value)}
                      placeholder="Describe what needs to be audited or built (e.g. High latency during batch transactions, need multi-agent RAG workflow with tool-calling for financial documents, or full code sandbox escape audit)..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LIVE AVAILABILITY SLOT PICKER */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    3. Reserve Live Advisory Slot
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Select a time window for the initial technical discovery briefing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_SLOTS.map((slot, index) => {
                    const isSelected = selectedSlot.date === slot.date && selectedSlot.time === slot.time;
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-4 ring-indigo-500/10'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{slot.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot.time}</span>
                        </div>
                        <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          {slot.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Pseudo-Anonymous Contact Handle / Identifier
                  </label>
                  <input
                    type="text"
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    placeholder={identity.handle}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Zero real name or phone number stored. You can track this booking anytime with your generated <code className="text-indigo-600 dark:text-indigo-400">SRV-</code> receipt.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    4. Confirm Request-a-Quote Handshake
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Review your engineering scope before generating your immutable receipt.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 text-xs uppercase block font-semibold">Service Sprint</span>
                      <span className="font-bold text-slate-900 dark:text-white">{currentTier.title}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase block font-semibold">Organization / Lab</span>
                      <span className="font-bold text-slate-900 dark:text-white">{organization}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase block font-semibold">Discovery Slot</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedSlot.date} ({selectedSlot.time})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase block font-semibold">Applicant Handle</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{contactHandle}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-xs uppercase block font-semibold mb-1">Deliverables In-Scope ({selectedDeliverables.length})</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                      {selectedDeliverables.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-xs uppercase block font-semibold mb-1">Scope Summary</span>
                    <p className="text-slate-700 dark:text-slate-300 text-xs italic bg-white dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      "{scopeNotes}"
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span>
                    Zero payment PII required. Once verified, Brandex leads initiate secure consultation through your private reference portal.
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitBooking}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating SRV Receipt...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      <span>Confirm & Generate Receipt</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
