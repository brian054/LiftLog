/*
 This is where the details for the specific workout live, sets and reps, form video/link, etc.
*/
import type { Workout } from "../types/workout";

type Props = {
  workout: Workout | null;
};

export default function WorkoutDetail({ workout }: Props) {
  if (!workout) {
    return <div>Select a workout</div>;
  }

  /*
    Workout details will go here section - TODO: Display exercises in workout, or if none "no exercises to show...add some!"
  */

  return (
    <div>
      <h2>{workout.name}</h2>

      <p>Workout details will go here</p>

      <button>Add Exercise</button>
    </div>
  );
}
