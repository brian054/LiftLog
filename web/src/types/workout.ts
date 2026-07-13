export type Exercise = {
  id: number;
  name: string;
  formLink?: string | null;
};

export type WorkoutSingleExercise = {
  id: number;
  workoutId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  sortOrder: number;
  exercise: Exercise;
};

export type Workout = {
  id: number;
  name: string;
  exercises?: WorkoutSingleExercise[];
};
