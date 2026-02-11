import { RootState } from "./store";
import { workoutsByCourseSlug } from "@/shared/data/workouts";

const average = (values: number[]) =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const selectWorkoutExerciseProgress = (state: RootState, workoutId: string) =>
    state.progress.exerciseProgressByWorkout[workoutId] ?? {};

export const selectWorkoutProgress = (state: RootState, workoutId: string) => {
    const map = selectWorkoutExerciseProgress(state, workoutId);
    return Math.round(average(Object.values(map)));
};

export const selectCourseProgress = (state: RootState, slug: string) => {
    const workouts = workoutsByCourseSlug[slug] ?? [];
    const values = workouts.map(workout => selectWorkoutProgress(state, workout._id));
    return Math.round(average(values));
};

export const selectCourseActionText = (state: RootState, slug: string) => {
    const progress = selectCourseProgress(state, slug);
    if (progress === 0) return "Начать тренировки";
    if (progress === 100) return "Начать заново";
    return "Продолжить";
};

export const selectCurrentUser = (state: RootState) => {
    const login = state.auth.currentUserLogin;
    if (!login) return null;
    return state.auth.users.find(user => user.login === login) ?? null;
};

export const selectUsers = (state: RootState) => state.auth.users;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.currentUserLogin);

export const selectMyCourseSlugs = (state: RootState) => {
    const user = selectCurrentUser(state);
    return user?.myCourseSlugs ?? [];
};

export const selectHasCourse = (state: RootState, slug: string) =>
    selectMyCourseSlugs(state).includes(slug);

export const selectCurrentUserLabel = (state: RootState) => {
    const user = selectCurrentUser(state);
    if (!user) return "";
    const source = user.login || user.email;
    const base = source.split("@")[0].split(".")[0];
    if (!base) return "Профиль";
    return base.charAt(0).toUpperCase() + base.slice(1);
};
