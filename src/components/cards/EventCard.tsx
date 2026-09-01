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
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col md:flex-row items-center justify-between group hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-4 gap-4">
      
      {/* Date & Title */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0 w-full sm:w-auto">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col items-center justify-center text-center shrink-0 min-w-[76px] sm:min-w-[96px] shadow-sm">
          <span className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {event.date.split(' ')[0]}
          </span>
          <span className="text-sm sm:text-base font-display font-bold text-slate-900 leading-tight">
            {event.date.split(' ')[1]?.replace(',', '') || 'TBD'}
          </span>
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{event.type}</span>
            <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3" /> {event.location.split(',')[0]}</span>
          </div>
          <NavLink to={`/events/${event.slug}`} className="block group-hover:text-indigo-600 transition-colors truncate">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 truncate">
              {event.title}
            </h3>
          </NavLink>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium whitespace-nowrap">
          <Users className="w-3.5 h-3.5" />
          <span>{event.registeredCount || 184}</span>
        </div>
        {event.isPast ? (
          <NavLink
            to={`/events/${event.slug}`}
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            <span>Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        ) : (
          <button
            onClick={() => onRegisterClick && onRegisterClick(event)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
          >
            <span>RSVP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
