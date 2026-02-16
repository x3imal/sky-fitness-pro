import { CatalogPayload, WorkoutsByCourseSlug } from "@/shared/types/catalog";
import { Course, DifficultyRU } from "@/shared/types/course";
import { fetchCourse, fetchCourses } from "@/shared/services/courseService";
import { COURSES } from "@/shared/data/courses";

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9а-яё\s-]/gi, "")
        .replace(/\s+/g, "-");

const normalizeDifficulty = (value: string | undefined): DifficultyRU => {
    if (value === "легкий" || value === "средний" || value === "сложный") return value;
    return "средний";
};

export async function loadCatalog(): Promise<CatalogPayload> {
    const coursesPayloadRaw = await fetchCourses();
    const coursesPayload = coursesPayloadRaw.reduce<typeof coursesPayloadRaw>((acc, course) => {
        const key = `${(course.nameEN || course.nameRU || "").toLowerCase()}`;
        if (!acc.some(item => item._id === course._id || `${(item.nameEN || item.nameRU || "").toLowerCase()}` === key)) {
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
        const localMatch =
            COURSES.find(item => item._id === detail._id) ??
            COURSES.find(item => item.nameRU === detail.nameRU) ??
            COURSES.find(item => item.nameEN === detail.nameEN);
        const slug = localMatch?.slug ?? slugify(detail.nameEN || detail.nameRU) ?? detail._id;

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
            imageSrc: localMatch?.imageSrc ?? "",
            ctaImageSrc: localMatch?.ctaImageSrc,
        };
    });
    const mappedCourses = mappedCoursesRaw.reduce<Course[]>((acc, course) => {
        if (!acc.some(item => item.slug === course.slug)) {
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
