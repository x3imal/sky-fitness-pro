import { notFound } from "next/navigation";
import ProgressModal from "@/components/ProgressModal/ProgressModal";
import { getWorkoutById } from "@/shared/util/getWorkoutById";
import AuthGuard from "@/components/AuthGuard/AuthGuard";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function WorkoutProgressModalPage({ params }: PageProps) {
    const { id } = await params;
    const workout = getWorkoutById(id);
    if (!workout) notFound();

    return (
        <AuthGuard>
            <ProgressModal workout={workout} showOverlay showClose={false} />
        </AuthGuard>
    );
}
