"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import {Button} from "@/components/ui/Button/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectCurrentUserLabel } from "@/store/selectors";
import { logoutUser } from "@/store/slices/authSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const currentUserLabel = useAppSelector(selectCurrentUserLabel);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logoWrapper} aria-label="SkyFitnessPro">
                    <Image
                        src="/logo.svg"
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

                {currentUser ? (
                    <div className={styles.userMenuWrap}>
                        <Button
                            variant="primary"
                            size="lg"
                            className={styles.userBtn}
                            onClick={() => setIsMenuOpen(prev => !prev)}
                        >
                            {currentUserLabel}
                        </Button>

                        {isMenuOpen && (
                            <>
                                <button
                                    type="button"
                                    className={styles.backdrop}
                                    aria-label="Закрыть меню профиля"
                                    onClick={() => setIsMenuOpen(false)}
                                />

                                <div className={styles.userMenu} role="dialog" aria-label="Меню профиля">
                                    <div className={styles.menuName}>{currentUserLabel}</div>
                                    <div className={styles.menuEmail}>{currentUser.email}</div>

                                    <Button
                                        variant="primary"
                                        size="menu"
                                        className={styles.menuButton}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            router.push("/profile");
                                        }}
                                    >
                                        Мой профиль
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        size="menu"
                                        className={styles.menuButton}
                                        onClick={() => {
                                            dispatch(logoutUser());
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Выйти
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <Link href="/auth">
                        <Button variant="primary" size="lg">
                            Войти
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}
