import { combineReducers, configureStore } from "@reduxjs/toolkit";
import progressReducer from "./slices/progressSlice";
import authReducer from "./slices/authSlice";
import catalogReducer from "./slices/catalogSlice";
import {
    createMigrate,
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
    getItem() {
        return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
        return Promise.resolve(value);
    },
    removeItem() {
        return Promise.resolve();
    },
});

const storage = typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootReducer = combineReducers({
    progress: progressReducer,
    auth: authReducer,
    catalog: catalogReducer,
});

type LegacyAuthUser = {
    login?: string;
    email?: string;
    myCourseSlugs?: string[];
};

type LegacyAuthState = {
    currentUserLogin?: string | null;
    users?: LegacyAuthUser[];
};

type PersistedRootState = {
    auth?: LegacyAuthState | {
        token?: string | null;
        currentUser?: {
            email?: string;
            selectedCourses?: string[];
            courseProgress?: {
                courseId: string;
                courseCompleted: boolean;
                workoutsProgress: {
                    workoutId: string;
                    workoutCompleted: boolean;
                    progressData: number[];
                }[];
            }[];
        } | null;
    };
};

const migrations: Record<string, (state: PersistedRootState | undefined) => PersistedRootState | undefined> = {
    "2": (state) => {
        if (!state?.auth) return state;
        const auth = state.auth;

        if ("currentUser" in auth || "token" in auth) {
            return state;
        }

        const legacyAuth = auth as LegacyAuthState;
        const currentLogin = legacyAuth.currentUserLogin;
        const users = Array.isArray(legacyAuth.users) ? legacyAuth.users : [];
        const matchedUser = users.find((user: LegacyAuthUser) => user.login === currentLogin) ?? null;

        return {
            ...state,
            auth: {
                token: null,
                currentUser: matchedUser
                    ? {
                        email: matchedUser.email ?? "",
                        selectedCourses: matchedUser.myCourseSlugs ?? [],
                        courseProgress: [],
                    }
                    : null,
                status: "idle",
                error: null,
            },
        };
    },
};

const persistConfig = {
    key: "root",
    version: 2,
    storage,
    whitelist: ["progress", "auth"],
    migrate: createMigrate(migrations as never, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
