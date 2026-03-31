import { apiFetch } from './fetchClient';

export interface MentorOption {
  id: string;
  expertise: string[];
  bio: string | null;
  school: { name: string } | null;
  user: { email: string };
}

export interface StudentRequest {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  note: string | null;
  rejectNote: string | null;
  createdAt: string;
  mentor?: MentorOption;
  student?: {
    id: string;
    fullName: string;
    gradeLevel: string;
    schoolName: string;
    user: { email: string };
  };
}

// Student: get approved mentors at their school
export async function fetchSchoolMentors(): Promise<MentorOption[]> {
  const res = await apiFetch<{ success: boolean; data: MentorOption[] }>('/api/student-requests/mentors');
  return res.data ?? [];
}

// Student: send a request to a mentor
export async function sendMentorRequest(mentorId: string, note?: string): Promise<void> {
  await apiFetch('/api/student-requests', {
    method: 'POST',
    body: JSON.stringify({ mentorId, note }),
  });
}

// Student: get their own requests
export async function fetchMyRequests(): Promise<StudentRequest[]> {
  const res = await apiFetch<{ success: boolean; data: StudentRequest[] }>('/api/student-requests/my');
  return res.data ?? [];
}

// Mentor: get pending student requests
export async function fetchStudentRequests(): Promise<StudentRequest[]> {
  const res = await apiFetch<{ success: boolean; data: StudentRequest[] }>('/api/student-requests/pending');
  return res.data ?? [];
}

// Mentor: approve a student
export async function approveStudentRequest(requestId: string): Promise<void> {
  await apiFetch(`/api/student-requests/${requestId}/approve`, { method: 'PATCH' });
}

// Mentor: reject a student
export async function rejectStudentRequest(requestId: string, reason?: string): Promise<void> {
  await apiFetch(`/api/student-requests/${requestId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}
