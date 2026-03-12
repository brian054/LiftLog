import { useState } from "react";

type Props = {
  onClose: () => void;
};

function CreateExerciseModal({ onClose }: Props) {
  const [name, setName] = useState("");

  const createExercise = async () => {
    if (!name.trim()) return;

    try {
      const response = await fetch("http://localhost:5198/api/exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create exercise");
      }

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create Exercise</h2>

      <input
        type="text"
        placeholder="Exercise name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={createExercise}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default CreateExerciseModal;
