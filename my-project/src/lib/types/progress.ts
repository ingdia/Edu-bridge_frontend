export type ModuleStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ModuleProgress {
  moduleId: string;
  moduleTitle: string;
  completedExercises: number;
  totalExercises: number;
  averageScore: number;
  status: ModuleStatus;
}

export interface ProgressData {
  studentId: string;
  modules: ModuleProgress[];
  overallScore: number;
  lastUpdated: string;
}
