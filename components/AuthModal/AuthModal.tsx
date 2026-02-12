"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./AuthModal.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import {
    validateLogin,
    validateSignup,
    type AuthErrors,
    type AuthValues,
} from "@/shared/util/authValidation";
import { Button } from "@/components/ui/Button/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, registerUser } from "@/store/slices/authSlice";
import { selectUsers } from "@/store/selectors";

type Mode = "login" | "signup";

type Props = {
    initialMode?: Mode;
    showOverlay?: boolean;
    showClose?: boolean;
    onClose?: () => void;
};

export default function AuthModal({
    initialMode = "login",
    showOverlay = true,
    showClose = false,
    onClose,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    const [mode, setMode] = useState<Mode>(initialMode);
    const [values, setValues] = useState<AuthValues>({
        login: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<AuthErrors>({});
    const isLogin = mode === "login";

    const handleClose = () => {
        if (onClose) {
            onClose();
            return;
        }

        router.push("/");
    };

    const onChange = (field: keyof AuthValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues(prev => ({ ...prev, [field]: e.target.value }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nextErrors: AuthErrors = isLogin ? validateLogin(values) : validateSignup(values);
        const nextUrl = searchParams.get("next") || "/profile";

        if (isLogin && Object.keys(nextErrors).length === 0) {
            const loginValue = values.login.trim().toLowerCase();
            const matchedUser = users.find(
                user =>
                    user.login.toLowerCase() === loginValue ||
                    user.email.toLowerCase() === loginValue
            );

            if (!matchedUser || matchedUser.password !== values.password.trim()) {
                nextErrors.password = "Логин или пароль введены неверно";
            } else {
                dispatch(loginUser({ login: matchedUser.login }));
                if (onClose) {
                    onClose();
                } else {
                    router.push(nextUrl);
                }
                return;
            }
        }

        if (!isLogin && Object.keys(nextErrors).length === 0) {
            const email = values.email.trim().toLowerCase();
            const hasEmail = users.some(user => user.email.toLowerCase() === email);

            if (hasEmail) {
                nextErrors.email = "Данная почта уже используется";
            } else {
                const baseLogin = email.split("@")[0] || "user";
                let nextLogin = baseLogin;
                let suffix = 1;
                while (users.some(user => user.login.toLowerCase() === nextLogin.toLowerCase())) {
                    suffix += 1;
                    nextLogin = `${baseLogin}${suffix}`;
                }

                dispatch(
                    registerUser({
                        login: nextLogin,
                        email,
                        password: values.password.trim(),
                        myCourseSlugs: [],
                    })
                );
                if (onClose) {
                    onClose();
                } else {
                    router.push(nextUrl);
                }
                return;
            }
        }

        setErrors(nextErrors);
    };

    return (
        <div
            className={showOverlay ? styles.overlay : styles.pageWrap}
            onClick={showOverlay ? (e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            } : undefined}
        >
            <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Авторизация">
                {showClose && (
                    <button
                        type="button"
                        className={styles.close}
                        onClick={handleClose}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                )}

                <div className={styles.logoRow}>
                    <Image src="/logo.svg" alt="SkyFitnessPro" width={220} height={35} />
                </div>

                <form className={styles.form} onSubmit={onSubmit} noValidate>
                    {isLogin ? (
                        <>
                            <input
                                className={`${styles.input} ${errors.login ? styles.inputError : ""}`}
                                type="text"
                                placeholder="Логин"
                                value={values.login}
                                onChange={onChange("login")}
                            />
                            {errors.login && <div className={styles.errorText}>{errors.login}</div>}

                            <input
                                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                                type="password"
                                placeholder="Пароль"
                                value={values.password}
                                onChange={onChange("password")}
                            />
                            {errors.password && <div className={styles.errorText}>{errors.password}</div>}

                            <div className={styles.actions}>
                                <Button type="submit" variant="primary" size="lg" className={styles.actionButton}>
                                    Войти
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    className={styles.actionButton}
                                    onClick={() => {
                                        setMode("signup");
                                        setErrors({});
                                    }}
                                >
                                    Зарегистрироваться
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                                type="email"
                                placeholder="Эл. почта"
                                value={values.email}
                                onChange={onChange("email")}
                            />
                            {errors.email && <div className={styles.errorText}>{errors.email}</div>}

                            <input
                                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                                type="password"
                                placeholder="Пароль"
                                value={values.password}
                                onChange={onChange("password")}
                            />
                            {errors.password && <div className={styles.errorText}>{errors.password}</div>}

                            <input
                                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                                type="password"
                                placeholder="Повторите пароль"
                                value={values.confirmPassword}
                                onChange={onChange("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <div className={styles.errorText}>{errors.confirmPassword}</div>
                            )}

                            <div className={styles.actions}>
                                <Button type="submit" variant="primary" size="lg" className={styles.actionButton}>
                                    Зарегистрироваться
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    className={styles.actionButton}
                                    onClick={() => {
                                        setMode("login");
                                        setErrors({});
                                    }}
                                >
                                    Войти
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
