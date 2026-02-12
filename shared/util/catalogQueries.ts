import { loadCatalog } from "@/shared/services/catalogService";

export async function getCourseByIdAsync(slug: string) {
    const catalog = await loadCatalog();
    return catalog.courses.find(course => course.slug === slug);
}

export async function getWorkoutsByCourseSlugAsync(slug: string) {
    const catalog = await loadCatalog();
    return catalog.workoutsByCourseSlug[slug] ?? [];
}

export async function getWorkoutByIdAsync(workoutId: string) {
    const catalog = await loadCatalog();
    return Object.values(catalog.workoutsByCourseSlug)
        .flat()
        .find(workout => workout._id === workoutId);
}

export async function getCourseByWorkoutIdAsync(workoutId: string) {
    const catalog = await loadCatalog();
    const entry = Object.entries(catalog.workoutsByCourseSlug).find(([, workouts]) =>
        workouts.some(workout => workout._id === workoutId)
    );
    if (!entry) return undefined;
    const [slug] = entry;
    return catalog.courses.find(course => course.slug === slug);
}
