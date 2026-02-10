"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import styles from "./page.module.css";
import WorkoutSelect from "@/components/WorkoutSelect/WorkoutSelect";
import { getWorkoutsByCourseSlug } from "@/shared/util/getWorkoutsByCourseSlug";
import { getCourseById } from "@/shared/util/getCourseById";

type PageProps = {
    params: Promise<{ course: string }>;
};

export default function WorkoutsModalPage({ params }: PageProps) {
    const router = useRouter();
    const { course } = use(params);
    const courseData = getCourseById(course);
    const workouts = getWorkoutsByCourseSlug(course);

    if (!courseData) return null;

    return (
        <div className={styles.overlay}>
            <WorkoutSelect
                courseTitle={courseData.nameRU}
                workouts={workouts}
                onClose={() => router.back()}
            />
        </div>
    );
}
