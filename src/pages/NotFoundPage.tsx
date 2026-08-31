import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, GraduationCap, Users, ArrowRight, Ghost, Compass } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export const NotFoundPage: React.FC = () => {
  useSEO('404 — Page Not Found | Brandex', 'The page you are looking for does not exist or has been moved.');

  const recommendedDestinations = [
    {
      title: 'Home Base',
      desc: 'Return to the main community hub and overview.',
      icon: Home,
      path: '/',
    },
    {
      title: 'Events & Summits',
      desc: 'Explore live hackathons, workshops, and wargames.',
      icon: Calendar,
      path: '/events',
    },
    {
      title: 'Cohort Training',
      desc: 'Browse hands-on tracks in AI, Cyber, and Systems.',
      icon: GraduationCap,
      path: '/training',
    },
    {
      title: 'Domain Circles',
      desc: 'Join developer circles and student chapters.',
      icon: Users,
      path: '/community',
    },
    {
      title: 'Global Search',
      desc: 'Find specific programs, resources, or media.',
      icon: Search,
      path: '/search',
    },
  ];

  return (
    <div className="w-full min-h-[80vh] pb-24 pt-24 px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <Breadcrumb items={[{ label: '404 Error' }]} />

      <div className="max-w-4xl mx-auto space-y-12 text-center pt-8">
        
        {/* Visual Badge & Ghost Icon */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
            <Ghost className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <span>404 Error • Route Not Found</span>
          </div>
        </div>

        {/* Header and Description */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-slate-900 tracking-tight leading-tight">
            Lost in the digital matrix?
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            The page you're trying to reach doesn't exist, has been archived, or the link may be outdated. Let's get you back on track.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </NavLink>

          <NavLink
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-semibold text-sm rounded-xl transition-all"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search Platform</span>
          </NavLink>
        </div>

        {/* Quick Nav Grid */}
        <div className="pt-8 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Popular Destinations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left pt-2">
            {recommendedDestinations.map((dest, idx) => {
              const Icon = dest.icon;
              return (
                <NavLink
                  key={idx}
                  to={dest.path}
                  className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {dest.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                        {dest.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
                    <span>Visit Page</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
