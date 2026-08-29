import { useSEO } from '../hooks/useSEO';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PageHero } from '../components/ui/PageHero';
import { EventCard } from '../components/cards/EventCard';
import { BackButton } from '../components/ui/BackButton';
import { EventRegistrationModal } from '../components/events/EventRegistrationModal';
import { EmptyState } from '../components/ui/EmptyState';
import { getEvents } from '../repositories/repository';
import { Event } from '../models/types';

export const EventsPage: React.FC = () => {
  useSEO("Live Events & Summits", "Browse upcoming and past live summits, hands-on buildathons, wargames, and workshops.");
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  useEffect(() => {
    async function loadEventData() {
      const data = await getEvents(activeTab);
      setEvents(data);
    }
    loadEventData();
  }, [activeTab]);

  const handleOpenRsvp = (evt: Event) => {
    setSelectedEvent(evt);
    setIsRsvpOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <BackButton />
      
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
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'past'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Past Event Archive
            </button>
          </div>

          <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm hidden sm:inline-flex">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
            Showing {events.length} {activeTab === 'upcoming' ? 'Upcoming Event(s)' : 'Archived Event(s)'}
          </span>
        </div>

        {events.length === 0 ? (
          <EmptyState
            title={activeTab === 'upcoming' ? 'No upcoming events scheduled.' : 'No archived events found.'}
            description={
              activeTab === 'upcoming'
                ? "We're preparing the next Brandex session. Check back soon."
                : 'Brandex past sessions and recordings will appear here.'
            }
          />
        ) : (
          <div className="flex flex-col gap-6">
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} onRegisterClick={handleOpenRsvp} />
            ))}
          </div>
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
