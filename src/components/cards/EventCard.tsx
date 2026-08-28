import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Event } from '../../models/types';
import { MediaPlaceholderCard } from '../ui/MediaPlaceholders';

interface EventCardProps {
  event: Event;
  onRegisterClick?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegisterClick }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch group hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
      
      {/* Date Block (Left Sidebar) */}
      <div className="bg-slate-50 border-r border-slate-200 px-6 py-8 flex flex-col items-center justify-center min-w-[120px] text-center shrink-0">
        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">
          {event.date.split(' ')[0]} {/* Assumes format like "Aug 18, 2026" */}
        </span>
        <span className="text-3xl font-display font-black text-slate-900 leading-none">
          {event.date.split(' ')[1]?.replace(',', '') || 'TBD'}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {event.type}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              {event.location.split(',')[0]}
            </span>
            {event.isPast ? (
              <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">PAST</span>
            ) : (
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">UPCOMING</span>
            )}
          </div>

          <NavLink to={`/events/${event.slug}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 leading-tight">
              {event.title}
            </h3>
          </NavLink>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed max-w-2xl">
            {event.shortDescription}
          </p>
        </div>
      </div>

      {/* Action Area (Right Side) */}
      <div className="p-6 md:p-8 bg-slate-50/50 flex flex-col items-start md:items-end justify-center border-t md:border-t-0 md:border-l border-slate-100 min-w-[200px]">
        {event.isPast ? (
          <NavLink
            to={`/events/${event.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-200 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>View Archive</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        ) : (
          <button
            onClick={() => onRegisterClick && onRegisterClick(event)}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
          >
            <span>RSVP Event</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <div className="mt-3 flex items-center justify-center w-full gap-1.5 text-xs text-slate-500 font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>{event.registeredCount || 184} Attending</span>
        </div>
      </div>

    </div>
  );
};
