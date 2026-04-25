/*
 To create an exercise - example: DB Hammer Curls
*/
import { useState } from "react";

type Props = {
  onClose: () => void;
};

// not technically a modal yet, but we'll get there lol
function CreateExerciseModal({ onClose }: Props) {
  const [name, setName] = useState("");

  const createExercise = async () => {
    //if (!name.trim()) return; // trim just returns the string with no whitespace, so " foo " name.trim() = "foo", if there's no string....then its false, thus return
    if (name.trim().length === 0) return; // covers "" and " ". If trim returns nothing, then name is empty, so return

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

// import { useEffect, useState } from "react";

// type Exercise = {
//   id: number;
//   name: string;
// };

// type Props = {
//   workoutId: number;
//   onClose: () => void;
// };

// function AddExerciseToWorkoutModal({ workoutId, onClose }: Props) {
//   const [exercises, setExercises] = useState<Exercise[]>([]);
//   const [selectedExerciseId, setSelectedExerciseId] = useState("");
//   const [newExerciseName, setNewExerciseName] = useState("");
//   const [sets, setSets] = useState("3");
//   const [reps, setReps] = useState("8");

//   useEffect(() => {
//     const fetchExercises = async () => {
//       try {
//         const response = await fetch("http://localhost:5198/api/exercise");

//         if (!response.ok) {
//           throw new Error("Failed to fetch exercises");
//         }

//         const data: Exercise[] = await response.json();
//         setExercises(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchExercises();
//   }, []);

//   const handleSave = async () => {
//     try {
//       let exerciseId = selectedExerciseId;

//       // If user typed a new exercise name, create it first
//       if (!exerciseId && newExerciseName.trim()) {
//         const createExerciseResponse = await fetch("http://localhost:5198/api/exercise", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ name: newExerciseName }),
//         });

//         if (!createExerciseResponse.ok) {
//           throw new Error("Failed to create exercise");
//         }

//         const createdExercise: Exercise = await createExerciseResponse.json();
//         exerciseId = createdExercise.id.toString();
//       }

//       if (!exerciseId) {
//         alert("Please select an exercise or create a new one.");
//         return;
//       }

//       const response = await fetch(
//         `http://localhost:5198/api/workout/${workoutId}/exercise`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             exerciseId: Number(exerciseId),
//             sets: Number(sets),
//             reps: Number(reps),
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to add exercise to workout");
//       }

//       onClose();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Add Exercise</h2>

//       <div>
//         <label>Choose existing exercise</label>
//         <select
//           value={selectedExerciseId}
//           onChange={(e) => setSelectedExerciseId(e.target.value)}
//         >
//           <option value="">-- Select an exercise --</option>
//           {exercises.map((exercise) => (
//             <option key={exercise.id} value={exercise.id}>
//               {exercise.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label>Or create a new exercise</label>
//         <input
//           type="text"
//           placeholder="New exercise name"
//           value={newExerciseName}
//           onChange={(e) => setNewExerciseName(e.target.value)}
//         />
//       </div>

//       <div>
//         <label>Sets</label>
//         <input
//           type="number"
//           min="1"
//           value={sets}
//           onChange={(e) => setSets(e.target.value)}
//         />
//       </div>

//       <div>
//         <label>Reps</label>
//         <input
//           type="number"
//           min="1"
//           value={reps}
//           onChange={(e) => setReps(e.target.value)}
//         />
//       </div>

//       <button onClick={handleSave}>Save</button>
//       <button onClick={onClose}>Cancel</button>
//     </div>
//   );
// }

// export default AddExerciseToWorkoutModal;
