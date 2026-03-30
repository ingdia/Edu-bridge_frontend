'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types/user';

const ROLE_REDIRECT: Record<UserRole, string> = {
  STUDENT: '/student',
  MENTOR:  '/mentor',
  ADMIN:   '/admin',
};

interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
  fullName?: string;
  gradeLevel?: string;
  schoolId?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: RegisterData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    if (Array.isArray(json)) throw new Error(json.map((e: any) => e.message).join(', '));
    throw new Error(json.message || json.error || 'Request failed');
  }
  return json;
}

function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  // Also set cookie so Next.js middleware can read it
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  document.cookie = 'accessToken=; path=/; max-age=0';
}

function mapUser(raw: any): User {
  const profile = raw.studentProfile || raw.mentorProfile || raw.adminProfile || {};
  return {
    id: raw.id,
    email: raw.email,
    fullName: profile.fullName || raw.fullName || raw.email.split('@')[0],
    role: raw.role as UserRole,
    profilePhoto: profile.profilePhotoUrl || profile.profilePhoto || null,
    school: profile.schoolName || 'GS Ruyenzi',
    gradeLevel: profile.gradeLevel || '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }

    apiFetch('/api/auth/me')
      .then((res) => setUser(mapUser(res.data.user)))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const { user: rawUser, accessToken, refreshToken } = res.data;
      saveTokens(accessToken, refreshToken);
      const mappedUser = mapUser(rawUser);
      setUser(mappedUser);
      router.push(ROLE_REDIRECT[mappedUser.role]);
      return {};
    } catch (err: any) {
      return { error: err.message || 'Invalid email or password.' };
    }
  };

  const register = async (data: RegisterData): Promise<{ error?: string }> => {
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // Don't save tokens — user must verify email first
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      return {};
    } catch (err: any) {
      return { error: err.message || 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Logout locally even if server call fails
    } finally {
      clearTokens();
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
