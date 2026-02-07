import { COURSES } from '@/shared/data/courses';
import { Course } from '@/shared/types/course';



export function getCourseById(slug: string): Course | undefined {
    return COURSES.find(course => course.slug === slug);
}