/*
 This is where the details for the specific workout live, sets and reps, form video/link, etc.
*/
import { useCallback, useEffect, useState } from "react";
import AddExerciseToWorkout from "./AddExerciseToWorkout";
import type { Workout } from "../types/workout";

const API_BASE = "http://localhost:5198";

type Props = {
  workout: Workout | null;
};

export default function WorkoutDetail({ workout }: Props) {
  const [detail, setDetail] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const fetchWorkoutDetail = useCallback(async (workoutId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/workout/${workoutId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch workout");
      }

      const data: Workout = await response.json();
      setDetail(data);
    } catch (error) {
      console.error(error);
      setDetail(null);
      setError("Can't load this workout. Is the API running and is PostgreSQL up?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!workout) {
      setDetail(null);
      setShowAddExercise(false);
      return;
    }

    fetchWorkoutDetail(workout.id);
  }, [workout, fetchWorkoutDetail]);

  if (!workout) {
    return <div>Select a workout</div>;
  }

  if (loading && !detail) {
    return <div>Loading workout...</div>;
  }

  const exercises = detail?.exercises ?? [];

  return (
    <div>
      <h2>{workout.name}</h2>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {exercises.length === 0 ? (
        <p>No exercises to show...add some!</p>
      ) : (
        <ul>
          {exercises.map((entry) => (
            <li key={entry.id}>
              {entry.exercise?.name ?? "Unknown exercise"} — {entry.sets} ×{" "}
              {entry.reps}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => setShowAddExercise(true)}>Add Exercise</button>

      {showAddExercise && (
        <AddExerciseToWorkout
          workoutId={workout.id}
          onClose={() => setShowAddExercise(false)}
          onAdded={() => fetchWorkoutDetail(workout.id)}
        />
      )}
    </div>
  );
}
