"use client";

import ProgressModal from "@/components/ProgressModal/ProgressModal";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { useParams } from "next/navigation";

export default function WorkoutProgressPage() {
    const params = useParams<{ id: string }>();
    const workoutId = params?.id ?? "";

    return (
        <AuthGuard>
            <ProgressModal workoutId={workoutId} showOverlay={false} showClose={false} />
        </AuthGuard>
    );
}
