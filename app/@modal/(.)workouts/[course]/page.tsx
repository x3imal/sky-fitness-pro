"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { use } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import WorkoutSelect from "@/components/WorkoutSelect/WorkoutSelect";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { useAppSelector } from "@/store/hooks";
import { selectAuthToken, selectCourseBySlug } from "@/store/selectors";
import { useEffect, useState } from "react";
import { fetchCourseWorkouts } from "@/shared/services/courseService";
import { getCourseProgress } from "@/shared/services/workoutService";
import { Workout } from "@/shared/types/workout";

type PageProps = {
    params: Promise<{ course: string }>;
};

export default function WorkoutsModalPage({ params }: PageProps) {
    const router = useRouter();
    const { course } = use(params);
    const courseData = useAppSelector(state => selectCourseBySlug(state, course));
    const token = useAppSelector(selectAuthToken);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token || !courseData) return;
        setLoading(true);
        setError(null);
        Promise.all([
            fetchCourseWorkouts(courseData._id, token),
            getCourseProgress(token, courseData._id),
        ])
            .then(([workoutsList, progress]) => {
                const progressMap = new Map(
                    (progress.workoutsProgress ?? []).map(item => [item.workoutId, item.workoutCompleted])
                );
                const merged = workoutsList.map(workout => ({
                    ...workout,
                    completed: progressMap.get(workout._id) ?? false,
                }));
                setWorkouts(merged);
            })
            .catch((err: unknown) => {
                const message = err instanceof Error ? err.message : "Не удалось загрузить тренировки";
                setError(message);
            })
            .finally(() => setLoading(false));
    }, [courseData, token]);

    if (!courseData) return null;

    return (
        <AuthGuard>
            <div className={styles.overlay} onClick={() => router.back()}>
                <div onClick={(e) => e.stopPropagation()}>
                    <WorkoutSelect
                        courseTitle={courseData.nameRU}
                        workouts={workouts}
                        loading={loading}
                        error={error}
                        onStartWorkout={(workoutId) => window.location.replace(`/workout/${workoutId}`)}
                    />
                </div>
            </div>
        </AuthGuard>
    );
}
