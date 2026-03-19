export type OpportunityType = 'SCHOLARSHIP' | 'INTERNSHIP' | 'JOB';
export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  description: string;
  requirements: string[];
  deadline: string;
  location: string;
  isRemote: boolean;
  minGrade: number;
  requiredSkills: string[];
  isActive: boolean;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  mentorId: string;
  studentIds: string[];
  status: SessionStatus;
  meetingLink?: string;
}

export interface TopPerformer {
  studentId: string;
  fullName: string;
  averageScore: number;
  completedModules: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}

export interface AdminStats {
  totalStudents: number;
  totalMentors: number;
  activeModules: number;
  completionRate: number;
  topPerformers: TopPerformer[];
  recentActivity: ActivityLog[];
}
