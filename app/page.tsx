"use client";

import { Button } from "@/components/ui/Button/Button";
import styles from "./page.module.css";
import Image from "next/image";
import {CourseCard} from "@/components/CourseCard/CourseCard";

type Course = {
    id: string;
    title: string;
    imageSrc: string;
    days: string;
    time: string;
};


const COURSES: Course[] = [
    {
        id: 'yoga',
        title: 'Йога',
        imageSrc: '/images/courses/yoga.png',
        days: '25 дней',
        time: '20–50 мин/день',
    },
    {
        id: 'stretching',
        title: 'Стретчинг',
        imageSrc: '/images/courses/stretching.png',
        days: '18 дней',
        time: '15–30 мин/день',
    },
    {
        id: 'fitness',
        title: 'Фитнес',
        imageSrc: '/images/courses/fitness.png',
        days: '30 дней',
        time: '10–25 мин/день',
    },
    {
        id: 'step',
        title: 'Степ-аэробика',
        imageSrc: '/images/courses/step.png',
        days: '18 дней',
        time: '15–30 мин/день',
    },
    {
        id: 'bodyflex',
        title: 'Бодифлекс',
        imageSrc: '/images/courses/bodyflex.png',
        days: '22 дней',
        time: '12–25 мин/день',
    },
];


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
                    <CourseCard
                        key={course.id}
                        title={course.title}
                        imageSrc={course.imageSrc}
                        days={course.days}
                        time={course.time}
                    />
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