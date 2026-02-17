"use client";

import { useMemo, useState } from "react";
import styles from "./WorkoutSelect.module.css";
import { Workout } from "@/shared/types/workout";
import { Button } from "@/components/ui/Button/Button";

type Props = {
    courseTitle: string;
    workouts: Workout[];
    loading?: boolean;
    error?: string | null;
    onStartWorkout?: (workoutId: string) => void;
};

export default function WorkoutSelect({
    courseTitle,
    workouts,
    loading = false,
    error = null,
    onStartWorkout,
}: Props) {
    const initialId = workouts[0]?._id ?? "";
    const [selectedId, setSelectedId] = useState<string>(initialId);

    const selected = useMemo(
        () => workouts.find(w => w._id === selectedId),
        [workouts, selectedId]
    );

    const onStart = () => {
        if (!selected) return;
        if (onStartWorkout) {
            onStartWorkout(selected._id);
            return;
        }
        window.location.assign(`/workout/${selected._id}`);
    };

    return (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Выбор тренировки">

            <h2 className={styles.title}>Выберите тренировку</h2>

            <div className={styles.list} role="radiogroup" aria-label={`Тренировки курса ${courseTitle}`}>
                {loading ? (
                    <div className={styles.infoText}>Загрузка тренировок...</div>
                ) : error ? (
                    <div className={styles.errorText}>{error}</div>
                ) : (
                    workouts.map((workout, idx) => {
                        const isSelected = workout._id === selectedId;
                        const isDone = Boolean(workout.completed);
                        return (
                            <label key={workout._id} className={styles.item}>
                                <input
                                    type="radio"
                                    name="workout"
                                    className={styles.radio}
                                    checked={isSelected}
                                    onChange={() => setSelectedId(workout._id)}
                                />
                                <span
                                    className={`${styles.marker} ${isSelected ? styles.markerActive : ""} ${
                                        isDone ? styles.markerDone : ""
                                    }`}
                                    aria-hidden="true"
                                />
                                <div className={styles.itemText}>
                                    <div className={styles.itemTitle}>{workout.name}</div>
                                    <div className={styles.itemSub}>
                                        {courseTitle} / {idx + 1} день
                                    </div>
                                </div>
                            </label>
                        );
                    })
                )}
            </div>

            <div className={styles.startLink}>
                <Button
                    variant="primary"
                    size="lg"
                    className={styles.startButton}
                    onClick={onStart}
                    disabled={loading || Boolean(error) || !selected}
                >
                    Начать
                </Button>
            </div>
        </div>
    );
}
