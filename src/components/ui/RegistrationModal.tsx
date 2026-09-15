import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  User,
  Mail,
  Building2,
  Sliders,
  AlertCircle,
  Code2,
  Users,
  Zap,
  BookOpen,
  Compass,
  Cpu,
  ShieldCheck,
  Palette,
  Layers,
  Check,
  Copy,
  Lightbulb,
  Briefcase,
  ExternalLink,
  Shield,
  Lock
} from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';
import { getOrCreateIdentity, addContributorPoints } from '../../utils/identity';
import { queueOfflineAction } from '../../utils/offlineDb';

export const RegistrationModal: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, type, closeModal } = useRegistration();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [shakeStep, setShakeStep] = useState<boolean>(false);
  const [applicationRefId, setApplicationRefId] = useState<string>('BX-2026-8812');
  const [isOfflineQueued, setIsOfflineQueued] = useState<boolean>(false);

  // Form State - NO PRE-FILLED DEFAULTS! User must actively select every required field.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    otherRoleText: '',
    organization: '',
    selections: [] as string[],
    otherSelectionText: '',
    experienceLevel: '', // Deliberately empty: user MUST select!
    contributions: [] as string[],
    focusAreas: [] as string[],
    otherFocusText: '',
    goals: [] as string[],
    otherGoalText: '',
    projectIdea: '',
  });

  // Touched & Error tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Community Guilds context
  const pageTitle = 'Join Brandex Community Circles';
  const pageDesc = 'Apply to join high-impact builder circles, weekly coding labs, and hackathon squads.';

  // Domain circle options with icons & descriptions
  const domainOptions = [
    {
      id: 'Artificial Intelligence',
      title: 'Artificial Intelligence Circle',
      desc: 'LLMs, autonomous agents, computer vision, and neural architecture.',
      icon: Cpu,
      badge: 'Active Labs',
    },
    {
      id: 'Cybersecurity & Defense',
      title: 'Cybersecurity & Defense Circle',
      desc: 'Offensive security, ethical hacking, CTF competitions & sandboxes.',
      icon: ShieldCheck,
      badge: 'Weekly CTFs',
    },
    {
      id: 'Distributed Systems',
      title: 'Distributed Systems Circle',
      desc: 'Low-level concurrency, cloud-native infra, Go/Rust high-throughput engines.',
      icon: Layers,
      badge: 'Systems Code',
    },
    {
      id: 'Swiss Editorial UX & Design',
      title: 'Swiss Editorial UX & Design',
      desc: 'Modern web aesthetics, micro-interactions, accessible design systems.',
      icon: Palette,
      badge: 'Visual Craft',
    },
    {
      id: 'Other',
      title: 'Other Domain / Custom',
      desc: 'Propose a custom research interest or cross-disciplinary initiative.',
      icon: Sliders,
      badge: 'Custom',
    },
  ];

  // Community Contribution Roles ("What will you bring to the community?")
  const contributionRoles = [
    {
      id: 'Open Source Builder',
      title: 'Open Source Builder & Hacker',
      role: 'Code & Tools',
      desc: 'Ship functional code, publish starter repos, and build public tools with peer circles.',
      icon: Code2,
    },
    {
      id: 'Peer Mentorship',
      title: 'Peer Support & Knowledge Sharing',
      role: 'Collaboration',
      desc: 'Assist teammates during coding labs, debug tricky issues, and share weekly research notes.',
      icon: Users,
    },
    {
      id: 'Hackathons & Sprints',
      title: 'Hackathons & CTF Teaming',
      role: 'Competitions',
      desc: 'Form or join fast squads for 48h hackathons, builder showdowns, and CTF challenges.',
      icon: Zap,
    },
    {
      id: 'Research & Tech Talks',
      title: 'Research Papers & Tech Talks',
      role: 'Deep-Dives',
      desc: 'Lead paper breakdown sessions on modern LLMs, distributed consensus, or security audits.',
      icon: BookOpen,
    },
    {
      id: 'Campus / Circle Ambassador',
      title: 'Campus / Circle Ambassador',
      role: 'Leadership',
      desc: 'Organize local study groups, campus workshops, and bridge student talent.',
      icon: Compass,
    },
    {
      id: 'Other / Custom',
      title: 'Specialized Contributor',
      role: 'Custom Value',
      desc: 'Offer cross-functional expertise like technical writing, UI design, or venture building.',
      icon: Sliders,
    },
  ];

  // Role options for candidate profile with "Other"
  const roleOptions = [
    'Student / Undergraduate',
    'Software Engineer',
    'AI / ML Researcher',
    'Product / UI Designer',
    'Security Analyst',
    'Founder / Builder',
    'Other',
  ];

  // Focus topic tags with "Other Topic"
  const focusPills = [
    'Autonomous AI Agents & RAG',
    'Distributed Systems & Rust/Go',
    'Penetration Testing & Defense',
    'Swiss Editorial UI & Design Systems',
    'Cloud-Native Infra & Edge',
    'Web3 Protocols & Cryptography',
    'Other Topic',
  ];

  // Quick Inspiration starter chips for project idea
  const projectInspirations = [
    'Build an autonomous LLM code-review agent for GitHub PRs',
    'Implement a high-throughput distributed key-value store in Go',
    'Design an ultra-minimal Swiss design component system',
    'Team up for the upcoming cybersecurity CTF defense tournament',
  ];

  // Real-time completion validation helpers
  const isStep1Complete = Boolean(
    formData.name.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
    formData.role &&
    (formData.role !== 'Other' || formData.otherRoleText.trim().length >= 2) &&
    formData.organization.trim().length >= 2
  );

  const isStep2Complete = Boolean(
    formData.selections.length > 0 &&
    (!formData.selections.includes('Other') || formData.otherSelectionText.trim().length >= 2)
  );

  const isStep3Complete = Boolean(formData.experienceLevel);

  const hasContribution = Boolean(
    formData.contributions.length > 0 &&
    (!formData.contributions.includes('Other / Custom') || formData.otherGoalText.trim().length >= 3)
  );

  const hasFocus = Boolean(
    formData.focusAreas.length > 0 &&
    (!formData.focusAreas.includes('Other Topic') || formData.otherFocusText.trim().length >= 2)
  );

  const hasProjectIdea = Boolean(formData.projectIdea.trim().length >= 20);

  const isStep4Complete = Boolean(hasContribution && hasFocus && hasProjectIdea);

  // Reset form when opened or type changed
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMsg('');
      setErrors({});
      setTouched({});
      setIsSuccess(false);
    }
  }, [type, isOpen]);

  if (!isOpen || type !== 'community') return null;

  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const markTouched = (fields: string[]) => {
    setTouched((prev) => {
      const next = { ...prev };
      fields.forEach((f) => {
        next[f] = true;
      });
      return next;
    });
  };

  // Rigorous validation logic per step:
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required to proceed.';
      } else if (formData.name.trim().length < 3) {
        newErrors.name = 'Please provide your full legal or professional name (min 3 characters).';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Please provide a valid email address (e.g. name@university.edu).';
      }

      if (!formData.role.trim()) {
        newErrors.role = 'Please select your primary role or background.';
      } else if (formData.role === 'Other' && !formData.otherRoleText.trim()) {
        newErrors.otherRoleText = 'Please specify your role / background.';
      }

      if (!formData.organization.trim()) {
        newErrors.organization = 'Please enter your college, school, or organization.';
      } else if (formData.organization.trim().length < 2) {
        newErrors.organization = 'Please provide a valid institution name.';
      }
    }

    if (currentStep === 2) {
      if (formData.selections.length === 0) {
        newErrors.selections = 'Please select at least one domain circle to participate in.';
      }
      if (formData.selections.includes('Other') && !formData.otherSelectionText.trim()) {
        newErrors.otherSelectionText = 'Please describe your custom domain or track.';
      }
    }

    if (currentStep === 3) {
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = 'Please actively select your engineering experience level.';
      }
    }

    if (currentStep === 4) {
      if (formData.contributions.length === 0) {
        newErrors.contributions = 'Please choose at least one way you plan to contribute to the community.';
      }

      if (formData.focusAreas.length === 0) {
        newErrors.focusAreas = 'Please pick at least one focus topic tag.';
      } else if (formData.focusAreas.includes('Other Topic') && !formData.otherFocusText.trim()) {
        newErrors.otherFocusText = 'Please specify your custom focus topic.';
      }

      if (!formData.projectIdea.trim()) {
        newErrors.projectIdea = 'Please write at least 20 characters explaining what you want to build or achieve.';
      } else if (formData.projectIdea.trim().length < 20) {
        newErrors.projectIdea = `Please provide a bit more detail (${formData.projectIdea.trim().length}/20 characters minimum).`;
      }

      if (formData.contributions.includes('Other / Custom') && !formData.otherGoalText.trim()) {
        newErrors.otherGoalText = 'Please provide details on your specialized contribution.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Mark fields touched
    if (step === 1) markTouched(['name', 'email', 'role', 'otherRoleText', 'organization']);
    if (step === 2) markTouched(['selections', 'otherSelectionText']);
    if (step === 3) markTouched(['experienceLevel']);
    if (step === 4) markTouched(['contributions', 'focusAreas', 'otherFocusText', 'projectIdea', 'otherGoalText']);

    const isValid = validateStep(step);
    if (!isValid) {
      setErrorMsg('Please complete all required fields on this section before proceeding.');
      setShakeStep(true);
      setTimeout(() => setShakeStep(false), 500);
      return;
    }

    setErrorMsg('');
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markTouched(['contributions', 'focusAreas', 'otherFocusText', 'projectIdea', 'otherGoalText']);

    const isValid = validateStep(4);
    if (!isValid || !isStep4Complete) {
      setErrorMsg('Please complete all required questions before submitting your application.');
      setShakeStep(true);
      setTimeout(() => setShakeStep(false), 500);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRefId = `BX-COMM-${randomSuffix}`;
    const identity = getOrCreateIdentity();

    const payload = {
      id: newRefId,
      userHandle: formData.name ? `@${formData.name.toLowerCase().replace(/[^a-z0-9_]/g, '')}` : identity.handle,
      type: 'community',
      domains: formData.selections.length > 0 ? formData.selections : ['Artificial Intelligence'],
      experienceLevel: formData.experienceLevel || 'Intermediate',
      contributions: formData.contributions,
      projectIdea: formData.projectIdea || 'Brandex Open Ecosystem Contribution'
    };

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }

      const res = await fetch('/api/pwa/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      setIsOfflineQueued(false);
    } catch {
      // Offline fallback: Queue in IndexedDB
      await queueOfflineAction('application', '/api/pwa/applications', payload);
      setIsOfflineQueued(true);
    } finally {
      setApplicationRefId(newRefId);
      try {
        const existing = JSON.parse(localStorage.getItem('brandex_recent_refs') || '[]');
        const updated = Array.from(new Set([newRefId, ...existing])).slice(0, 5);
        localStorage.setItem('brandex_recent_refs', JSON.stringify(updated));
      } catch {}
      addContributorPoints(100);
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const toggleSelection = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selections.includes(id);
      const updated = exists ? prev.selections.filter((s) => s !== id) : [...prev.selections, id];
      return { ...prev, selections: updated };
    });
    if (errors.selections) {
      setErrors((prev) => ({ ...prev, selections: '' }));
    }
  };

  const toggleContribution = (id: string) => {
    setFormData((prev) => {
      const exists = prev.contributions.includes(id);
      const updated = exists ? prev.contributions.filter((c) => c !== id) : [...prev.contributions, id];
      return { ...prev, contributions: updated };
    });
    if (errors.contributions) {
      setErrors((prev) => ({ ...prev, contributions: '' }));
    }
  };

  const toggleFocusPill = (pill: string) => {
    setFormData((prev) => {
      const exists = prev.focusAreas.includes(pill);
      const updated = exists ? prev.focusAreas.filter((p) => p !== pill) : [...prev.focusAreas, pill];
      return { ...prev, focusAreas: updated };
    });
    if (errors.focusAreas) {
      setErrors((prev) => ({ ...prev, focusAreas: '' }));
    }
  };

  const resetForm = () => {
    setStep(1);
    setIsSuccess(false);
    setErrorMsg('');
    setErrors({});
    setTouched({});
    setFormData({
      name: '',
      email: '',
      role: '',
      otherRoleText: '',
      organization: '',
      selections: [],
      otherSelectionText: '',
      experienceLevel: '',
      contributions: [],
      focusAreas: [],
      otherFocusText: '',
      goals: [],
      otherGoalText: '',
      projectIdea: '',
    });
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(applicationRefId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans overflow-hidden transform-gpu"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full h-[100dvh] md:h-[92vh] md:max-h-[850px] md:max-w-5xl bg-white dark:bg-slate-900 md:rounded-3xl shadow-2xl border-0 md:border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden animate-slide-up transition-all ${
          shakeStep ? 'animate-shake' : ''
        }`}
      >
        {/* ========================================================================= */}
        {/* DESKTOP SIDEBAR: Clean, persistent overview without covering the form */}
        {/* ========================================================================= */}
        <div className="hidden md:flex flex-col w-72 lg:w-80 bg-slate-900 text-white p-6 lg:p-8 border-r border-slate-800 shrink-0 justify-between relative overflow-hidden">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Sidebar Top: Logo & Title */}
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-[11px] font-bold rounded-full tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active 2026 Admissions</span>
              </span>
              <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight leading-snug">
                {pageTitle}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {pageDesc}
              </p>
            </div>

            {/* Step Progress Timeline */}
            {!isSuccess && (
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Application Steps
                </div>
                <div className="space-y-2">
                  {[
                    { num: 1, label: 'Candidate Profile', desc: 'Identity & contact' },
                    { num: 2, label: 'Technology Circles', desc: 'Domain areas' },
                    { num: 3, label: 'Experience Level', desc: 'Engineering background' },
                    { num: 4, label: 'Contributions & Build', desc: 'Intent & project' },
                  ].map((s) => {
                    const isDone = step > s.num;
                    const isCurrent = step === s.num;
                    return (
                      <button
                        key={s.num}
                        type="button"
                        disabled={s.num > step}
                        onClick={() => s.num < step && setStep(s.num)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                          isCurrent
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                            : isDone
                            ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 cursor-pointer'
                            : 'opacity-40 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-white text-indigo-600'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate leading-tight">
                            {s.label}
                          </div>
                          <div className="text-[10px] text-slate-300/80 truncate">
                            {s.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Real-time Pass Preview Card */}
            {!isSuccess && formData.name.trim() && (
              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-1.5 text-xs animate-fade-in">
                <div className="text-[10px] uppercase font-bold text-slate-400">Live Application Pass</div>
                <div className="font-bold text-white truncate">{formData.name}</div>
                <div className="text-[11px] text-indigo-300 flex items-center justify-between">
                  <span>{formData.role === 'Other' ? (formData.otherRoleText || 'Other') : (formData.role || 'Role pending')}</span>
                  <span>{formData.selections.length} circle{formData.selections.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Bottom: Status check link & info */}
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2 relative z-10">
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate('/status');
              }}
              className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1 font-semibold text-slate-300"
            >
              <span>Track Existing Application</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Brandex Onboarding Gateway</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT MAIN AREA: Slim minimal header + scrollable content + bottom actions */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden relative">
          
          {/* SLIM TOP BAR (Only 56px! Never covers the content) */}
          <div className="h-14 sm:h-16 px-4 sm:px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="md:hidden text-[11px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-800">
                Step 0{step}/04
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white truncate">
                  {step === 1 && '01. Candidate Identity & Profile'}
                  {step === 2 && '02. Domain Circles of Interest'}
                  {step === 3 && '03. Engineering Experience Level'}
                  {step === 4 && '04. What Will You Bring & Build?'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                  {step === 1 && 'Please fill in your primary details carefully.'}
                  {step === 2 && 'Select at least one technology area to explore.'}
                  {step === 3 && 'Choose your skill tier to guide squad placement.'}
                  {step === 4 && 'Tell us about your contributions, vision, and project ideas.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  navigate('/status');
                }}
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 px-3 py-1.5 rounded-xl transition-all shadow-xs hover:shadow-sm inline-flex items-center gap-1.5 active:scale-95"
              >
                <span>Check Status</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>
              <button
                onClick={handleClose}
                aria-label="Close form"
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full transition-all active:scale-95"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Minimal 2px Progress Bar directly under header */}
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* SCROLLABLE FORM BODY (Maximal height available!) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Error Alert Banner if validation fails */}
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="flex-1">{errorMsg}</div>
                </div>
              )}

              {isSuccess ? (
                /* Success View */
                <div className="py-6 sm:py-12 text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                      Application Verified & Queued
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                      Welcome aboard, {formData.name.split(' ')[0]}!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      Your application has been verified and registered. We have queued your onboarding packet to be sent to{' '}
                      <strong className="text-slate-900 dark:text-slate-200 font-semibold">{formData.email}</strong>.
                    </p>
                  </div>

                  {/* Application Reference Code Card */}
                  <div className="p-4 sm:p-5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl max-w-md mx-auto text-left space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
                        Tracking Reference ID
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyRef}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                      >
                        {copiedRef ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white tracking-wide">
                      {applicationRefId}
                    </div>
                    {isOfflineQueued && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        (Offline: Queued locally in IndexedDB, will sync automatically when online)
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Save this reference ID. You can check admission and circle review status anytime on our application tracker.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 text-sm font-semibold">
                    <NavLink
                      to={`/status?id=${applicationRefId}`}
                      onClick={handleClose}
                      className="btn-primary w-full sm:w-auto justify-center px-6 py-3"
                    >
                      <span>Track Application Status</span>
                      <ArrowRight className="w-4 h-4" />
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn-secondary w-full sm:w-auto justify-center px-6 py-3"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                /* Step-by-Step Form Container */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* STEP 1: Basic Information */}
                  {step === 1 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Candidate Details
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          All fields marked with <span className="text-rose-500 font-bold">*</span> are required for committee review.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                              Full Name <span className="text-rose-500">*</span>
                            </label>
                            {touched.name && errors.name ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-full">
                                <AlertCircle className="w-3 h-3" /> Missing
                              </span>
                            ) : touched.name && formData.name.trim().length >= 3 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" /> Complete
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Required</span>
                            )}
                          </div>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={formData.name}
                              onBlur={() => {
                                markTouched(['name']);
                                validateStep(1);
                              }}
                              onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                              }}
                              placeholder="e.g. Maya Lin"
                              className={`w-full pl-10 pr-10 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.name && errors.name
                                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 dark:text-rose-200 ring-4 ring-rose-500/10'
                                  : touched.name && formData.name.trim().length >= 3
                                  ? 'bg-white dark:bg-slate-800 border-2 border-emerald-500/60 text-slate-900 dark:text-white'
                                  : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10'
                              }`}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                              {touched.name && errors.name && (
                                <AlertCircle className="w-4 h-4 text-rose-500" />
                              )}
                              {touched.name && !errors.name && formData.name.trim().length >= 3 && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                          </div>
                          {touched.name && errors.name && (
                            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.name}</span>
                            </p>
                          )}
                        </div>

                        {/* Email Address */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                              Email Address <span className="text-rose-500">*</span>
                            </label>
                            {touched.email && errors.email ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-full">
                                <AlertCircle className="w-3 h-3" /> Missing
                              </span>
                            ) : touched.email && formData.email.trim() && !errors.email ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" /> Valid
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Required</span>
                            )}
                          </div>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              value={formData.email}
                              onBlur={() => {
                                markTouched(['email']);
                                validateStep(1);
                              }}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                              }}
                              placeholder="maya@example.org"
                              className={`w-full pl-10 pr-10 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.email && errors.email
                                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 dark:text-rose-200 ring-4 ring-rose-500/10'
                                  : touched.email && formData.email.trim() && !errors.email
                                  ? 'bg-white dark:bg-slate-800 border-2 border-emerald-500/60 text-slate-900 dark:text-white'
                                  : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10'
                              }`}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                              {touched.email && errors.email && (
                                <AlertCircle className="w-4 h-4 text-rose-500" />
                              )}
                              {touched.email && !errors.email && formData.email.trim() && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                          </div>
                          {touched.email && errors.email && (
                            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.email}</span>
                            </p>
                          )}
                        </div>

                        {/* Primary Role Selector with "Other" and Typeable Input */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                              Primary Background / Role <span className="text-rose-500">*</span>
                            </label>
                            {touched.role && errors.role ? (
                              <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Select one
                              </span>
                            ) : formData.role ? (
                              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Required</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {roleOptions.map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, role: r });
                                  if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
                                }}
                                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                                  formData.role === r
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-400 shadow-xs ring-2 ring-indigo-500/20'
                                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                                }`}
                              >
                                <span>{r}</span>
                                {formData.role === r && <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                              </button>
                            ))}
                          </div>
                          {touched.role && errors.role && (
                            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{errors.role}</span>
                            </p>
                          )}

                          {/* "Other" Role Typeable Input Field */}
                          {formData.role === 'Other' && (
                            <div className="pt-2.5 animate-fade-in">
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                                  Specify Your Primary Role / Title <span className="text-rose-500">*</span>
                                </label>
                                {touched.otherRoleText && errors.otherRoleText && (
                                  <span className="text-[11px] font-semibold text-rose-600">Required</span>
                                )}
                              </div>
                              <input
                                type="text"
                                value={formData.otherRoleText}
                                onBlur={() => markTouched(['otherRoleText'])}
                                onChange={(e) => {
                                  setFormData({ ...formData, otherRoleText: e.target.value });
                                  if (errors.otherRoleText) setErrors((prev) => ({ ...prev, otherRoleText: '' }));
                                }}
                                placeholder="e.g. Data Scientist, DevOps Engineer, High Schooler, Educator..."
                                className={`w-full p-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                  touched.otherRoleText && errors.otherRoleText
                                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10'
                                }`}
                              />
                              {touched.otherRoleText && errors.otherRoleText && (
                                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{errors.otherRoleText}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* University / School / Organization */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                              University / School / Company <span className="text-rose-500">*</span>
                            </label>
                            {touched.organization && errors.organization && (
                              <span className="text-[11px] font-semibold text-rose-600">Missing</span>
                            )}
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={formData.organization}
                              onBlur={() => {
                                markTouched(['organization']);
                                validateStep(1);
                              }}
                              onChange={(e) => {
                                setFormData({ ...formData, organization: e.target.value });
                                if (errors.organization) setErrors((prev) => ({ ...prev, organization: '' }));
                              }}
                              placeholder="e.g. National Institute of Tech / Startup Lab"
                              className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.organization && errors.organization
                                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                                  : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10'
                              }`}
                            />
                          </div>
                          {touched.organization && errors.organization && (
                            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{errors.organization}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Selections (Domains of Interest) */}
                  {step === 2 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                            Select Domain Circles
                          </h4>
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900">
                            {formData.selections.length} selected
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Choose the technical areas you want to actively participate in (must select at least one).
                        </p>
                      </div>

                      {/* Missing selection warning */}
                      {touched.selections && errors.selections && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                          <span>{errors.selections}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {domainOptions.map((opt) => {
                          const isSelected = formData.selections.includes(opt.id);
                          const Icon = opt.icon;
                          return (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => toggleSelection(opt.id)}
                              className={`p-4 text-left rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                                isSelected
                                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 border border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                    {opt.badge}
                                  </span>
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div
                                  className={`font-display font-bold text-sm leading-tight ${
                                    isSelected
                                      ? 'text-indigo-950 dark:text-white'
                                      : 'text-slate-900 dark:text-slate-100'
                                  }`}
                                >
                                  {opt.title}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                  {opt.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Dynamic Text Input for "Other" Domain */}
                      {formData.selections.includes('Other') && (
                        <div className="pt-2 animate-fade-in">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                              Specify Your Specific Domain / Topic <span className="text-rose-500">*</span>
                            </label>
                            {touched.otherSelectionText && errors.otherSelectionText && (
                              <span className="text-[11px] font-semibold text-rose-600">Missing</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={formData.otherSelectionText}
                            onChange={(e) => {
                              setFormData({ ...formData, otherSelectionText: e.target.value });
                              if (errors.otherSelectionText) {
                                setErrors((prev) => ({ ...prev, otherSelectionText: '' }));
                              }
                            }}
                            placeholder="e.g. Embedded Rust, Quantum Logic, High-Frequency Systems..."
                            className={`w-full p-3.5 rounded-xl text-sm transition-all focus:outline-none ${
                              touched.otherSelectionText && errors.otherSelectionText
                                ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                                : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                            }`}
                          />
                          {touched.otherSelectionText && errors.otherSelectionText && (
                            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.otherSelectionText}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3: Experience Level (Deliberately empty initially!) */}
                  {step === 3 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Select Your Engineering Experience
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          You must actively choose one tier. This determines peer group pairing and lab difficulty.
                        </p>
                      </div>

                      {touched.experienceLevel && errors.experienceLevel && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                          <span>{errors.experienceLevel}</span>
                        </div>
                      )}

                      <div className="space-y-3">
                        {[
                          {
                            level: 'Beginner',
                            bars: 1,
                            tag: 'Foundational Builder',
                            desc: 'Starting out in technology coding or design. Looking for structured labs, mentor reviews, and fundamentals.',
                          },
                          {
                            level: 'Intermediate',
                            bars: 2,
                            tag: 'Active Developer',
                            desc: 'Hands-on builder with 1-3 years experience writing production code, building apps, or deploying servers.',
                          },
                          {
                            level: 'Advanced',
                            bars: 3,
                            tag: 'Senior / Specialist',
                            desc: 'Senior engineer, architect, team lead, or published researcher. Looking to mentor and tackle hard systems.',
                          },
                        ].map((item) => {
                          const isSelected = formData.experienceLevel === item.level;
                          return (
                            <button
                              type="button"
                              key={item.level}
                              onClick={() => {
                                setFormData({ ...formData, experienceLevel: item.level });
                                if (errors.experienceLevel) {
                                  setErrors((prev) => ({ ...prev, experienceLevel: '' }));
                                }
                              }}
                              className={`w-full p-4.5 sm:p-5 text-left border rounded-2xl transition-all duration-200 flex items-center justify-between gap-4 group ${
                                isSelected
                                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-display font-bold text-base ${
                                      isSelected
                                        ? 'text-indigo-950 dark:text-white'
                                        : 'text-slate-900 dark:text-slate-100'
                                    }`}
                                  >
                                    {item.level}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                    {item.tag}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {[1, 2, 3].map((b) => (
                                  <div
                                    key={b}
                                    className={`w-2 h-6 rounded-full transition-all ${
                                      b <= item.bars
                                        ? isSelected
                                          ? 'bg-indigo-600 dark:bg-indigo-400'
                                          : 'bg-slate-400 dark:bg-slate-600'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                                  />
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Contributions & Questions ("What will you bring & build?") */}
                  {step === 4 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          What Will You Bring & Build?
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Brandex circles are high-agency working squads. Please answer all 3 questions below to unlock submission.
                        </p>
                      </div>

                      {/* Question 1: What will you bring to the community? */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                            <span>Q1. What will you bring to the community?</span>
                            <span className="text-rose-500">*</span>
                          </label>
                          {hasContribution ? (
                            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Answered
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Select at least one</span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {contributionRoles.map((role) => {
                            const isSelected = formData.contributions.includes(role.id);
                            const Icon = role.icon;
                            return (
                              <button
                                type="button"
                                key={role.id}
                                onClick={() => toggleContribution(role.id)}
                                className={`p-3.5 sm:p-4 text-left rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {role.role}
                                  </div>
                                  <div
                                    className={`font-display font-bold text-sm leading-tight ${
                                      isSelected
                                        ? 'text-indigo-950 dark:text-white'
                                        : 'text-slate-900 dark:text-slate-100'
                                    }`}
                                  >
                                    {role.title}
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                    {role.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* "Other / Custom" Contribution Typeable Input */}
                        {formData.contributions.includes('Other / Custom') && (
                          <div className="pt-2 animate-fade-in">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                              Please describe your specialized contribution: <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.otherGoalText}
                              onChange={(e) => {
                                setFormData({ ...formData, otherGoalText: e.target.value });
                                if (errors.otherGoalText) setErrors((prev) => ({ ...prev, otherGoalText: '' }));
                              }}
                              placeholder="e.g. Hosting weekend study circles, reviewing systems PRs, hardware integration..."
                              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Question 2: Interactive Focus Tags with "Other Topic" Typeable Input */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                            <span>Q2. What will you focus on mastering or building?</span>
                            <span className="text-rose-500">*</span>
                          </label>
                          {hasFocus ? (
                            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Answered
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Select at least 1</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {focusPills.map((pill) => {
                            const isPicked = formData.focusAreas.includes(pill);
                            return (
                              <button
                                key={pill}
                                type="button"
                                onClick={() => toggleFocusPill(pill)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                  isPicked
                                    ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-600/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                              >
                                <span>{pill}</span>
                                {isPicked && <Check className="w-3 h-3" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* "Other Topic" Custom Typeable Input */}
                        {formData.focusAreas.includes('Other Topic') && (
                          <div className="pt-2 animate-fade-in">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1">
                              Specify Custom Focus Topic <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.otherFocusText}
                              onChange={(e) => {
                                setFormData({ ...formData, otherFocusText: e.target.value });
                                if (errors.otherFocusText) setErrors((p) => ({ ...p, otherFocusText: '' }));
                              }}
                              placeholder="e.g. Compiler Engineering, Embedded Firmware, Quant Trading Engines..."
                              className="w-full p-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                            />
                          </div>
                        )}
                      </div>

                      {/* Question 3: Interactive Project Idea - Requires at least 20 chars! */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span>Q3. What will you build next? (Your Vision or Project Idea)</span>
                            <span className="text-rose-500">*</span>
                          </label>
                          <span
                            className={`text-[11px] font-mono font-bold ${
                              hasProjectIdea
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {formData.projectIdea.trim().length}/400 (min 20)
                          </span>
                        </div>

                        {/* Starter inspiration prompts */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            Inspiration prompts (Click to insert starter idea):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {projectInspirations.map((idea, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, projectIdea: idea });
                                  if (errors.projectIdea) setErrors((prev) => ({ ...prev, projectIdea: '' }));
                                }}
                                className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors text-left"
                              >
                                💡 {idea}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            rows={3}
                            maxLength={400}
                            value={formData.projectIdea}
                            onBlur={() => {
                              markTouched(['projectIdea']);
                              validateStep(4);
                            }}
                            onChange={(e) => {
                              setFormData({ ...formData, projectIdea: e.target.value });
                              if (errors.projectIdea && e.target.value.trim().length >= 20) {
                                setErrors((prev) => ({ ...prev, projectIdea: '' }));
                              }
                            }}
                            placeholder="Share the project, open-source tool, research paper, or coding challenge you are looking forward to building with Brandex..."
                            className={`w-full p-3.5 rounded-xl text-base sm:text-sm resize-none transition-all focus:outline-none ${
                              touched.projectIdea && errors.projectIdea
                                ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                                : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10'
                            }`}
                          />
                        </div>
                        {touched.projectIdea && errors.projectIdea && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.projectIdea}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* BOTTOM ACTION BAR (Strictly gate buttons until completed) */}
                  <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-2">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="btn-secondary px-4 sm:px-5 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleClose}
                          className="btn-secondary px-4 py-2.5 text-xs text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      )}

                      {/* Live Question Completion Indicator */}
                      {step === 4 && (
                        <div>
                          {!isStep4Complete ? (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-2.5 py-1 rounded-lg text-[11px]">
                              <Lock className="w-3 h-3 shrink-0" />
                              <span>Answer all questions ({[hasContribution, hasFocus, hasProjectIdea].filter(Boolean).length}/3)</span>
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 rounded-lg text-[11px]">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              <span>Ready to Submit</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-auto">
                      {step < 4 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={
                            (step === 1 && !isStep1Complete) ||
                            (step === 2 && !isStep2Complete) ||
                            (step === 3 && !isStep3Complete)
                          }
                          className={`btn-primary px-5 sm:px-6 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all ${
                            ((step === 1 && !isStep1Complete) ||
                             (step === 2 && !isStep2Complete) ||
                             (step === 3 && !isStep3Complete))
                              ? 'opacity-40 cursor-not-allowed bg-slate-300 dark:bg-slate-800 text-slate-500 shadow-none hover:translate-y-0 active:scale-100 pointer-events-none'
                              : 'shadow-sm hover:shadow-indigo-500/20'
                          }`}
                        >
                          <span>Continue to Step 0{step + 1}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={!isStep4Complete || isSubmitting}
                          className={`btn-primary px-6 sm:px-8 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all ${
                            !isStep4Complete || isSubmitting
                              ? 'opacity-40 cursor-not-allowed bg-slate-300 dark:bg-slate-800 text-slate-500 shadow-none hover:translate-y-0 active:scale-100 pointer-events-none'
                              : 'shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Submitting Application...</span>
                            </>
                          ) : (
                            <>
                              {!isStep4Complete && <Lock className="w-3.5 h-3.5" />}
                              <span>Submit Application</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
