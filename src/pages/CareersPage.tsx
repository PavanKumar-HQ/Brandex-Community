import { useSEO } from '../hooks/useSEO';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  Heart,
  Cpu,
  Globe,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Search,
  Copy,
  Check,
  Send,
  Mail
} from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CareerApplyModal } from '../components/careers/CareerApplyModal';
import { SkeletonCard } from '../components/ui/Skeleton';

export const CareersPage: React.FC = () => {
  useSEO("Careers & Team", "Join our team. Work remotely and help build the future of tech education.");
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  return (
    <div className="w-full space-y-8 pb-20 pt-20 sm:pt-24 px-4 sm:px-8 lg:px-12 xl:px-16 bg-white text-slate-900 font-sans">
      <CareerApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
      <Breadcrumb items={[{ label: 'Careers' }]} />
        
        {/* Hero Section */}
        <PageHero 
          tag="CAREERS AT BRANDEX"
          title="Join Our Mission to Build the Future of Tech Education."
          description="We're always looking for passionate engineers, designers, and community builders to help us scale the Brandex Showcase Ecosystem."
          widgetTitle="Brandex.Team"
          widgetStatLabel="Global Members"
          widgetStatValue="Growing"
          widgetStatusLabel="Hiring Status"
          widgetStatusText="Open Roles Below"
        />

      {/* Why Join Us */}
      <section className="space-y-6">
        <SectionHeading
          tag="WHY BRANDEX"
          title="Build With Purpose"
          subtitle="We are building the definitive ecosystem for technology education and community building."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Globe,
              title: "Remote-First",
              desc: "Work from anywhere. We value output and creativity over office hours."
            },
            {
              icon: Cpu,
              title: "Cutting-Edge Tech",
              desc: "We experiment with the latest in AI, systems, and digital frameworks."
            },
            {
              icon: Heart,
              title: "Community Driven",
              desc: "Everything we build is designed to empower and connect people."
            },
            {
              icon: Briefcase,
              title: "Growth Potential",
              desc: "Take ownership of massive projects and scale your career rapidly."
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                <benefit.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">{benefit.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Roles */}
      <section className="space-y-6 pt-8 border-t border-slate-200">
        <SectionHeading
          tag="OPEN POSITIONS"
          title="Explore Open Roles"
          subtitle="Find your next opportunity at Brandex."
        />
        
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-none p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-none flex items-center justify-center text-slate-400 mb-2 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Open Roles Right Now</h3>
          <p className="text-slate-600 max-w-md">
            We aren't actively hiring at this exact moment, but we are always on the lookout for exceptional talent. Check back soon or follow us on our socials for updates!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5 w-full max-w-md">
            <button
              type="button"
              onClick={() => setApplyModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Submit Candidacy / Send Resume</span>
            </button>
            <a
              href="mailto:careers@brandex.network?subject=Brandex%20Talent%20Pool%20Candidacy"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 active:scale-98 border border-slate-300 text-slate-700 font-bold text-xs shadow-xs transition-all"
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Email Resume Directly</span>
            </a>
          </div>
        </div>
      </section>

      {/* Fused Application & Career Status Tracker */}
      <section className="space-y-6 pt-8 border-t border-slate-200">
        <SectionHeading
          tag="STATUS TRACKER"
          title="Fused Application & Career Tracker"
          subtitle="Query live admissions, fellowship pipelines, or circular evaluation using your email or reference code."
        />
        <FusedCareerTracker />
      </section>

    </div>
  );
};

interface StatusRecord {
  id: string;
  refCode?: string;
  type?: string;
  status: string;
  program?: string;
  serviceTitle?: string;
  applicationType?: string;
  userHandle?: string;
  email?: string;
  notes?: string;
  reviewerNotes?: string;
  createdAt?: string;
  submittedAt?: string;
}

const FusedCareerTracker: React.FC = () => {
  const [query, setQuery] = useState(() => sessionStorage.getItem('careerEmail') || '');
  const [record, setRecord] = useState<StatusRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('careerEmail', query);
  }, [query]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setErrorMsg("Please enter a valid email address or reference ID (e.g. BX-...).");
      setRecord(null);
      setNotFound(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setRecord(null);
    setNotFound(false);

    try {
      const res = await fetch(`/api/pwa/status/${encodeURIComponent(cleanQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setRecord(data);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch {
      setErrorMsg("Unable to connect to live status verification pipeline. Please try again or visit the main tracker.");
    } finally {
      setLoading(false);
    }
  };

  const copyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('accept') || s.includes('select') || s.includes('approved')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{status}</span>
        </span>
      );
    }
    if (s.includes('interview')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{status}</span>
        </span>
      );
    }
    if (s.includes('action') || s.includes('document') || s.includes('waitlist')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full">
        <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
        <span>{status || 'Under Technical Review'}</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 w-full space-y-6 rounded-2xl">
      <form onSubmit={handleCheck} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="tracker-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Registered Email Address or Reference ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="tracker-input"
                type="text"
                placeholder="e.g. karthik@example.com or BX-2026-1003"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                className="border border-slate-200 px-4 py-3 text-sm bg-white text-slate-900 focus:outline-none focus:border-indigo-600 w-full rounded-xl disabled:bg-slate-100 disabled:cursor-not-allowed font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-white" />
                  <span>Track Status</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {errorMsg && (
        <div className="p-4 text-xs font-medium border rounded-xl bg-red-50 border-red-200 text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading && (
        <SkeletonCard className="bg-white border-slate-200 shadow-xs" />
      )}

      {record && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ref ID:</span>
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                {record.id || record.refCode}
              </span>
              <button
                type="button"
                onClick={() => copyRef(record.id || record.refCode || '')}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                title="Copy Reference Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {renderBadge(record.status)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase">Program / Role</span>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {record.program || record.serviceTitle || record.applicationType || 'Talent Application'}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase">Applicant Identifier</span>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {record.userHandle || record.email || 'Confidential'}
              </p>
            </div>
          </div>

          {(record.notes || record.reviewerNotes) && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900">Admissions / Evaluation Notes:</span>
              <p className="text-slate-600 leading-relaxed">{record.notes || record.reviewerNotes}</p>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
            <span className="text-slate-500">
              Submitted on {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Recent Submission'}
            </span>
            <NavLink
              to={`/status?id=${encodeURIComponent(record.id || record.refCode || query.trim())}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-98"
            >
              <span>View in Full Platform Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      )}

      {notFound && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900">No Application Record Found</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            We couldn't find a record for <strong className="font-mono">{query}</strong>. If you applied recently, please ensure your email or reference code matches exactly.
          </p>
          <div className="pt-2">
            <NavLink
              to="/status"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
            >
              <span>Search Platform Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};
