"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import styles from "@/app/page.module.css";
import { useAppSelector } from "@/store/hooks";
import { selectCatalogStatus, selectCourses } from "@/store/selectors";

export default function HomePageContent() {
    const courses = useAppSelector(selectCourses);
    const catalogStatus = useAppSelector(selectCatalogStatus);
    const isLoading = catalogStatus === "loading" || (catalogStatus === "idle" && courses.length === 0);
    const coursesToShow = courses.reduce<typeof courses>((acc, course) => {
        if (!acc.some(item => item.slug === course.slug)) {
            acc.push(course);
        }
        return acc;
    }, []);

    return (
        <>
            <div className={styles.hero}>
                <h1>
                    Начните заниматься спортом
                    <br />
                    и улучшите качество жизни
                </h1>
                <Image src="/Massage.svg" alt="Dsdsd" width={288} height={120} />
            </div>

            <div className={styles.grid}>
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className={styles.skeletonCard} aria-hidden="true">
                            <div className={styles.skeletonImage} />
                            <div className={styles.skeletonContent}>
                                <div className={styles.skeletonTitle} />
                                <div className={styles.skeletonMetaRow} />
                                <div className={styles.skeletonMetaRowShort} />
                                <div className={styles.skeletonButton} />
                            </div>
                        </div>
                    ))
                ) : coursesToShow.length > 0 ? (
                    coursesToShow.map((course) => (
                        <CourseCard key={course._id || course.slug} course={course} />
                    ))
                ) : (
                    <div>Список тренировок пуст</div>
                )}
            </div>

            <div className={styles.toTop}>
                <Button
                    variant="primary"
                    size="down"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    Наверх ↑
                </Button>
            </div>
        </>
    );
}
