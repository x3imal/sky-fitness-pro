import { WORKOUTS } from "@/shared/data/workouts";
import { Workout } from "@/shared/types/workout";

export function getWorkoutById(id: string): Workout | undefined {
    return WORKOUTS.find(workout => workout._id === id);
}
