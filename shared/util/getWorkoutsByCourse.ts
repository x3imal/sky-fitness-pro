import { WORKOUTS } from '@/shared/data/workouts';
import { Workout } from '@/shared/types/workout';

export function getWorkoutsByCourse(workoutIds: string[]): Workout[] {
    return WORKOUTS.filter(workout => workoutIds.includes(workout.id));
}
