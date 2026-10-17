/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NoticeEvent } from '../types/notice';

export type EventStatus = 'ONGOING' | 'UPCOMING' | 'COMPLETED';

/**
 * Determine if an event is currently ONGOING, UPCOMING, or COMPLETED.
 */
export function getEventStatus(event: NoticeEvent, now: Date = new Date()): EventStatus {
  const start = new Date(event.startDate).getTime();
  const end = new Date(event.endDate).getTime();
  const current = now.getTime();

  if (isNaN(start) || isNaN(end)) {
    return 'UPCOMING';
  }

  if (current >= start && current <= end) {
    return 'ONGOING';
  } else if (current < start) {
    return 'UPCOMING';
  } else {
    return 'COMPLETED';
  }
}

/**
 * Detailed countdown time structure.
 */
export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  formattedText: string;
  isUrgent: boolean;
}

/**
 * Calculates countdown from reference date to target date.
 */
export function calculateCountdown(targetIso: string, referenceDate: Date = new Date()): CountdownResult {
  const target = new Date(targetIso).getTime();
  const current = referenceDate.getTime();
  const diff = target - current;

  if (diff <= 0 || isNaN(target)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      formattedText: '00:00:00',
      isUrgent: false,
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  let formattedText = '';
  if (days > 0) {
    formattedText = `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  } else if (hours > 0) {
    formattedText = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  } else {
    formattedText = `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }

  // Urgent if less than 6 hours remaining
  const isUrgent = diff < 6 * 60 * 60 * 1000;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diff,
    formattedText,
    isUrgent,
  };
}

/**
 * Formats start and end dates cleanly.
 */
export function formatEventSchedule(startDateIso: string, endDateIso: string): {
  startFormatted: string;
  endFormatted: string;
  isSameDay: boolean;
  durationLabel: string;
} {
  const start = new Date(startDateIso);
  const end = new Date(endDateIso);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      startFormatted: startDateIso || 'N/A',
      endFormatted: endDateIso || 'N/A',
      isSameDay: false,
      durationLabel: '',
    };
  }

  const isSameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const durationMs = end.getTime() - start.getTime();
  const durationHours = Math.round(durationMs / (1000 * 60 * 60));
  const durationLabel = durationHours < 24 ? `${durationHours}h duration` : `${Math.round(durationHours / 24)}d window`;

  return {
    startFormatted: `${dateFormatter.format(start)} at ${timeFormatter.format(start)} IST`,
    endFormatted: `${dateFormatter.format(end)} at ${timeFormatter.format(end)} IST`,
    isSameDay,
    durationLabel,
  };
}

/**
 * Format ISO date string into UTC string for Google Calendar URL (YYYYMMDDTHHmmssZ).
 */
export function formatToGoogleCalendarUtc(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Generates Google Calendar web URL.
 * - For ongoing events: only the end date (deadline).
 * - For upcoming events: both start and end dates.
 */
export function createGoogleCalendarUrl(
  event: NoticeEvent,
  status: 'ONGOING' | 'UPCOMING'
): string {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.miniDescription ? `${event.title} - ${event.miniDescription}` : event.title);

  const endUtc = formatToGoogleCalendarUtc(event.endDate);

  let datesParam: string;
  if (status === 'ONGOING') {
    // For ongoing events, use only the end date (marks deadline)
    datesParam = `${endUtc}/${endUtc}`;
  } else {
    // For upcoming events, use both start and end date
    const startUtc = formatToGoogleCalendarUtc(event.startDate);
    datesParam = `${startUtc}/${endUtc}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}`;
}

/**
 * Computes progress percentage for ongoing event (0 to 100).
 */
export function getOngoingProgress(startDateIso: string, endDateIso: string, now: Date = new Date()): number {
  const start = new Date(startDateIso).getTime();
  const end = new Date(endDateIso).getTime();
  const current = now.getTime();

  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  if (current <= start) return 0;
  if (current >= end) return 100;

  return Math.min(100, Math.max(0, ((current - start) / (end - start)) * 100));
}

/**
 * Shift sample event dates relative to today's date so demo never gets outdated.
 */
export function shiftEventsRelativeToNow(events: NoticeEvent[]): NoticeEvent[] {
  const now = new Date();
  
  // Set reference times
  return events.map((ev, idx) => {
    const originalStart = new Date(ev.startDate);
    const originalEnd = new Date(ev.endDate);
    const duration = originalEnd.getTime() - originalStart.getTime();

    let newStart: Date;
    let newEnd: Date;

    if (idx === 0) {
      // Ongoing: started 4 hours ago, ends in 6 hours
      newStart = new Date(now.getTime() - 4 * 60 * 60 * 1000);
      newEnd = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    } else if (idx === 1) {
      // Ongoing: started yesterday, ends tomorrow in 24 hours
      newStart = new Date(now.getTime() - 18 * 60 * 60 * 1000);
      newEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000);
    } else if (idx === 2) {
      // Ongoing: started 2 days ago, ends in 18 hours
      newStart = new Date(now.getTime() - 36 * 60 * 60 * 1000);
      newEnd = new Date(now.getTime() + 18 * 60 * 60 * 1000);
    } else if (idx === 3) {
      // Upcoming: starts in 3 hours
      newStart = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      newEnd = new Date(newStart.getTime() + 2 * 60 * 60 * 1000);
    } else if (idx === 4) {
      // Upcoming: starts tomorrow morning (+18h)
      newStart = new Date(now.getTime() + 18 * 60 * 60 * 1000);
      newEnd = new Date(newStart.getTime() + 3 * 60 * 60 * 1000);
    } else if (idx === 5) {
      // Upcoming: starts in 2 days
      newStart = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      newEnd = new Date(newStart.getTime() + 2 * 60 * 60 * 1000);
    } else if (idx === 6) {
      // Upcoming: starts in 4 days
      newStart = new Date(now.getTime() + 96 * 60 * 60 * 1000);
      newEnd = new Date(newStart.getTime() + 48 * 60 * 60 * 1000);
    } else {
      // Upcoming later
      const offsetDays = idx;
      newStart = new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000);
      newEnd = new Date(newStart.getTime() + (duration > 0 ? duration : 24 * 60 * 60 * 1000));
    }

    return {
      ...ev,
      startDate: newStart.toISOString(),
      endDate: newEnd.toISOString(),
    };
  });
}
