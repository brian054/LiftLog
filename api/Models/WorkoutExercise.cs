/*
    “DB Rear Delt Fly is in Workout A for 3 sets of 15”
*/
namespace LiftLog.Api.Models;

public class WorkoutExercise
{
    public int Id { get; set; }

    public int WorkoutId { get; set; }
    public Workout Workout { get; set; } = null!; // A or B for now

    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!; // DB Curl, DB Bench, etc.

    public int Sets { get; set; }
    public int Reps { get; set; }
    public int SortOrder { get; set; }
}