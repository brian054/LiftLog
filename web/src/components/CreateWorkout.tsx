/*
  To create a Workout - example: Workout A, Workout B, etc.
*/
import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

function CreateWorkoutModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createWorkout = async () => {
    if (!name.trim()) return;

    setError(null);
    try {
      const response = await fetch("http://localhost:5198/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workout");
      }

      onCreated(); // refresh workout list
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      setError("Couldn't save workout. Is the API running and is PostgreSQL up?");
    }
  };

  return (
    <div>
      <h2>Create Workout</h2>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <input
        type="text"
        placeholder="Workout name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={createWorkout}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default CreateWorkoutModal;
