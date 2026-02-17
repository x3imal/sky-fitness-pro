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
    return state.auth.currentUser;
};

export const selectIsAuthenticated = (state: RootState) =>
    Boolean(state.auth.token && state.auth.currentUser);
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthToken = (state: RootState) => state.auth.token;

export const selectMySelectedCourses = (state: RootState) =>
    selectCurrentUser(state)?.selectedCourses ?? [];

export const selectMyCourseSlugs = (state: RootState) => {
    const selected = selectMySelectedCourses(state);
    const courses = selectCourses(state);
    return selected.map((value) => {
        const bySlug = courses.find(course => course.slug === value);
        if (bySlug) return bySlug.slug;
        const byId = courses.find(course => course._id === value);
        if (byId) return byId.slug;
        return value;
    });
};

export const selectHasCourse = (state: RootState, slug: string) => {
    const selected = selectMySelectedCourses(state);
    const course = selectCourseBySlug(state, slug);
    if (!course) {
        return selected.includes(slug);
    }
    return selected.includes(course._id) || selected.includes(course.slug);
};

export const selectMyCourses = (state: RootState) => {
    const selected = selectMySelectedCourses(state);
    return selectCourses(state).filter(
        course => selected.includes(course._id) || selected.includes(course.slug)
    );
};

export const selectCourseBySlug = (state: RootState, slug: string) =>
    selectCourses(state).find(course => course.slug === slug);

export const selectWorkoutsForCourse = (state: RootState, slug: string) =>
    selectWorkoutsByCourseSlug(state)[slug] ?? [];

export const selectWorkoutById = (state: RootState, id: string) =>
    Object.values(selectWorkoutsByCourseSlug(state)).flat().find(workout => workout._id === id);

export const selectCourseIdBySlug = (state: RootState, slug: string) => {
    const course = selectCourseBySlug(state, slug);
    return course?._id ?? null;
};

export const selectCourseIdByWorkoutId = (state: RootState, workoutId: string) => {
    const course = selectCourses(state).find(item => item.workouts?.includes(workoutId));
    return course?._id ?? null;
};

export const selectCurrentUserLabel = (state: RootState) => {
    const user = selectCurrentUser(state);
    if (!user) return "";
    const email = user.email ?? "";
    const base = email.split("@")[0]?.split(".")[0] ?? "";
    if (!base) return "Профиль";
    return base.charAt(0).toUpperCase() + base.slice(1);
};
