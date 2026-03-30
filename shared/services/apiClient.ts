const DEFAULT_API_BASE = "https://wedev-api.sky.pro";

/**
 * Нормализует базовый URL API из env/конфига.
 * Принимает полный URL или хост и всегда возвращает корректный HTTPS URL.
 */
const normalizeBaseUrl = (base: string) => {
    const trimmed = base.trim();
    if (!trimmed) return DEFAULT_API_BASE;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
};

const API_BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE);

/**
 * Собирает абсолютный URL API из относительного пути endpoint.
 */
export const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

const parseApiError = async (response: Response): Promise<string> => {
    try {
        const payload = (await response.json()) as { message?: string };
        if (payload?.message) return payload.message;
    } catch {
        // ignore parse error
    }
    return `Ошибка запроса (${response.status})`;
};

/**
 * Общий HTTP-обертка для запросов с timeout и единообразной обработкой ошибок API.
 * В случае сетевой/API ошибки выбрасывает `Error` с понятным сообщением.
 */
export async function apiRequest<TResponse>(url: string, init: RequestInit): Promise<TResponse> {
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
