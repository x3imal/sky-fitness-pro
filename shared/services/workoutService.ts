import { Workout } from "@/shared/types/workout";
import { apiRequest, buildApiUrl } from "@/shared/services/apiClient";

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

export async function getWorkout(token: string, workoutId: string): Promise<Workout> {
    return apiRequest<Workout>(buildApiUrl(`/api/fitness/workouts/${workoutId}`), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function getCourseProgress(token: string, courseId: string): Promise<CourseProgressResponse> {
    return apiRequest<CourseProgressResponse>(
        buildApiUrl(`/api/fitness/users/me/progress?courseId=${courseId}`),
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
    return apiRequest<WorkoutProgressResponse>(
        buildApiUrl(`/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`),
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
    return apiRequest<{ message: string }>(
        buildApiUrl(`/api/fitness/courses/${courseId}/workouts/${workoutId}`),
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
    return apiRequest<{ message: string }>(
        buildApiUrl(`/api/fitness/courses/${courseId}/workouts/${workoutId}/reset`),
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}
