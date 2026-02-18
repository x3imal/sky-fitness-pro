import { CatalogPayload, WorkoutsByCourseSlug } from "@/shared/types/catalog";
import { Course, DifficultyRU } from "@/shared/types/course";
import { fetchCourse, fetchCourses } from "@/shared/services/courseService";
import { COURSE_THEME_BY_SLUG } from "@/components/ui/Theme/courseTheme";
import { resolveCourseSlug } from "@/shared/util/resolveCourseSlug";

const normalizeDifficulty = (value: string | undefined): DifficultyRU => {
    if (value === "легкий" || value === "средний" || value === "сложный") return value;
    return "средний";
};

export async function loadCatalog(): Promise<CatalogPayload> {
    const coursesPayloadRaw = await fetchCourses();
    const coursesPayload = coursesPayloadRaw.reduce<typeof coursesPayloadRaw>((acc, course) => {
        if (!acc.some(item => item._id === course._id)) {
            acc.push(course);
        }
        return acc;
    }, []);
    const details = await Promise.all(
        coursesPayload.map(async (course) => {
            try {
                return await fetchCourse(course._id);
            } catch {
                return course;
            }
        })
    );
    const workoutsMap: WorkoutsByCourseSlug = {};

    const mappedCoursesRaw: Course[] = details.map(detail => {
        const slug = resolveCourseSlug(detail.nameRU, detail.nameEN, detail._id);
        const theme = COURSE_THEME_BY_SLUG[slug];

        return {
            _id: detail._id,
            nameRU: detail.nameRU,
            nameEN: detail.nameEN,
            description: detail.description ?? "",
            directions: detail.directions ?? [],
            fitting: detail.fitting ?? [],
            difficulty: normalizeDifficulty(detail.difficulty),
            durationInDays: detail.durationInDays ?? 0,
            dailyDurationInMinutes: detail.dailyDurationInMinutes ?? { from: 0, to: 0 },
            workouts: detail.workouts ?? [],
            slug,
            imageSrc: theme?.cardImageSrc ?? "",
            ctaImageSrc: undefined,
        };
    });
    const mappedCourses = mappedCoursesRaw.reduce<Course[]>((acc, course) => {
        if (!acc.some(item => item._id === course._id)) {
            acc.push(course);
        }
        return acc;
    }, []);

    return {
        courses: mappedCourses,
        workoutsByCourseSlug: workoutsMap,
        source: "api",
    };
}
