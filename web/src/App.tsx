import { useState } from "react";
import "./App.css";
import WorkoutList from "./components/WorkoutList";
import WorkoutDetail from "./components/WorkoutDetail";
import CreateWorkoutModal from "./components/CreateWorkout";
import CreateExerciseModal from "./components/CreateExercise";
import type { Workout } from "./types/workout";

export default function App() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [refreshWorkouts, setRefreshWorkouts] = useState(false);

  const handleWorkoutCreated = () => {
    setRefreshWorkouts((prev) => !prev); // we flip the boolean, the useEffect in WorkoutDetails gets called, which GET's the list of workouts
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>LiftLog</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setShowCreateWorkoutModal(true)}>
          Create Workout
        </button>

        <button
          onClick={() => setShowCreateExerciseModal(true)}
          style={{ marginLeft: "0.5rem" }}
        >
          Create Exercise
        </button>
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <WorkoutList
          onSelectWorkout={setSelectedWorkout}
          refreshTrigger={refreshWorkouts}
        />

        <WorkoutDetail workout={selectedWorkout} />
      </div>

      {showCreateWorkoutModal && (
        <CreateWorkoutModal
          onClose={() => setShowCreateWorkoutModal(false)}
          onCreated={handleWorkoutCreated}
        />
      )}

      {showCreateExerciseModal && (
        <CreateExerciseModal
          onClose={() => setShowCreateExerciseModal(false)}
        />
      )}
    </div>
  );
}

//export default App;
