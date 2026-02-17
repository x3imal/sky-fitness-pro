import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { getWorkoutProgress, saveWorkoutProgress as saveWorkoutProgressRequest } from "@/shared/services/workoutService";
import { Exercise } from "@/shared/types/workout";

type ExerciseProgressByWorkout = Record<string, Record<string, number>>;

type ProgressState = {
    exerciseProgressByWorkout: ExerciseProgressByWorkout;
};

const clampProgress = (value: number) => Math.max(0, Math.min(100, value));

const initialState: ProgressState = {
    exerciseProgressByWorkout: {},
};

const progressSlice = createSlice({
    name: "progress",
    initialState,
    reducers: {
        setWorkoutProgress: (
            state,
            action: PayloadAction<{ workoutId: string; values: Record<string, number> }>
        ) => {
            state.exerciseProgressByWorkout[action.payload.workoutId] = action.payload.values;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchWorkoutProgress.fulfilled, (state, action) => {
                state.exerciseProgressByWorkout[action.payload.workoutId] = action.payload.values;
            })
            .addCase(saveWorkoutProgressApi.fulfilled, (state, action) => {
                state.exerciseProgressByWorkout[action.payload.workoutId] = action.payload.values;
            });
    },
});

export const { setWorkoutProgress } = progressSlice.actions;
export default progressSlice.reducer;

/**
 * Загружает прогресс тренировки из API и конвертирует значения в проценты
 * относительно `quantity` упражнений для отображения в UI-баре.
 */
export const fetchWorkoutProgress = createAsyncThunk<
    { workoutId: string; values: Record<string, number> },
    { courseId: string; workoutId: string; exercises: Exercise[] },
    { state: RootState; rejectValue: string }
>("progress/fetchWorkoutProgress", async ({ courseId, workoutId, exercises }, thunkApi) => {
    const token = thunkApi.getState().auth.token;
    if (!token) {
        return thunkApi.rejectWithValue("Токен не найден");
    }
    try {
        const data = await getWorkoutProgress(token, courseId, workoutId);
        const values = exercises.reduce<Record<string, number>>((acc, exercise, idx) => {
            const count = data.progressData?.[idx] ?? 0;
            const quantity = (exercise as Exercise & { quantity?: number }).quantity ?? 0;
            const percent = quantity > 0 ? Math.round((count / quantity) * 100) : 0;
            acc[exercise._id] = clampProgress(percent);
            return acc;
        }, {});
        return { workoutId, values };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Не удалось получить прогресс";
        return thunkApi.rejectWithValue(message);
    }
});

/**
 * Сохраняет прогресс тренировки в API.
 * В UI используются проценты, перед отправкой они конвертируются
 * в абсолютные значения повторений для backend `progressData`.
 */
export const saveWorkoutProgressApi = createAsyncThunk<
    { workoutId: string; values: Record<string, number> },
    { courseId: string; workoutId: string; values: Record<string, number>; exercises: Exercise[] },
    { state: RootState; rejectValue: string }
>("progress/saveWorkoutProgressApi", async ({ courseId, workoutId, values, exercises }, thunkApi) => {
    const token = thunkApi.getState().auth.token;
    if (!token) {
        return thunkApi.rejectWithValue("Токен не найден");
    }
    const progressData = exercises.map(ex => {
        const percent = values[ex._id] ?? 0;
        const quantity = (ex as Exercise & { quantity?: number }).quantity ?? 0;
        if (!quantity) return 0;
        return Math.max(0, Math.round((percent / 100) * quantity));
    });

    try {
        await saveWorkoutProgressRequest(token, courseId, workoutId, progressData);
        return { workoutId, values };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Не удалось сохранить прогресс";
        return thunkApi.rejectWithValue(message);
    }
});
