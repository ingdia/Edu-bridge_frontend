export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  profilePhoto: string | null;
  school: string;
  gradeLevel: string;
}
