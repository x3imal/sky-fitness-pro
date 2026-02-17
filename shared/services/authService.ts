import { apiRequest, buildApiUrl } from "@/shared/services/apiClient";

type RegisterPayload = {
    email: string;
    password: string;
};

type LoginPayload = {
    email: string;
    password: string;
};

export type MeResponse = {
    email: string;
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
};

type RawMeResponse =
    | MeResponse
    | {
        user?: {
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
        };
    };

export async function registerRequest(payload: RegisterPayload): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(buildApiUrl("/api/fitness/auth/register"), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function loginRequest(payload: LoginPayload): Promise<{ token: string }> {
    return apiRequest<{ token: string }>(buildApiUrl("/api/fitness/auth/login"), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function meRequest(token: string): Promise<MeResponse> {
    const payload = await apiRequest<RawMeResponse>(buildApiUrl("/api/fitness/users/me"), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if ("email" in payload) {
        return {
            email: payload.email ?? "",
            selectedCourses: payload.selectedCourses ?? [],
            courseProgress: payload.courseProgress ?? [],
        };
    }

    return {
        email: payload.user?.email ?? "",
        selectedCourses: payload.user?.selectedCourses ?? [],
        courseProgress: payload.user?.courseProgress ?? [],
    };
}
