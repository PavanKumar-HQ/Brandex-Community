import { useSEO } from '../hooks/useSEO';
import React from 'react';
import { Briefcase, Heart, Cpu, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { BackButton } from '../components/ui/BackButton';
import { SectionHeading } from '../components/ui/SectionHeading';

export const CareersPage: React.FC = () => {
  useSEO("Careers & Team", "Join our team. Work remotely and help build the future of tech education.");
  return (
    <div className="space-y-6 pb-16 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <BackButton />
      
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
        gradientFrom="text-indigo-600"
        gradientTo="bg-indigo-50"
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
          <a href="mailto:careers@brandex.network" className="inline-flex items-center gap-2 mt-4 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            Send us your resume anyway
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Application Status Tracker */}
      <section className="space-y-6 pt-8 border-t border-slate-200">
        <SectionHeading
          tag="STATUS CHECKER"
          title="Check Review Status"
          subtitle="Input your application email to check your status."
        />
        <StatusCheckerForm />
      </section>

    </div>
  );
};

const StatusCheckerForm: React.FC = () => {
  const [email, setEmail] = React.useState(() => sessionStorage.getItem('careerEmail') || '');
  const [result, setResult] = React.useState<string | null>(null);
  const [statusType, setStatusType] = React.useState<'info' | 'success' | 'warning' | 'error' | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    sessionStorage.setItem('careerEmail', email);
  }, [email]);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setResult("Please enter a valid email address.");
      setStatusType('error');
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setLoading(false);
      // Mock Database for Career Submissions
      const mockDb: Record<string, { status: string; type: 'info' | 'success' | 'warning' | 'error' }> = {
        'pavan@brandex.network': { status: 'Application Approved - Welcome to the Core Executive Team.', type: 'success' },
        'alex.mercer@gmail.com': { status: 'Under Technical Evaluation - Engineering task review is active.', type: 'info' },
        'sathvik@brandex.network': { status: 'Application Approved - Welcome to the Core Tech Team.', type: 'success' },
        'candidate@example.com': { status: 'Interview Scheduled - Please check your calendar for the invite link.', type: 'success' },
        'rejected@example.com': { status: 'Review Concluded - Thank you for applying. We are not moving forward at this time.', type: 'warning' },
      };

      if (mockDb[cleanEmail]) {
        setResult(mockDb[cleanEmail].status);
        setStatusType(mockDb[cleanEmail].type);
      } else {
        setResult("No application record found for this email address. Submit your CV to careers@brandex.network first.");
        setStatusType('error');
      }
    }, 1000);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-6 w-full space-y-4 rounded-2xl">
      <form onSubmit={handleCheck} className="space-y-3">
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Registered Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="candidate@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="border border-slate-200 px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:border-indigo-600 w-full rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying application...</span>
            </>
          ) : (
            <span>Check Application Status</span>
          )}
        </button>
      </form>

      {result && (
        <div className={`p-4 text-xs font-medium border rounded-lg ${
          statusType === 'success' ? 'bg-emerald-50 border-emerald-250 text-emerald-800' :
          statusType === 'warning' ? 'bg-amber-50 border-amber-250 text-amber-800' :
          statusType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {result}
        </div>
      )}
    </div>
  );
};
