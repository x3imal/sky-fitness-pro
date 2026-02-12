"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/selectors";

type Props = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
    const pathname = usePathname();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            const nextPath = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
            window.location.replace(`/auth${nextPath}`);
        }
    }, [isAuthenticated, pathname]);

    if (!isAuthenticated) return null;
    return <>{children}</>;
}
