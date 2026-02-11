"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './CourseCard.module.css';
import {Course} from "@/shared/types/course";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCourseToCurrentUser, removeCourseFromCurrentUser } from "@/store/slices/authSlice";
import { selectHasCourse, selectIsAuthenticated } from "@/store/selectors";
import { useRouter } from "next/navigation";

interface CourseCardProps {
    course: Course;
    progress?: number;
    actionText?: string;
    actionHref?: string;
    showAddButton?: boolean;
}

export function CourseCard({ course, progress, actionText, actionHref, showAddButton = true }: CourseCardProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const {slug, nameRU, imageSrc, durationInDays, dailyDurationInMinutes, difficulty} = course;
    const hasCourse = useAppSelector(state => selectHasCourse(state, slug));

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

                {showAddButton && (
                    <button
                        type="button"
                        className={styles.plusButton}
                        aria-label={hasCourse ? "Удалить тренировку" : "Добавить тренировку"}
                        onClick={() => {
                            if (!isAuthenticated) {
                                router.push("/auth");
                                return;
                            }
                            if (hasCourse) {
                                dispatch(removeCourseFromCurrentUser({ slug }));
                            } else {
                                dispatch(addCourseToCurrentUser({ slug }));
                            }
                        }}
                    >
                        <Image
                            src="/icons/plus.svg"
                            alt="Добавить"
                            width={26}
                            height={26}
                            className={`${styles.plusIcon} ${hasCourse ? styles.plusIconActive : ""}`}
                        />
                    </button>
                )}
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

                {typeof progress === "number" && (
                    <div className={styles.progressBlock}>
                        <div className={styles.progressLabel}>Прогресс {progress}%</div>
                        <div className={styles.progressBar} aria-hidden="true">
                            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}

                {actionText &&
                    (actionHref ? (
                        <Link href={actionHref} className={styles.actionButton}>
                            {actionText}
                        </Link>
                    ) : (
                        <button type="button" className={styles.actionButton}>
                            {actionText}
                        </button>
                    ))}
            </div>
        </article>
    );
}
