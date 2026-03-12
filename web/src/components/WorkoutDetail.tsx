// move Workout to a Workout.tsx file, repeated 3 times now
type Workout = {
  id: number;
  name: string;
};

type Props = {
  workout: Workout | null;
};

function WorkoutDetail({ workout }: Props) {
  if (!workout) {
    return <div>Select a workout</div>;
  }

  return (
    <div>
      <h2>{workout.name}</h2>

      <p>Workout details will go here</p>

      <button>Add Exercise</button>
    </div>
  );
}

export default WorkoutDetail;
