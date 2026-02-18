"use client";

import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal/AuthModal";

export default function AuthModalPage() {
    const router = useRouter();

    return (
        <AuthModal
            showOverlay
            showClose={false}
            onClose={() => router.back()}
        />
    );
}
