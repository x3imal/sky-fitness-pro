import Link from 'next/link';
import Image from 'next/image';
import styles from './CourseCard.module.css';

interface CourseCardProps {
    title: string;
    imageSrc?: string;
    days: string;
    time: string;
}

export function CourseCard({ title, imageSrc, days, time }: CourseCardProps) {
    return (
        <article className={styles.card}>
            <div className={styles.imageContainer}>
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className={styles.courseImage}
                        priority={false}
                    />
                ) : (
                    <div className={styles.imagePlaceholder} />
                )}

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
                <h3 className={styles.title}>{title}</h3>

                <div className={styles.meta}>
                    {/* ВЕРХНИЙ РЯД: календарь + время на одном уровне */}
                    <div className={styles.metaTop}>
                        <div className={styles.metaRow}>
                            <Image
                                src="/icons/calendar.svg"
                                alt="Дни"
                                width={18}
                                height={18}
                                className={styles.metaIcon}
                            />
                            <span className={styles.metaText}>{days}</span>
                        </div>

                        <div className={styles.metaRow}>
                            <Image
                                src="/icons/watch.svg"
                                alt="Время"
                                width={18}
                                height={18}
                                className={styles.metaIcon}
                            />
                            <span className={styles.metaText}>{time}</span>
                        </div>
                    </div>

                    {/* НИЖНИЙ РЯД: сложность ниже */}
                    <div className={styles.metaRow}>
                        <Image
                            src="/icons/complexity.svg"
                            alt="Сложность"
                            width={18}
                            height={18}
                            className={styles.metaIcon}
                        />
                        <span className={styles.metaText}>Сложность</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
