import { apiFetch } from './fetchClient';

export interface School {
  id: string;
  name: string;
  district: string | null;
  province: string | null;
  isActive?: boolean;
}

export interface MentorAccessRequest {
  id: string;
  accessStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  accessNote: string | null;
  expertise: string[];
  createdAt: string;
  user: { id: string; email: string; isActive: boolean; createdAt: string };
  school: { id: string; name: string } | null;
}

// ─── Schools ──────────────────────────────────────────────────

export async function fetchSchools(): Promise<School[]> {
  const res = await apiFetch<{ success: boolean; data: School[] }>('/api/schools');
  return res.data ?? [];
}

export async function createSchool(body: { name: string; district?: string; province?: string }): Promise<School> {
  const res = await apiFetch<{ success: boolean; data: School }>('/api/schools', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function updateSchool(id: string, body: Partial<{ name: string; district: string; province: string; isActive: boolean }>): Promise<School> {
  const res = await apiFetch<{ success: boolean; data: School }>(`/api/schools/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function deleteSchool(id: string): Promise<void> {
  await apiFetch(`/api/schools/${id}`, { method: 'DELETE' });
}

// ─── Mentor Access ────────────────────────────────────────────

export async function fetchMentorRequests(status?: string): Promise<MentorAccessRequest[]> {
  const params = status && status !== 'ALL' ? `?status=${status}` : '';
  const res = await apiFetch<{ success: boolean; data: MentorAccessRequest[] }>(`/api/mentor-access${params}`);
  return res.data ?? [];
}

export async function approveMentor(mentorProfileId: string, schoolId?: string): Promise<void> {
  await apiFetch(`/api/mentor-access/${mentorProfileId}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ schoolId }),
  });
}

export async function rejectMentor(mentorProfileId: string, reason?: string): Promise<void> {
  await apiFetch(`/api/mentor-access/${mentorProfileId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

export async function assignMentorToSchool(mentorProfileId: string, schoolId: string): Promise<void> {
  await apiFetch(`/api/mentor-access/${mentorProfileId}/assign-school`, {
    method: 'PATCH',
    body: JSON.stringify({ schoolId }),
  });
}

// ─── Mentor Module Assignment ─────────────────────────────────

export async function fetchMentorModules(mentorProfileId: string): Promise<{ id: string; title: string; type: string; difficulty: string }[]> {
  const res = await apiFetch<{ success: boolean; data: any[] }>(`/api/mentor-access/${mentorProfileId}/modules`);
  return res.data ?? [];
}

export async function assignModuleToMentor(mentorProfileId: string, moduleId: string): Promise<void> {
  await apiFetch(`/api/mentor-access/${mentorProfileId}/modules`, {
    method: 'POST',
    body: JSON.stringify({ moduleId }),
  });
}

export async function unassignModuleFromMentor(mentorProfileId: string, moduleId: string): Promise<void> {
  await apiFetch(`/api/mentor-access/${mentorProfileId}/modules/${moduleId}`, { method: 'DELETE' });
}
