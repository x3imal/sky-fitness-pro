import { loadCatalog } from "@/shared/services/catalogService";
import { fetchCourse, fetchCourseWorkouts, fetchCourses } from "@/shared/services/courseService";
import { COURSE_THEME_BY_SLUG } from "@/components/ui/Theme/courseTheme";
import { resolveCourseSlug } from "@/shared/util/resolveCourseSlug";

const findCourseIdBySlug = async (slug: string): Promise<string | null> => {
    try {
        const list = await fetchCourses();
        const matched = list.find(course => {
            const resolvedSlug = resolveCourseSlug(course.nameRU, course.nameEN, course._id);
            return resolvedSlug === slug || course._id === slug;
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
        const resolvedSlug = resolveCourseSlug(detail.nameRU, detail.nameEN, detail._id);
        const theme = COURSE_THEME_BY_SLUG[resolvedSlug];
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
            slug: resolvedSlug,
            imageSrc: theme?.cardImageSrc ?? "",
            ctaImageSrc: undefined,
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
