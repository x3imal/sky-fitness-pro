import { RootState } from "./store";

const average = (values: number[]) =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const selectCourses = (state: RootState) => state.catalog.courses;
export const selectWorkoutsByCourseSlug = (state: RootState) => state.catalog.workoutsByCourseSlug;
export const selectCatalogStatus = (state: RootState) => state.catalog.status;
export const selectCatalogError = (state: RootState) => state.catalog.error;

export const selectWorkoutExerciseProgress = (state: RootState, workoutId: string) =>
    state.progress.exerciseProgressByWorkout[workoutId] ?? {};

export const selectWorkoutProgress = (state: RootState, workoutId: string) => {
    const map = selectWorkoutExerciseProgress(state, workoutId);
    return Math.round(average(Object.values(map)));
};

/**
 * Возвращает прогресс курса в процентах.
 * Приоритет источников:
 * 1) локальный прогресс тренировки (только что изменен в UI),
 * 2) прогресс из API (`users/me.courseProgress`),
 * 3) `0` для тренировок без прогресса.
 *
 * Это позволяет сразу обновлять карточки после сохранения
 * и сохранять корректность после перезагрузки страницы.
 */
export const selectCourseProgress = (state: RootState, slug: string) => {
    const course = selectCourseBySlug(state, slug);
    const courseId = course?._id ?? slug;
    const userCourseProgress = selectCurrentUser(state)?.courseProgress ?? [];
    const apiCourseProgress = userCourseProgress.find(
        item => item.courseId === courseId || item.courseId === slug
    );

    const workouts = selectWorkoutsByCourseSlug(state)[slug] ?? [];
    const workoutIds = (course?.workouts?.length ? course.workouts : workouts.map(workout => workout._id));

    const apiProgressByWorkoutId = new Map<string, number>();
    if (apiCourseProgress) {
        apiCourseProgress.workoutsProgress.forEach(item => {
            if (item.workoutCompleted) {
                apiProgressByWorkoutId.set(item.workoutId, 100);
                return;
            }
            const values = item.progressData ?? [];
            if (!values.length) {
                apiProgressByWorkoutId.set(item.workoutId, 0);
                return;
            }
            const doneCount = values.filter(value => value > 0).length;
            apiProgressByWorkoutId.set(item.workoutId, Math.round((doneCount / values.length) * 100));
        });
    }

    const normalizedWorkoutIds = workoutIds.length
        ? workoutIds
        : Array.from(apiProgressByWorkoutId.keys());

    const values = normalizedWorkoutIds.map(workoutId => {
        const localProgress = selectWorkoutProgress(state, workoutId);
        if (localProgress > 0) return localProgress;
        return apiProgressByWorkoutId.get(workoutId) ?? 0;
    });
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
export const selectAuthToken = (state: RootState) => state.auth.token;

export const selectMySelectedCourses = (state: RootState) =>
    selectCurrentUser(state)?.selectedCourses ?? [];

/**
 * Проверяет, есть ли курс в списке пользователя.
 * Поддерживает и legacy-хранение по slug, и текущее хранение по backend `_id`.
 */
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

export const selectCourseIdByWorkoutId = (state: RootState, workoutId: string) => {
    const course = selectCourses(state).find(item => item.workouts?.includes(workoutId));
    return course?._id ?? null;
};

/**
 * Формирует короткий лейбл для хедера из email
 * (часть до `@` и до первой точки).
 */
export const selectCurrentUserLabel = (state: RootState) => {
    const user = selectCurrentUser(state);
    if (!user) return "";
    const email = user.email ?? "";
    const base = email.split("@")[0]?.split(".")[0] ?? "";
    if (!base) return "Профиль";
    return base.charAt(0).toUpperCase() + base.slice(1);
};
