// src/lib/api/mockClient.ts
import { 
  mockUser, mockModules, mockProgress, mockOpportunities, 
  mockSessions, mockMentorStats 
} from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  auth: {
    login: async ({ email, password }: { email: string; password: string }) => {
      await delay(500);
      if (email === 'student@example.com' && password === 'password123') {
        return {
          data: {
            user: mockUser,
            accessToken: 'mock_access_token_123',
            refreshToken: 'mock_refresh_token_456',
          },
        };
      }
      throw new Error('Invalid credentials');
    },
    register: async (data: any) => {
      await delay(800);
      return { data: { message: 'Registration successful', user: { ...mockUser, email: data.email } } };
    },
    logout: async () => {
      await delay(300);
      return { data: { message: 'Logged out' } };
    },
    getCurrentUser: async () => {
      await delay(300);
      return { data: mockUser };
    },
  },

  modules: {
    getAll: async () => {
      await delay(400);
      return { data: mockModules };
    },
    getById: async (id: string) => {
      await delay(300);
      const module = mockModules.find(m => m.id === id);
      if (!module) throw new Error('Module not found');
      return { data: module };
    },
    getStudentModules: async () => {
      await delay(400);
      return { data: mockModules }; // In real app, filter by student
    },
  },

  progress: {
    getMyProgress: async () => {
      await delay(400);
      return { data: mockProgress };
    },
    getStudentProgress: async (studentId: string) => {
      await delay(400);
      return { data: mockProgress }; // Return same for demo
    },
    submitProgress: async (data: any) => {
      await delay(500);
      return { data: { message: 'Progress saved', ...data } };
    },
  },

  opportunities: {
    getAll: async (filters?: any) => {
      await delay(400);
      let results = mockOpportunities;
      if (filters?.type) {
        results = results.filter(o => o.type === filters.type);
      }
      return { data: results };
    },
    getMatched: async (studentId: string) => {
      await delay(400);
      // Simple mock matching logic
      return { data: mockOpportunities.filter(o => o.minGrade! <= 88) };
    },
  },

  mentorship: {
    getSessions: async (role: 'mentor' | 'student') => {
      await delay(400);
      return { data: mockSessions };
    },
    scheduleSession: async (data: any) => {
      await delay(500);
      return { data: { message: 'Session scheduled', session: { id: 'ses_new', ...data } } };
    },
  },

  admin: {
    getOverview: async () => {
      await delay(500);
      return { data: mockMentorStats };
    },
    getAllStudents: async () => {
      await delay(400);
      return { data: mockMentorStats.topPerformers.map(p => ({ 
        id: p.studentId, 
        fullName: p.fullName,
        email: `${p.fullName.toLowerCase().split(' ')[0]}@example.com`,
        role: 'STUDENT' as const,
      })) };
    },
  },

  // File upload mock
  uploadFile: async (formData: FormData) => {
    await delay(1000);
    return { data: { message: 'File uploaded', url: '/mock-uploads/file.pdf' } };
  },
};