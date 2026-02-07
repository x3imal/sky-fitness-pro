import Link from 'next/link';
import Image from 'next/image';
import styles from './CourseCard.module.css';
import {Course} from "@/shared/types/course";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({course}: CourseCardProps) {
    const {slug, nameRU, imageSrc, durationInDays, dailyDurationInMinutes, difficulty} = course;

    return (
        <article className={styles.card}>
            <div className={styles.imageContainer}>
                <Link
                    href={`/course/${slug}`}
                    className={styles.cardLink}
                    aria-label={`Открыть курс: ${nameRU}`}
                >
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={nameRU}
                            fill
                            sizes="(max-width: 768px) 100vw, 360px"
                            className={styles.courseImage}
                            priority={false}
                        />
                    ) : (
                        <div className={styles.imagePlaceholder}/>
                    )}
                </Link>

                <Link
                    href="/auth"
                    className={styles.plusButton}
                    aria-label="Добавить тренировку"
                >
                    <Image
                        src="/icons/plus.svg"
                        alt="Добавить"
                        width={26}
                        height={26}
                        className={styles.plusIcon}
                    />
                </Link>
            </div>

            <div className={styles.content}>
                <Link
                    href={`/course/${slug}`}
                    className={styles.titleLink}
                    aria-label={`Открыть курс: ${nameRU}`}
                >
                    <h3 className={styles.title}>{nameRU}</h3>
                </Link>

                <div className={styles.meta}>
                    <div className={styles.metaTop}>
                        <div className={styles.metaRow}>
                            <Image
                                src="/icons/calendar.svg"
                                alt="Дни"
                                width={18}
                                height={18}
                                className={styles.metaIcon}
                            />
                            <span className={styles.metaText}>{durationInDays} дней</span>
                        </div>

                        <div className={styles.metaRow}>
                            <Image
                                src="/icons/watch.svg"
                                alt="Время"
                                width={18}
                                height={18}
                                className={styles.metaIcon}
                            />
                            <span className={styles.metaText}>
                {dailyDurationInMinutes.from}-{dailyDurationInMinutes.to} мин/день
              </span>
                        </div>
                    </div>

                    <div className={styles.metaRow}>
                        <Image
                            src="/icons/complexity.svg"
                            alt="Сложность"
                            width={18}
                            height={18}
                            className={styles.metaIcon}
                        />
                        <span className={styles.metaText}>{difficulty}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
