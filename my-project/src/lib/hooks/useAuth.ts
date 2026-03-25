import { useAuthContext } from '@/lib/contexts/AuthContext';

export function useAuth() {
  const { user, login, logout } = useAuthContext();
  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    isStudent: user?.role === 'STUDENT',
    isMentor:  user?.role === 'MENTOR',
    isAdmin:   user?.role === 'ADMIN',
  };
}
