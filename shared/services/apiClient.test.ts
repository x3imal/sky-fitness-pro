import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest, buildApiUrl } from "@/shared/services/apiClient";

describe("apiClient", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("builds api urls from the default base", () => {
        expect(buildApiUrl("/api/test")).toBe("https://wedev-api.sky.pro/api/test");
    });

    it("returns parsed json for successful responses", async () => {
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        );

        await expect(apiRequest<{ ok: boolean }>("/api/test", { method: "GET" })).resolves.toEqual({ ok: true });
    });

    it("returns empty object for 204 responses", async () => {
        vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));

        await expect(apiRequest<Record<string, never>>("/api/test", { method: "DELETE" })).resolves.toEqual({});
    });

    it("throws backend message for unsuccessful responses", async () => {
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify({ message: "Bad request" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        );

        await expect(apiRequest("/api/test", { method: "GET" })).rejects.toThrow("Bad request");
    });

    it("throws generic unavailable message for network failures", async () => {
        vi.mocked(fetch).mockRejectedValue(new Error("network down"));

        await expect(apiRequest("/api/test", { method: "GET" })).rejects.toThrow(
            "Сервер недоступен, попробуйте позже"
        );
    });
});
