import {COURSE_THEME_BY_SLUG, CourseTheme} from "@/components/ui/Theme/courseTheme";

const DEFAULT_THEME: CourseTheme = {
    cardImageSrc: '/images/courses/default-card.png',
    heroImageSrc: '/images/courses/default-hero.png',
};

export function getCourseTheme(courseId: string): CourseTheme {
    return COURSE_THEME_BY_SLUG[courseId] ?? DEFAULT_THEME;
}
