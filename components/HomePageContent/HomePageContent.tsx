"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import styles from "@/app/page.module.css";
import { useAppSelector } from "@/store/hooks";
import { selectCourses } from "@/store/selectors";

export default function HomePageContent() {
    const courses = useAppSelector(selectCourses);

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
                {courses.map((course) => (
                    <CourseCard key={course.slug} course={course} />
                ))}
            </div>

            <div className={styles.toTop}>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    Наверх ↑
                </Button>
            </div>
        </>
    );
}
