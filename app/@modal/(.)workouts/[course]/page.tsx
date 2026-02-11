"use client";

import { use } from "react";
import styles from "./page.module.css";
import WorkoutSelect from "@/components/WorkoutSelect/WorkoutSelect";
import { getWorkoutsByCourseSlug } from "@/shared/util/getWorkoutsByCourseSlug";
import { getCourseById } from "@/shared/util/getCourseById";
import AuthGuard from "@/components/AuthGuard/AuthGuard";

type PageProps = {
    params: Promise<{ course: string }>;
};

export default function WorkoutsModalPage({ params }: PageProps) {
    const { course } = use(params);
    const courseData = getCourseById(course);
    const workouts = getWorkoutsByCourseSlug(course);

    if (!courseData) return null;

    return (
        <AuthGuard>
            <div className={styles.overlay}>
                <WorkoutSelect courseTitle={courseData.nameRU} workouts={workouts} />
            </div>
        </AuthGuard>
    );
}
