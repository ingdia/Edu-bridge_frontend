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

export interface MentorSession {
  id: string;
  notes: string | null;
  scheduledFor: string;
  duration: number;
  status: string;
  location: string | null;
  meetingLink: string | null;
  student?: { user: { email: string }; fullName: string; gradeLevel: string } | null;
  mentor?: { user: { email: string }; expertise: string[] } | null;
}

export interface MentorDashboardStudent {
  studentId: string;
  fullName: string;
  gradeLevel: string;
  schoolName: string;
  completedModules: number;
  inProgressModules: number;
  averageScore: number | null;
  lastActivity: string | null;
  progressRecords: { moduleId: string; moduleTitle: string; score: number | null; isCompleted: boolean }[];
}

export interface MentorDashboard {
  students: MentorDashboardStudent[];
  summary: {
    totalStudents: number;
    averageScore: number | null;
    totalCompletedModules: number;
  };
}

// ─── Sessions ─────────────────────────────────────────────────

export async function fetchMentorSessions(status?: string): Promise<MentorSession[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const res = await apiFetch<{ success: boolean; data: MentorSession[] }>(`/api/mentorship/sessions/mentor?${params}`);
  return res.data ?? [];
}

export async function createMentorSession(body: {
  studentId: string;
  scheduledFor: string;
  duration: number;
  notes?: string;
  meetingLink?: string;
  location?: string;
}): Promise<MentorSession> {
  const res = await apiFetch<{ success: boolean; data: MentorSession }>('/api/mentorship/sessions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function cancelSession(id: string, reason?: string): Promise<void> {
  await apiFetch(`/api/mentorship/sessions/${id}/cancel`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  });
}

// ─── Mentor Dashboard ─────────────────────────────────────────

export async function fetchMentorDashboard(): Promise<MentorDashboard> {
  const res = await apiFetch<{ success: boolean; data: MentorDashboard }>('/api/progress/mentor/dashboard');
  return res.data;
}

// ─── Messages ─────────────────────────────────────────────────

export interface Conversation {
  otherUserId: string;
  otherUserName: string;
  otherUserRole: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await apiFetch<{ success: boolean; data: Conversation[] }>('/api/messages/conversations');
  return res.data ?? [];
}

export async function fetchConversation(otherUserId: string): Promise<ChatMessage[]> {
  const res = await apiFetch<{ success: boolean; data: ChatMessage[] }>(`/api/messages/conversation/${otherUserId}`);
  return res.data ?? [];
}

export async function sendMessage(receiverId: string, content: string): Promise<ChatMessage> {
  const res = await apiFetch<{ success: boolean; data: ChatMessage }>('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ receiverId, content }),
  });
  return res.data;
}

export async function markMessagesRead(otherUserId: string): Promise<void> {
  await apiFetch('/api/messages/mark-read', {
    method: 'PATCH',
    body: JSON.stringify({ otherUserId }),
  });
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await apiFetch<{ success: boolean; data: { count: number } }>('/api/messages/unread-count');
  return res.data?.count ?? 0;
}
