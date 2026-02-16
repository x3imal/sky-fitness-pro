"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import styles from "./page.module.css";
import WorkoutExercisesCard from "@/components/WorkoutExercisesCard/WorkoutExercisesCard";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthToken, selectCourseIdByWorkoutId, selectCourses } from "@/store/selectors";
import { getWorkout } from "@/shared/services/workoutService";
import { Exercise, Workout } from "@/shared/types/workout";
import { fetchWorkoutProgress, setWorkoutProgress } from "@/store/slices/progressSlice";

type WorkoutWithExercises = Workout & { exercises: (Exercise & { quantity?: number })[] };

export default function WorkoutPage() {
    const params = useParams<{ id: string }>();
    const workoutId = params?.id ?? "";
    const token = useAppSelector(selectAuthToken);
    const courseId = useAppSelector(state => selectCourseIdByWorkoutId(state, workoutId));
    const courses = useAppSelector(selectCourses);
    const dispatch = useAppDispatch();
    const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
    const [loading, setLoading] = useState(false);

    const courseName = courseId
        ? courses.find(course => course._id === courseId)?.nameRU
        : undefined;

    useEffect(() => {
        if (!token || !workoutId) return;
        setLoading(true);
        getWorkout(token, workoutId)
            .then((data) => {
                const exercises = data.exercises?.map((ex) => ({
                    _id: ex._id,
                    name: ex.name,
                    quantity: (ex as { quantity?: number }).quantity,
                })) ?? [];
                const mapped: WorkoutWithExercises = {
                    _id: data._id,
                    name: data.name,
                    video: data.video,
                    exercises,
                };
                setWorkout(mapped);
                if (courseId) {
                    dispatch(fetchWorkoutProgress({ courseId, workoutId, exercises }));
                } else {
                    const empty = exercises.reduce<Record<string, number>>((acc, ex) => {
                        acc[ex._id] = 0;
                        return acc;
                    }, {});
                    dispatch(setWorkoutProgress({ workoutId, values: empty }));
                }
            })
            .finally(() => setLoading(false));
    }, [courseId, dispatch, token, workoutId]);

    return (
        <AuthGuard>
            <div className={styles.page}>
                <div className={styles.container}>
                    <h1 className={styles.courseTitle}>{courseName ?? "Тренировка"}</h1>

                    <div className={styles.videoCard}>
                        {workout ? (
                            <iframe
                                className={styles.video}
                                src={workout.video}
                                title={workout.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className={styles.video} />
                        )}
                    </div>

                    {workout ? (
                        <WorkoutExercisesCard workoutId={workoutId} exercises={workout.exercises} />
                    ) : (
                        loading && <div>Загрузка тренировки...</div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
