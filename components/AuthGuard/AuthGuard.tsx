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
            const nextPath = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
            window.location.replace(`/auth${nextPath}`);
        }
    }, [isAuthenticated, isResolvingSession, pathname]);

    if (!isAuthenticated || isResolvingSession) return null;
    return <>{children}</>;
}
