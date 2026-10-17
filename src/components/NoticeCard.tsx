/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NoticeEvent, SUBJECT_METADATA, SubjectEnum } from '../types/notice';
import { calculateCountdown, formatEventSchedule, createGoogleCalendarUrl } from '../utils/dateUtils';
import { Calendar, Clock, CalendarPlus } from 'lucide-react';

interface NoticeCardProps {
  event: NoticeEvent;
  status: 'ONGOING' | 'UPCOMING';
  currentTime: Date;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  event,
  status,
  currentTime,
}) => {
  const subjectKey = (event.subject as SubjectEnum) || SubjectEnum.GENERAL;
  const subjectMeta = SUBJECT_METADATA[subjectKey] || {
    name: event.subject,
    shortName: event.subject,
  };

  const schedule = formatEventSchedule(event.startDate, event.endDate);
  const ongoingCountdown = calculateCountdown(event.endDate, currentTime);
  const upcomingCountdown = calculateCountdown(event.startDate, currentTime);
  const googleCalendarUrl = createGoogleCalendarUrl(event, status);

  return (
    <article className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between">
      <div>
        {/* Top row: Category & Subject on Left; Countdown on TOP RIGHT */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          
          {/* Category & Subject Name */}
          <div className="min-w-0 pr-1 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={event.category === 'SUBJECT' ? 'text-blue-700 font-semibold' : 'text-slate-600 font-semibold'}>
                {event.category === 'SUBJECT' ? 'Subject' : 'General'}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-800 font-bold truncate">
                {subjectMeta.name}
              </span>
            </div>
          </div>

          {/* Top Right: Time Left (Ongoing) or Time to Start (Upcoming) */}
          <div className="shrink-0 text-right">
            {status === 'ONGOING' ? (
              <div className="flex flex-col items-end">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Time Left
                </span>
                <span className="font-mono tabular-nums text-xs sm:text-sm font-bold tracking-tight text-emerald-800 mt-0.5">
                  {ongoingCountdown.formattedText}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-600" />
                  Time to Start
                </span>
                <span className="font-mono tabular-nums text-xs sm:text-sm font-bold tracking-tight text-indigo-900 mt-0.5">
                  {upcomingCountdown.formattedText}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {event.title}
        </h3>

        {/* Mini Description (only rendered if present) */}
        {event.miniDescription ? (
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {event.miniDescription}
          </p>
        ) : null}
      </div>

      <div>
        {/* Start & End Dates */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-start sm:items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium text-slate-700">Starts:</span>
              <span className="font-mono tabular-nums">{schedule.startFormatted}</span>
            </div>
          </div>
          
          <div className="flex items-start sm:items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium text-slate-700">Ends:</span>
              <span className="font-mono tabular-nums">{schedule.endFormatted}</span>
              {schedule.durationLabel && (
                <span className="text-slate-400 font-normal">({schedule.durationLabel})</span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Google Calendar Button */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 hover:text-slate-900 transition-colors shadow-2xs"
            title={status === 'ONGOING' ? 'Add deadline to Google Calendar' : 'Add event to Google Calendar'}
          >
            <CalendarPlus className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>Add to Calendar</span>
          </a>
        </div>
      </div>
    </article>
  );
};
