/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Subject Enum with exactly the 4 subjects for BITS M.Tech AIML + General & All.
 */
export enum SubjectEnum {
  ALL = 'ALL',
  DEEP_LEARNING = 'DEEP_LEARNING',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
  ISM = 'ISM',
  MFML = 'MFML',
  GENERAL = 'GENERAL',
}

/**
 * Category enum: whether an event is tied to a specific subject or is general.
 */
export enum EventCategory {
  SUBJECT = 'SUBJECT',
  GENERAL = 'GENERAL',
}

/**
 * Main Notice Event Interface.
 * Note: Location and link fields have been removed per specification.
 */
export interface NoticeEvent {
  id: string;
  title: string;
  miniDescription: string;
  category: EventCategory | 'SUBJECT' | 'GENERAL';
  subject: SubjectEnum | keyof typeof SubjectEnum;
  startDate: string; // ISO 8601 string
  endDate: string;   // ISO 8601 string
}

/**
 * Subject metadata configuration.
 */
export interface SubjectMeta {
  enumValue: SubjectEnum;
  name: string;
  shortName: string;
}

export const SUBJECT_METADATA: Record<SubjectEnum, SubjectMeta> = {
  [SubjectEnum.ALL]: {
    enumValue: SubjectEnum.ALL,
    name: 'All Subjects',
    shortName: 'All',
  },
  [SubjectEnum.DEEP_LEARNING]: {
    enumValue: SubjectEnum.DEEP_LEARNING,
    name: 'Deep Learning',
    shortName: 'Deep Learning',
  },
  [SubjectEnum.MACHINE_LEARNING]: {
    enumValue: SubjectEnum.MACHINE_LEARNING,
    name: 'Machine Learning',
    shortName: 'Machine Learning',
  },
  [SubjectEnum.ISM]: {
    enumValue: SubjectEnum.ISM,
    name: 'ISM',
    shortName: 'ISM',
  },
  [SubjectEnum.MFML]: {
    enumValue: SubjectEnum.MFML,
    name: 'MFML',
    shortName: 'MFML',
  },
  [SubjectEnum.GENERAL]: {
    enumValue: SubjectEnum.GENERAL,
    name: 'General',
    shortName: 'General',
  },
};
