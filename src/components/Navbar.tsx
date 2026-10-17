/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NavbarProps {
  ongoingCount: number;
  upcomingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ ongoingCount, upcomingCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand title */}
        <div className="flex items-center gap-2 truncate">
          <div className="w-6 h-6 rounded-md bg-blue-900 text-amber-300 font-extrabold text-[10px] flex items-center justify-center tracking-tighter shrink-0 shadow-xs">
            BITS
          </div>
          <span className="font-bold text-sm text-slate-900 truncate">
            M.Tech AIML Now
          </span>
        </div>

        {/* Quick jump links on mobile & desktop */}
        <nav className="flex items-center gap-2 sm:gap-4 shrink-0 text-xs font-semibold">
          <a
            href="#ongoing"
            className="px-2.5 py-1.5 rounded-lg text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <span>Ongoing</span>
            <span className="font-mono text-[11px] font-bold">({ongoingCount})</span>
          </a>
          <a
            href="#upcoming"
            className="px-2.5 py-1.5 rounded-lg text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <span>Upcoming</span>
            <span className="font-mono text-[11px] font-bold">({upcomingCount})</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
