import { notFound } from "next/navigation";
import ProgressModal from "@/components/ProgressModal/ProgressModal";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { getWorkoutByIdAsync } from "@/shared/util/catalogQueries";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function WorkoutProgressPage({ params }: PageProps) {
    const { id } = await params;
    const workout = await getWorkoutByIdAsync(id);
    if (!workout) notFound();

    return (
        <AuthGuard>
            <ProgressModal workout={workout} showOverlay={false} showClose={false} />
        </AuthGuard>
    );
}
