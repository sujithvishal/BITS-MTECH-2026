/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SubjectEnum, SUBJECT_METADATA } from '../types/notice';
import { BookOpen, ChevronDown } from 'lucide-react';

interface SubjectFilterDropdownProps {
  selectedSubject: SubjectEnum;
  onSelectSubject: (subject: SubjectEnum) => void;
  subjectCounts: Record<string, number>;
  totalCount: number;
}

export const SubjectFilterDropdown: React.FC<SubjectFilterDropdownProps> = ({
  selectedSubject,
  onSelectSubject,
  subjectCounts,
  totalCount,
}) => {
  const subjectsList = Object.values(SubjectEnum);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Label */}
        <label
          htmlFor="subject-select"
          className="text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0"
        >
          <BookOpen className="w-4 h-4 text-blue-800" />
          <span>Filter by Subject:</span>
        </label>

        {/* Dropdown container */}
        <div className="relative w-full sm:w-auto sm:min-w-[340px]">
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={(e) => onSelectSubject(e.target.value as SubjectEnum)}
            aria-label="Filter events by subject"
            /* text-base on mobile prevents iOS Safari from auto-zooming in on focus, sm:text-sm for desktop */
            className="w-full appearance-none min-h-[46px] sm:min-h-[40px] pl-3.5 pr-10 py-2.5 text-base sm:text-sm bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-colors cursor-pointer"
          >
            {subjectsList.map((subj) => {
              const meta = SUBJECT_METADATA[subj];
              const count = subj === SubjectEnum.ALL ? totalCount : (subjectCounts[subj] || 0);
              const label = meta.name;

              return (
                <option key={subj} value={subj}>
                  {label} ({count})
                </option>
              );
            })}
          </select>

          {/* Custom Chevron icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

      </div>
    </div>
  );
};
