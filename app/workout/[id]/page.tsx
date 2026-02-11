import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { getWorkoutById } from "@/shared/util/getWorkoutById";
import { getCourseByWorkoutId } from "@/shared/util/getCourseByWorkoutId";
import WorkoutExercisesCard from "@/components/WorkoutExercisesCard/WorkoutExercisesCard";
import AuthGuard from "@/components/AuthGuard/AuthGuard";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function WorkoutPage({ params }: PageProps) {
    const { id } = await params;
    const workout = getWorkoutById(id);
    if (!workout) notFound();

    const course = getCourseByWorkoutId(id);

    return (
        <AuthGuard>
            <div className={styles.page}>
                <div className={styles.container}>
                    <h1 className={styles.courseTitle}>{course?.nameRU ?? "Тренировка"}</h1>

                    <div className={styles.videoCard}>
                        <iframe
                            className={styles.video}
                            src={workout.video}
                            title={workout.name}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <WorkoutExercisesCard workoutId={id} exercises={workout.exercises} />
                </div>
            </div>
        </AuthGuard>
    );
}
