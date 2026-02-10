import styles from "./page.module.css";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import { COURSES } from "@/shared/data/courses";
import Image from "next/image";

const profileCourseState: Record<string, { progress: number; actionText: string }> = {
    yoga: { progress: 40, actionText: "Продолжить" },
    stretching: { progress: 0, actionText: "Начать тренировки" },
    fitness: { progress: 100, actionText: "Начать заново" },
};

export default function ProfilePage() {
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
                        <div className={styles.userName}>Сергей</div>
                        <div className={styles.userLogin}>
                            Логин: <span className={styles.userLoginValue}>sergey.petrov96</span>
                        </div>

                        <button className={styles.logoutBtn} type="button">
                            Выйти
                        </button>
                    </div>
                </section>

                <h2 className={styles.sectionTitle}>Мои курсы</h2>

                {/* Courses */}
                <section className={styles.grid} aria-label="Мои курсы">
                    {COURSES.map((course) => {
                        const state = profileCourseState[course.slug];
                        return (
                            <CourseCard
                                key={course.slug}
                                course={course}
                                progress={state?.progress}
                                actionText={state?.actionText}
                                actionHref={`/workouts/${course.slug}`}
                                showAddButton={false}
                            />
                        );
                    })}
                </section>
            </div>
        </main>
    );
}
