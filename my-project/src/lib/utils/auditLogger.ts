// NFR5 — Audit logging: all actions logged with timestamp, user, and action

export type AuditAction =
  | 'LOGIN' | 'LOGOUT'
  | 'EXERCISE_STARTED' | 'EXERCISE_COMPLETED' | 'MODULE_COMPLETED'
  | 'GRADE_SUBMITTED' | 'REPORT_UPLOADED' | 'REPORT_MANUAL_ENTRY'
  | 'SESSION_SCHEDULED' | 'SESSION_COMPLETED'
  | 'MESSAGE_SENT' | 'NOTE_ADDED'
  | 'OPPORTUNITY_APPLIED' | 'CV_UPDATED'
  | 'PROFILE_UPDATED' | 'USER_CREATED' | 'USER_UPDATED';

export interface AuditEntry {
  id:        string;
  userId:    string;
  userRole:  string;
  action:    AuditAction;
  detail:    string;
  timestamp: string;
}

// In-memory log (replace with API call in production)
const auditLog: AuditEntry[] = [];

export function logAction(
  userId: string,
  userRole: string,
  action: AuditAction,
  detail: string
): void {
  const entry: AuditEntry = {
    id:        `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    userRole,
    action,
    detail,
    timestamp: new Date().toISOString(),
  };
  auditLog.push(entry);

  // In production: send to API
  // api.admin.logAudit(entry);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUDIT] ${entry.timestamp} | ${userRole} ${userId} | ${action} | ${detail}`);
  }
}

export function getAuditLog(): AuditEntry[] {
  return [...auditLog].reverse();
}
