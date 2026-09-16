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
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-row items-center justify-between group hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-3 sm:p-4 gap-3 sm:gap-4">
      
      {/* Date & Title */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex flex-col items-center justify-center text-center shrink-0 min-w-[60px] sm:min-w-[88px] shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {event.date.split(' ')[0]}
          </span>
          <span className="text-xs sm:text-base font-display font-bold text-slate-900 leading-tight">
            {event.date.split(' ')[1]?.replace(',', '') || 'TBD'}
          </span>
        </div>

        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{event.type}</span>
            <span className="hidden xs:flex items-center gap-1 truncate"><MapPin className="w-2.5 h-2.5" /> {event.location.split(',')[0]}</span>
          </div>
          <NavLink to={`/events/${event.slug}`} className="block group-hover:text-indigo-600 transition-colors truncate">
            <h3 className="font-display font-bold text-xs sm:text-base text-slate-900 truncate">
              {event.title}
            </h3>
          </NavLink>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium whitespace-nowrap">
          <Users className="w-3.5 h-3.5" />
          <span>{event.registeredCount || 184}</span>
        </div>
        {event.isPast ? (
          <NavLink
            to={`/events/${event.slug}`}
            className="inline-flex items-center justify-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            <span>Archive</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </NavLink>
        ) : (
          <button
            onClick={() => onRegisterClick && onRegisterClick(event)}
            className="inline-flex items-center justify-center gap-1 bg-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs active:scale-95"
          >
            <span>RSVP</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
