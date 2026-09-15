import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  School,
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
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
  AlertCircle
} from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';
import { createEnquiry } from '../../repositories/repository';

export const InstitutionPartnershipModal: React.FC = () => {
  const { isOpen, type, modalData, closeModal } = useRegistration();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const partnershipTracks = [
    {
      id: 'college_research',
      label: 'College Research Lab & Thesis Mentorship',
      badge: 'University'
    },
    {
      id: 'school_syllabus',
      label: 'Geniusphere School Technology Series',
      badge: 'Secondary School'
    },
    {
      id: 'hackathon_ctf',
      label: 'Campus Buildathon & CTF Wargames',
      badge: 'Events & Labs'
    },
    {
      id: 'student_chapter',
      label: 'Official Student Chapter & Ambassador Setup',
      badge: 'Community'
    },
    {
      id: 'faculty_upskilling',
      label: 'Faculty Development & Custom Training',
      badge: 'Faculty Cohort'
    }
  ];

  const batchSizes = [
    '50 – 100 students',
    '100 – 300 students',
    '300 – 500 students',
    '500+ (Campus-wide)'
  ];

  const timelines = [
    'Immediate / Current Term',
    'Upcoming Semester',
    'Annual Partnership'
  ];

  const [formData, setFormData] = useState({
    institutionName: '',
    department: '',
    coordinatorName: '',
    coordinatorRole: '',
    email: '',
    phone: '',
    track: partnershipTracks[0].label,
    batchSize: batchSizes[1],
    timeline: timelines[1],
    specificGoals: ''
  });

  useEffect(() => {
    if (modalData?.track) {
      setFormData((prev) => ({ ...prev, track: modalData.track || '' }));
    }
  }, [modalData]);

  if (!isOpen || type !== 'partnership') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.institutionName.trim()) {
      setErrorMsg('Please enter your institution or college name.');
      return;
    }
    if (!formData.coordinatorName.trim()) {
      setErrorMsg('Please enter the contact person or faculty lead name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please provide a valid official email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please provide a contact phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedRef = `BX-COLL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await createEnquiry({
        type: 'school',
        orgName: formData.institutionName,
        contactName: `${formData.coordinatorName} (${formData.coordinatorRole || 'Coordinator'}) - ${formData.department || 'Department'}`,
        email: formData.email,
        phone: formData.phone,
        message: `[Partnership Track: ${formData.track}] [Batch: ${formData.batchSize}] [Timeline: ${formData.timeline}] \nGoals: ${formData.specificGoals || 'Standard institutional syllabus & campus buildathon collaboration.'}`,
        adminNotes: `Generated Ref: ${generatedRef}`
      });

      // Save reference in recent list for status tracking
      if (typeof window !== 'undefined') {
        try {
          const saved = JSON.parse(localStorage.getItem('brandex_recent_refs') || '[]');
          localStorage.setItem('brandex_recent_refs', JSON.stringify(Array.from(new Set([generatedRef, ...saved]))));
        } catch {}
      }

      setReferenceId(generatedRef);
      setIsSuccess(true);
    } catch {
      setErrorMsg('Failed to log partnership inquiry. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="py-4 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Institutional Partnership Logged
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Proposal Request Received
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Thank you, <strong>{formData.coordinatorName}</strong>. Our academic partnerships team is reviewing collaboration requirements for <strong>{formData.institutionName}</strong>.
              </p>
            </div>

            {/* Reference ID Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Official Partnership Tracking Reference:
              </span>
              <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-mono font-bold text-sm sm:text-base text-indigo-600 dark:text-indigo-400">
                  {referenceId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Track status anytime via our live tracker using this Reference ID or your registered official email.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <NavLink
                to={`/status?id=${referenceId}`}
                onClick={closeModal}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Track Status Now</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academic & Institutional Collaboration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                College & School Partnership Form
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Setup custom student curriculum cohorts, campus CTF defense hackathons, or faculty workshops.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* 1. Institution Name & Dept */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Institution / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    placeholder="e.g. St. Xavier's Institute of Technology"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Department / Student Club
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Dept of CS / ACM Chapter"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 2. Contact Person & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Faculty Lead / Coordinator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.coordinatorName}
                    onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                    placeholder="e.g. Dr. Ramesh Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={formData.coordinatorRole}
                    onChange={(e) => setFormData({ ...formData, coordinatorRole: e.target.value })}
                    placeholder="e.g. Head of Dept / Faculty Coordinator"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 3. Official Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Official Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="coordinator@college.edu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 4. Partnership Track Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Collaboration Program / Track of Interest
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {partnershipTracks.map((trk) => (
                    <button
                      type="button"
                      key={trk.id}
                      onClick={() => setFormData({ ...formData, track: trk.label })}
                      className={`p-2 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${
                        formData.track === trk.label
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate">{trk.label}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200 dark:border-slate-700">
                        {trk.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Batch Size & Target Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Student Cohort
                  </label>
                  <select
                    value={formData.batchSize}
                    onChange={(e) => setFormData({ ...formData, batchSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {batchSizes.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Target Implementation Term
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {timelines.map((tm) => (
                      <option key={tm} value={tm}>
                        {tm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6. Specific Requirements */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Specific Objectives or Custom Topics
                </label>
                <textarea
                  rows={2}
                  value={formData.specificGoals}
                  onChange={(e) => setFormData({ ...formData, specificGoals: e.target.value })}
                  placeholder="Outline any special prerequisites, campus lab infrastructure, or syllabus alignment requests..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging Institutional Proposal...</span>
                  </>
                ) : (
                  <>
                    <span>Submit College & Institutional Proposal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
