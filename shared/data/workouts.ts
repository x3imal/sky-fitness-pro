import {Workout} from "@/shared/types/workout";

export const workoutsByCourseSlug: Record<string, Workout[]> = {
    yoga: [
        {
            _id: "yoga_w1",
            name: "Утренняя практика",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: true,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "yoga_w2",
            name: "Красота и здоровье",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: true,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "yoga_w3",
            name: "Асаны стоя",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
    ],

    stretching: [
        {
            _id: "stretching_w1",
            name: "Растягиваем мышцы бедра",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: true,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "stretching_w2",
            name: "Гибкость спины",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "stretching_w3",
            name: "Длинная растяжка",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
    ],

    fitness: [
        {
            _id: "fitness_w1",
            name: "Ноги + корпус",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: true,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "fitness_w2",
            name: "Верх тела + корпус",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "fitness_w3",
            name: "Круговая на все тело",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
    ],

    step: [
        {
            _id: "step_w1",
            name: "Разминка + базовые шаги",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: true,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "step_w2",
            name: "Кардио связка",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "step_w3",
            name: "Интервалы и заминка",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
    ],

    bodyflex: [
        {
            _id: "bodyflex_w1",
            name: "Дыхание и активация корпуса",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: true,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "bodyflex_w2",
            name: "Тонус и выносливость",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
        {
            _id: "bodyflex_w3",
            name: "Растяжка и восстановление",
            video: "https://www.youtube.com/embed/gJPs7b8SpVw",
            completed: false,
            exercises: [
                { _id: "ex1", name: "Наклоны вперед", progress: 0 },
                { _id: "ex2", name: "Наклоны назад", progress: 0 },
                { _id: "ex3", name: "Поднятие ног, согнутых в коленях", progress: 0 },
                { _id: "ex4", name: "Повороты корпуса", progress: 0 },
                { _id: "ex5", name: "Баланс стоя", progress: 0 },
                { _id: "ex6", name: "Растяжка спины", progress: 0 },
            ]
        },
    ],
};

export const WORKOUTS: Workout[] = Object.values(workoutsByCourseSlug).flat();
