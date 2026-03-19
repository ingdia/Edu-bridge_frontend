export type ModuleType = 'ENGLISH' | 'DIGITAL_LITERACY';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ExerciseType = 'LISTENING' | 'SPEAKING' | 'READING' | 'WRITING' | 'DIGITAL_SKILL';

export interface Exercise {
  id: string;
  moduleId: string;
  type: ExerciseType;
  title: string;
  instructions: string;
  content: Record<string, unknown>;
  maxScore: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  difficulty: Difficulty;
  isActive: boolean;
  createdAt: string;
  exercises: Exercise[];
}
