"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import { Button } from "@/components/ui/Button/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectCurrentUserLabel } from "@/store/selectors";
import { logoutUser } from "@/store/slices/authSlice";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const currentUserLabel = useAppSelector(selectCurrentUserLabel);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const isMobile = () => typeof window !== "undefined" && window.innerWidth <= 767;

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (menuRef.current?.contains(target)) return;
            if (buttonRef.current?.contains(target)) return;
            setIsMenuOpen(false);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isMenuOpen]);

    const onProfileClick = () => {
        if (isMobile()) {
            router.push("/profile");
            return;
        }
        setIsMenuOpen(prev => !prev);
    };

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
                        <button
                            type="button"
                            className={styles.profileTrigger}
                            ref={buttonRef}
                            onClick={onProfileClick}
                            aria-haspopup="dialog"
                            aria-expanded={isMenuOpen}
                            aria-label="Открыть меню профиля"
                        >
                            <Image
                                src="/images/profile/mini_avatar.png"
                                alt=""
                                width={50}
                                height={50}
                                aria-hidden="true"
                                className={styles.profileAvatar}
                            />
                            <span className={styles.profileName}>{currentUserLabel}</span>
                            <span className={styles.profileChevron} aria-hidden="true" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <button
                                    type="button"
                                    className={styles.backdrop}
                                    aria-label="Закрыть меню профиля"
                                    onClick={() => setIsMenuOpen(false)}
                                />

                                <div
                                    ref={menuRef}
                                    className={styles.userMenu}
                                    role="dialog"
                                    aria-label="Меню профиля"
                                >
                                    <div className={styles.menuName}>{currentUserLabel}</div>
                                    <div className={styles.menuEmail}>{currentUser.email ?? ""}</div>

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
                                            setIsMenuOpen(false);
                                            window.sessionStorage.setItem("logout_redirect", "1");
                                            dispatch(logoutUser());
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
                        <Button variant="primary" size="in" className={styles.loginBtn}>
                            Войти
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}
