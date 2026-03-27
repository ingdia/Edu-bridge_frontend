const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || json.error || 'Request failed');
  return json;
}

// ─── Types ────────────────────────────────────────────────────

export interface StudentModule {
  id: string;
  title: string;
  description: string | null;
  type: string;
  difficulty: string;
  estimatedDuration: number | null;
  orderIndex: number;
  progress: {
    score: number | null;
    completedAt: string | null;
    timeSpent: number | null;
    isCompleted: boolean;
  } | null;
}

export interface ProgressRecord {
  id: string;
  moduleId: string;
  score: number | null;
  timeSpent: number | null;
  completedAt: string | null;
  status: 'completed' | 'in_progress';
  module: { id: string; title: string; type: string; difficulty: string; estimatedDuration: number | null };
}

export interface ProgressSummary {
  totalModules: number;
  completed: number;
  inProgress: number;
  completionRate: number;
  averageScore: number | null;
  totalTimeSpent: number;
}

export interface StudentSession {
  id: string;
  notes: string | null;
  scheduledFor: string;
  duration: number;
  status: string;
  location: string | null;
  meetingLink: string | null;
  mentor: { user: { email: string }; expertise: string[] } | null;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'SCHOLARSHIP' | 'INTERNSHIP' | 'JOB' | 'UNIVERSITY' | 'TRAINING';
  description: string;
  deadline: string | null;
  location: string | null;
  isActive: boolean;
  requiredSkills: string[];
  gradeLevel: string[];
  applicationUrl: string | null;
  matchScore?: number;
}

export interface Application {
  id: string;
  position: string;
  organization: string;
  status: string;
  createdAt: string;
}

// ─── Modules ──────────────────────────────────────────────────

export async function fetchStudentModules(): Promise<StudentModule[]> {
  const res = await apiFetch<{ success: boolean; data: { modulesWithProgress: StudentModule[] } }>('/api/modules/student');
  return res.data.modulesWithProgress ?? [];
}

// ─── Progress ─────────────────────────────────────────────────

export async function fetchStudentProgress(): Promise<{ progress: ProgressRecord[]; summary: ProgressSummary }> {
  const res = await apiFetch<{ success: boolean; data: { progress: ProgressRecord[]; summary: ProgressSummary } }>('/api/progress/me');
  return res.data;
}

export async function submitProgress(body: {
  moduleId: string;
  score?: number;
  timeSpent?: number;
  completedAt?: string;
}): Promise<void> {
  await apiFetch('/api/progress/submit', { method: 'POST', body: JSON.stringify(body) });
}

// ─── Sessions ─────────────────────────────────────────────────

export async function fetchStudentSessions(status?: string): Promise<StudentSession[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const res = await apiFetch<{ success: boolean; data: StudentSession[] }>(`/api/mentorship/sessions/student?${params}`);
  return res.data ?? [];
}

// ─── Opportunities ────────────────────────────────────────────

export async function fetchMatchedOpportunities(): Promise<Opportunity[]> {
  const res = await apiFetch<{ success: boolean; data: Opportunity[] }>('/api/opportunities/matched');
  return res.data ?? [];
}

export async function fetchOpportunities(type?: string): Promise<Opportunity[]> {
  const params = new URLSearchParams();
  if (type && type !== 'ALL') params.set('type', type);
  const res = await apiFetch<{ success: boolean; data: { opportunities: Opportunity[]; pagination: any } }>(`/api/opportunities?${params}`);
  return res.data?.opportunities ?? res.data ?? [];
}

export async function applyToOpportunity(id: string): Promise<void> {
  await apiFetch(`/api/opportunities/${id}/apply`, { method: 'POST' });
}

// ─── Career / Applications ────────────────────────────────────

export async function fetchMyApplications(): Promise<Application[]> {
  const res = await apiFetch<{ success: boolean; data: Application[] }>('/api/career/applications');
  return res.data ?? [];
}

export async function createApplication(body: {
  position: string;
  organization: string;
  type: string;
  coverLetter?: string;
}): Promise<Application> {
  const res = await apiFetch<{ success: boolean; data: Application }>('/api/career/applications', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.data;
}
