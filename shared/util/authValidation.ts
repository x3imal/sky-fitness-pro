export type AuthValues = {
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type AuthErrors = Partial<Record<keyof AuthValues, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values: AuthValues): AuthErrors {
    const errors: AuthErrors = {};

    if (!values.login.trim()) {
        errors.login = "Введите email";
    } else if (!emailRegex.test(values.login.trim())) {
        errors.login = "Некорректный email";
    }

    if (!values.password.trim()) {
        errors.password = "Введите пароль";
    }

    return errors;
}

export function validateSignup(values: AuthValues): AuthErrors {
    const errors: AuthErrors = {};

    if (!values.email.trim()) {
        errors.email = "Введите эл. почту";
    } else if (!emailRegex.test(values.email.trim())) {
        errors.email = "Некорректный email";
    }

    if (!values.password.trim()) {
        errors.password = "Введите пароль";
    }

    if (!values.confirmPassword.trim()) {
        errors.confirmPassword = "Повторите пароль";
    } else if (values.confirmPassword.trim() !== values.password.trim()) {
        errors.confirmPassword = "Пароли не совпадают";
    }

    return errors;
}
