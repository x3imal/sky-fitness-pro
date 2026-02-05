"use client";

import { Button } from "@/components/ui/Button/Button";
import styles from "./page.module.css";
import Image from "next/image";
import {CourseCard} from "@/components/CourseCard/CourseCard";
import {COURSES} from "@/shared/data/courses";


export default function Home() {
    return (
        <>
            <div className={styles.hero}>
                <h1>
                    Начните заниматься спортом
                    <br />
                    и улучшите качество жизни
                </h1>
                <Image
                    src="/Massage.svg"
                    alt="Dsdsd"
                    width={288}
                    height={120}
                />
            </div>

            <div className={styles.grid}>
                {COURSES.map((course) => (
                    <CourseCard key={course.id} course={course} />
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