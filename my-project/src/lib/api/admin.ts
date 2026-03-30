import { apiFetch } from './fetchClient';

// ─── Types ────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  fullName: string | null;
  studentProfileId: string | null;
  gradeLevel: string | null;
  schoolName: string | null;
  expertise: string[] | null;
  accessStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
}

export interface AdminOverview {
  totalStudents: number;
  totalMentors: number;
  totalModules: number;
  totalSessions: number;
  activeStudents: number;
  completedSessions: number;
  pendingSubmissions: number;
}

export interface AdminModule {
  id: string;
  title: string;
  description: string | null;
  type: string;
  difficulty: string;
  isActive: boolean;
  orderIndex: number;
  estimatedDuration: number | null;
  createdAt: string;
  _count?: { progress: number; exerciseSubmissions: number };
}

export interface AdminOpportunity {
  id: string;
  title: string;
  organization: string;
  type: string;
  description: string;
  deadline: string | null;
  isActive: boolean;
  applyCount: number;
  viewCount: number;
  location: string | null;
  minGrade: string | null;
  createdAt: string;
}

export interface TopPerformer {
  fullName: string;
  gradeLevel: string;
  schoolName: string;
  averageScore: number;
  completedModules: number;
}

export interface ActivityItem {
  email: string;
  role: string;
  lastLogin: string;
}

// ─── Overview ─────────────────────────────────────────────────

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const res = await apiFetch<{ success: boolean; data: AdminOverview }>('/api/admin/dashboard/overview');
  return res.data;
}

export async function fetchTopPerformers(limit = 5): Promise<TopPerformer[]> {
  const res = await apiFetch<{ success: boolean; data: TopPerformer[] }>(`/api/admin/dashboard/top-performers?limit=${limit}`);
  return res.data;
}

export async function fetchSystemActivity(): Promise<{ recentLogins: ActivityItem[] }> {
  const res = await apiFetch<{ success: boolean; data: { recentLogins: ActivityItem[] } }>('/api/admin/dashboard/activity');
  return res.data;
}

// ─── Users ────────────────────────────────────────────────────

export async function fetchAdminUsers(role?: string, search?: string): Promise<AdminUser[]> {
  const params = new URLSearchParams();
  if (role && role !== 'ALL') params.set('role', role);
  if (search) params.set('search', search);
  const query = params.toString();
  const res = await apiFetch<{ success: boolean; data: AdminUser[] }>(`/api/admin/dashboard/users${query ? `?${query}` : ''}`);
  return res.data;
}

export async function toggleUserStatus(userId: string): Promise<{ id: string; isActive: boolean }> {
  const res = await apiFetch<{ success: boolean; data: { id: string; isActive: boolean } }>(
    `/api/admin/dashboard/users/${userId}/toggle-status`,
    { method: 'PATCH' }
  );
  return res.data;
}

// ─── Modules ──────────────────────────────────────────────────

export async function fetchAdminModules(type?: string): Promise<AdminModule[]> {
  const params = new URLSearchParams();
  if (type && type !== 'ALL') params.set('type', type);
  const query = params.toString();
  const res = await apiFetch<{ success: boolean; data: { modules: AdminModule[] } }>(`/api/modules${query ? `?${query}` : ''}`);
  return res.data.modules ?? [];
}

export async function createModule(body: {
  title: string;
  type: string;
  difficulty: string;
  contentUrl: string;
  description?: string;
  estimatedDuration?: number;
}): Promise<AdminModule> {
  const res = await apiFetch<{ success: boolean; data: { module: AdminModule } }>('/api/modules', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.data.module;
}

export async function updateModule(id: string, body: Partial<{ title: string; description: string; isActive: boolean }>): Promise<AdminModule> {
  const res = await apiFetch<{ success: boolean; data: { updatedModule: AdminModule } }>(`/api/modules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return res.data.updatedModule;
}

export async function toggleModuleStatus(id: string): Promise<AdminModule> {
  const res = await apiFetch<{ success: boolean; data: { updated: AdminModule } }>(`/api/modules/${id}/status`, {
    method: 'PATCH',
  });
  return res.data.updated;
}

export async function deleteModule(id: string): Promise<void> {
  await apiFetch(`/api/modules/${id}`, { method: 'DELETE' });
}

// ─── Opportunities ────────────────────────────────────────────

export async function fetchAdminOpportunities(type?: string): Promise<AdminOpportunity[]> {
  const params = new URLSearchParams();
  if (type && type !== 'ALL') params.set('type', type);
  const query = params.toString();
  const res = await apiFetch<{ success: boolean; data: any }>(`/api/opportunities${query ? `?${query}` : ''}`);
  // Handle both flat array and wrapped { opportunities: [] } shapes
  if (Array.isArray(res.data)) return res.data;
  return res.data?.opportunities ?? res.data?.data ?? [];
}

export async function createOpportunity(body: {
  title: string;
  organization: string;
  type: string;
  description: string;
  deadline?: string;
  location?: string;
  minGrade?: string;
  applicationUrl?: string;
}): Promise<AdminOpportunity> {
  const res = await apiFetch<{ success: boolean; data: AdminOpportunity }>('/api/opportunities', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function updateOpportunity(id: string, body: Partial<{
  title: string;
  organization: string;
  isActive: boolean;
  deadline: string;
}>): Promise<AdminOpportunity> {
  const res = await apiFetch<{ success: boolean; data: AdminOpportunity }>(`/api/opportunities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function deleteOpportunity(id: string): Promise<void> {
  await apiFetch(`/api/opportunities/${id}`, { method: 'DELETE' });
}

export interface ModuleEngagementItem {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  totalAttempts: number;
  completedCount: number;
  completionRate: string;
  averageScore: number;
  submissionsCount: number;
}

// ─── Reports ─────────────────────────────────────────────────

export interface AcademicReport {
  id: string;
  studentId: string;
  term: string;
  year: number;
  fileUrl: string;
  fileName: string | null;
  subjects: Record<string, any> | null;
  overallGrade: string | null;
  remarks: string | null;
  enteredBy: string;
  createdAt: string;
  student: { fullName: string; gradeLevel: string };
}

export async function fetchAllReports(term?: string, year?: number): Promise<AcademicReport[]> {
  const params = new URLSearchParams();
  if (term) params.set('term', term);
  if (year) params.set('year', String(year));
  const res = await apiFetch<{ success: boolean; data: AcademicReport[] }>(`/api/academic?${params}`);
  return res.data ?? [];
}

export async function submitManualReport(body: {
  studentId: string;
  term: string;
  year: number;
  subjects: Record<string, number>;
  overallGrade: string;
  remarks?: string;
}): Promise<AcademicReport> {
  const res = await apiFetch<{ success: boolean; data: AcademicReport }>('/api/academic/manual', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function deleteReport(reportId: string): Promise<void> {
  await apiFetch(`/api/academic/${reportId}`, { method: 'DELETE' });
}

// ─── Notifications ───────────────────────────────────────────

export interface AdminNotification {
  id: string;
  type: string;
  status: string;
  title: string;
  message: string;
  actionUrl: string | null;
  createdAt: string;
  readAt: string | null;
  emailSent: boolean;
  recipient: { fullName: string } | null;
}

export async function fetchAllNotifications(type?: string, status?: string): Promise<AdminNotification[]> {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (status) params.set('status', status);
  const res = await apiFetch<{ success: boolean; data: AdminNotification[] }>(`/api/notifications/all?${params}`);
  return res.data ?? [];
}

export async function sendNotification(body: {
  recipientId: string;
  type: string;
  title: string;
  message: string;
  sendEmail?: boolean;
}): Promise<void> {
  await apiFetch('/api/notifications', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function sendBulkNotification(body: {
  recipientIds: string[];
  type: string;
  title: string;
  message: string;
  sendEmail?: boolean;
}): Promise<void> {
  await apiFetch('/api/notifications/bulk', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─── Analytics ────────────────────────────────────────────────

export async function fetchAnalyticsOverview() {
  const res = await apiFetch<{ success: boolean; data: any }>('/api/analytics/overview');
  return res.data;
}

export async function fetchModuleEngagement(): Promise<ModuleEngagementItem[]> {
  const res = await apiFetch<{ success: boolean; data: { modules: ModuleEngagementItem[] } }>('/api/analytics/modules/engagement');
  return res.data.modules ?? [];
}
