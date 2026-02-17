"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import styles from "./page.module.css";
import WorkoutSelect from "@/components/WorkoutSelect/WorkoutSelect";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectAuthToken, selectCourseBySlug } from "@/store/selectors";
import { useEffect, useState } from "react";
import { fetchCourseWorkouts } from "@/shared/services/courseService";
import { getCourseProgress } from "@/shared/services/workoutService";
import { Workout } from "@/shared/types/workout";

export default function WorkoutsPage() {
    const params = useParams<{ course: string }>();
    const courseSlug = params?.course ?? "";
    const courseData = useAppSelector(state => selectCourseBySlug(state, courseSlug));
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
            <div className={styles.page}>
                <WorkoutSelect
                    courseTitle={courseData.nameRU}
                    workouts={workouts}
                    loading={loading}
                    error={error}
                />
            </div>
        </AuthGuard>
    );
}
