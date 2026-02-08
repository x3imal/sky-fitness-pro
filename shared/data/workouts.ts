import {Workout} from "@/shared/types/workout";

export const workoutsByCourseSlug: Record<string, Workout[]> = {
    yoga: [
        {
            _id: "yoga_w1",
            name: "Урок 1. Дыхание и мягкая мобилизация",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "yoga_w2",
            name: "Урок 2. Основные движения",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "yoga_w3",
            name: "Урок 3. Баланс и центр",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
    ],

    stretching: [
        {
            _id: "stretching_w1",
            name: "Урок 1. Шея, плечи, грудной отдел",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "stretching_w2",
            name: "Урок 2. Таз и задняя поверхность бедра",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "stretching_w3",
            name: "Урок 3. Спина и мягкое восстановление",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
    ],

    fitness: [
        {
            _id: "fitness_w1",
            name: "Урок 1. Ноги + корпус",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "fitness_w2",
            name: "Урок 2. Верх тела + корпус",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "fitness_w3",
            name: "Урок 3. Круговая на всё тело",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
    ],

    step: [
        {
            _id: "step_w1",
            name: "Урок 1. Разминка + базовые шаги",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "step_w2",
            name: "Урок 2. Кардио связка",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "step_w3",
            name: "Урок 3. Интервалы и заминка",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
    ],

    bodyflex: [
        {
            _id: "bodyflex_w1",
            name: "Урок 1. Дыхание и активация корпуса",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "bodyflex_w2",
            name: "Урок 2. Тонус и выносливость",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
        {
            _id: "bodyflex_w3",
            name: "Урок 3. Растяжка и восстановление",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: []
        },
    ],
};

export const WORKOUTS: Workout[] = Object.values(workoutsByCourseSlug).flat();
