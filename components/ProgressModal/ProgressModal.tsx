"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import styles from "./ProgressModal.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthToken, selectCourseIdByWorkoutId } from "@/store/selectors";
import { getWorkout, getWorkoutProgress, saveWorkoutProgress as saveWorkoutProgressRequest } from "@/shared/services/workoutService";
import { Exercise, Workout } from "@/shared/types/workout";
import { setWorkoutProgress } from "@/store/slices/progressSlice";

type Props = {
    workoutId: string;
    showOverlay?: boolean;
    showClose?: boolean;
};

type WorkoutWithExercises = Workout & { exercises: (Exercise & { quantity?: number })[] };

export default function ProgressModal({
    workoutId,
    showOverlay = true,
    showClose = true,
}: Props) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectAuthToken);
    const courseId = useAppSelector(state => selectCourseIdByWorkoutId(state, workoutId));
    const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token || !courseId || !workoutId) return;
        setLoading(true);
        Promise.all([getWorkout(token, workoutId), getWorkoutProgress(token, courseId, workoutId)])
            .then(([workoutData, progress]) => {
                const exercises = workoutData.exercises?.map((ex) => ({
                    _id: ex._id,
                    name: ex.name,
                    quantity: (ex as { quantity?: number }).quantity,
                })) ?? [];
                setWorkout({
                    _id: workoutData._id,
                    name: workoutData.name,
                    video: workoutData.video,
                    exercises,
                });
                const initial = exercises.reduce<Record<string, string>>((acc, ex, idx) => {
                    const count = progress.progressData?.[idx] ?? 0;
                    acc[ex._id] = String(count);
                    return acc;
                }, {});
                setValues(initial);
            })
            .finally(() => setLoading(false));
    }, [courseId, token, workoutId]);

    const onChange = (id: string, value: string) => {
        const next = value.replace(/[^\d]/g, "");
        setValues(prev => ({ ...prev, [id]: next }));
    };

    const onSave = async () => {
        if (!token || !courseId || !workout) return;
        const counts = workout.exercises.map(ex => Number(values[ex._id] || 0));
        await saveWorkoutProgressRequest(token, courseId, workoutId, counts);

        const percents = workout.exercises.reduce<Record<string, number>>((acc, ex, idx) => {
            const quantity = ex.quantity ?? 0;
            const percent = quantity > 0 ? Math.round((counts[idx] / quantity) * 100) : 0;
            acc[ex._id] = Math.max(0, Math.min(100, percent));
            return acc;
        }, {});
        dispatch(setWorkoutProgress({ workoutId, values: percents }));
        router.push(`/workout/${workoutId}`);
    };

    const handleClose = () => {
        if (window.history.length > 1) {
            router.back();
            return;
        }
        router.push(`/workout/${workoutId}`);
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
                    {workout?.exercises.map(ex => (
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
                    disabled={loading || !workout}
                >
                    Сохранить
                </Button>
            </div>
        </div>
    );
}
