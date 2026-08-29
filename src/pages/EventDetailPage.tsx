import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowUpRight, Play, CheckCircle } from 'lucide-react';
import { getEventBySlug } from '../repositories/repository';
import { Event } from '../models/types';
import { EventRegistrationModal } from '../components/events/EventRegistrationModal';
import { MediaPlaceholderCard } from '../components/ui/MediaPlaceholders';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      if (!slug) return;
      const data = await getEventBySlug(slug);
      setEvent(data);
    }
    loadEvent();
  }, [slug]);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center bg-white">
        <EmptyState
          title="EVENT NOT FOUND"
          description="The event slug you requested does not exist or has been removed."
          actionText="Back to Events Timeline"
          onAction={() => navigate('/events')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 pt-20 bg-white">
      
      {/* Breadcrumb Navigation */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-24">
        <Breadcrumb items={[{ label: 'Events', path: '/events' }, { label: event.title }]} />
      </div>

      {/* Hero Poster & Header */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase text-[#4f46e5] bg-[#e0e7ff] border border-[#4f46e5]/30 px-3 py-1 font-bold">
              [{event.category}]
            </span>
            <span className="font-mono text-xs text-[#0f142e] bg-[#f1f5f9] border border-[#cbd5e1] px-3 py-1 font-bold">
              {event.type}
            </span>
            {event.isPast && (
              <span className="font-mono text-xs text-[#475569] bg-[#f1f5f9] border border-[#cbd5e1] px-3 py-1 font-bold">
                ARCHIVED SESSION
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-editorial font-bold uppercase tracking-tight text-[#0f142e] leading-tight">
            {event.title}
          </h1>

          <p className="font-sans text-base text-[#475569] leading-relaxed">
            {event.description}
          </p>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-[#0f142e] border-2 border-[#0f142e] p-4 bg-[#f8fafc] shadow-brutal-sm font-bold">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#4f46e5]" />
              <span>{event.date} ({event.time})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#4f46e5]" />
              <span>{event.location}</span>
            </div>
          </div>

          {!event.isPast && (
            <div className="pt-2">
              <button
                onClick={() => setIsRsvpOpen(true)}
                className="inline-flex items-center gap-2 bg-[#0f142e] text-white px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1e2756] transition-all shadow-brutal-sm"
              >
                <span>RSVP for Event</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Hero Poster Frame */}
        <div className="lg:col-span-5">
          <MediaPlaceholderCard
            type="image"
            src={event.coverImage}
            title={event.title}
            category={event.category}
            aspectRatio="video"
          />
        </div>
      </section>

      {/* Agenda & Speakers */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Agenda Timeline */}
        <div className="lg:col-span-7 space-y-6 border-2 border-[#0f142e] bg-white p-8 grid-lines shadow-brutal-sm">
          <h2 className="font-editorial font-bold text-2xl uppercase tracking-tight text-[#0f142e] border-b-2 border-[#0f142e] pb-4">
            Event Agenda & Timeline
          </h2>

          {event.agenda && event.agenda.length > 0 ? (
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#cbd5e1]">
              {event.agenda.map((item, idx) => (
                <div key={idx} className="relative pl-10 space-y-1">
                  <div className="absolute left-0 top-1 w-7 h-7 bg-white border-2 border-[#0f142e] text-[#4f46e5] font-mono text-[10px] font-bold flex items-center justify-center shadow-brutal-sm">
                    {idx + 1}
                  </div>
                  <span className="font-mono text-xs text-[#4f46e5] font-bold block">
                    {item.time}
                  </span>
                  <h4 className="font-editorial font-bold text-lg uppercase text-[#0f142e]">
                    {item.title}
                  </h4>
                  {item.speaker && (
                    <span className="font-mono text-xs text-[#475569] font-bold block">
                      Speaker: {item.speaker}
                    </span>
                  )}
                  {item.description && (
                    <p className="font-sans text-xs text-[#475569] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-mono text-xs text-[#475569]">
              Detailed timetable will be released closer to event start.
            </p>
          )}
        </div>

        {/* Speakers List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-2 border-[#0f142e] bg-white p-8 space-y-6 grid-lines shadow-brutal-sm">
            <h2 className="font-editorial font-bold text-2xl uppercase tracking-tight text-[#0f142e] border-b-2 border-[#0f142e] pb-4">
              Featured Speakers
            </h2>

            <div className="space-y-4">
              {event.speakers.map((spk, idx) => (
                <div key={idx} className="border border-[#0f142e] p-4 bg-[#f8fafc] flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-[#0f142e] font-editorial font-bold text-[#0f142e] flex items-center justify-center">
                    {spk.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-editorial font-bold text-base uppercase text-[#0f142e]">
                      {spk.name}
                    </h4>
                    <span className="font-mono text-xs text-[#475569] font-semibold block">
                      {spk.role} · {spk.organization}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Event Media Recording */}
          {event.isPast && event.recordingUrl && (
            <div className="border-2 border-[#0f142e] bg-[#f8fafc] p-6 space-y-4 shadow-brutal-sm">
              <span className="font-mono text-xs uppercase text-[#4f46e5] font-bold block">
                PAST SESSION RECORDING
              </span>
              <p className="font-sans text-xs text-[#475569]">
                This session has concluded. Watch the full recorded keynote and panel stream.
              </p>
              <a
                href={event.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#0f142e] text-white py-3 font-mono text-xs uppercase font-bold hover:bg-[#1e2756]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Recorded Stream</span>
              </a>
            </div>
          )}
        </div>

      </section>

      {/* RSVP Modal */}
      <EventRegistrationModal
        event={event}
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
      />

    </div>
  );
};
