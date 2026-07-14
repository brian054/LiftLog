/*
 Just a list of your workouts, when you click the workout a detail page pops up
*/
import { useEffect, useState } from "react";
import type { Workout } from "../types/workout";

type Props = {
  onSelectWorkout: (workout: Workout) => void;
  refreshTrigger: boolean;
};

function WorkoutList({ onSelectWorkout, refreshTrigger }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:5198/api/workout");

      if (!response.ok) {
        throw new Error("Failed to fetch workouts");
      }

      const data: Workout[] = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error(error);
      setWorkouts([]);
      setError("Can't load workouts. Is the API running and is PostgreSQL up?");
    }
  };

  // Fetch workouts on first render and whenever App toggles refreshTrigger.
  useEffect(() => {
    fetchWorkouts();
  }, [refreshTrigger]); // translation: run this effect any time refreshTrigger changes

  return (
    <div>
      <h2>Your Workouts</h2>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            <button onClick={() => onSelectWorkout(workout)}>
              {workout.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkoutList;
