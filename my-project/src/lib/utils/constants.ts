export const APP_NAME = 'EDU-Bridge';
export const APP_TAGLINE = 'English, Digital Literacy & Career Guidance';

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  MENTOR:  'MENTOR',
  ADMIN:   'ADMIN',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  STUDENT: 'Student',
  MENTOR:  'Mentor',
  ADMIN:   'Administrator',
};

export const ROLE_REDIRECTS: Record<string, string> = {
  STUDENT: '/student',
  MENTOR:  '/mentor',
  ADMIN:   '/admin',
};

export const MODULE_TYPES = {
  ENGLISH:          'ENGLISH',
  DIGITAL_LITERACY: 'DIGITAL_LITERACY',
  CAREER:           'CAREER',
} as const;

export const MODULE_TYPE_LABELS: Record<string, string> = {
  ENGLISH:          'English',
  DIGITAL_LITERACY: 'Digital Literacy',
  CAREER:           'Career',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER:     'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED:     'Advanced',
};

export const OPPORTUNITY_TYPES = {
  SCHOLARSHIP: 'SCHOLARSHIP',
  INTERNSHIP:  'INTERNSHIP',
  JOB:         'JOB',
} as const;

export const SESSION_STATUS = {
  SCHEDULED:  'SCHEDULED',
  COMPLETED:  'COMPLETED',
  CANCELLED:  'CANCELLED',
} as const;

export const MAX_FILE_SIZE_MB = 10;
export const ACCEPTED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png'];
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_NOTE_LENGTH = 1000;
