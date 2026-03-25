'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types/user';
import { mockUser } from '@/lib/api/mockData';

const MOCK_ACCOUNTS: Record<string, { password: string; user: User }> = {
  'student@edubridge.rw': {
    password: 'student123',
    user: { ...mockUser, role: 'STUDENT' },
  },
  'mentor@edubridge.rw': {
    password: 'mentor123',
    user: { ...mockUser, id: 'mnt_001', email: 'mentor@edubridge.rw', fullName: 'Dr. Alice Ingabire', role: 'MENTOR', gradeLevel: 'Mentor' },
  },
  'admin@edubridge.rw': {
    password: 'admin123',
    user: { ...mockUser, id: 'adm_001', email: 'admin@edubridge.rw', fullName: 'Diane Ingabire', role: 'ADMIN', gradeLevel: 'Administrator' },
  },
};

const ROLE_REDIRECT: Record<UserRole, string> = {
  STUDENT: '/student',
  MENTOR:  '/mentor',
  ADMIN:   '/admin',
};

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const account = MOCK_ACCOUNTS[email.toLowerCase()];
    if (!account || account.password !== password) {
      return { error: 'Invalid email or password.' };
    }
    document.cookie = 'accessToken=mock-token; path=/; max-age=86400';
    setUser(account.user);
    router.push(ROLE_REDIRECT[account.user.role]);
    return {};
  };

  const logout = () => {
    document.cookie = 'accessToken=; path=/; max-age=0';
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
