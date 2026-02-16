import { Workout } from "@/shared/types/workout";

type WorkoutProgressResponse = {
    workoutId: string;
    workoutCompleted: boolean;
    progressData: number[];
};

type CourseProgressResponse = {
    courseId: string;
    courseCompleted: boolean;
    workoutsProgress: WorkoutProgressResponse[];
};

const DEFAULT_API_BASE = "https://wedev-api.sky.pro";

const normalizeBaseUrl = (base: string) => {
    const trimmed = base.trim();
    if (!trimmed) return DEFAULT_API_BASE;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
};

const API_BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE);

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const parseApiError = async (response: Response): Promise<string> => {
    try {
        const payload = (await response.json()) as { message?: string };
        if (payload?.message) return payload.message;
    } catch {
        // ignore parse error
    }
    return `Ошибка запроса (${response.status})`;
};

async function request<TResponse>(url: string, init: RequestInit): Promise<TResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let response: Response;
    try {
        response = await fetch(url, {
            ...init,
            headers: init.headers ?? {},
            cache: "no-store",
            signal: controller.signal,
        });
    } catch {
        throw new Error("Сервер недоступен, попробуйте позже");
    } finally {
        clearTimeout(timeout);
    }

    if (!response.ok) {
        throw new Error(await parseApiError(response));
    }

    if (response.status === 204) {
        return {} as TResponse;
    }

    return response.json() as Promise<TResponse>;
}

export async function getWorkout(token: string, workoutId: string): Promise<Workout> {
    return request<Workout>(buildUrl(`/api/fitness/workouts/${workoutId}`), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function getCourseProgress(token: string, courseId: string): Promise<CourseProgressResponse> {
    return request<CourseProgressResponse>(
        buildUrl(`/api/fitness/users/me/progress?courseId=${courseId}`),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export async function getWorkoutProgress(
    token: string,
    courseId: string,
    workoutId: string
): Promise<WorkoutProgressResponse> {
    return request<WorkoutProgressResponse>(
        buildUrl(`/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export async function saveWorkoutProgress(
    token: string,
    courseId: string,
    workoutId: string,
    progressData: number[]
): Promise<{ message: string }> {
    return request<{ message: string }>(
        buildUrl(`/api/fitness/courses/${courseId}/workouts/${workoutId}`),
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ progressData }),
        }
    );
}

export async function resetWorkoutProgress(
    token: string,
    courseId: string,
    workoutId: string
): Promise<{ message: string }> {
    return request<{ message: string }>(
        buildUrl(`/api/fitness/courses/${courseId}/workouts/${workoutId}/reset`),
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}
