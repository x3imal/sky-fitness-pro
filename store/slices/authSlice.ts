import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginRequest, meRequest, registerRequest } from "@/shared/services/authService";
import { addUserCourse, removeUserCourse } from "@/shared/services/courseService";
import { RootState } from "@/store/store";

export type AuthUser = {
    email: string;
    selectedCourses: string[];
};

type AuthState = {
    token: string | null;
    currentUser: AuthUser | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
};

const initialState: AuthState = {
    token: null,
    currentUser: null,
    status: "idle",
    error: null,
};

type Credentials = {
    email: string;
    password: string;
};

export const loginUser = createAsyncThunk<
    { token: string; user: AuthUser },
    Credentials,
    { rejectValue: string }
>("auth/loginUser", async ({ email, password }, thunkApi) => {
    try {
        const { token } = await loginRequest({ email, password });
        const me = await meRequest(token);
        const resolvedEmail = (me.email ?? email).trim();
        return {
            token,
            user: {
                email: resolvedEmail,
                selectedCourses: me.selectedCourses ?? [],
            },
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Ошибка входа";
        return thunkApi.rejectWithValue(message);
    }
});

export const registerUser = createAsyncThunk<
    { token: string; user: AuthUser },
    Credentials,
    { rejectValue: string }
>("auth/registerUser", async ({ email, password }, thunkApi) => {
    try {
        await registerRequest({ email, password });
        const { token } = await loginRequest({ email, password });
        const me = await meRequest(token);
        const resolvedEmail = (me.email ?? email).trim();
        return {
            token,
            user: {
                email: resolvedEmail,
                selectedCourses: me.selectedCourses ?? [],
            },
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Ошибка регистрации";
        return thunkApi.rejectWithValue(message);
    }
});

export const fetchCurrentUser = createAsyncThunk<
    AuthUser,
    void,
    { state: { auth: AuthState }; rejectValue: string }
>("auth/fetchCurrentUser", async (_, thunkApi) => {
    const token = thunkApi.getState().auth.token;
    if (!token) {
        return thunkApi.rejectWithValue("Токен не найден");
    }

    try {
        const me = await meRequest(token);
        const resolvedEmail = (me.email ?? "").trim();
        return {
            email: resolvedEmail,
            selectedCourses: me.selectedCourses ?? [],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Не удалось получить профиль";
        return thunkApi.rejectWithValue(message);
    }
});

export const addCourseForUser = createAsyncThunk<
    { courseId: string },
    { slug: string },
    { state: RootState; rejectValue: string }
>("auth/addCourseForUser", async ({ slug }, thunkApi) => {
    const state = thunkApi.getState();
    const token = state.auth.token;
    if (!token) {
        return thunkApi.rejectWithValue("Токен не найден");
    }
    const course = state.catalog.courses.find(item => item.slug === slug);
    if (!course) {
        return thunkApi.rejectWithValue("Курс не найден");
    }

    try {
        await addUserCourse(token, course._id);
        return { courseId: course._id };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Не удалось добавить курс";
        if (message.toLowerCase().includes("уже")) {
            return { courseId: course._id };
        }
        return thunkApi.rejectWithValue(message);
    }
});

export const removeCourseForUser = createAsyncThunk<
    { courseId: string; slug: string },
    { slug: string },
    { state: RootState; rejectValue: string }
>("auth/removeCourseForUser", async ({ slug }, thunkApi) => {
    const state = thunkApi.getState();
    const token = state.auth.token;
    if (!token) {
        return thunkApi.rejectWithValue("Токен не найден");
    }
    const course = state.catalog.courses.find(item => item.slug === slug);
    if (!course) {
        return thunkApi.rejectWithValue("Курс не найден");
    }

    try {
        await removeUserCourse(token, course._id);
        return { courseId: course._id, slug };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Не удалось удалить курс";
        return thunkApi.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutUser: state => {
            state.token = null;
            state.currentUser = null;
            state.status = "idle";
            state.error = null;
        },
        addCourseToCurrentUser: (state, action: PayloadAction<{ slug: string }>) => {
            const currentUser = state.currentUser;
            if (!currentUser) return;
            const selected = currentUser.selectedCourses ?? (currentUser.selectedCourses = []);
            if (!selected.includes(action.payload.slug)) {
                selected.push(action.payload.slug);
            }
        },
        removeCourseFromCurrentUser: (state, action: PayloadAction<{ slug: string }>) => {
            const currentUser = state.currentUser;
            if (!currentUser) return;
            const selected = currentUser.selectedCourses ?? (currentUser.selectedCourses = []);
            currentUser.selectedCourses = selected.filter(slug => slug !== action.payload.slug);
        },
        clearAuthError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, state => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? action.error.message ?? "Ошибка входа";
            })
            .addCase(registerUser.pending, state => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? action.error.message ?? "Ошибка регистрации";
            })
            .addCase(fetchCurrentUser.pending, state => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
                state.currentUser = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? action.error.message ?? "Не удалось получить профиль";
            })
            .addCase(addCourseForUser.fulfilled, (state, action) => {
                const currentUser = state.currentUser;
                if (!currentUser) return;
                const selected = currentUser.selectedCourses ?? (currentUser.selectedCourses = []);
                if (!selected.includes(action.payload.courseId)) {
                    selected.push(action.payload.courseId);
                }
            })
            .addCase(removeCourseForUser.fulfilled, (state, action) => {
                const currentUser = state.currentUser;
                if (!currentUser) return;
                const selected = currentUser.selectedCourses ?? (currentUser.selectedCourses = []);
                currentUser.selectedCourses = selected.filter(
                    value => value !== action.payload.courseId && value !== action.payload.slug
                );
            });
    },
});

export const {
    logoutUser,
    addCourseToCurrentUser,
    removeCourseFromCurrentUser,
    clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
