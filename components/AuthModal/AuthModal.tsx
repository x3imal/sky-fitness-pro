"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./AuthModal.module.css";
import {
    validateLogin,
    validateSignup,
    type AuthErrors,
    type AuthValues,
} from "@/shared/util/authValidation";

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

}: Props) {
    const [mode, setMode] = useState<Mode>(initialMode);
    const [values, setValues] = useState<AuthValues>({
        login: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<AuthErrors>({});
    const isLogin = mode === "login";

    const onChange = (field: keyof AuthValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues(prev => ({ ...prev, [field]: e.target.value }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nextErrors = isLogin ? validateLogin(values) : validateSignup(values);
        setErrors(nextErrors);
    };

    return (
        <div className={showOverlay ? styles.overlay : styles.pageWrap}>
            <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Авторизация">

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
                                <button type="submit" className={styles.primaryButton}>
                                    Войти
                                </button>
                                <button
                                    type="button"
                                    className={styles.secondaryButton}
                                    onClick={() => {
                                        setMode("signup");
                                        setErrors({});
                                    }}
                                >
                                    Зарегистрироваться
                                </button>
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
                                <button type="submit" className={styles.primaryButton}>
                                    Зарегистрироваться
                                </button>
                                <button
                                    type="button"
                                    className={styles.secondaryButton}
                                    onClick={() => {
                                        setMode("login");
                                        setErrors({});
                                    }}
                                >
                                    Войти
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
