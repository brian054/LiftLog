import { useEffect, useState } from "react";
import type { Exercise } from "../types/workout";

const API_BASE = "http://localhost:5198";

type Props = {
  workoutId: number;
  onClose: () => void;
  onAdded: () => void;
};

function AddExerciseToWorkout({ workoutId, onClose, onAdded }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [newExerciseName, setNewExerciseName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("8");

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/exercise`);

        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data: Exercise[] = await response.json();
        setExercises(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExercises();
  }, []);

  const handleSave = async () => {
    try {
      let exerciseId = selectedExerciseId;

      if (!exerciseId && newExerciseName.trim()) {
        const createExerciseResponse = await fetch(`${API_BASE}/api/exercise`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newExerciseName.trim() }),
        });

        if (!createExerciseResponse.ok) {
          throw new Error("Failed to create exercise");
        }

        const createdExercise: Exercise = await createExerciseResponse.json();
        exerciseId = createdExercise.id.toString();
      }

      if (!exerciseId) {
        alert("Please select an exercise or create a new one.");
        return;
      }

      const response = await fetch(`${API_BASE}/api/workoutexercise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutId,
          exerciseId: Number(exerciseId),
          sets: Number(sets),
          reps: Number(reps),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add exercise to workout");
      }

      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Exercise</h2>

      <div>
        <label>Choose existing exercise</label>
        <select
          value={selectedExerciseId}
          onChange={(e) => {
            setSelectedExerciseId(e.target.value);
            if (e.target.value) {
              setNewExerciseName("");
            }
          }}
        >
          <option value="">-- Select an exercise --</option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Or create a new exercise</label>
        <input
          type="text"
          placeholder="New exercise name"
          value={newExerciseName}
          onChange={(e) => {
            setNewExerciseName(e.target.value);
            if (e.target.value.trim()) {
              setSelectedExerciseId("");
            }
          }}
        />
      </div>

      <div>
        <label>Sets</label>
        <input
          type="number"
          min="1"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />
      </div>

      <div>
        <label>Reps</label>
        <input
          type="number"
          min="1"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
      </div>

      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default AddExerciseToWorkout;
