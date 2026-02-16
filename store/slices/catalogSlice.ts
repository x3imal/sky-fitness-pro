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
                state.courses = action.payload.courses.reduce<Course[]>((acc, course) => {
                    if (!acc.some(item => item.slug === course.slug)) {
                        acc.push(course);
                    }
                    return acc;
                }, []);
                state.workoutsByCourseSlug = action.payload.workoutsByCourseSlug;
                state.source = "api";
            })
            .addCase(fetchCatalog.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message ?? "Не удалось загрузить каталог";
            });
    },
});

export default catalogSlice.reducer;
