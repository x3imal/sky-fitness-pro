import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getCourseById } from '@/shared/util/getCourseById';
import {CourseCTA} from "@/components/CourseCTA/CourseCTA";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function CoursePage({ params }: PageProps) {
    const { id } = await params;

    const course = getCourseById(id);
    if (!course) notFound();

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.heroCard}>
                    <h1 className={styles.heroTitle}>{course.nameRU}</h1>

                    <div className={styles.heroImage}>
                        <Image src={course.imageSrc} alt={course.nameRU} fill priority sizes="(max-width: 768px) 100vw, 1200px" />
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>

                <div className={styles.fittingGrid}>
                    {course.fitting.slice(0, 3).map((text, idx) => (
                        <div key={idx} className={styles.fittingCard}>
                            <div className={styles.fittingIndex}>{idx + 1}</div>
                            <p className={styles.fittingText}>{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Направления</h2>

                <div className={styles.directions}>
                    {course.directions.map(dir => (
                        <span key={dir} className={styles.directionChip}>
              + {dir}
            </span>
                    ))}
                </div>
            </section>

            <CourseCTA />

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Описание</h2>
                <p className={styles.description}>{course.description}</p>
            </section>
        </div>
    );
}
