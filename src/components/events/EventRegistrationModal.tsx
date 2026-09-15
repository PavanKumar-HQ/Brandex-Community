import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Check,
  Lightbulb
} from 'lucide-react';
import { Event } from '../../models/types';
import { registerForEvent } from '../../repositories/repository';

interface EventRegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    experienceLevel: 'Intermediate',
    reason: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !event) return null;

  const reasonChips = [
    'Hands-on technical coding lab',
    'Network with speakers and engineering peers',
    'Find teammates for upcoming hackathons',
    'Explore internship and fellowship pathways',
    'Learn modern architecture and best practices',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Please provide your real full name';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email (e.g. alex@example.org)';
    }

    if (!formData.reason.trim()) {
      errs.reason = 'Please tell us what you hope to learn or get out of this event';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, reason: true });

    if (!validate()) {
      setErrorMessage('Please fill in the required highlighted fields below.');
      setStatus('error');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setStatus('submitting');
      setErrorMessage('');
      await registerForEvent({
        eventId: event.id,
        eventTitle: event.title,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        experienceLevel: formData.experienceLevel,
      });

      setStatus('success');
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus('error');
      setErrorMessage('Registration failed. Please check your network connection and try again.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setTouched({});
    setErrors({});
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      experienceLevel: 'Intermediate',
      reason: '',
    });
    onClose();
  };

  const handleSelectReason = (chip: string) => {
    setFormData((prev) => ({
      ...prev,
      reason: prev.reason ? `${prev.reason}; ${chip}` : chip,
    }));
    if (errors.reason) setErrors((prev) => ({ ...prev, reason: '' }));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans overflow-y-auto transform-gpu"
      onClick={handleReset}
    >
      <div
        className={`relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 text-slate-900 dark:text-white space-y-5 my-auto ${
          shake ? 'animate-shake' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-t-3xl" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 pt-1">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              Event RSVP Registration
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{event.date} • {event.time || '10:00 AM IST'}</span>
            </div>
          </div>
          <button
            onClick={handleReset}
            aria-label="Close Registration Modal"
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on status */}
        {status === 'success' ? (
          <div className="py-8 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center border border-emerald-100 dark:border-emerald-800 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                Seat Confirmed!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                We have registered your RSVP for <strong className="text-slate-900 dark:text-white">{event.title}</strong>. Check your inbox at <strong className="text-slate-900 dark:text-white">{formData.email}</strong> for calendar access and zoom/hall coordinates.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn-primary w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm shadow-md"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-medium animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                {touched.name && errors.name && (
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Missing
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                  }}
                  placeholder="e.g. Alex Mercer"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none ${
                    touched.name && errors.name
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                {touched.email && errors.email && (
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Missing
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                  }}
                  placeholder="alex@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none ${
                    touched.email && errors.email
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold">{errors.email}</p>
              )}
            </div>

            {/* Phone & Organization Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 99868 80072"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Institution / Org
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. University / Company"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      formData.experienceLevel === lvl
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-400 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Question: What will you get out of this event? */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                  <span>What will you gain or bring to this event?</span>
                  <span className="text-rose-500">*</span>
                </label>
                {touched.reason && errors.reason && (
                  <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Missing
                  </span>
                )}
              </div>

              {/* Reason Quick-Select Chips */}
              <div className="mb-2">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Quick-add intent:
                </span>
                <div className="flex flex-wrap gap-1">
                  {reasonChips.map((chip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectReason(chip)}
                      className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-lg transition-colors text-left"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={formData.reason}
                onBlur={() => setTouched((p) => ({ ...p, reason: true }))}
                onChange={(e) => {
                  setFormData({ ...formData, reason: e.target.value });
                  if (errors.reason) setErrors((p) => ({ ...p, reason: '' }));
                }}
                placeholder="Share your goals, questions for speakers, or topics you want to explore..."
                className={`w-full p-3 rounded-xl text-xs sm:text-sm resize-none transition-all focus:outline-none ${
                  touched.reason && errors.reason
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                }`}
              />
              {touched.reason && errors.reason && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold">{errors.reason}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming RSVP...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Event RSVP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
