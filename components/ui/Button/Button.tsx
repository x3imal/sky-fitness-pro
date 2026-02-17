import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./Button.module.css";

const cn = (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(" ");

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "down" | "menu" | "in";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            children,
            onClick,
            ...props
        },
        ref
    ) => {
        return (
            <button
                className={cn(
                    styles.button,
                    styles[`variant-${variant}`],
                    styles[`size-${size}`],
                    className
                )}
                ref={ref}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
