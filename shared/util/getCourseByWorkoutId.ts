import { workoutsByCourseSlug } from "@/shared/data/workouts";
import { getCourseById } from "@/shared/util/getCourseById";
import { Course } from "@/shared/types/course";

export function getCourseByWorkoutId(workoutId: string): Course | undefined {
    const entry = Object.entries(workoutsByCourseSlug).find(([, workouts]) =>
        workouts.some(w => w._id === workoutId)
    );

    if (!entry) return undefined;
    const [slug] = entry;
    return getCourseById(slug);
}
