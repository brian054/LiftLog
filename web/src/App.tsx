import { useState } from "react";
import "./App.css";

type Workout = {
  id: number;
  name: string;
};

function App() {
  const [workoutName, setWorkoutName] = useState("");
  const [message, setMessage] = useState("");

  const createWorkout = async () => {
    if (!workoutName.trim()) {
      setMessage("Please enter a workout name.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5198/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: workoutName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workout.");
      }

      const data: Workout = await response.json();

      setMessage(`Created workout: ${data.name}`);
      setWorkoutName("");
    } catch (error) {
      setMessage("Something went wrong while creating the workout.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create Workout</h1>

      <input
        type="text"
        placeholder="Enter workout name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      />

      <button onClick={createWorkout}>Save Workout</button>

      <p>{message}</p>
    </div>
  );
}

export default App;
