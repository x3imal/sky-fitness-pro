import { describe, expect, it } from "vitest";
import {
    selectCourseProgress,
    selectCurrentUserLabel,
    selectHasCourse,
    selectWorkoutProgress,
} from "@/store/selectors";

const createState = () => ({
    catalog: {
        courses: [
            {
                _id: "course-1",
                slug: "yoga",
                nameRU: "Йога",
                nameEN: "Yoga",
                description: "",
                directions: [],
                fitting: [],
                difficulty: "средний",
                durationInDays: 10,
                dailyDurationInMinutes: { from: 10, to: 20 },
                workouts: ["workout-1", "workout-2"],
                imageSrc: "",
                ctaImageSrc: undefined,
            },
        ],
        workoutsByCourseSlug: {},
        status: "succeeded",
        error: null,
        source: "api",
    },
    auth: {
        token: "token",
        currentUser: {
            email: "anna.ivanova@example.com",
            selectedCourses: ["course-1"],
            courseProgress: [
                {
                    courseId: "course-1",
                    courseCompleted: false,
                    workoutsProgress: [
                        { workoutId: "workout-1", workoutCompleted: true, progressData: [1, 1] },
                        { workoutId: "workout-2", workoutCompleted: false, progressData: [1, 0] },
                    ],
                },
            ],
        },
        status: "succeeded",
        error: null,
    },
    progress: {
        exerciseProgressByWorkout: {
            "workout-2": {
                ex1: 100,
                ex2: 50,
            },
        },
    },
}) as const;

describe("selectors", () => {
    it("calculates average workout progress from local exercise values", () => {
        const state = createState();
        expect(selectWorkoutProgress(state as never, "workout-2")).toBe(75);
    });

    it("prefers local progress over persisted api progress for course progress", () => {
        const state = createState();
        expect(selectCourseProgress(state as never, "yoga")).toBe(88);
    });

    it("detects selected course by backend id", () => {
        const state = createState();
        expect(selectHasCourse(state as never, "yoga")).toBe(true);
    });

    it("builds a short user label from email", () => {
        const state = createState();
        expect(selectCurrentUserLabel(state as never)).toBe("Anna");
    });
});
