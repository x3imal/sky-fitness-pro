"use client";

import styles from "./page.module.css";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import { COURSES } from "@/shared/data/courses";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    selectCourseActionText,
    selectCourseProgress,
    selectCurrentUser,
    selectMyCourseSlugs
} from "@/store/selectors";
import { logoutUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button/Button";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const myCourseSlugs = useAppSelector(selectMyCourseSlugs);
    const myCourses = COURSES.filter(course => myCourseSlugs.includes(course.slug));
    const courseUiBySlug = useAppSelector(state =>
        Object.fromEntries(
            COURSES.map(course => [
                course.slug,
                {
                    progress: selectCourseProgress(state, course.slug),
                    actionText: selectCourseActionText(state, course.slug),
                },
            ])
        )
    );

    if (!currentUser) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Профиль</h1>
                    <section className={styles.userCard} aria-label="Требуется авторизация">
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>Требуется вход</div>
                            <div className={styles.userLogin}>
                                Чтобы открыть профиль, войдите в аккаунт.
                            </div>
                            <Link href="/auth">
                                <Button variant="primary" size="lg">
                                    Войти
                                </Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    return (
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
                        <div className={styles.userName}>{currentUser.login}</div>
                        <div className={styles.userLogin}>
                            Логин: <span className={styles.userLoginValue}>{currentUser.login}</span>
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
                        <Link href="/">
                            <Button variant="primary" size="lg">
                                Перейти к курсам
                            </Button>
                        </Link>
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
    );
}
