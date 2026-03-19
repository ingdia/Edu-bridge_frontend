// src/lib/api/client.ts
import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { mockApi } from './mockClient';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Real API client setup
const realApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Add auth interceptor for real API
if (!USE_MOCK) {
  realApiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  // Add response interceptor for token refresh (real API only)
  realApiClient.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: AxiosError) => {
      // ... token refresh logic here
      return Promise.reject(error);
    }
  );
}

// Unified API export - switches based on env var
export const api = USE_MOCK ? mockApi : {
  auth: {
    login: (data: any) => realApiClient.post('/api/auth/login', data),
    register: (data: any) => realApiClient.post('/api/auth/register', data),
    logout: () => realApiClient.post('/api/auth/logout'),
    getCurrentUser: () => realApiClient.get('/api/auth/me'),
  },
  modules: {
    getAll: () => realApiClient.get('/api/modules'),
    getById: (id: string) => realApiClient.get(`/api/modules/${id}`),
    getStudentModules: () => realApiClient.get('/api/modules/student'),
  },
  progress: {
    getMyProgress: () => realApiClient.get('/api/progress/my'),
    getStudentProgress: (id: string) => realApiClient.get(`/api/progress/student/${id}`),
    submitProgress: (data: any) => realApiClient.post('/api/progress', data),
  },
  opportunities: {
    getAll: (filters?: any) => realApiClient.get('/api/opportunities', { params: filters }),
    getMatched: (id: string) => realApiClient.get(`/api/matching/student/${id}`),
  },
  mentorship: {
    getSessions: (role: string) => realApiClient.get(`/api/mentorship/sessions/${role}`),
    scheduleSession: (data: any) => realApiClient.post('/api/mentorship/sessions', data),
  },
  admin: {
    getOverview: () => realApiClient.get('/api/admin/dashboard/overview'),
    getAllStudents: () => realApiClient.get('/api/profile/students'),
  },
  uploadFile: (formData: FormData) => 
    realApiClient.post('/api/files/signed-url', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Helper to check if using mock
export const isUsingMockApi = () => USE_MOCK;