import { apiFetch } from './fetchClient';

export interface WeekLesson {
  id: string;
  orderIndex: number;
  title: string;
  contentType: string;
  contentUrl: string;
  description: string | null;
  durationMin: number | null;
}

export interface QuizQuestion {
  id: string;
  orderIndex: number;
  questionText: string;
  questionType: 'multiple_choice' | 'open_ended';
  options: string[] | null;
  correctAnswer?: string | null; // only for mentor
  marks: number;
}

export interface MentorQuiz {
  id: string;
  title: string;
  instructions: string | null;
  passMark: number;
  maxAttempts: number;
  isPublished: boolean;
  questions?: QuizQuestion[];
}

export interface WeeklyPlan {
  id: string;
  weekNumber: number;
  title: string;
  description: string | null;
  isPublished: boolean;
  lessons: WeekLesson[];
  quizzes: MentorQuiz[];
  progress?: { isUnlocked: boolean; isCompleted: boolean };
  studentProgress?: { isUnlocked: boolean; isCompleted: boolean }[];
}

export interface MentorModuleWithCurriculum {
  id: string;
  module: { id: string; title: string; type: string; difficulty: string; description: string | null };
  weeklyPlans: WeeklyPlan[];
}

export interface QuizSubmission {
  id: string;
  score: number | null;
  isPassed: boolean | null;
  feedback: string | null;
  attempt: number;
  status: string;
  submittedAt: string;
  gradedAt: string | null;
  student?: { fullName: string; gradeLevel: string };
}

// ─── Mentor ───────────────────────────────────────────────────

export async function fetchMentorCurriculum(): Promise<MentorModuleWithCurriculum[]> {
  const res = await apiFetch<{ success: boolean; data: MentorModuleWithCurriculum[] }>('/api/curriculum/my-modules');
  return res.data ?? [];
}

export async function createWeek(mentorModuleId: string, body: { weekNumber: number; title: string; description?: string }): Promise<WeeklyPlan> {
  const res = await apiFetch<{ success: boolean; data: WeeklyPlan }>(`/api/curriculum/${mentorModuleId}/weeks`, {
    method: 'POST', body: JSON.stringify(body),
  });
  return res.data;
}

export async function updateWeek(weekId: string, body: Partial<{ title: string; description: string; isPublished: boolean }>): Promise<WeeklyPlan> {
  const res = await apiFetch<{ success: boolean; data: WeeklyPlan }>(`/api/curriculum/weeks/${weekId}`, {
    method: 'PATCH', body: JSON.stringify(body),
  });
  return res.data;
}

export async function deleteWeek(weekId: string): Promise<void> {
  await apiFetch(`/api/curriculum/weeks/${weekId}`, { method: 'DELETE' });
}

export async function createLesson(weekId: string, body: { title: string; contentType: string; contentUrl: string; description?: string; durationMin?: number; orderIndex?: number }): Promise<WeekLesson> {
  const res = await apiFetch<{ success: boolean; data: WeekLesson }>(`/api/curriculum/weeks/${weekId}/lessons`, {
    method: 'POST', body: JSON.stringify(body),
  });
  return res.data;
}

export async function deleteLesson(lessonId: string): Promise<void> {
  await apiFetch(`/api/curriculum/lessons/${lessonId}`, { method: 'DELETE' });
}

export async function createQuiz(weekId: string, body: { title: string; instructions?: string; passMark?: number; maxAttempts?: number; questions?: Partial<QuizQuestion>[] }): Promise<MentorQuiz> {
  const res = await apiFetch<{ success: boolean; data: MentorQuiz }>(`/api/curriculum/weeks/${weekId}/quizzes`, {
    method: 'POST', body: JSON.stringify(body),
  });
  return res.data;
}

export async function updateQuiz(quizId: string, body: Partial<MentorQuiz>): Promise<MentorQuiz> {
  const res = await apiFetch<{ success: boolean; data: MentorQuiz }>(`/api/curriculum/quizzes/${quizId}`, {
    method: 'PATCH', body: JSON.stringify(body),
  });
  return res.data;
}

export async function fetchQuizSubmissions(quizId: string): Promise<QuizSubmission[]> {
  const res = await apiFetch<{ success: boolean; data: QuizSubmission[] }>(`/api/curriculum/quizzes/${quizId}/submissions`);
  return res.data ?? [];
}

export async function gradeSubmission(submissionId: string, score: number, feedback?: string): Promise<{ message: string }> {
  const res = await apiFetch<{ success: boolean; message: string }>(`/api/curriculum/submissions/${submissionId}/grade`, {
    method: 'PATCH', body: JSON.stringify({ score, feedback }),
  });
  return { message: res.message };
}

// ─── Student ──────────────────────────────────────────────────

export async function fetchStudentCurriculum(): Promise<MentorModuleWithCurriculum[]> {
  const res = await apiFetch<{ success: boolean; data: MentorModuleWithCurriculum[] }>('/api/curriculum/student');
  return res.data ?? [];
}

export async function fetchQuizForStudent(quizId: string): Promise<MentorQuiz> {
  const res = await apiFetch<{ success: boolean; data: MentorQuiz }>(`/api/curriculum/quizzes/${quizId}`);
  return res.data;
}

export async function submitQuiz(quizId: string, answers: Record<string, string>): Promise<{ message: string; data: QuizSubmission }> {
  const res = await apiFetch<{ success: boolean; message: string; data: QuizSubmission }>(`/api/curriculum/quizzes/${quizId}/submit`, {
    method: 'POST', body: JSON.stringify({ answers }),
  });
  return { message: res.message, data: res.data };
}

export async function fetchMyQuizSubmission(quizId: string): Promise<QuizSubmission | null> {
  const res = await apiFetch<{ success: boolean; data: QuizSubmission | null }>(`/api/curriculum/quizzes/${quizId}/my-submission`);
  return res.data;
}
