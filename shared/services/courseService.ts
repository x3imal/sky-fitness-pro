import { Workout } from "@/shared/types/workout";
import { apiRequest, buildApiUrl } from "@/shared/services/apiClient";

type CourseListItem = {
    _id: string;
    nameRU: string;
    nameEN: string;
    description: string;
    directions: string[];
    fitting: string[];
    workouts: string[];
    difficulty?: string;
    durationInDays?: number;
    dailyDurationInMinutes?: {
        from: number;
        to: number;
    };
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

export async function fetchCourses(): Promise<CourseListItem[]> {
    return apiRequest<CourseListItem[]>(buildApiUrl("/api/fitness/courses"), { method: "GET" });
}

export async function fetchCourse(courseId: string): Promise<CourseDetail> {
    return apiRequest<CourseDetail>(buildApiUrl(`/api/fitness/courses/${courseId}`), { method: "GET" });
}

export async function fetchCourseWorkouts(courseId: string, token?: string): Promise<Workout[]> {
    return apiRequest<Workout[]>(buildApiUrl(`/api/fitness/courses/${courseId}/workouts`), {
        method: "GET",
        headers: token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : undefined,
    });
}

export async function addUserCourse(token: string, courseId: string): Promise<ApiMessage> {
    return apiRequest<ApiMessage>(buildApiUrl("/api/fitness/users/me/courses"), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
    });
}

export async function removeUserCourse(token: string, courseId: string): Promise<ApiMessage> {
    return apiRequest<ApiMessage>(buildApiUrl(`/api/fitness/users/me/courses/${courseId}`), {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function resetCourseProgress(token: string, courseId: string): Promise<ApiMessage> {
    return apiRequest<ApiMessage>(buildApiUrl(`/api/fitness/courses/${courseId}/reset`), {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
