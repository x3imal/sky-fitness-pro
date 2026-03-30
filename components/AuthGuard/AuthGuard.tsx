"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectAuthStatus, selectAuthToken, selectIsAuthenticated } from "@/store/selectors";

type Props = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
    const pathname = usePathname();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const authStatus = useAppSelector(selectAuthStatus);
    const authToken = useAppSelector(selectAuthToken);

    const isResolvingSession = Boolean(authToken) && authStatus === "loading" && !isAuthenticated;

    useEffect(() => {
        if (!isAuthenticated && !isResolvingSession) {
            const shouldGoHome = typeof window !== "undefined" && window.sessionStorage.getItem("logout_redirect") === "1";
            if (shouldGoHome) {
                window.sessionStorage.removeItem("logout_redirect");
                window.location.replace("/");
                return;
            }
            const nextPath = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
            window.location.replace(`/auth${nextPath}`);
        }
    }, [isAuthenticated, isResolvingSession, pathname]);

    if (!isAuthenticated || isResolvingSession) return null;
    return <>{children}</>;
}
