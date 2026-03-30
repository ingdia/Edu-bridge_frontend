import { apiFetch } from './fetchClient';

// ─── Types ────────────────────────────────────────────────────

export interface MentorSession {
  id: string;
  notes: string | null;
  scheduledFor: string;
  duration: number;
  status: string;
  location: string | null;
  meetingLink: string | null;
  student?: { fullName: string; gradeLevel?: string } | null;
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
  const res = await apiFetch<{ success: boolean; data: any }>(`/api/mentorship/sessions/mentor?${params}`);
  return Array.isArray(res.data) ? res.data : (res.data?.sessions ?? []);
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
    body: JSON.stringify({ reason: reason || 'Cancelled by mentor' }),
  });
}

// ─── Mentor Dashboard ─────────────────────────────────────────

export async function fetchMentorDashboard(): Promise<MentorDashboard> {
  const res = await apiFetch<{ success: boolean; data: { students: any[]; summary: any } }>('/api/progress/mentor/dashboard');
  const raw = res.data;
  const students: MentorDashboardStudent[] = (raw.students ?? []).map((s: any) => ({
    studentId:         s.student?.id         ?? s.studentId         ?? '',
    fullName:          s.student?.fullName   ?? s.fullName          ?? 'Unknown',
    gradeLevel:        s.student?.gradeLevel ?? s.gradeLevel        ?? '',
    schoolName:        s.student?.schoolName ?? s.schoolName        ?? '',
    completedModules:  s.stats?.completed    ?? s.completedModules  ?? 0,
    inProgressModules: s.stats?.inProgress   ?? s.inProgressModules ?? 0,
    averageScore:      s.stats?.avgScore     ?? s.averageScore      ?? null,
    lastActivity:      s.lastActivity        ?? null,
    progressRecords:   (s.progress ?? []).map((p: any) => ({
      moduleId:    p.moduleId      ?? p.module?.id    ?? '',
      moduleTitle: p.module?.title ?? p.moduleTitle   ?? '',
      score:       p.score         ?? null,
      isCompleted: p.status === 'completed' || !!p.completedAt,
    })),
  }));
  return {
    students,
    summary: {
      totalStudents:         raw.summary?.totalStudents         ?? students.length,
      averageScore:          raw.summary?.avgCompletionRate     ?? null,
      totalCompletedModules: raw.summary?.totalCompletedModules ?? 0,
    },
  };
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
  senderUserId: string;
  recipientUserId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await apiFetch<{ success: boolean; data: { conversations: any[] } }>('/api/messages/conversations');
  const raw = res.data?.conversations ?? [];
  // Normalize backend shape (userId/userName/userRole) to our Conversation interface
  return raw.map((c: any) => ({
    otherUserId:   c.userId       ?? c.otherUserId,
    otherUserName: c.userName     ?? c.otherUserName ?? 'Unknown',
    otherUserRole: c.userRole     ?? c.otherUserRole ?? '',
    lastMessage:   c.lastMessage  ?? '',
    lastMessageAt: c.lastMessageAt ?? c.createdAt ?? new Date().toISOString(),
    unreadCount:   c.unreadCount  ?? 0,
  }));
}

export async function fetchConversation(otherUserId: string): Promise<ChatMessage[]> {
  const res = await apiFetch<{ success: boolean; data: { messages: any[]; pagination: any } | any[] }>(`/api/messages/conversation/${otherUserId}`);
  // Handle both flat array and wrapped { messages: [] } shapes
  const raw = Array.isArray(res.data) ? res.data : (res.data as any)?.messages ?? [];
  return raw;
}

export async function sendMessage(receiverId: string, content: string): Promise<ChatMessage> {
  const res = await apiFetch<{ success: boolean; data: { message: any } }>('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ recipientUserId: receiverId, content }),
  });
  return res.data?.message ?? res.data;
}

export async function markMessagesRead(otherUserId: string): Promise<void> {
  // Fetch unread message IDs from this sender then mark them read
  try {
    const res = await apiFetch<{ success: boolean; data: { messages: any[] } }>(`/api/messages/conversation/${otherUserId}`);
    const messages = Array.isArray(res.data) ? res.data : (res.data as any)?.messages ?? [];
    const unreadIds = messages
      .filter((m: any) => !m.isRead && m.recipientUserId !== otherUserId)
      .map((m: any) => m.id);
    if (unreadIds.length === 0) return;
    await apiFetch('/api/messages/mark-read', {
      method: 'PATCH',
      body: JSON.stringify({ messageIds: unreadIds }),
    });
  } catch { /* silent */ }
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await apiFetch<{ success: boolean; data: { unreadCount: number } }>('/api/messages/unread-count');
  return res.data?.unreadCount ?? 0;
}
