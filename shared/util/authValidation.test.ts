import { describe, expect, it } from "vitest";
import { validateLogin, validateSignup } from "@/shared/util/authValidation";

describe("authValidation", () => {
    it("returns login and password errors for empty login form", () => {
        const result = validateLogin({
            login: " ",
            email: "",
            password: " ",
            confirmPassword: "",
        });

        expect(result).toEqual({
            login: "Введите email",
            password: "Введите пароль",
        });
    });

    it("validates incorrect login email format", () => {
        const result = validateLogin({
            login: "not-an-email",
            email: "",
            password: "secret",
            confirmPassword: "",
        });

        expect(result.login).toBe("Некорректный email");
        expect(result.password).toBeUndefined();
    });

    it("returns signup errors for invalid email and mismatched passwords", () => {
        const result = validateSignup({
            login: "",
            email: "bad-email",
            password: "123456",
            confirmPassword: "654321",
        });

        expect(result).toEqual({
            email: "Некорректный email",
            confirmPassword: "Пароли не совпадают",
        });
    });

    it("returns no signup errors for valid values", () => {
        const result = validateSignup({
            login: "",
            email: "user@example.com",
            password: "123456",
            confirmPassword: "123456",
        });

        expect(result).toEqual({});
    });
});
