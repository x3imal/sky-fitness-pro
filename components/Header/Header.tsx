"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import {Button} from "@/components/ui/Button/Button";

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

                <Link href="/auth">
                    <Button variant="primary" size="lg">
                        Войти
                    </Button>
                </Link>
            </div>
        </header>
    );
}