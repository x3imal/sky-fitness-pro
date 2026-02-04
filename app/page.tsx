"use client";

import { Button } from "@/components/ui/Button/Button";
import styles from "./page.module.css";
import Image from "next/image";

const courses = [
    { title: "Йога", color: "#ffca28", days: "25 дней", time: "20-50 мин/день" },
    { title: "Стретчинг", color: "#2196f3", days: "25 дней", time: "20-50 мин/день" },
    { title: "Фитнес", color: "#ff9800", days: "25 дней", time: "20-50 мин/день" },
    { title: "Степ-аэробика", color: "#ff5722", days: "25 дней", time: "20-50 мин/день" },
    { title: "Бодифлекс", color: "#9c27b0", days: "25 дней", time: "20-50 мин/день" },
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
                {courses.map((course) => (
                    <div key={course.title} className={styles.card}>
                        <div className={styles.media} style={{ backgroundColor: course.color }}>
                            <button className={styles.plus}>+</button>
                        </div>
                        <div className={styles.content}>
                            <h3>{course.title}</h3>
                            <div className={styles.meta}>
                                <span>🗓 {course.days}</span>
                                <span>⏱ {course.time}</span>
                            </div>
                            <div className={styles.difficulty}>★ Сложность</div>
                        </div>
                    </div>
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