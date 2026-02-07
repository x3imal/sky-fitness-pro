import {COURSE_THEME_BY_ID, CourseTheme} from "@/components/ui/Theme/courseTheme";

const DEFAULT_THEME: CourseTheme = {
    themeColor: '#f7c400',
    cardImageSrc: '/images/courses/default-card.png',
    heroImageSrc: '/images/courses/default-hero.png',
};

export function getCourseTheme(courseId: string): CourseTheme {
    return COURSE_THEME_BY_ID[courseId] ?? DEFAULT_THEME;
}
