import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Check,
  Copy,
  AlertCircle,
  ExternalLink,
  Code2,
  Compass,
  Cpu,
  ShieldCheck,
  Layers,
  Palette,
  Shield
} from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';
import { queueOfflineAction } from '../../utils/offlineDb';

export const CohortEnrollmentModal: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, type, modalData, closeModal } = useRegistration();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [shakeStep, setShakeStep] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');

  const cohortPrograms = [
    {
      id: 'AI Engineering Cohort',
      title: 'AI Engineering & Autonomous Agents Cohort',
      duration: '8 Weeks Intensive',
      level: 'Transformers, RAG & Agents',
      icon: Cpu,
      badge: 'Live Mentorship',
    },
    {
      id: 'Cybersecurity Foundation',
      title: 'Offensive Security & Network Defense Lab',
      duration: '6 Weeks Hands-on',
      level: 'CTF Sandboxes & Hardening',
      icon: ShieldCheck,
      badge: 'Active CTFs',
    },
    {
      id: 'Advanced System Design',
      title: 'High-Concurrency Distributed Systems (Go/Rust)',
      duration: '10 Weeks Track',
      level: 'Distributed Consensus & Concurrency',
      icon: Layers,
      badge: 'Production Code',
    },
    {
      id: 'UX/UI Mastery',
      title: 'Swiss Editorial UX/UI & Ergonomic Systems',
      duration: '4 Weeks Build Track',
      level: 'Micro-Interactions & Aesthetics',
      icon: Palette,
      badge: 'Design Sprint',
    },
    {
      id: 'Hands-on Workshops',
      title: 'Hands-on Weekend Buildathon & Masterclass',
      duration: 'Weekend Sprint',
      level: 'Live Code Reviews & Teardowns',
      icon: BookOpen,
      badge: 'Fast Track',
    },
  ];

  const batchSchedules = [
    {
      id: 'weekend_bootcamp',
      label: 'Weekend Intensive Bootcamp',
      timing: 'Sat & Sun (10:00 AM – 2:00 PM IST)',
      desc: 'Ideal for university students and working developers.',
    },
    {
      id: 'weekday_evening',
      label: 'Weekday Evening Cohort',
      timing: 'Tue & Thu (7:00 PM – 9:30 PM IST)',
      desc: 'Live instructor teardowns, pair debugging, and architecture labs.',
    },
    {
      id: 'self_paced_mentored',
      label: 'Self-Paced with 1-on-1 Office Hours',
      timing: 'Flexible schedule + Weekly Mentor Sync',
      desc: 'Async modular curriculum with direct mentor code review.',
    },
  ];

  const proficiencyLevels = [
    {
      id: 'Beginner',
      title: 'Beginner / Foundations',
      desc: 'Familiar with basic syntax (Python/JS/C++), ready to build hands-on applications.',
    },
    {
      id: 'Intermediate',
      title: 'Intermediate Builder',
      desc: 'Shipped fullstack apps, comfortable with Git, APIs, databases, and Docker.',
    },
    {
      id: 'Advanced',
      title: 'Advanced / Production Engineer',
      desc: 'Professional software engineer or architect looking to master deep specialization.',
    },
  ];

  const careerOutcomes = [
    {
      id: 'Job Placement',
      title: 'Job Placement & Engineering Roles',
      desc: 'Build high-caliber production repos to crack top engineering interviews.',
    },
    {
      id: 'Research Thesis',
      title: 'University Research & Thesis Mentorship',
      desc: 'Author technical research papers and open-source benchmark implementations.',
    },
    {
      id: 'Startup Prototyping',
      title: 'Startup & Commercial Product Build',
      desc: 'Rapidly architect and launch scalable MVP infrastructure.',
    },
    {
      id: 'Workplace Upskilling',
      title: 'Career Advancement & Lead Promotion',
      desc: 'Master concurrency, system design, and AI agent engineering for career growth.',
    },
  ];

  const [formData, setFormData] = useState({
    // Step 1: Candidate Profile
    name: '',
    email: '',
    phone: '',
    organization: '',
    majorOrRole: '',
    // Step 2: Course & Batch
    selectedProgram: cohortPrograms[0].title,
    selectedBatch: batchSchedules[0].label,
    // Step 3: Proficiency Level
    proficiency: 'Intermediate Builder',
    // Step 4: Outcome & Vision
    targetOutcome: 'Job Placement & Engineering Roles',
    githubOrPortfolio: '',
    specificGoalNote: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (modalData?.program) {
      setFormData((prev) => ({ ...prev, selectedProgram: modalData.program || prev.selectedProgram }));
    }
  }, [modalData]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMsg('');
      setErrors({});
      setTouched({});
      setIsSuccess(false);
    }
  }, [type, isOpen]);

  if (!isOpen || type !== 'enroll') return null;

  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      setErrorMsg('');
      setErrors({});
      setTouched({});
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

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required to proceed.';
      } else if (formData.name.trim().length < 3) {
        newErrors.name = 'Please enter your full legal or professional name (min 3 characters).';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required for syllabus access.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Please provide a valid email address.';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone / WhatsApp number is required for cohort updates.';
      } else if (formData.phone.trim().length < 8) {
        newErrors.phone = 'Please provide a valid contact number.';
      }

      if (!formData.organization.trim()) {
        newErrors.organization = 'Please enter your university, college, or current company.';
      }
    }

    if (currentStep === 2) {
      if (!formData.selectedProgram) {
        newErrors.selectedProgram = 'Please select a training program.';
      }
      if (!formData.selectedBatch) {
        newErrors.selectedBatch = 'Please select a preferred cohort schedule.';
      }
    }

    if (currentStep === 3) {
      if (!formData.proficiency) {
        newErrors.proficiency = 'Please select your current coding proficiency.';
      }
    }

    if (currentStep === 4) {
      if (!formData.targetOutcome) {
        newErrors.targetOutcome = 'Please select your primary career outcome.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) markTouched(['name', 'email', 'phone', 'organization']);
    if (step === 2) markTouched(['selectedProgram', 'selectedBatch']);
    if (step === 3) markTouched(['proficiency']);
    if (step === 4) markTouched(['targetOutcome']);

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
    markTouched(['targetOutcome']);

    const isValid = validateStep(4);
    if (!isValid) {
      setErrorMsg('Please complete all required questions before submitting your enrollment.');
      setShakeStep(true);
      setTimeout(() => setShakeStep(false), 500);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRefId = `BX-ENR-${new Date().getFullYear()}-${randomSuffix}`;

    const payload = {
      id: newRefId,
      userHandle: `@${formData.name.toLowerCase().replace(/[^a-z0-9_]/g, '')}`,
      type: 'cohort',
      domains: [formData.selectedProgram],
      experienceLevel: formData.proficiency,
      contributions: [formData.targetOutcome],
      projectIdea: `Enrolled in ${formData.selectedProgram} (${formData.selectedBatch}). Candidate from ${formData.organization} (${formData.majorOrRole || 'Student/Engineer'}). Goals: ${formData.specificGoalNote || 'Standard cohort mastery.'}`
    };

    try {
      const res = await fetch('/api/pwa/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Offline fallback');
      }
    } catch {
      await queueOfflineAction('application', '/api/pwa/applications', payload);
    } finally {
      if (typeof window !== 'undefined') {
        try {
          const saved = JSON.parse(localStorage.getItem('brandex_recent_refs') || '[]');
          localStorage.setItem('brandex_recent_refs', JSON.stringify(Array.from(new Set([newRefId, ...saved]))));
        } catch {}
      }
      setReferenceId(newRefId);
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans overflow-hidden transform-gpu"
      onClick={handleClose}
    >
      <div
        className={`relative w-full h-[100dvh] md:h-[92vh] md:max-h-[850px] md:max-w-5xl bg-white dark:bg-slate-900 md:rounded-3xl shadow-2xl border-0 md:border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden animate-slide-up transition-all ${
          shakeStep ? 'animate-shake' : ''
        }`}
      >
        {/* ========================================================================= */}
        {/* DESKTOP SIDEBAR: Matching exact Join Brandex premium layout */}
        {/* ========================================================================= */}
        <div className="hidden md:flex flex-col w-72 lg:w-80 bg-slate-900 text-white p-6 lg:p-8 border-r border-slate-800 shrink-0 justify-between relative overflow-hidden">
          {/* Ambient Gradient */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Sidebar Top: Logo & Title */}
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-[11px] font-bold rounded-full tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active 2026 Cohorts</span>
              </span>
              <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight leading-snug">
                Enroll in Brandex Cohort
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Register for upcoming cohort-based courses, masterclasses, and specialized training tracks.
              </p>
            </div>

            {/* Step Progress Timeline */}
            {!isSuccess && (
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Enrollment Steps
                </div>
                <div className="space-y-2">
                  {[
                    { num: 1, label: 'Candidate Profile', desc: 'Identity & contact' },
                    { num: 2, label: 'Course & Batch Track', desc: 'Program & schedule' },
                    { num: 3, label: 'Engineering Background', desc: 'Proficiency tier' },
                    { num: 4, label: 'Goals & Objectives', desc: 'Outcomes & vision' },
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
                <div className="text-[10px] uppercase font-bold text-slate-400">Live Cohort Pass</div>
                <div className="font-bold text-white truncate">{formData.name}</div>
                <div className="text-[11px] text-indigo-300 truncate">
                  {formData.selectedProgram}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Bottom: Status check link */}
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2 relative z-10">
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate('/status');
              }}
              className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1 font-semibold text-slate-300"
            >
              <span>Track Existing Enrollment</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Brandex Academic Gateway</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT MAIN AREA: Slim minimal header + scrollable content + bottom actions */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden relative">
          
          {/* SLIM TOP BAR (56px) */}
          <div className="h-14 sm:h-16 px-4 sm:px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="md:hidden text-[11px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-800">
                Step 0{step}/04
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white truncate">
                  {step === 1 && '01. Student & Candidate Profile'}
                  {step === 2 && '02. Course Track & Cohort Schedule'}
                  {step === 3 && '03. Programming Proficiency Tier'}
                  {step === 4 && '04. Target Learning Goals & Vision'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                  {step === 1 && 'Fill in your primary details for admission confirmation.'}
                  {step === 2 && 'Choose your specialized curriculum track and batch timing.'}
                  {step === 3 && 'Select your engineering experience tier.'}
                  {step === 4 && 'Tell us about your career outcomes and project aspirations.'}
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

          {/* Minimal 2px Progress Bar */}
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="flex-1">{errorMsg}</div>
                </div>
              )}

              {isSuccess ? (
                /* SUCCESS VIEW */
                <div className="py-6 sm:py-12 text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                      Cohort Seat Application Registered
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                      Welcome to Cohorts, {formData.name.split(' ')[0]}!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      Your enrollment for <strong>{formData.selectedProgram}</strong> has been registered. Course syllabus and orientation packet will be dispatched to{' '}
                      <strong className="text-slate-900 dark:text-slate-200 font-semibold">{formData.email}</strong>.
                    </p>
                  </div>

                  {/* Reference ID Card */}
                  <div className="p-4 sm:p-5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl max-w-md mx-auto text-left space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
                        Official Enrollment Reference ID
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyRef}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
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
                      {referenceId}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Save this reference ID. You can check admission and cohort orientation status anytime on our application tracker.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 text-sm font-semibold">
                    <NavLink
                      to={`/status?id=${referenceId}`}
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
                /* STEPPED FORM */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* STEP 1: Student & Candidate Profile */}
                  {step === 1 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Candidate Details
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          All fields marked with <span className="text-rose-500 font-bold">*</span> are required for cohort admissions review.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={formData.name}
                              onBlur={() => markTouched(['name'])}
                              onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                              }}
                              placeholder="e.g. Maya Lin"
                              className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.name && errors.name
                                  ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900'
                                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800'
                              }`}
                            />
                          </div>
                          {touched.name && errors.name && (
                            <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{errors.name}</span>
                            </p>
                          )}
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                            Email Address (For Syllabus Access) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              value={formData.email}
                              onBlur={() => markTouched(['email'])}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                              }}
                              placeholder="maya@example.org"
                              className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.email && errors.email
                                  ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900'
                                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800'
                              }`}
                            />
                          </div>
                          {touched.email && errors.email && (
                            <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{errors.email}</span>
                            </p>
                          )}
                        </div>

                        {/* Contact Phone / WhatsApp Number */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                            Phone / WhatsApp Number (For Cohort Updates) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Phone className="w-4 h-4" />
                            </div>
                            <input
                              type="tel"
                              value={formData.phone}
                              onBlur={() => markTouched(['phone'])}
                              onChange={(e) => {
                                setFormData({ ...formData, phone: e.target.value });
                                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                              }}
                              placeholder="+91 99868 80072"
                              className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.phone && errors.phone
                                  ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900'
                                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800'
                              }`}
                            />
                          </div>
                          {touched.phone && errors.phone && (
                            <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{errors.phone}</span>
                            </p>
                          )}
                        </div>

                        {/* University / School / Organization */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                              University / School / Company <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                value={formData.organization}
                                onBlur={() => markTouched(['organization'])}
                                onChange={(e) => {
                                  setFormData({ ...formData, organization: e.target.value });
                                  if (errors.organization) setErrors((prev) => ({ ...prev, organization: '' }));
                                }}
                                placeholder="e.g. National Institute of Tech"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                  touched.organization && errors.organization
                                    ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900'
                                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600'
                                }`}
                              />
                            </div>
                            {touched.organization && errors.organization && (
                              <p className="mt-1 text-xs text-rose-600 font-semibold">Missing</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                              Academic Major / Current Role
                            </label>
                            <input
                              type="text"
                              value={formData.majorOrRole}
                              onChange={(e) => setFormData({ ...formData, majorOrRole: e.target.value })}
                              placeholder="e.g. 3rd Year CS / Junior Engineer"
                              className="w-full px-4 py-3 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Course Track & Cohort Schedule */}
                  {step === 2 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Select Course Track & Preferred Batch
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Choose the curriculum track and timing schedule that fits your availability.
                        </p>
                      </div>

                      {/* Course Selection Cards */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1">
                          1. Target Training Program *
                        </label>
                        <div className="grid grid-cols-1 gap-2.5">
                          {cohortPrograms.map((prog) => {
                            const isSelected = formData.selectedProgram === prog.title;
                            const Icon = prog.icon;
                            return (
                              <button
                                key={prog.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, selectedProgram: prog.title })}
                                className={`p-3.5 text-left rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                  isSelected
                                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md ring-2 ring-indigo-500/20'
                                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                      {prog.title}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                      {prog.duration} • {prog.level}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                                  {prog.badge}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Batch Schedule Selector */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1">
                          2. Preferred Cohort Schedule *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {batchSchedules.map((batch) => {
                            const isSelected = formData.selectedBatch === batch.label;
                            return (
                              <button
                                key={batch.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, selectedBatch: batch.label })}
                                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-xs ring-2 ring-indigo-500/20'
                                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-slate-300'
                                }`}
                              >
                                <div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                                    {batch.label}
                                  </div>
                                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                                    {batch.timing}
                                  </div>
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                                  {batch.desc}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Engineering Proficiency Tier */}
                  {step === 3 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Current Engineering Proficiency
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          This helps us assign you to the most effective peer breakout squad and mentor pair.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {proficiencyLevels.map((lvl) => {
                          const isSelected = formData.proficiency === lvl.title;
                          return (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, proficiency: lvl.title })}
                              className={`p-4 w-full rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-300'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <span>{lvl.title}</span>
                                  {isSelected && (
                                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {lvl.desc}
                                </p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Goals, Portfolio & Vision */}
                  {step === 4 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Target Career Outcome & Learning Goals
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Select your primary objective to calibrate your capstone project review.
                        </p>
                      </div>

                      {/* Career Outcomes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {careerOutcomes.map((out) => {
                          const isSelected = formData.targetOutcome === out.title;
                          return (
                            <button
                              key={out.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, targetOutcome: out.title })}
                              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-slate-300'
                              }`}
                            >
                              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span>{out.title}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                                {out.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1">
                            GitHub / Portfolio Link
                          </label>
                          <input
                            type="url"
                            value={formData.githubOrPortfolio}
                            onChange={(e) => setFormData({ ...formData, githubOrPortfolio: e.target.value })}
                            placeholder="https://github.com/yourhandle"
                            className="w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1">
                            Specific Goals / Questions
                          </label>
                          <input
                            type="text"
                            value={formData.specificGoalNote}
                            onChange={(e) => setFormData({ ...formData, specificGoalNote: e.target.value })}
                            placeholder="e.g. Inquiring about GPU cloud setup"
                            className="w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BOTTOM ACTION BAR */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="btn-secondary px-5 py-3 text-xs flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        Cancel
                      </button>
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary px-6 py-3 text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <span>Continue to Step 0{step + 1}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-6 py-3 text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Reserving Cohort Seat...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Cohort Enrollment</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
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
