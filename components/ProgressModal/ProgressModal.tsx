"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import styles from "./ProgressModal.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthToken, selectCourseIdByWorkoutId } from "@/store/selectors";
import {
    getWorkout,
    getWorkoutProgress,
    saveWorkoutProgress as saveWorkoutProgressRequest,
} from "@/shared/services/workoutService";
import { Exercise } from "@/shared/types/workout";
import { setWorkoutProgress } from "@/store/slices/progressSlice";
import { fetchCurrentUser } from "@/store/slices/authSlice";

type Props = {
    workoutId: string;
    showOverlay?: boolean;
    showClose?: boolean;
};

type WorkoutExercise = Exercise & { quantity?: number };
type WorkoutWithExercises = {
    _id: string;
    name: string;
    video: string;
    exercises: WorkoutExercise[];
};

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
    const [initialCounts, setInitialCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const closeTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!token || !courseId || !workoutId) return;
        setLoading(true);
        setLoadError("");

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
                    acc[ex._id] = count > 0 ? String(count) : "";
                    return acc;
                }, {});

                const initialNumeric = exercises.reduce<Record<string, number>>((acc, ex, idx) => {
                    acc[ex._id] = progress.progressData?.[idx] ?? 0;
                    return acc;
                }, {});

                setValues(initial);
                setInitialCounts(initialNumeric);
            })
            .catch((error: unknown) => {
                const message = error instanceof Error ? error.message : "Не удалось загрузить прогресс";
                setWorkout(null);
                setLoadError(message);
            })
            .finally(() => setLoading(false));
    }, [courseId, token, workoutId]);

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    const onChange = (id: string, value: string) => {
        const next = value.replace(/[^\d]/g, "");
        setValues(prev => ({ ...prev, [id]: next }));
    };

    const onSave = async () => {
        if (!token || !courseId || !workout) return;

        const counts = workout.exercises.map(ex => {
            const rawValue = values[ex._id];
            if (rawValue === "" || rawValue === undefined) {
                return initialCounts[ex._id] ?? 0;
            }
            return Number(rawValue);
        });

        setSaving(true);
        setSaveError("");

        try {
            await saveWorkoutProgressRequest(token, courseId, workoutId, counts);
            const actualProgress = await getWorkoutProgress(token, courseId, workoutId);
            const percents = workout.exercises.reduce<Record<string, number>>((acc, ex, idx) => {
                const quantity = ex.quantity ?? 0;
                const count = actualProgress.progressData?.[idx] ?? 0;
                const percent = quantity > 0 ? Math.round((count / quantity) * 100) : 0;
                acc[ex._id] = Math.max(0, Math.min(100, percent));
                return acc;
            }, {});

            dispatch(setWorkoutProgress({ workoutId, values: percents }));
            void dispatch(fetchCurrentUser()).unwrap().catch(() => undefined);

            setShowSuccess(true);
            closeTimerRef.current = window.setTimeout(() => {
                closeSuccessAndLeave();
            }, 1100);
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : "Не удалось сохранить прогресс");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (window.history.length > 1) {
            router.back();
            return;
        }
        router.push(`/workout/${workoutId}`);
    };

    const closeSuccessAndLeave = () => {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        if (showOverlay && window.history.length > 1) {
            router.back();
            return;
        }
        router.replace(`/workout/${workoutId}`);
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
            {!showSuccess && (
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
                        {loadError ? (
                            <div className={styles.errorText}>{loadError}</div>
                        ) : workout?.exercises.map((ex: WorkoutExercise) => (
                            <div key={ex._id} className={styles.formItem}>
                                <label className={styles.label} htmlFor={`progress-${ex._id}`}>
                                    Сколько раз вы сделали {ex.name.toLowerCase()}?
                                </label>
                                <input
                                    id={`progress-${ex._id}`}
                                    className={styles.input}
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={values[ex._id] ?? ""}
                                    onChange={e => onChange(ex._id, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    {saveError && <div className={styles.errorText}>{saveError}</div>}

                    <Button
                        variant="primary"
                        size="lg"
                        className={styles.saveButton}
                        onClick={onSave}
                        disabled={loading || saving || !workout || Boolean(loadError)}
                    >
                        {saving ? "Сохранение..." : "Сохранить"}
                    </Button>
                </div>
            )}

            {showSuccess && (
                <div
                    className={styles.successOverlay}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeSuccessAndLeave();
                        }
                    }}
                >
                    <div className={styles.successModal} role="status" aria-live="polite">
                        <h3 className={styles.successTitle}>Ваш прогресс засчитан!</h3>
                        <span className={styles.successIcon} aria-hidden="true">✓</span>
                    </div>
                </div>
            )}
        </div>
    );
}
