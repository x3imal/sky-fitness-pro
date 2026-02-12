"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Workout } from "@/shared/types/workout";
import { Button } from "@/components/ui/Button/Button";
import styles from "./ProgressModal.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { saveWorkoutProgress } from "@/store/slices/progressSlice";
import { selectWorkoutExerciseProgress } from "@/store/selectors";

type Props = {
    workout: Workout;
    showOverlay?: boolean;
    showClose?: boolean;
};

export default function ProgressModal({
    workout,
    showOverlay = true,
    showClose = true,
}: Props) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const savedMap = useAppSelector(state => selectWorkoutExerciseProgress(state, workout._id));

    const initialValues = useMemo(
        () =>
            Object.fromEntries(
                workout.exercises.map(ex => [ex._id, String(savedMap[ex._id] ?? ex.progress ?? 0)])
            ) as Record<string, string>,
        [savedMap, workout.exercises]
    );
    const [values, setValues] = useState<Record<string, string>>(initialValues);

    const onChange = (id: string, value: string) => {
        // Allow only digits to keep the input predictable for mock UI.
        const next = value.replace(/[^\d]/g, "");
        setValues(prev => ({ ...prev, [id]: next }));
    };

    const onSave = () => {
        const parsed = Object.entries(values).reduce<Record<string, number>>((acc, [id, value]) => {
            acc[id] = Number(value || 0);
            return acc;
        }, {});
        dispatch(saveWorkoutProgress({ workoutId: workout._id, values: parsed }));
        router.push(`/workout/${workout._id}`);
    };

    const handleClose = () => {
        if (window.history.length > 1) {
            router.back();
            return;
        }
        router.push(`/workout/${workout._id}`);
    };

    return (
        <div
            className={showOverlay ? styles.overlay : styles.pageWrap}
            onClick={showOverlay ? (e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            } : undefined}
        >
            <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Мой прогресс">
                {showClose && (
                    <button
                        type="button"
                        className={styles.close}
                        aria-label="Закрыть"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                )}

                <h2 className={styles.title}>Мой прогресс</h2>

                <div className={styles.formList}>
                    {workout.exercises.map(ex => (
                        <div key={ex._id} className={styles.formItem}>
                            <label className={styles.label} htmlFor={`progress-${ex._id}`}>
                                Сколько раз вы сделали {ex.name.toLowerCase()}?
                            </label>
                            <input
                                id={`progress-${ex._id}`}
                                className={styles.input}
                                type="text"
                                inputMode="numeric"
                                value={values[ex._id] ?? ""}
                                onChange={e => onChange(ex._id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className={styles.saveButton}
                    onClick={onSave}
                >
                    Сохранить
                </Button>
            </div>
        </div>
    );
}
