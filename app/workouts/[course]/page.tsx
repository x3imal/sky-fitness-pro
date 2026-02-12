import styles from "./page.module.css";
import WorkoutSelect from "@/components/WorkoutSelect/WorkoutSelect";
import { notFound } from "next/navigation";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { getCourseByIdAsync, getWorkoutsByCourseSlugAsync } from "@/shared/util/catalogQueries";

type PageProps = {
    params: Promise<{ course: string }>;
};

export default async function WorkoutsPage({ params }: PageProps) {
    const { course } = await params;
    const courseData = await getCourseByIdAsync(course);
    if (!courseData) notFound();

    const workouts = await getWorkoutsByCourseSlugAsync(course);

    return (
        <AuthGuard>
            <div className={styles.page}>
                <WorkoutSelect courseTitle={courseData.nameRU} workouts={workouts} />
            </div>
        </AuthGuard>
    );
}
