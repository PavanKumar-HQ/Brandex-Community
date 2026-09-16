import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  School,
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  Mail,
  Phone,
  User,
  FileText,
  Copy,
  Check,
  Calendar,
  Layers,
  Award,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';
import { createEnquiry } from '../../repositories/repository';

export const InstitutionPartnershipModal: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, type, modalData, closeModal } = useRegistration();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shakeStep, setShakeStep] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const partnershipTracks = [
    {
      id: 'college_research',
      label: 'College Research Lab & Thesis Mentorship',
      badge: 'University Track',
      desc: 'Supervised open-source research papers, vector search benchmarks & distributed systems.'
    },
    {
      id: 'school_syllabus',
      label: 'Geniusphere School Technology Series',
      badge: 'Secondary School',
      desc: 'Algorithmic logic, robotics foundation, and web prototyping for secondary schools.'
    },
    {
      id: 'hackathon_ctf',
      label: 'Campus Buildathon & CTF Wargames',
      badge: 'Events & Labs',
      desc: 'Sponsored 48h hackathons, Capture The Flag cybersecurity defense arenas.'
    },
    {
      id: 'student_chapter',
      label: 'Official Student Chapter & Ambassador Setup',
      badge: 'Community',
      desc: 'Launch a self-sustaining Brandex student chapter with founder mentorship loops.'
    },
    {
      id: 'faculty_upskilling',
      label: 'Faculty Development & Custom Cohort Training',
      badge: 'Faculty Cohort',
      desc: 'Hands-on faculty upskilling in modern AI agent architecture and secure development.'
    }
  ];

  const batchSizes = [
    '50 – 100 students',
    '100 – 300 students',
    '300 – 500 students',
    '500+ (Campus-wide)'
  ];

  const timelines = [
    'Immediate Term',
    'Upcoming Semester',
    'Annual Institutional Partnership'
  ];

  const [formData, setFormData] = useState({
    // Step 1: Institution & Contact Lead
    institutionName: '',
    department: '',
    coordinatorName: '',
    coordinatorRole: '',
    // Step 2: Track
    track: partnershipTracks[0].label,
    // Step 3: Scope & Official Contact
    batchSize: batchSizes[1],
    timeline: timelines[1],
    email: '',
    phone: '',
    // Step 4: Specific Objectives
    specificGoals: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (modalData?.track) {
      setFormData((prev) => ({ ...prev, track: modalData.track || prev.track }));
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

  if (!isOpen || type !== 'partnership') return null;

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
      if (!formData.institutionName.trim()) {
        newErrors.institutionName = 'Please enter your institution or college name.';
      }
      if (!formData.coordinatorName.trim()) {
        newErrors.coordinatorName = 'Please enter the faculty coordinator / contact lead name.';
      }
    }

    if (currentStep === 2) {
      if (!formData.track) {
        newErrors.track = 'Please select a partnership track of interest.';
      }
    }

    if (currentStep === 3) {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        newErrors.email = 'Please enter a valid official institutional email.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please enter a contact phone or WhatsApp number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) markTouched(['institutionName', 'coordinatorName']);
    if (step === 2) markTouched(['track']);
    if (step === 3) markTouched(['email', 'phone']);

    const isValid = validateStep(step);
    if (!isValid) {
      setErrorMsg('Please complete all required fields before proceeding.');
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
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const generatedRef = `BX-COLL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await createEnquiry({
        type: 'school',
        orgName: formData.institutionName,
        contactName: `${formData.coordinatorName} (${formData.coordinatorRole || 'Coordinator'}) - ${formData.department || 'Academic Department'}`,
        email: formData.email,
        phone: formData.phone,
        message: `[Track: ${formData.track}] [Cohort Size: ${formData.batchSize}] [Timeline: ${formData.timeline}]\nObjectives: ${formData.specificGoals || 'Standard institutional syllabus & campus buildathon collaboration.'}`,
        adminNotes: `Generated Ref: ${generatedRef}`
      });

      if (typeof window !== 'undefined') {
        try {
          const saved = JSON.parse(localStorage.getItem('brandex_recent_refs') || '[]');
          localStorage.setItem('brandex_recent_refs', JSON.stringify(Array.from(new Set([generatedRef, ...saved]))));
        } catch {}
      }

      setReferenceId(generatedRef);
      setIsSuccess(true);
    } catch {
      setErrorMsg('Failed to log partnership inquiry. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
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
      role="dialog"
      aria-modal="true"
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
                <span>Academic & Institutional Hub</span>
              </span>
              <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight leading-snug">
                Partner With Brandex
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deploy open-source curricula in schools, launch university research labs, or conduct campus hackathons.
              </p>
            </div>

            {/* Step Progress Timeline */}
            {!isSuccess && (
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Partnership Steps
                </div>
                <div className="space-y-2">
                  {[
                    { num: 1, label: 'Institution & Lead', desc: 'Campus & coordinator' },
                    { num: 2, label: 'Partnership Track', desc: 'Collaboration program' },
                    { num: 3, label: 'Cohort Scope & Dates', desc: 'Batch size & contact' },
                    { num: 4, label: 'Syllabus Alignment', desc: 'Objectives & labs' },
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
            {!isSuccess && formData.institutionName.trim() && (
              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-1.5 text-xs animate-fade-in">
                <div className="text-[10px] uppercase font-bold text-slate-400">Institutional Proposal</div>
                <div className="font-bold text-white truncate">{formData.institutionName}</div>
                <div className="text-[11px] text-indigo-300 truncate">
                  {formData.track}
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
              className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1 font-semibold text-slate-300 cursor-pointer"
            >
              <span>Track Existing Proposal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Brandex Institutional Desk</span>
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
                  {step === 1 && '01. Institution & Faculty Lead'}
                  {step === 2 && '02. Collaboration Track Selection'}
                  {step === 3 && '03. Student Cohort Scope & Contact'}
                  {step === 4 && '04. Specific Objectives & Syllabus'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                  {step === 1 && 'Provide your institution and department coordinator details.'}
                  {step === 2 && 'Select your academic focus or campus workshop track.'}
                  {step === 3 && 'Estimate student cohort size, term timeline, and official email.'}
                  {step === 4 && 'Outline any prerequisite labs or custom curriculum topics.'}
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
                      Institutional Proposal Logged
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                      Proposal Received Successfully!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong>{formData.coordinatorName}</strong>. Our academic partnerships team is reviewing the collaboration requirements for <strong>{formData.institutionName}</strong>.
                    </p>
                  </div>

                  {/* Reference ID Card */}
                  <div className="p-4 sm:p-5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl max-w-md mx-auto text-left space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
                        Official Partnership Reference ID
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
                      Save this reference ID. You can track proposal review progress anytime on our status tracker.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 text-sm font-semibold">
                    <NavLink
                      to={`/status?id=${referenceId}`}
                      onClick={handleClose}
                      className="btn-primary w-full sm:w-auto justify-center px-6 py-3"
                    >
                      <span>Track Proposal Status</span>
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
                  
                  {/* STEP 1: Institution & Contact Lead */}
                  {step === 1 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Institution & Faculty Coordinator Details
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Provide primary information for official institutional correspondence.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Institution Name */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                            Institution or College Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={formData.institutionName}
                              onBlur={() => markTouched(['institutionName'])}
                              onChange={(e) => {
                                setFormData({ ...formData, institutionName: e.target.value });
                                if (errors.institutionName) setErrors((prev) => ({ ...prev, institutionName: '' }));
                              }}
                              placeholder="e.g. St. Xavier's Institute of Technology"
                              className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.institutionName && errors.institutionName
                                  ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900'
                                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800'
                              }`}
                            />
                          </div>
                          {touched.institutionName && errors.institutionName && (
                            <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{errors.institutionName}</span>
                            </p>
                          )}
                        </div>

                        {/* Department / Club */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                            Department or Student Chapter
                          </label>
                          <input
                            type="text"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            placeholder="e.g. Dept of Computer Science or ACM Student Chapter"
                            className="w-full px-4 py-3.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                          />
                        </div>

                        {/* Coordinator Name & Designation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                              Faculty Coordinator Name <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <User className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                value={formData.coordinatorName}
                                onBlur={() => markTouched(['coordinatorName'])}
                                onChange={(e) => {
                                  setFormData({ ...formData, coordinatorName: e.target.value });
                                  if (errors.coordinatorName) setErrors((prev) => ({ ...prev, coordinatorName: '' }));
                                }}
                                placeholder="e.g. Dr. Ramesh Kumar"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                  touched.coordinatorName && errors.coordinatorName
                                    ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900'
                                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600'
                                }`}
                              />
                            </div>
                            {touched.coordinatorName && errors.coordinatorName && (
                              <p className="mt-1 text-xs text-rose-600 font-semibold">Missing</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                              Designation or Role
                            </label>
                            <input
                              type="text"
                              value={formData.coordinatorRole}
                              onChange={(e) => setFormData({ ...formData, coordinatorRole: e.target.value })}
                              placeholder="e.g. Head of Dept or Faculty Mentor"
                              className="w-full px-4 py-3 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Collaboration Track Selection */}
                  {step === 2 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Select Collaboration Program / Track
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Choose the primary track of interest for your student cohort.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {partnershipTracks.map((trk) => {
                          const isSelected = formData.track === trk.label;
                          return (
                            <button
                              key={trk.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, track: trk.label })}
                              className={`p-4 w-full text-left rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-300'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    {trk.label}
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                    {trk.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {trk.desc}
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

                  {/* STEP 3: Student Cohort Scope & Contact Info */}
                  {step === 3 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Cohort Scope & Official Contact
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Provide estimated student count and official email for proposal dispatch.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                              Estimated Student Cohort Size *
                            </label>
                            <select
                              value={formData.batchSize}
                              onChange={(e) => setFormData({ ...formData, batchSize: e.target.value })}
                              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {batchSizes.map((sz) => (
                                <option key={sz} value={sz}>{sz}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                              Target Implementation Term *
                            </label>
                            <select
                              value={formData.timeline}
                              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {timelines.map((tm) => (
                                <option key={tm} value={tm}>{tm}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Official Email */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                            Official Institutional Email <span className="text-rose-500">*</span>
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
                              placeholder="coordinator@college.edu"
                              className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.email && errors.email
                                  ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900'
                                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600'
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

                        {/* Contact Phone */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                            Contact Phone / WhatsApp Number <span className="text-rose-500">*</span>
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
                              placeholder="+91 98765 43210"
                              className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-base sm:text-sm transition-all focus:outline-none ${
                                touched.phone && errors.phone
                                  ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900'
                                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600'
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
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Specific Objectives & Syllabus Alignment */}
                  {step === 4 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Specific Objectives & Lab Infrastructure
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Share any prerequisites, lab setups, or custom topics needed for your institution.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                            Specific Objectives & Curriculum Requirements
                          </label>
                          <textarea
                            rows={4}
                            value={formData.specificGoals}
                            onChange={(e) => setFormData({ ...formData, specificGoals: e.target.value })}
                            placeholder="Outline any specific syllabus alignment, campus lab hardware (GPUs/Linux nodes), hackathon dates, or student guild objectives..."
                            className="w-full p-3.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 resize-none"
                          />
                        </div>

                        <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1">
                          <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
                            Academic Review Guarantee:
                          </span>
                          <p>
                            Upon submission, our academic relations lead will review your requirements and coordinate an orientation call within 24-48 hours.
                          </p>
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
                            <span>Logging Institutional Proposal...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Institutional Proposal</span>
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
