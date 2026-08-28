import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Calendar, BookOpen, FileText, Settings, Bell, Shield, ArrowUpRight } from 'lucide-react';
import { useRegistration } from '../contexts/RegistrationContext';
import { getTrainingPrograms, getEvents, getResources } from '../repositories/repository';
import { TrainingProgram, Event, Resource } from '../models/types';

export const AppDashboardPage: React.FC = () => {
  const { openModal } = useRegistration();
  const [enrolledPrograms, setEnrolledPrograms] = useState<TrainingProgram[]>([]);
  const [rsvpdEvents, setRsvpdEvents] = useState<Event[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);

  useEffect(() => {
    async function loadUserDashboard() {
      const programs = await getTrainingPrograms();
      setEnrolledPrograms(programs.slice(0, 2));

      const evts = await getEvents('upcoming');
      setRsvpdEvents(evts.slice(0, 1));

      const res = await getResources();
      setSavedResources(res.slice(0, 2));
    }
    loadUserDashboard();
  }, []);

  return (
    <div className="space-y-12 pb-20 pt-28 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white">
      
      {/* Top Banner */}
      <div className="border-2 border-[#0f142e] bg-white p-8 grid-lines flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-brutal">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#f8fafc] border-2 border-[#0f142e] flex items-center justify-center font-editorial font-bold text-xl text-[#0f142e]">
            AT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-[#4f46e5] bg-[#e0e7ff] border border-[#4f46e5]/30 px-2 py-0.5 font-bold">
                MEMBER ACCOUNT PREVIEW
              </span>
              <span className="font-mono text-xs text-[#475569] font-bold">ID: #BX-9042</span>
            </div>
            <h1 className="font-editorial font-bold text-2xl uppercase tracking-tight text-[#0f142e]">
              Welcome back, Alex Mercer
            </h1>
            <p className="font-sans text-xs text-[#475569]">
              Member of Artificial Intelligence & Cybersecurity Working Circles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('community')}
            className="border-2 border-[#0f142e] px-4 py-2 font-mono text-xs uppercase font-bold text-[#0f142e] hover:bg-[#f1f5f9]"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Enrolled Programs & RSVPs */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Enrolled Training Programs */}
          <div className="border-2 border-[#0f142e] bg-white p-6 space-y-4 grid-lines shadow-brutal-sm">
            <div className="flex items-center justify-between border-b-2 border-[#0f142e] pb-3">
              <h2 className="font-editorial font-bold text-xl uppercase tracking-tight text-[#0f142e] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#4f46e5]" />
                <span>Enrolled Training Cohorts</span>
              </h2>
              <NavLink to="/training" className="font-mono text-xs text-[#4f46e5] font-bold hover:underline">
                Catalog →
              </NavLink>
            </div>

            <div className="space-y-4">
              {enrolledPrograms.map((prog) => (
                <div key={prog.id} className="border-2 border-[#0f142e] p-4 bg-[#f8fafc] space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#4f46e5] font-bold">[{prog.category}]</span>
                    <span className="text-[#475569] font-bold">{prog.duration}</span>
                  </div>
                  <NavLink to={`/training/${prog.slug}`} className="font-editorial font-bold text-lg uppercase text-[#0f142e] hover:underline block">
                    {prog.title}
                  </NavLink>
                  <div className="w-full bg-[#e2e8f0] h-2 border border-[#0f142e] overflow-hidden mt-2">
                    <div className="bg-[#0f142e] h-full w-[45%]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#475569] font-bold block">Progress: 45% Completed (Module 02 Active)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Event RSVPs */}
          <div className="border-2 border-[#0f142e] bg-white p-6 space-y-4 grid-lines shadow-brutal-sm">
            <div className="flex items-center justify-between border-b-2 border-[#0f142e] pb-3">
              <h2 className="font-editorial font-bold text-xl uppercase tracking-tight text-[#0f142e] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#4f46e5]" />
                <span>My Registered Events</span>
              </h2>
              <NavLink to="/events" className="font-mono text-xs text-[#4f46e5] font-bold hover:underline">
                Events →
              </NavLink>
            </div>

            <div className="space-y-3">
              {rsvpdEvents.map((evt) => (
                <div key={evt.id} className="border-2 border-[#0f142e] p-4 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-[#4f46e5] font-bold block uppercase">{evt.date} · {evt.time}</span>
                    <NavLink to={`/events/${evt.slug}`} className="font-editorial font-bold text-base uppercase text-[#0f142e] hover:underline">
                      {evt.title}
                    </NavLink>
                    <span className="font-sans text-xs text-[#475569] block">{evt.location}</span>
                  </div>
                  <span className="font-mono text-xs text-[#4f46e5] font-bold bg-[#e0e7ff] border border-[#4f46e5]/30 px-3 py-1 shrink-0">
                    RSVP CONFIRMED
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Saved Resources & Community */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="border-2 border-[#0f142e] bg-white p-6 space-y-4 grid-lines shadow-brutal-sm">
            <h3 className="font-editorial font-bold text-lg uppercase text-[#0f142e] border-b-2 border-[#0f142e] pb-2">
              Saved Blueprints
            </h3>
            <div className="space-y-3 font-mono text-xs text-[#475569]">
              {savedResources.map((res) => (
                <div key={res.id} className="border border-[#0f142e] p-3 bg-[#f8fafc] space-y-1">
                  <span className="text-[#4f46e5] text-[10px] font-bold block">{res.type}</span>
                  <span className="text-[#0f142e] font-bold block">{res.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-[#0f142e] bg-[#f8fafc] p-6 space-y-3 font-mono text-xs text-[#475569] font-bold shadow-brutal-sm">
            <h3 className="font-editorial font-bold text-base uppercase text-[#0f142e]">
              Member Status
            </h3>
            <p>Account Type: Active Member</p>
            <p>Verification: Authenticated</p>
            <p>Joined: August 2026</p>
          </div>

        </div>

      </div>

    </div>
  );
};
