"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { Exercise } from "@/shared/types/workout";
import { useAppSelector } from "@/store/hooks";
import { selectWorkoutExerciseProgress } from "@/store/selectors";
import styles from "./WorkoutExercisesCard.module.css";

type Props = {
    workoutId: string;
    exercises: Exercise[];
};

export default function WorkoutExercisesCard({ workoutId, exercises }: Props) {
    const progressMap = useAppSelector(state => selectWorkoutExerciseProgress(state, workoutId));
    const hasAnyProgress = Object.values(progressMap).some(value => value > 0);
    const progressButtonText = hasAnyProgress
        ? "Обновить свой прогресс"
        : "Заполнить свой прогресс";

    return (
        <div className={styles.exercisesCard}>
            <div className={styles.exercisesTitle}>Упражнения тренировки</div>

            <div className={styles.exerciseGrid}>
                {exercises.map(ex => {
                    const progress = progressMap[ex._id] ?? ex.progress ?? 0;
                    return (
                        <div
                            key={ex._id}
                            className={styles.exerciseItem}
                            style={{ ["--progress" as never]: `${progress}%` }}
                        >
                            <div className={styles.exerciseRow}>
                                <span className={styles.exerciseName}>{ex.name}</span>
                                <span className={styles.exerciseProgress}>{progress}%</span>
                            </div>
                            <div className={styles.exerciseBar} aria-hidden="true">
                                <span className={styles.exerciseBarFill} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <Link href={`/workout/${workoutId}/progress`} className={styles.fillButtonLink}>
                <Button variant="primary" size="lg" className={styles.fillButton}>
                    {progressButtonText}
                </Button>
            </Link>
        </div>
    );
}
