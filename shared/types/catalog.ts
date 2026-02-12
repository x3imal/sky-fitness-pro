import { Course } from "@/shared/types/course";
import { Workout } from "@/shared/types/workout";

export type WorkoutsByCourseSlug = Record<string, Workout[]>;

export type CatalogPayload = {
    courses: Course[];
    workoutsByCourseSlug: WorkoutsByCourseSlug;
    source: "api" | "mock";
};
