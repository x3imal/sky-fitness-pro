import Link from 'next/link';
import styles from './WorkoutCard.module.css';
import { Workout } from '@/shared/types/workout';

interface Props {
    workout: Workout;
    index: number;
}

export function WorkoutCard({ workout, index }: Props) {
    return (
        <Link href={`/workout/${workout._id}`} className={styles.card}>
            <span className={styles.index}>{index}</span>
            <span className={styles.name}>{workout.name}</span>
        </Link>
    );
}
