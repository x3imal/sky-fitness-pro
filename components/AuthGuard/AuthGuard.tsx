"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/selectors";

type Props = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            const nextPath = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
            router.replace(`/auth${nextPath}`);
        }
    }, [isAuthenticated, pathname, router]);

    if (!isAuthenticated) return null;
    return <>{children}</>;
}
