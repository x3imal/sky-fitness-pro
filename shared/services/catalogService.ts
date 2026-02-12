import { COURSES } from "@/shared/data/courses";
import { workoutsByCourseSlug } from "@/shared/data/workouts";
import { CatalogPayload, WorkoutsByCourseSlug } from "@/shared/types/catalog";
import { Course } from "@/shared/types/course";
import { Workout } from "@/shared/types/workout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";

const getMockCatalog = (): CatalogPayload => ({
    courses: COURSES,
    workoutsByCourseSlug,
    source: "mock",
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isWorkoutArrayMap = (value: unknown): value is WorkoutsByCourseSlug => {
    if (!isRecord(value)) return false;
    return Object.values(value).every(
        (items) => Array.isArray(items) && items.every((item) => isRecord(item) && typeof item._id === "string")
    );
};

const toWorkoutsMap = (value: unknown): WorkoutsByCourseSlug | null => {
    if (isWorkoutArrayMap(value)) return value;
    if (!Array.isArray(value)) return null;

    const mapped = value.reduce<WorkoutsByCourseSlug>((acc, item) => {
        if (!isRecord(item)) return acc;
        if (typeof item._id !== "string" || typeof item.courseSlug !== "string") return acc;
        const courseSlug = item.courseSlug;
        const workout: Workout = {
            _id: item._id,
            name: typeof item.name === "string" ? item.name : "",
            video: typeof item.video === "string" ? item.video : "",
            exercises: Array.isArray(item.exercises) ? (item.exercises as Workout["exercises"]) : [],
            completed: Boolean(item.completed),
        };

        if (!acc[courseSlug]) acc[courseSlug] = [];
        acc[courseSlug].push(workout);
        return acc;
    }, {});

    return Object.keys(mapped).length ? mapped : null;
};

const fetchJSON = async <T>(url: string): Promise<T> => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
};

export async function loadCatalog(): Promise<CatalogPayload> {
    if (!API_BASE_URL) {
        return getMockCatalog();
    }

    try {
        const [coursesPayload, workoutsPayload] = await Promise.all([
            fetchJSON<unknown>(`${API_BASE_URL}/courses`),
            fetchJSON<unknown>(`${API_BASE_URL}/workouts`),
        ]);

        if (!Array.isArray(coursesPayload) || !coursesPayload.every((item) => isRecord(item))) {
            return getMockCatalog();
        }

        const mappedWorkouts = toWorkoutsMap(workoutsPayload);
        if (!mappedWorkouts) {
            return getMockCatalog();
        }

        return {
            courses: coursesPayload as Course[],
            workoutsByCourseSlug: mappedWorkouts,
            source: "api",
        };
    } catch {
        return getMockCatalog();
    }
}
