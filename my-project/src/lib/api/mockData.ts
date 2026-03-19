// src/lib/api/mockData.ts
import type { User } from '../types/user';
import type { Module } from '../types/module';
import type { ProgressData } from '../types/progress';
import type { Opportunity, Session, AdminStats } from '../types/api';

// ============ DUMMY DATA ============

export const mockUser: User = {
  id: 'usr_123',
  email: 'student@example.com',
  fullName: 'Jean Pierre Niyonzima',
  role: 'STUDENT',
  profilePhoto: null,
  school: 'GS Ruyenzi',
  gradeLevel: 'Senior 4',
};

export const mockModules: Module[] = [
  {
    id: 'mod_001',
    title: 'English: Listening Basics',
    description: 'Learn to understand everyday English conversations through interactive audio exercises.',
    type: 'ENGLISH',
    difficulty: 'BEGINNER',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
    exercises: [
      {
        id: 'ex_001',
        moduleId: 'mod_001',
        type: 'LISTENING',
        title: 'Greetings & Introductions',
        instructions: 'Listen to the conversation and answer the questions below.',
        content: {
          audioUrl: '/audio/greetings.mp3',
          questions: [
            { id: 'q1', question: 'What is the speaker\'s name?', options: ['Marie', 'John', 'Alice'], answer: 'Marie' },
            { id: 'q2', question: 'Where are they meeting?', options: ['School', 'Market', 'Bus stop'], answer: 'School' },
          ],
        },
        maxScore: 10,
      },
      {
        id: 'ex_002',
        moduleId: 'mod_001',
        type: 'SPEAKING',
        title: 'Practice Your Introduction',
        instructions: 'Record yourself introducing yourself in English.',
        content: {
          prompt: 'Say: Hello, my name is ___. I am a student at ___.',
          maxDuration: 60,
        },
        maxScore: 15,
      },
    ],
  },
  {
    id: 'mod_002',
    title: 'Digital: Email Essentials',
    description: 'Learn to write professional emails, attach files, and manage your inbox.',
    type: 'DIGITAL_LITERACY',
    difficulty: 'BEGINNER',
    isActive: true,
    createdAt: '2026-01-16T08:00:00Z',
    exercises: [
      {
        id: 'ex_003',
        moduleId: 'mod_002',
        type: 'DIGITAL_SKILL',
        title: 'Compose Your First Email',
        instructions: 'Practice writing a professional email to a teacher.',
        content: {
          template: {
            to: 'teacher@example.com',
            subject: 'Question about Assignment',
            body: 'Dear [Teacher],\n\nI am writing to ask about...\n\nThank you,\n[Your Name]',
          },
        },
        maxScore: 10,
      },
    ],
  },
  {
    id: 'mod_003',
    title: 'English: Reading Comprehension',
    description: 'Improve your reading skills with passages about Rwandan culture and global topics.',
    type: 'ENGLISH',
    difficulty: 'INTERMEDIATE',
    isActive: true,
    createdAt: '2026-01-17T08:00:00Z',
    exercises: [
      {
        id: 'ex_004',
        moduleId: 'mod_003',
        type: 'READING',
        title: 'The Importance of Education',
        instructions: 'Read the passage and answer the comprehension questions.',
        content: {
          passage: 'Education is the key to unlocking opportunities...',
          questions: [
            { id: 'q1', question: 'What is the main idea?', type: 'multiple-choice', options: ['A', 'B', 'C'], answer: 'A' },
          ],
        },
        maxScore: 12,
      },
    ],
  },
  {
    id: 'mod_004',
    title: 'English: Writing Practice',
    description: 'Practice writing paragraphs, essays, and formal letters in English.',
    type: 'ENGLISH',
    difficulty: 'INTERMEDIATE',
    isActive: true,
    createdAt: '2026-01-18T08:00:00Z',
    exercises: [
      {
        id: 'ex_005',
        moduleId: 'mod_004',
        type: 'WRITING',
        title: 'Write About Your Goals',
        instructions: 'Write a short paragraph about your future career goals.',
        content: {
          prompt: 'What do you want to be in the future? Why?',
          minLength: 50,
          maxLength: 200,
        },
        maxScore: 20,
      },
    ],
  },
];

export const mockProgress: ProgressData = {
  studentId: 'usr_123',
  modules: [
    {
      moduleId: 'mod_001',
      moduleTitle: 'English: Listening Basics',
      completedExercises: 1,
      totalExercises: 2,
      averageScore: 85,
      status: 'IN_PROGRESS',
    },
    {
      moduleId: 'mod_002',
      moduleTitle: 'Digital: Email Essentials',
      completedExercises: 1,
      totalExercises: 1,
      averageScore: 92,
      status: 'COMPLETED',
    },
    {
      moduleId: 'mod_003',
      moduleTitle: 'English: Reading Comprehension',
      completedExercises: 0,
      totalExercises: 1,
      averageScore: 0,
      status: 'NOT_STARTED',
    },
  ],
  overallScore: 88,
  lastUpdated: '2026-03-19T10:30:00Z',
};

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp_001',
    title: 'Scholarship: African Leadership University',
    organization: 'African Leadership University',
    type: 'SCHOLARSHIP',
    description: 'Full scholarship for outstanding secondary school graduates in Rwanda.',
    requirements: ['Senior 6 completion', 'English proficiency', 'Leadership potential'],
    deadline: '2026-06-30',
    location: 'Kigali, Rwanda',
    isRemote: false,
    minGrade: 75,
    requiredSkills: ['English', 'Leadership'],
    isActive: true,
  },
  {
    id: 'opp_002',
    title: 'Internship: Tech Hub Rwanda',
    organization: 'Tech Hub Rwanda',
    type: 'INTERNSHIP',
    description: '3-month internship in digital skills training and community outreach.',
    requirements: ['Basic computer skills', 'English communication', 'Availability weekends'],
    deadline: '2026-04-15',
    location: 'Kigali, Rwanda',
    isRemote: false,
    minGrade: 60,
    requiredSkills: ['Digital Literacy', 'Communication'],
    isActive: true,
  },
  {
    id: 'opp_003',
    title: 'Remote Job: Content Writer',
    organization: 'EduTech Africa',
    type: 'JOB',
    description: 'Part-time remote role creating educational content for students.',
    requirements: ['Strong English writing', 'Reliable internet', 'Self-motivated'],
    deadline: '2026-05-01',
    location: 'Remote',
    isRemote: true,
    minGrade: 70,
    requiredSkills: ['Writing', 'English'],
    isActive: true,
  },
];

export const mockSessions: Session[] = [
  {
    id: 'ses_001',
    title: 'Weekly Mentorship: English Practice',
    description: 'One-on-one session to practice speaking and get feedback on exercises.',
    startTime: '2026-03-25T14:00:00Z',
    endTime: '2026-03-25T15:00:00Z',
    mentorId: 'mnt_001',
    studentIds: ['usr_123'],
    status: 'SCHEDULED',
    meetingLink: 'https://meet.example.com/abc123',
  },
  {
    id: 'ses_002',
    title: 'Career Guidance: University Applications',
    description: 'Learn how to prepare strong university applications and personal statements.',
    startTime: '2026-04-01T14:00:00Z',
    endTime: '2026-04-01T15:30:00Z',
    mentorId: 'mnt_001',
    studentIds: ['usr_123', 'usr_124'],
    status: 'SCHEDULED',
  },
];

export const mockMentorStats: AdminStats = {
  totalStudents: 42,
  totalMentors: 5,
  activeModules: 8,
  completionRate: 68,
  topPerformers: [
    { studentId: 'usr_123', fullName: 'Jean Pierre Niyonzima', averageScore: 88, completedModules: 3 },
    { studentId: 'usr_124', fullName: 'Marie Uwimana', averageScore: 85, completedModules: 4 },
    { studentId: 'usr_125', fullName: 'Emmanuel Habimana', averageScore: 82, completedModules: 2 },
  ],
  recentActivity: [
    { id: 'act_1', userId: 'usr_123', action: 'Completed exercise: Email Essentials', timestamp: '2026-03-19T09:15:00Z' },
    { id: 'act_2', userId: 'mnt_001', action: 'Submitted feedback for Jean Pierre', timestamp: '2026-03-19T08:45:00Z' },
    { id: 'act_3', userId: 'usr_124', action: 'Started module: Reading Comprehension', timestamp: '2026-03-18T14:20:00Z' },
  ],
};