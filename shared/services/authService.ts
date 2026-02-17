type ApiErrorPayload = {
    message?: string;
};

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
};

type RawMeResponse =
    | MeResponse
    | {
        user?: {
            email?: string;
            selectedCourses?: string[];
        };
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
        const payload = (await response.json()) as ApiErrorPayload;
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

export async function registerRequest(payload: RegisterPayload): Promise<{ message: string }> {
    return request<{ message: string }>(buildUrl("/api/fitness/auth/register"), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function loginRequest(payload: LoginPayload): Promise<{ token: string }> {
    return request<{ token: string }>(buildUrl("/api/fitness/auth/login"), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function meRequest(token: string): Promise<MeResponse> {
    const payload = await request<RawMeResponse>(buildUrl("/api/fitness/users/me"), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if ("email" in payload) {
        return {
            email: payload.email ?? "",
            selectedCourses: payload.selectedCourses ?? [],
        };
    }

    return {
        email: payload.user?.email ?? "",
        selectedCourses: payload.user?.selectedCourses ?? [],
    };
}
