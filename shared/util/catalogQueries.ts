import { loadCatalog } from "@/shared/services/catalogService";
import { fetchCourse, fetchCourseWorkouts, fetchCourses } from "@/shared/services/courseService";
import { COURSES } from "@/shared/data/courses";

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9а-яё\s-]/gi, "")
        .replace(/\s+/g, "-");

const findCourseIdBySlug = async (slug: string): Promise<string | null> => {
    try {
        const list = await fetchCourses();
        const matched = list.find(course => {
            const localMatch =
                COURSES.find(item => item._id === course._id) ??
                COURSES.find(item => item.nameRU === course.nameRU) ??
                COURSES.find(item => item.nameEN === course.nameEN);
            const resolvedSlug = localMatch?.slug ?? slugify(course.nameEN || course.nameRU);
            return resolvedSlug === slug;
        });
        return matched?._id ?? null;
    } catch {
        return null;
    }
};

export async function getCourseByIdAsync(slug: string) {
    const courseId = await findCourseIdBySlug(slug);
    if (!courseId) {
        const catalog = await loadCatalog();
        return catalog.courses.find(course => course.slug === slug);
    }
    try {
        const detail = await fetchCourse(courseId);
        const localMatch =
            COURSES.find(item => item._id === detail._id) ??
            COURSES.find(item => item.nameRU === detail.nameRU) ??
            COURSES.find(item => item.nameEN === detail.nameEN);
        return {
            _id: detail._id,
            nameRU: detail.nameRU,
            nameEN: detail.nameEN,
            description: detail.description,
            directions: detail.directions ?? [],
            fitting: detail.fitting ?? [],
            difficulty: detail.difficulty ?? "средний",
            durationInDays: detail.durationInDays ?? 0,
            dailyDurationInMinutes: detail.dailyDurationInMinutes ?? { from: 0, to: 0 },
            workouts: detail.workouts ?? [],
            slug: localMatch?.slug ?? slug,
            imageSrc: localMatch?.imageSrc ?? "",
            ctaImageSrc: localMatch?.ctaImageSrc,
        };
    } catch {
        const catalog = await loadCatalog();
        return catalog.courses.find(course => course.slug === slug);
    }
}

export async function getWorkoutsByCourseSlugAsync(slug: string) {
    const courseId = await findCourseIdBySlug(slug);
    if (!courseId) {
        const catalog = await loadCatalog();
        return catalog.workoutsByCourseSlug[slug] ?? [];
    }
    try {
        return await fetchCourseWorkouts(courseId);
    } catch {
        const catalog = await loadCatalog();
        return catalog.workoutsByCourseSlug[slug] ?? [];
    }
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
