import { describe, expect, it } from "vitest";
import { resolveCourseSlug } from "@/shared/util/resolveCourseSlug";

describe("resolveCourseSlug", () => {
    it("maps known english aliases", () => {
        expect(resolveCourseSlug("Anything", "Yoga Flow")).toBe("yoga");
        expect(resolveCourseSlug("Anything", "Stretch Class")).toBe("stretching");
        expect(resolveCourseSlug("Anything", "Bodyflex Pro")).toBe("bodyflex");
    });

    it("falls back to slugified english name", () => {
        expect(resolveCourseSlug("Русское имя", "Super Course 101")).toBe("super-course-101");
    });

    it("uses fallback id when names cannot be slugified", () => {
        expect(resolveCourseSlug("", "", "course-id")).toBe("course-id");
    });

    it("uses generic fallback when nothing else is available", () => {
        expect(resolveCourseSlug("", "")).toBe("course");
    });
});
