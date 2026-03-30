import { describe, expect, it, vi, beforeEach } from "vitest";
import reducer, {
    addCourseForUser,
    fetchCurrentUser,
    loginUser,
    logoutUser,
    removeCourseForUser,
} from "@/store/slices/authSlice";
import * as authService from "@/shared/services/authService";
import * as courseService from "@/shared/services/courseService";

vi.mock("@/shared/services/authService", () => ({
    loginRequest: vi.fn(),
    meRequest: vi.fn(),
    registerRequest: vi.fn(),
}));

vi.mock("@/shared/services/courseService", () => ({
    addUserCourse: vi.fn(),
    removeUserCourse: vi.fn(),
}));

const mockedLoginRequest = vi.mocked(authService.loginRequest);
const mockedMeRequest = vi.mocked(authService.meRequest);
const mockedAddUserCourse = vi.mocked(courseService.addUserCourse);
const mockedRemoveUserCourse = vi.mocked(courseService.removeUserCourse);

describe("authSlice", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("stores user and token after successful login", async () => {
        mockedLoginRequest.mockResolvedValue({ token: "token-1" });
        mockedMeRequest.mockResolvedValue({
            email: " user@example.com ",
            selectedCourses: ["course-1"],
            courseProgress: [],
        });

        const dispatch = vi.fn();
        const getState = vi.fn();

        const action = await loginUser({ email: "user@example.com", password: "secret" })(
            dispatch,
            getState,
            undefined
        );
        const state = reducer(undefined, action);

        expect(action.meta.requestStatus).toBe("fulfilled");
        expect(state.token).toBe("token-1");
        expect(state.currentUser?.email).toBe("user@example.com");
        expect(state.currentUser?.selectedCourses).toEqual(["course-1"]);
    });

    it("returns rejected action when current user is requested without token", async () => {
        const action = await fetchCurrentUser()(
            vi.fn(),
            () => ({ auth: { token: null } }),
            undefined
        );

        expect(action.meta.requestStatus).toBe("rejected");
        expect(action.payload).toBeTruthy();
    });

    it("adds course id to selected courses after successful addCourseForUser", async () => {
        mockedAddUserCourse.mockResolvedValue({ message: "ok" });

        const action = await addCourseForUser({ slug: "yoga" })(
            vi.fn(),
            () => ({
                auth: {
                    token: "token-1",
                    currentUser: {
                        email: "user@example.com",
                        selectedCourses: [],
                        courseProgress: [],
                    },
                },
                catalog: {
                    courses: [{ _id: "course-1", slug: "yoga" }],
                },
            }),
            undefined
        );

        const prevState = {
            token: "token-1",
            currentUser: {
                email: "user@example.com",
                selectedCourses: [],
                courseProgress: [],
            },
            status: "idle" as const,
            error: null,
        };
        const state = reducer(prevState, action);

        expect(action.meta.requestStatus).toBe("fulfilled");
        expect(state.currentUser?.selectedCourses).toEqual(["course-1"]);
    });

    it("removes course id and slug from selected courses after successful removeCourseForUser", async () => {
        mockedRemoveUserCourse.mockResolvedValue({ message: "ok" });

        const action = await removeCourseForUser({ slug: "yoga" })(
            vi.fn(),
            () => ({
                auth: {
                    token: "token-1",
                    currentUser: {
                        email: "user@example.com",
                        selectedCourses: ["course-1", "yoga", "course-2"],
                        courseProgress: [],
                    },
                },
                catalog: {
                    courses: [{ _id: "course-1", slug: "yoga" }],
                },
            }),
            undefined
        );

        const prevState = {
            token: "token-1",
            currentUser: {
                email: "user@example.com",
                selectedCourses: ["course-1", "yoga", "course-2"],
                courseProgress: [],
            },
            status: "idle" as const,
            error: null,
        };
        const state = reducer(prevState, action);

        expect(action.meta.requestStatus).toBe("fulfilled");
        expect(state.currentUser?.selectedCourses).toEqual(["course-2"]);
    });

    it("clears auth state on logout", () => {
        const prevState = {
            token: "token-1",
            currentUser: {
                email: "user@example.com",
                selectedCourses: ["course-1"],
                courseProgress: [],
            },
            status: "succeeded" as const,
            error: "error",
        };

        const state = reducer(prevState, logoutUser());

        expect(state).toEqual({
            token: null,
            currentUser: null,
            status: "idle",
            error: null,
        });
    });
});
