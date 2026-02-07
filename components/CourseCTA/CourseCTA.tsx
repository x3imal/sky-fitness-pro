import Link from 'next/link';
import Image from 'next/image';
import styles from './CourseCTA.module.css';

export function CourseCTA() {
    return (
        <section className={styles.cta}>
            <div className={styles.card}>
                <div className={styles.left}>
                    <h2 className={styles.title}>Начните путь к новому телу</h2>

                    <ul className={styles.list}>
                        <li>проработка всех групп мышц</li>
                        <li>тренировка суставов</li>
                        <li>улучшение циркуляции крови</li>
                        <li>упражнения заряжают бодростью</li>
                        <li>помогают противостоять стрессам</li>
                    </ul>

                    <Link href="/auth" className={styles.button}>
                        Войдите, чтобы добавить курс
                    </Link>
                </div>

                <div className={styles.right}>
  <span className={styles.line} aria-hidden>
    <Image
        src="/images/cta/line-cta.png"
        alt=""
        fill
        sizes="300px"
        className={styles.lineImg}
    />
  </span>

                    <div className={styles.imageWrap}>
                        <Image
                            src="/images/cta/common-cta.png"
                            alt=""
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 600px"
                            className={styles.image}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
