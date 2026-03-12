namespace LiftLog.Api.Models;

// Represents one lift in a specific workout: specifies sets and reps
// “DB Rear Delt Fly is in Workout A for 3 sets of 15”
public class WorkoutExercise
{
    public int Id { get; set; }

    // Which workout is this apart of? so Workout A, B, Pull Day, etc.
    public int WorkoutId { get; set; }
    public Workout Workout { get; set; } = null!;

    // What Exercise am I adding to this Workout: Hammer Curls? DB Bench
    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    // Specific sets and reps for this particular exercise in the workout
    public int Sets { get; set; }
    public int Reps { get; set; }
    public int SortOrder { get; set; }
}