import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { getWorkoutById } from "@/shared/util/getWorkoutById";
import { getCourseByWorkoutId } from "@/shared/util/getCourseByWorkoutId";
import { Button } from "@/components/ui/Button/Button";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function WorkoutPage({ params }: PageProps) {
    const { id } = await params;
    const workout = getWorkoutById(id);
    if (!workout) notFound();

    const course = getCourseByWorkoutId(id);

    return (
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

                <div className={styles.exercisesCard}>
                    <div className={styles.exercisesTitle}>Упражнения тренировки</div>

                    <div className={styles.exerciseGrid}>
                        {workout.exercises.map(ex => (
                            <div
                                key={ex._id}
                                className={styles.exerciseItem}
                                style={{ ["--progress" as never]: `${ex.progress ?? 0}%` }}
                            >
                                <div className={styles.exerciseRow}>
                                    <span className={styles.exerciseName}>{ex.name}</span>
                                    <span className={styles.exerciseProgress}>{ex.progress ?? 0}%</span>
                                </div>
                                <div className={styles.exerciseBar} aria-hidden="true">
                                    <span className={styles.exerciseBarFill} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="primary" size="lg" className={styles.fillButton}>
                        Заполнить свой прогресс
                    </Button>
                </div>
            </div>
        </div>
    );
}
