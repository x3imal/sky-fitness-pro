"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./WorkoutSelect.module.css";
import { Workout } from "@/shared/types/workout";
import { Button } from "@/components/ui/Button/Button";

type Props = {
    courseTitle: string;
    workouts: Workout[];
    onClose?: () => void;
};

export default function WorkoutSelect({ courseTitle, workouts, onClose }: Props) {
    const router = useRouter();
    const initialId = workouts[0]?._id ?? "";
    const [selectedId, setSelectedId] = useState<string>(initialId);

    const selected = useMemo(
        () => workouts.find(w => w._id === selectedId),
        [workouts, selectedId]
    );

    const onStart = () => {
        if (!selected) return;
        router.push(`/workout/${selected._id}`);
    };

    return (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Выбор тренировки">

            <h2 className={styles.title}>Выберите тренировку</h2>

            <div className={styles.list} role="radiogroup" aria-label={`Тренировки курса ${courseTitle}`}>
                {workouts.map((workout, idx) => {
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
                })}
            </div>

            <div className={styles.startLink}>
                <Button
                    variant="primary"
                    size="lg"
                    className={styles.startButton}
                    onClick={onStart}
                >
                    Начать
                </Button>
            </div>
        </div>
    );
}
