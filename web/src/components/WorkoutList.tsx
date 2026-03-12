import { useEffect, useState } from "react";

type Workout = {
  // move this out
  id: number;
  name: string;
};

type Props = {
  onSelectWorkout: (workout: Workout) => void;
  refreshTrigger: boolean;
};

function WorkoutList({ onSelectWorkout, refreshTrigger }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch("http://localhost:5198/api/workout");

      if (!response.ok) {
        throw new Error("Failed to fetch workouts");
      }

      const data: Workout[] = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [refreshTrigger]);

  return (
    <div>
      <h2>Your Workouts</h2>

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
