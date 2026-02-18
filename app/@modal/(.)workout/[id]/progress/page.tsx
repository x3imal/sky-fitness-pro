"use client";

import ProgressModal from "@/components/ProgressModal/ProgressModal";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { useParams } from "next/navigation";

export default function WorkoutProgressModalPage() {
    const params = useParams<{ id: string }>();
    const workoutId = params?.id ?? "";

    return (
        <AuthGuard>
            <ProgressModal workoutId={workoutId} showOverlay showClose={false} />
        </AuthGuard>
    );
}
