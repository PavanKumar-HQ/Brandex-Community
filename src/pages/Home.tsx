import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Calendar, Users, BookOpen, Terminal, Play, MessageSquare, Award, BookText, ChevronDown, ChevronUp } from 'lucide-react';
import { useRegistration } from '../contexts/RegistrationContext';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Marquee } from '../components/layout/Marquee';
import { FadeIn } from '../components/ui/FadeIn';
import { TrainingCard } from '../components/cards/TrainingCard';
import { EventCard } from '../components/cards/EventCard';
import { MediaCard } from '../components/cards/MediaCard';
import { ImpactStatisticsSection } from '../components/showcase/ImpactStatisticsSection';
import { EventRegistrationModal } from '../components/events/EventRegistrationModal';
import { VideoModalPlayer } from '../components/ui/VideoModalPlayer';
import { MediaPlaceholderCard } from '../components/ui/MediaPlaceholders';
import { useSEO } from '../hooks/useSEO';
import { getTrainingPrograms, getEvents, getMedia, getCommunities, getStories, getAchievements } from '../repositories/repository';
import { TrainingProgram, Event, Media, Community, Story, Achievement } from '../models/types';

const TypewriterText: React.FC<{ words: string[] }> = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1600);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  // Find the longest word to prevent layout shift
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), '');

  return (
    <span className="inline-flex items-center relative text-indigo-600 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
      {/* Hidden text to reserve space */}
      <span className="invisible">{longestWord}</span>
      {/* Actual typing text */}
      <span className="absolute left-0 top-0 bottom-0 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
        <span>{words[index].substring(0, subIndex)}</span>
        <span className="animate-pulse ml-1 w-2 h-[0.8em] bg-purple-600 inline-block rounded-sm" />
      </span>
    </span>
  );
};

export const Home: React.FC = () => {
  useSEO("Showcase & Tech Education Platform", "Discover the Brandex Community platform - showcasing emerging technology, high school workshops, and professional cohort training.");
  const { openModal } = useRegistration();
  const [featuredTraining, setFeaturedTraining] = useState<TrainingProgram[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [featuredMedia, setFeaturedMedia] = useState<Media[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  const [activeVideo, setActiveVideo] = useState<Media | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      const programs = await getTrainingPrograms();
      setFeaturedTraining(programs.filter(p => p.featured).slice(0, 3));

      const upEvts = await getEvents('upcoming');
      setUpcomingEvents(upEvts);

      const pastEvts = await getEvents('past');
      setPastEvents(pastEvts.slice(0, 2));

      const med = await getMedia();
      setFeaturedMedia(med.filter(m => m.featured).slice(0, 3));

      const comms = await getCommunities();
      setCommunities(comms.slice(0, 3));

      const st = await getStories();
      setStories(st.slice(0, 2));

      const ach = await getAchievements();
      setAchievements(ach.slice(0, 2));
    }
    loadHomeData();
  }, []);

  const openRsvp = (evt: Event) => {
    setSelectedEvent(evt);
    setIsRsvpOpen(true);
  };

  const openVideo = (m: Media) => {
    setActiveVideo(m);
    setIsVideoModalOpen(true);
  };

  const marqueeItems = [
    'ARTIFICIAL INTELLIGENCE',
    'CYBERSECURITY',
    'DISTRIBUTED SYSTEMS',
    'DESIGN & UX',
    'GENIUSPHERE SCHOOL SERIES',
    'COMMUNITY WORKSHOPS',
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12 pt-24 sm:pt-32 bg-white text-slate-900">
      
      {/* ==========================================
          01. HERO SECTION (High Quality Institutional Media + Messaging)
         ========================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full uppercase tracking-wider shadow-sm border border-indigo-100">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              Brandex Community & Education
            </span>

            <div className="min-h-[60px] sm:min-h-[75px] flex items-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-slate-900 tracking-tight leading-tight flex flex-wrap gap-x-3 items-center">
                <span>Learn.</span>
                <span>Build.</span>
                <TypewriterText words={["Share.", "Showcase.", "Scale.", "Grow."]} />
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
              The digital home showcasing technology communities, educational workshops, student achievements, and live events.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => openModal('community')}
                className="btn-primary px-8 py-4 group hover:shadow-indigo-500/30 hover:shadow-md"
              >
                <span>Access Member Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <NavLink
                to="/education"
                className="btn-secondary px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all hover:scale-[1.02]"
              >
                <span>View Academic Courses</span>
              </NavLink>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full overflow-hidden">
              <div className="absolute inset-0 bg-purple-600/15 mix-blend-color z-20 pointer-events-none" />
              <img 
                src="/geniusphere-collab-indigo.jpg" 
                alt="Geniusphere School Coding Workshop" 
                className="w-full h-auto object-cover relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <Marquee items={marqueeItems} />

      {/* ==========================================
          02. IMPACT / STATISTICS (Configurable Admin Telemetry)
         ========================================== */}
      <div className="bg-slate-50/50">
        <ImpactStatisticsSection />
      </div>

      {/* ==========================================
          03. WHAT BRANDEX OFFERS
         ========================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 py-10">
        <FadeIn>
          <SectionHeading
            tag="SHOWCASE PILLARS"
            title="Core Platform Pillars"
            subtitle="Discover community initiatives, education pathways, technical training, and live events."
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Community',
              desc: 'Specialized technology domain circles in AI, Cybersecurity, and UX.',
              path: '/community',
              icon: Users,
              color: 'text-indigo-600 bg-indigo-50',
            },
            {
              title: 'Education',
              desc: 'School, college and student skill development initiatives.',
              path: '/education',
              icon: BookOpen,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              title: 'Training',
              desc: 'Cohort-based technical courses engineered by industry leads.',
              path: '/training',
              icon: Terminal,
              color: 'text-purple-600 bg-purple-50',
            },
            {
              title: 'Events',
              desc: 'School series, technical summits, and capture-the-flag wargames.',
              path: '/events',
              icon: Calendar,
              color: 'text-emerald-600 bg-emerald-50',
            },
          ].map((pillar, idx) => (
            <FadeIn key={pillar.title} delay={idx * 0.1}>
              <NavLink
                to={pillar.path}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between group hover:border-indigo-300 hover:shadow-lg transition-all duration-200 h-full"
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pillar.color}`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  
                  <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between mt-auto">
                  <span className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold group-hover:bg-indigo-700 transition-colors shadow-sm w-full justify-center">
                    View {pillar.title} Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </NavLink>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ==========================================
          04. UPCOMING EVENTS
         ========================================== */}
      <div className="bg-slate-50/50 py-10">
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24">
          <FadeIn>
            <SectionHeading
              tag="UPCOMING EVENTS"
              title="Upcoming Live Events"
              subtitle="Explore upcoming events and register via external URLs."
              actionText="View Scheduled Events"
              actionPath="/events"
            />
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto mt-8">
            {upcomingEvents.map((evt, idx) => (
              <FadeIn key={evt.id} delay={idx * 0.1}>
                <EventCard event={evt} onRegisterClick={openRsvp} />
              </FadeIn>
            ))}
          </div>
        </section>
      </div>

      {/* ==========================================
      {/* ==========================================
          05. STORIES & ACHIEVEMENTS SHOWCASE
         ========================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 py-10">
        <FadeIn>
          <SectionHeading
            tag="STORIES & ACHIEVEMENTS"
            title="Platform Impact Stories"
            subtitle="Documenting student achievements, workshop breakthroughs, and community awards."
            actionText="View Published Stories"
            actionPath="/stories"
          />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Stories Column */}
          <div className="lg:col-span-7 space-y-6">
            {stories.map((story, idx) => (
              <FadeIn key={story.id} delay={idx * 0.1}>
                <NavLink
                  to={`/stories/${story.slug}`}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row gap-5 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <img
                  src={story.coverImage || '/brandex-full-logo.png'}
                  alt={story.title}
                  className="w-full sm:w-44 h-32 object-cover rounded-lg shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {story.category}
                  </span>
                  <h4 className="font-display font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {story.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>
              </NavLink>
              </FadeIn>
            ))}
          </div>

          {/* Achievements Sidebar */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Recognitions and Awards</span>
            </h3>

            <div className="space-y-4">
              {achievements.map((ach) => (
                <div key={ach.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="text-indigo-600 font-semibold">{ach.category}</span>
                    <span>{ach.date}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {ach.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          06. BRANDEX IN ACTION (MEDIA HUB)
         ========================================== */}
      <div className="bg-slate-50/50 py-10 !mt-8 sm:!mt-12">
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24">
          <SectionHeading
            tag="MEDIA VAULT"
            title="Archived Video Recordings"
            subtitle="Explore recorded keynote talks, technical workshops, and video archives."
            actionText="Access Recorded Media"
            actionPath="/media"
            asButton={true}
          />

          <div className="overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-6 scrollbar-none snap-x">
            {featuredMedia.map((m, idx) => (
              <div key={m.id} className="w-[300px] sm:w-[360px] shrink-0 snap-start">
                <FadeIn delay={idx * 0.1}>
                  <MediaCard media={m} onPlayClick={openVideo} />
                </FadeIn>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ==========================================
          06b. FAQ SECTION
         ========================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 py-10 border-t border-slate-200">
        <FadeIn>
          <SectionHeading
            tag="FAQ"
            title="Platform FAQ Hub"
            subtitle="Common questions regarding the Brandex ecosystem, training cohorts, and community circles."
          />
        </FadeIn>

        <div className="w-full space-y-3 mt-8">
          {[
            {
              q: "What is the Brandex Showcase Ecosystem?",
              a: "Brandex is a hybrid education and tech showcase platform. We support emerging developers through domain circles in AI, Cybersecurity, and UX design, hosting workshops, curriculum series, and local summits."
            },
            {
              q: "Who can enroll in the training programs?",
              a: "Our educational courses are open to students (both high school and university levels) and self-taught software engineers. We offer cohort paths ranging from basic programming logic to industrial systems engineering."
            },
            {
              q: "Are credentials issued upon course completion?",
              a: "Yes. All students completing cohort training tracks receive verified digital completion credentials. These can be integrated into LinkedIn profiles and shared with hiring organizations."
            },
            {
              q: "How can academic institutions collaborate?",
              a: "We partner with schools and colleges to host custom training programs, technology events, and Capture The Flag cybersecurity wargames. Please email our administrative desk to set up a cohort strategy."
            },
            {
              q: "Where are the events and circles hosted?",
              a: "We operate a hybrid model. Circle meetings and developer labs are held virtually, while larger summits and workshops are organized at partner campus venues or our headquarters in Bangalore."
            },
            {
              q: "How do I check my career application status?",
              a: "If you applied for a vacancy or our Brand Ambassador cohort, navigate to our Careers Portal. Enter your submission email in the Status Tracker to get real-time evaluations of your application."
            }
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-200 bg-white transition-all rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-display font-bold text-base text-slate-900">{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 text-left">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          07. FINAL JOIN CTA
         ========================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 py-10 !mt-4 sm:!mt-6">
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 sm:p-12 text-left shadow-sm relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/30 to-purple-100/30 mix-blend-overlay pointer-events-none"></div>
          
          {/* Left Column: Text & Action */}
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-white text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider border border-indigo-100 shadow-sm">
                Get Connected
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 leading-tight">
                Access Member Ecosystem
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Participate in upcoming workshops, explore community initiatives, and connect with peers.
              </p>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={() => openModal('community')}
                className="btn-primary"
              >
                <span>Access Member Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual graphics / Social Proof / Stats to fill the space */}
          <div className="lg:col-span-5 relative z-10 flex justify-center lg:justify-end">
            <div className="bg-white/90 backdrop-blur-md border border-indigo-100/60 p-6 rounded-2xl shadow-xl max-w-sm w-full space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">PK</div>
                  <div className="w-9 h-9 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">SN</div>
                  <div className="w-9 h-9 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm">+</div>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">1,200+ Active Builders</p>
                  <p className="text-slate-500">Collaborating on projects</p>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="font-bold text-indigo-600 block text-sm">15+ Circles</span>
                  <span>Active Domains</span>
                </div>
                <div className="border-l border-slate-150 pl-4 flex-1">
                  <span className="font-bold text-indigo-600 block text-sm">Weekly Labs</span>
                  <span>Interactive Workshops</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Modal */}
      <EventRegistrationModal
        event={selectedEvent}
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
      />

      {/* Video Modal Player */}
      <VideoModalPlayer
        media={activeVideo}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

    </div>
  );
};
