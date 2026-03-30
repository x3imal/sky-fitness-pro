import { beforeEach, describe, expect, it, vi } from "vitest";
import reducer, {
    fetchWorkoutProgress,
    saveWorkoutProgressApi,
    setWorkoutProgress,
} from "@/store/slices/progressSlice";
import * as workoutService from "@/shared/services/workoutService";

vi.mock("@/shared/services/workoutService", () => ({
    getWorkoutProgress: vi.fn(),
    saveWorkoutProgress: vi.fn(),
}));

const mockedGetWorkoutProgress = vi.mocked(workoutService.getWorkoutProgress);
const mockedSaveWorkoutProgress = vi.mocked(workoutService.saveWorkoutProgress);

const exercises = [
    { _id: "ex-1", name: "Push Ups", quantity: 10 },
    { _id: "ex-2", name: "Squats", quantity: 20 },
];

describe("progressSlice", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("sets workout progress synchronously", () => {
        const state = reducer(
            undefined,
            setWorkoutProgress({ workoutId: "workout-1", values: { "ex-1": 50 } })
        );

        expect(state.exerciseProgressByWorkout["workout-1"]).toEqual({ "ex-1": 50 });
    });

    it("maps backend counts to clamped percents on fetchWorkoutProgress", async () => {
        mockedGetWorkoutProgress.mockResolvedValue({
            workoutId: "workout-1",
            workoutCompleted: false,
            progressData: [12, 5],
        });

        const action = await fetchWorkoutProgress({
            courseId: "course-1",
            workoutId: "workout-1",
            exercises,
        })(
            vi.fn(),
            () => ({ auth: { token: "token-1" } }),
            undefined
        );

        const state = reducer(undefined, action);

        expect(action.meta.requestStatus).toBe("fulfilled");
        expect(state.exerciseProgressByWorkout["workout-1"]).toEqual({
            "ex-1": 100,
            "ex-2": 25,
        });
    });

    it("returns rejected action when token is missing for fetchWorkoutProgress", async () => {
        const action = await fetchWorkoutProgress({
            courseId: "course-1",
            workoutId: "workout-1",
            exercises,
        })(
            vi.fn(),
            () => ({ auth: { token: null } }),
            undefined
        );

        expect(action.meta.requestStatus).toBe("rejected");
        expect(action.payload).toBeTruthy();
    });

    it("converts percent values back to absolute counts on saveWorkoutProgressApi", async () => {
        mockedSaveWorkoutProgress.mockResolvedValue({ message: "ok" });

        const action = await saveWorkoutProgressApi({
            courseId: "course-1",
            workoutId: "workout-1",
            values: { "ex-1": 50, "ex-2": 25 },
            exercises,
        })(
            vi.fn(),
            () => ({ auth: { token: "token-1" } }),
            undefined
        );

        expect(action.meta.requestStatus).toBe("fulfilled");
        expect(mockedSaveWorkoutProgress).toHaveBeenCalledWith(
            "token-1",
            "course-1",
            "workout-1",
            [5, 5]
        );
    });

    it("returns rejected action when saveWorkoutProgressApi fails", async () => {
        mockedSaveWorkoutProgress.mockRejectedValue(new Error("save failed"));

        const action = await saveWorkoutProgressApi({
            courseId: "course-1",
            workoutId: "workout-1",
            values: { "ex-1": 50, "ex-2": 25 },
            exercises,
        })(
            vi.fn(),
            () => ({ auth: { token: "token-1" } }),
            undefined
        );

        expect(action.meta.requestStatus).toBe("rejected");
        expect(action.payload).toBe("save failed");
    });
});
