"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logoWrapper} aria-label="SkyFitnessPro">
                    <Image
                        src="/logo.png"
                        alt="SkyFitnessPro"
                        width={225}
                        height={35}
                        priority
                        className={styles.logoImage}
                    />
                    <div className={styles.logoSub}>
                        Онлайн-тренировки для занятий дома
                    </div>
                </Link>

                <Link href="/auth" className={styles.loginBtn}>
                    Войти
                </Link>
            </div>
        </header>
    );
}