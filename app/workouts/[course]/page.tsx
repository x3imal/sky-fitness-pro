import styles from "./page.module.css";
import WorkoutSelect from "@/components/WorkoutSelect/WorkoutSelect";
import { getWorkoutsByCourseSlug } from "@/shared/util/getWorkoutsByCourseSlug";
import { getCourseById } from "@/shared/util/getCourseById";
import { notFound } from "next/navigation";
import AuthGuard from "@/components/AuthGuard/AuthGuard";

type PageProps = {
    params: Promise<{ course: string }>;
};

export default async function WorkoutsPage({ params }: PageProps) {
    const { course } = await params;
    const courseData = getCourseById(course);
    if (!courseData) notFound();

    const workouts = getWorkoutsByCourseSlug(course);

    return (
        <AuthGuard>
            <div className={styles.page}>
                <WorkoutSelect courseTitle={courseData.nameRU} workouts={workouts} />
            </div>
        </AuthGuard>
    );
}
