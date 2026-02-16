import { Workout } from "@/shared/types/workout";

type CourseListItem = {
    _id: string;
    nameRU: string;
    nameEN: string;
    description: string;
    directions: string[];
    fitting: string[];
    workouts: string[];
};

type CourseDetail = CourseListItem & {
    difficulty: string;
    durationInDays: number;
    dailyDurationInMinutes: {
        from: number;
        to: number;
    };
};

type ApiMessage = {
    message: string;
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

export async function fetchCourses(): Promise<CourseListItem[]> {
    return request<CourseListItem[]>(buildUrl("/api/fitness/courses"), { method: "GET" });
}

export async function fetchCourse(courseId: string): Promise<CourseDetail> {
    return request<CourseDetail>(buildUrl(`/api/fitness/courses/${courseId}`), { method: "GET" });
}

export async function fetchCourseWorkouts(courseId: string): Promise<Workout[]> {
    return request<Workout[]>(buildUrl(`/api/fitness/courses/${courseId}/workouts`), { method: "GET" });
}

export async function addUserCourse(token: string, courseId: string): Promise<ApiMessage> {
    return request<ApiMessage>(buildUrl("/api/fitness/users/me/courses"), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
    });
}

export async function removeUserCourse(token: string, courseId: string): Promise<ApiMessage> {
    return request<ApiMessage>(buildUrl(`/api/fitness/users/me/courses/${courseId}`), {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function resetCourseProgress(token: string, courseId: string): Promise<ApiMessage> {
    return request<ApiMessage>(buildUrl(`/api/fitness/courses/${courseId}/reset`), {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
