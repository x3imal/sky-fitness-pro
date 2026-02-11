import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
    login: string;
    email: string;
    password: string;
    myCourseSlugs: string[];
};

type AuthState = {
    users: AuthUser[];
    currentUserLogin: string | null;
};

const initialState: AuthState = {
    users: [
        {
            login: "sergey.petrov96",
            email: "sergey.petrov96@mail.ru",
            password: "123456",
            myCourseSlugs: ["yoga", "stretching", "fitness"],
        },
    ],
    currentUserLogin: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        registerUser: (state, action: PayloadAction<AuthUser>) => {
            state.users.push(action.payload);
            state.currentUserLogin = action.payload.login;
        },
        loginUser: (state, action: PayloadAction<{ login: string }>) => {
            state.currentUserLogin = action.payload.login;
        },
        logoutUser: state => {
            state.currentUserLogin = null;
        },
        addCourseToCurrentUser: (state, action: PayloadAction<{ slug: string }>) => {
            if (!state.currentUserLogin) return;
            const user = state.users.find(u => u.login === state.currentUserLogin);
            if (!user) return;
            // Backward compatibility for persisted users created before myCourseSlugs existed.
            const myCourseSlugs = user.myCourseSlugs ?? (user.myCourseSlugs = []);
            if (!myCourseSlugs.includes(action.payload.slug)) {
                myCourseSlugs.push(action.payload.slug);
            }
        },
        removeCourseFromCurrentUser: (state, action: PayloadAction<{ slug: string }>) => {
            if (!state.currentUserLogin) return;
            const user = state.users.find(u => u.login === state.currentUserLogin);
            if (!user) return;
            const myCourseSlugs = user.myCourseSlugs ?? (user.myCourseSlugs = []);
            user.myCourseSlugs = myCourseSlugs.filter(slug => slug !== action.payload.slug);
        },
    },
});

export const {
    registerUser,
    loginUser,
    logoutUser,
    addCourseToCurrentUser,
    removeCourseFromCurrentUser,
} = authSlice.actions;
export default authSlice.reducer;
