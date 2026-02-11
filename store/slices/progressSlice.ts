import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { workoutsByCourseSlug } from "@/shared/data/workouts";

type ExerciseProgressByWorkout = Record<string, Record<string, number>>;

type ProgressState = {
    exerciseProgressByWorkout: ExerciseProgressByWorkout;
};

const clampProgress = (value: number) => Math.max(0, Math.min(100, value));

const initialExerciseProgressByWorkout: ExerciseProgressByWorkout = Object
    .values(workoutsByCourseSlug)
    .flat()
    .reduce<ExerciseProgressByWorkout>((acc, workout) => {
        acc[workout._id] = workout.exercises.reduce<Record<string, number>>((exerciseAcc, ex) => {
            const fallback = workout.completed ? 100 : 0;
            exerciseAcc[ex._id] = clampProgress(ex.progress ?? fallback);
            return exerciseAcc;
        }, {});
        return acc;
    }, {});

const initialState: ProgressState = {
    exerciseProgressByWorkout: initialExerciseProgressByWorkout,
};

type SaveWorkoutProgressPayload = {
    workoutId: string;
    values: Record<string, number>;
};

const progressSlice = createSlice({
    name: "progress",
    initialState,
    reducers: {
        saveWorkoutProgress: (state, action: PayloadAction<SaveWorkoutProgressPayload>) => {
            const { workoutId, values } = action.payload;
            const current = state.exerciseProgressByWorkout[workoutId] ?? {};

            state.exerciseProgressByWorkout[workoutId] = Object.keys(current).reduce<Record<string, number>>(
                (acc, exerciseId) => {
                    const nextValue = values[exerciseId];
                    acc[exerciseId] = clampProgress(Number.isFinite(nextValue) ? nextValue : current[exerciseId]);
                    return acc;
                },
                {}
            );
        },
    },
});

export const { saveWorkoutProgress } = progressSlice.actions;
export default progressSlice.reducer;
