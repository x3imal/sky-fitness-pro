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
import { useAppDispatch } from "@/store/hooks";
import { loginUser, registerUser } from "@/store/slices/authSlice";

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
    const [mode, setMode] = useState<Mode>(initialMode);
    const [values, setValues] = useState<AuthValues>({
        login: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<AuthErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isLogin = mode === "login";

    const getErrorMessage = (error: unknown, fallback: string) => {
        if (typeof error === "string" && error.trim()) return error;
        if (error instanceof Error && error.message.trim()) return error.message;
        return fallback;
    };

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

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const nextErrors: AuthErrors = isLogin ? validateLogin(values) : validateSignup(values);
        const nextUrl = searchParams.get("next") || "/profile";

        if (isLogin && Object.keys(nextErrors).length === 0) {
            try {
                setIsSubmitting(true);
                await dispatch(
                    loginUser({
                        email: values.login.trim().toLowerCase(),
                        password: values.password.trim(),
                    })
                ).unwrap();

                if (onClose) onClose();
                else router.push(nextUrl);
                return;
            } catch (error) {
                const message = getErrorMessage(error, "Ошибка входа");
                if (message.toLowerCase().includes("email")) nextErrors.login = message;
                else nextErrors.password = message;
            } finally {
                setIsSubmitting(false);
            }
        }

        if (!isLogin && Object.keys(nextErrors).length === 0) {
            try {
                setIsSubmitting(true);
                await dispatch(
                    registerUser({
                        email: values.email.trim().toLowerCase(),
                        password: values.password.trim(),
                    })
                ).unwrap();

                if (onClose) onClose();
                else router.push(nextUrl);
                return;
            } catch (error) {
                const message = getErrorMessage(error, "Ошибка регистрации");
                if (message.toLowerCase().includes("email")) nextErrors.email = message;
                else if (message.toLowerCase().includes("парол")) nextErrors.password = message;
                else nextErrors.password = message;
            } finally {
                setIsSubmitting(false);
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
                                type="email"
                                placeholder="Эл. почта"
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
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className={styles.actionButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Вход..." : "Войти"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    className={styles.actionButton}
                                    disabled={isSubmitting}
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
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className={styles.actionButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    className={styles.actionButton}
                                    disabled={isSubmitting}
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
