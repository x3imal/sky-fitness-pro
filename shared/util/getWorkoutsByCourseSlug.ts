import { workoutsByCourseSlug } from "@/shared/data/workouts";
import { Workout } from "@/shared/types/workout";

export function getWorkoutsByCourseSlug(slug: string): Workout[] {
    return workoutsByCourseSlug[slug] ?? [];
}
