import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { COURSES } from "@/shared/data/courses";
import { workoutsByCourseSlug } from "@/shared/data/workouts";
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
    courses: COURSES,
    workoutsByCourseSlug,
    status: "idle",
    error: null,
    source: "mock",
};

export const fetchCatalog = createAsyncThunk<CatalogPayload>(
    "catalog/fetchCatalog",
    async () => loadCatalog()
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
                state.courses = action.payload.courses;
                state.workoutsByCourseSlug = action.payload.workoutsByCourseSlug;
                state.source = action.payload.source;
            })
            .addCase(fetchCatalog.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message ?? "Не удалось загрузить каталог";
            });
    },
});

export default catalogSlice.reducer;
