import { useSEO } from '../hooks/useSEO';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PageHero } from '../components/ui/PageHero';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { EventCard } from '../components/cards/EventCard';
import { EventRegistrationModal } from '../components/events/EventRegistrationModal';
import { EmptyState } from '../components/ui/EmptyState';
import { getEvents } from '../repositories/repository';
import { Event } from '../models/types';

export const EventsPage: React.FC = () => {
  useSEO("Live Events & Summits", "Browse upcoming and past live summits, hands-on buildathons, wargames, and workshops.");
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'calendar'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  // Calendar State
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // Default: October (9)
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function loadEventData() {
      const data = await getEvents(activeTab === 'calendar' ? 'upcoming' : activeTab);
      setEvents(data);
    }
    loadEventData();
  }, [activeTab]);

  useEffect(() => {
    // Load all events (both upcoming and past) for the calendar view
    async function loadAllEventData() {
      const upcoming = await getEvents('upcoming');
      const past = await getEvents('past');
      setAllEvents([...upcoming, ...past]);
    }
    loadAllEventData();
  }, []);

  const handleOpenRsvp = (evt: Event) => {
    setSelectedEvent(evt);
    setIsRsvpOpen(true);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calendar Helper Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedCalendarEvent(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedCalendarEvent(null);
  };

  // Find events on a specific date (day, currentMonth, currentYear)
  const getEventForDay = (day: number) => {
    const monthName = monthNames[currentMonth];
    return allEvents.find(evt => {
      // Event date string is formatted like "18 August 2026" or "14 October 2026"
      const dateParts = evt.date.split(' ');
      if (dateParts.length >= 3) {
        const evtDay = parseInt(dateParts[0], 10);
        const evtMonth = dateParts[1];
        const evtYear = parseInt(dateParts[2], 10);
        return evtDay === day && evtMonth.toLowerCase() === monthName.toLowerCase() && evtYear === currentYear;
      }
      return false;
    });
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="space-y-6 pb-16 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <Breadcrumb items={[{ label: 'Events & Summits' }]} />

      {/* Hero Header */}
      <PageHero 
        tag="Brandex Summits & Gatherings"
        title="Events & Summits Timeline"
        description="Live technical summits, hands-on buildathons, school series workshops (e.g. Geniusphere Series), and cybersecurity capture-the-flag wargames."
        widgetTitle="Events.Calendar"
        widgetStatLabel="Upcoming Events"
        widgetStatValue="12"
        widgetStatusLabel="Registration"
        widgetStatusText="Open for RSVPs"
      />

      {/* Split Tabs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 sm:px-5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'upcoming'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 sm:px-5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'past'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Past Event Archive
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 sm:px-5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Calendar View
            </button>
          </div>

          <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm hidden md:inline-flex shrink-0">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
            {activeTab === 'calendar' ? 'Interactive Calendar Mode' : `Showing ${events.length} ${activeTab === 'upcoming' ? 'Upcoming Event(s)' : 'Archived Event(s)'}`}
          </span>
        </div>

        {activeTab === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Calendar Grid Container */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              {/* Month Cells Grid */}
              <div className="grid grid-cols-7 gap-2">
                {paddingArray.map(idx => (
                  <div key={`pad-${idx}`} className="aspect-square bg-slate-100/40 rounded-lg border border-transparent" />
                ))}

                {daysArray.map(day => {
                  const dayEvent = getEventForDay(day);
                  const isSelected = selectedCalendarEvent && dayEvent && selectedCalendarEvent.id === dayEvent.id;
                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => dayEvent && setSelectedCalendarEvent(dayEvent)}
                      disabled={!dayEvent}
                      className={`aspect-square rounded-lg border flex flex-col items-center justify-between p-1.5 transition-all text-xs relative ${
                        dayEvent
                          ? isSelected
                            ? 'bg-indigo-600 border-indigo-700 text-white shadow-md'
                            : 'bg-white border-slate-250 hover:border-indigo-500 hover:shadow-sm cursor-pointer'
                          : 'bg-white/40 border-slate-100 text-slate-400 cursor-default'
                      }`}
                    >
                      <span className="font-bold self-start">{day}</span>
                      {dayEvent && (
                        <span className={`w-2 h-2 rounded-full absolute bottom-2 right-2 ${isSelected ? 'bg-white' : 'bg-indigo-600 animate-pulse'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Description Panel */}
            <div className="lg:col-span-5 space-y-4">
              {selectedCalendarEvent ? (
                <div className="bg-slate-50 border-2 border-indigo-600 rounded-2xl p-6 shadow-md space-y-4 animate-fade-in relative">
                  <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded border border-indigo-200 uppercase">
                    {selectedCalendarEvent.type}
                  </span>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {selectedCalendarEvent.category}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                      {selectedCalendarEvent.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-650 leading-relaxed">
                    {selectedCalendarEvent.shortDescription}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{selectedCalendarEvent.date} @ {selectedCalendarEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="truncate">{selectedCalendarEvent.venue} ({selectedCalendarEvent.location})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenRsvp(selectedCalendarEvent)}
                    className="btn-primary w-full py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Register / RSVP Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px] text-slate-500">
                  <Calendar className="w-10 h-10 text-slate-300 mb-3" />
                  <h4 className="font-display font-bold text-sm text-slate-800">Select an Event Date</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Click on highlighted dates (marked with indicators) on the calendar to preview summit details and access RSVPs.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          events.length === 0 ? (
            <EmptyState
              title={activeTab === 'upcoming' ? 'No upcoming events scheduled.' : 'No archived events found.'}
              description={
                activeTab === 'upcoming'
                  ? "We're preparing the next Brandex session. Check back soon."
                  : 'Brandex past sessions and recordings will appear here.'
              }
            />
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in">
              {events.map((evt) => (
                <EventCard key={evt.id} event={evt} onRegisterClick={handleOpenRsvp} />
              ))}
            </div>
          )
        )}
      </section>

      {/* RSVP Modal */}
      <EventRegistrationModal
        event={selectedEvent}
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
      />

    </div>
  );
};
