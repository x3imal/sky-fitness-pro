import { RootState } from "./store";

const average = (values: number[]) =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const selectCourses = (state: RootState) => state.catalog.courses;
export const selectWorkoutsByCourseSlug = (state: RootState) => state.catalog.workoutsByCourseSlug;
export const selectCatalogStatus = (state: RootState) => state.catalog.status;
export const selectCatalogError = (state: RootState) => state.catalog.error;
export const selectCatalogSource = (state: RootState) => state.catalog.source;

export const selectWorkoutExerciseProgress = (state: RootState, workoutId: string) =>
    state.progress.exerciseProgressByWorkout[workoutId] ?? {};

export const selectWorkoutProgress = (state: RootState, workoutId: string) => {
    const map = selectWorkoutExerciseProgress(state, workoutId);
    return Math.round(average(Object.values(map)));
};

export const selectCourseProgress = (state: RootState, slug: string) => {
    const workouts = selectWorkoutsByCourseSlug(state)[slug] ?? [];
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

export const selectCourseBySlug = (state: RootState, slug: string) =>
    selectCourses(state).find(course => course.slug === slug);

export const selectWorkoutsForCourse = (state: RootState, slug: string) =>
    selectWorkoutsByCourseSlug(state)[slug] ?? [];

export const selectWorkoutById = (state: RootState, id: string) =>
    Object.values(selectWorkoutsByCourseSlug(state)).flat().find(workout => workout._id === id);

export const selectCurrentUserLabel = (state: RootState) => {
    const user = selectCurrentUser(state);
    if (!user) return "";
    const source = user.login || user.email;
    const base = source.split("@")[0].split(".")[0];
    if (!base) return "Профиль";
    return base.charAt(0).toUpperCase() + base.slice(1);
};
