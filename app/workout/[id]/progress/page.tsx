import { notFound } from "next/navigation";
import ProgressModal from "@/components/ProgressModal/ProgressModal";
import { getWorkoutById } from "@/shared/util/getWorkoutById";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function WorkoutProgressPage({ params }: PageProps) {
    const { id } = await params;
    const workout = getWorkoutById(id);
    if (!workout) notFound();

    return <ProgressModal workout={workout} showOverlay={false} showClose={false} />;
}
