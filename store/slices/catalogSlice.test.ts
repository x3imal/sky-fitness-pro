import { describe, expect, it } from "vitest";
import reducer, { fetchCatalog } from "@/store/slices/catalogSlice";

describe("catalogSlice", () => {
    it("sets loading state on pending", () => {
        const state = reducer(undefined, fetchCatalog.pending("request-id", undefined));

        expect(state.status).toBe("loading");
        expect(state.error).toBeNull();
    });

    it("stores payload error from rejectWithValue", () => {
        const state = reducer(
            undefined,
            fetchCatalog.rejected(new Error("boom"), "request-id", undefined, "Не удалось загрузить каталог")
        );

        expect(state.status).toBe("failed");
        expect(state.error).toBe("Не удалось загрузить каталог");
    });

    it("deduplicates courses on fulfilled", () => {
        const state = reducer(
            undefined,
            fetchCatalog.fulfilled(
                {
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
                            workouts: [],
                            imageSrc: "",
                            ctaImageSrc: undefined,
                        },
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
                            workouts: [],
                            imageSrc: "",
                            ctaImageSrc: undefined,
                        },
                    ],
                    workoutsByCourseSlug: {},
                    source: "api",
                },
                "request-id",
                undefined
            )
        );

        expect(state.status).toBe("succeeded");
        expect(state.courses).toHaveLength(1);
        expect(state.source).toBe("api");
    });
});
