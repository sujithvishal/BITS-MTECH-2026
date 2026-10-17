/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import noticeEventsData from './data/noticeTemplate.json';
import { NoticeEvent, SubjectEnum } from './types/notice';
import { getEventStatus } from './utils/dateUtils';
import { Navbar } from './components/Navbar';
import { NoticeCard } from './components/NoticeCard';
import { SubjectFilterDropdown } from './components/SubjectFilterDropdown';
import { Radio, CalendarDays, Clock } from 'lucide-react';

export default function App() {
  // Live ticking time for countdown calculations
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Subject filter
  const [selectedSubject, setSelectedSubject] = useState<SubjectEnum>(SubjectEnum.ALL);

  // Mobile section tab toggle: 'ALL' | 'ONGOING' | 'UPCOMING'
  const [activeTab, setActiveTab] = useState<'ALL' | 'ONGOING' | 'UPCOMING'>('ALL');

  // Read directly from template JSON (edited only in code editor)
  const events = noticeEventsData as NoticeEvent[];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter events based on selected subject dropdown
  const filteredEvents = useMemo(() => {
    if (selectedSubject === SubjectEnum.ALL) {
      return events;
    }
    return events.filter((ev) => ev.subject === selectedSubject);
  }, [events, selectedSubject]);

  // Separate into Ongoing and Upcoming events
  const { ongoingEvents, upcomingEvents } = useMemo(() => {
    const ongoing: NoticeEvent[] = [];
    const upcoming: NoticeEvent[] = [];

    filteredEvents.forEach((ev) => {
      const status = getEventStatus(ev, currentTime);
      if (status === 'ONGOING') {
        ongoing.push(ev);
      } else if (status === 'UPCOMING') {
        upcoming.push(ev);
      }
    });

    ongoing.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return { ongoingEvents: ongoing, upcomingEvents: upcoming };
  }, [filteredEvents, currentTime]);

  // Subject event counts for the dropdown
  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((ev) => {
      counts[ev.subject] = (counts[ev.subject] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Formatted IST time
  const istTimeFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(currentTime);
  }, [currentTime]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        ongoingCount={ongoingEvents.length}
        upcomingCount={upcomingEvents.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-6">
        
        {/* Header Intro */}
        <section className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-blue-900">BITS Pilani</span>
              <span aria-hidden="true">·</span>
              <span>M.Tech AI &amp; ML</span>
            </div>
            
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-white border border-slate-200/90 rounded-md px-2 py-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{istTimeFormatted} IST</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Notice Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Live schedule for active submissions, quizzes, and upcoming sync lectures.
          </p>
        </section>

        {/* Dropdown for each subject or all subjects */}
        <section>
          <SubjectFilterDropdown
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            subjectCounts={subjectCounts}
            totalCount={events.length}
          />
        </section>

        {/* Mobile-Friendly Section Switcher (Thumb Zone tabs) */}
        <div className="flex items-center p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`flex-1 min-h-[38px] py-2 rounded-lg transition-all text-center ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Notices ({filteredEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ONGOING')}
            className={`flex-1 min-h-[38px] py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'ONGOING'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Ongoing ({ongoingEvents.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('UPCOMING')}
            className={`flex-1 min-h-[38px] py-2 rounded-lg transition-all text-center ${
              activeTab === 'UPCOMING'
                ? 'bg-white text-indigo-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingEvents.length})
          </button>
        </div>

        {/* SECTION 1: ONGOING EVENTS */}
        {(activeTab === 'ALL' || activeTab === 'ONGOING') && (
          <section id="ongoing" className="space-y-3.5 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>Ongoing Events</span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800">
                  {ongoingEvents.length}
                </span>
              </h2>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Time left shown on top right
              </span>
            </div>

            {ongoingEvents.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center text-xs text-slate-500">
                No ongoing events currently active for this subject.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {ongoingEvents.map((event) => (
                  <NoticeCard
                    key={event.id}
                    event={event}
                    status="ONGOING"
                    currentTime={currentTime}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: UPCOMING EVENTS */}
        {(activeTab === 'ALL' || activeTab === 'UPCOMING') && (
          <section id="upcoming" className="space-y-3.5 scroll-mt-20 pt-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                <span>Upcoming Events</span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100/70 text-indigo-800">
                  {upcomingEvents.length}
                </span>
              </h2>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Time to start shown on top right
              </span>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center text-xs text-slate-500">
                No upcoming events scheduled for this subject.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {upcomingEvents.map((event) => (
                  <NoticeCard
                    key={event.id}
                    event={event}
                    status="UPCOMING"
                    currentTime={currentTime}
                  />
                ))}
              </div>
            )}
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 py-6 text-xs text-slate-500 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <span>BITS Pilani · M.Tech AI &amp; ML</span>
        </div>
      </footer>
    </div>
  );
}
