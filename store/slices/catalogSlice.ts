import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CatalogPayload, WorkoutsByCourseSlug } from "@/shared/types/catalog";
import { Course } from "@/shared/types/course";
import { loadCatalog } from "@/shared/services/catalogService";

type CatalogState = {
    courses: Course[];
    workoutsByCourseSlug: WorkoutsByCourseSlug;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    source: "api" | "mock";
};

const initialState: CatalogState = {
    courses: [],
    workoutsByCourseSlug: {},
    status: "idle",
    error: null,
    source: "api",
};

export const fetchCatalog = createAsyncThunk<
    CatalogPayload,
    void,
    { rejectValue: string }
>(
    "catalog/fetchCatalog",
    async (_, thunkApi) => {
        try {
            return await loadCatalog();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Не удалось загрузить каталог";
            return thunkApi.rejectWithValue(message);
        }
    }
);

const catalogSlice = createSlice({
    name: "catalog",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCatalog.pending, state => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCatalog.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
                state.courses = action.payload.courses.reduce<Course[]>((acc, course) => {
                    if (!acc.some(item => item._id === course._id)) {
                        acc.push(course);
                    }
                    return acc;
                }, []);
                state.workoutsByCourseSlug = action.payload.workoutsByCourseSlug;
                state.source = "api";
            })
            .addCase(fetchCatalog.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? action.error.message ?? "Не удалось загрузить каталог";
            });
    },
});

export default catalogSlice.reducer;
