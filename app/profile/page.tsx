"use client";

import styles from "./page.module.css";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    selectCourses,
    selectCourseActionText,
    selectCourseProgress,
    selectCurrentUser,
    selectMyCourseSlugs
} from "@/store/selectors";
import { logoutUser } from "@/store/slices/authSlice";
import AuthGuard from "@/components/AuthGuard/AuthGuard";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const courses = useAppSelector(selectCourses);
    const currentUser = useAppSelector(selectCurrentUser);
    const myCourseSlugs = useAppSelector(selectMyCourseSlugs);
    const myCourses = courses.filter(course => myCourseSlugs.includes(course.slug));
    const userName = (currentUser?.email?.split("@")[0] ?? "").split(".")[0];
    const displayName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : "";
    const courseUiBySlug = useAppSelector(state =>
        Object.fromEntries(
            courses.map(course => [
                course.slug,
                {
                    progress: selectCourseProgress(state, course.slug),
                    actionText: selectCourseActionText(state, course.slug),
                },
            ])
        )
    );

    return (
        <AuthGuard>
            <main className={styles.page}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Профиль</h1>

                    {/* User card */}
                    <section className={styles.userCard} aria-label="Данные пользователя">
                        <div className={styles.avatar}>
                            <Image
                                src="/images/profile/avatarBase.png"
                                alt=""
                                fill
                                priority
                                className={styles.avatarBase}
                            />
                            <Image
                                src="/images/profile/avatar-body.png"
                                alt=""
                                width={211}
                                height={72}
                                className={styles.avatarBody}
                            />
                            <Image
                                src="/images/profile/avatar-head.png"
                                alt=""
                                width={70}
                                height={70}
                                className={styles.avatarHead}
                            />
                        </div>

                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{displayName}</div>
                            <div className={styles.userLogin}>
                                Логин: <span className={styles.userLoginValue}>{userName}</span>
                            </div>

                            <button
                                className={styles.logoutBtn}
                                type="button"
                                onClick={() => {
                                    dispatch(logoutUser());
                                }}
                            >
                                Выйти
                            </button>
                        </div>
                    </section>

                    <h2 className={styles.sectionTitle}>Мои курсы</h2>

                    {/* Courses */}
                    {myCourses.length === 0 ? (
                        <section className={styles.emptyState} aria-label="Мои курсы пусты">
                            <p className={styles.emptyText}>У вас пока нет добавленных курсов</p>
                        </section>
                    ) : (
                        <section className={styles.grid} aria-label="Мои курсы">
                            {myCourses.map((course) => {
                                const courseUi = courseUiBySlug[course.slug];
                                return (
                                    <CourseCard
                                        key={course.slug}
                                        course={course}
                                        progress={courseUi?.progress ?? 0}
                                        actionText={courseUi?.actionText ?? "Начать тренировки"}
                                        actionHref={`/workouts/${course.slug}`}
                                        showAddButton
                                    />
                                );
                            })}
                        </section>
                    )}
                </div>
            </main>
        </AuthGuard>
    );
}
