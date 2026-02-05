import Link from 'next/link';
import Image from 'next/image';
import styles from './CourseCard.module.css';

interface CourseCardProps {
    title: string;
    bgColor: string;
    imageSrc?: string;
    days: string;
    time: string;
}

export function CourseCard({
                               title,
                               bgColor,
                               imageSrc,
                               days,
                               time,
                           }: CourseCardProps) {
    return (
        <article className={styles.card}>
            <div className={styles.imageContainer} style={{ backgroundColor: bgColor }}>
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className={styles.courseImage}
                        priority={false} // или true для первых 2–3 карточек
                    />
                ) : (
                    // заглушка, если картинки пока нет
                    <div className={styles.imagePlaceholder} />
                )}

                <Link href="/auth" className={styles.plusButton} aria-label="Добавить курс">
                    <span className={styles.plus}>+</span>
                </Link>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>

                <div className={styles.meta}>
                    <div className={styles.metaRow}>
                        <Image
                            src="/icons/calendar.png"
                            alt="Дни"
                            width={18}
                            height={18}
                            className={styles.metaIcon}
                        />
                        <span>{days}</span>
                    </div>

                    <div className={styles.metaRow}>
                        <Image
                            src="/icons/watch.png"
                            alt="Время"
                            width={18}
                            height={18}
                            className={styles.metaIcon}
                        />
                        <span>{time}</span>
                    </div>

                    <div className={styles.metaRow}>
                        <Image
                            src="/icons/complexity.png"
                            alt="Сложность"
                            width={18}
                            height={18}
                            className={styles.metaIcon}
                        />
                        <span>Сложность</span>
                    </div>
                </div>
            </div>
        </article>
    );
}