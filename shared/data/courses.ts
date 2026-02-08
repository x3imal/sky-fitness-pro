import { Course } from '@/shared/types/course';

export const COURSES: Course[] = [
    {
        slug: 'yoga',
        imageSrc: '/images/courses/yoga.png',
        ctaImageSrc: '/images/courses/cta-yoga.png',

        _id: 'q02a6i',
        nameRU: 'Йога',
        nameEN: 'Yoga',
        description:
            'Йога помогает улучшить гибкость, осанку и контроль дыхания. Подходит для мягкого старта и регулярной практики дома.',
        directions: ['Йога для новичков', 'Классическая йога', 'Хатха-йога', 'Кундалини-йога', 'Йогатерапия', 'Аштанга-йога'],
        fitting: [
            'Давно хотели попробовать йогу, но не решались начать',
            'Хотите укрепить позвоночник, избавиться от болей в спине и суставах',
            'Ищете активность, полезную для тела и души',
        ],
        difficulty: 'средний',
        durationInDays: 20,
        dailyDurationInMinutes: { from: 20, to: 40 },
        workouts: ['yoga_w1', 'yoga_w2', 'yoga_w3'],
    },

    {
        slug: 'stretching',
        imageSrc: '/images/courses/stretching.png',
        ctaImageSrc: '/images/courses/cta-stretching.png',

        _id: 's12abc',
        nameRU: 'Стретчинг',
        nameEN: 'Stretching',
        description:
            'Растяжка для снятия зажимов, улучшения подвижности и восстановления после нагрузок.',
        directions: ['Мягкая растяжка', 'Мобилити', 'Шпагаты'],
        fitting: ['Хочется больше подвижности', 'Чувствуете зажатость мышц', 'Нужно восстановление после тренировок'],
        difficulty: 'легкий',
        durationInDays: 14,
        dailyDurationInMinutes: { from: 15, to: 30 },
        workouts: ['stretching_w1', 'stretching_w2', 'stretching_w3'],
    },

    {
        slug: 'fitness',
        imageSrc: '/images/courses/fitness.png',
        ctaImageSrc: '/images/courses/cta-fitness.png',

        _id: 'f99xyz',
        nameRU: 'Фитнес',
        nameEN: 'Fitness',
        description:
            'Силовые и функциональные тренировки для тонуса и энергии. Подходит для домашних занятий.',
        directions: ['Функциональный', 'Силовой', 'Кардио-микс'],
        fitting: ['Хочется тонуса', 'Нужно больше энергии', 'Хотите укрепить всё тело'],
        difficulty: 'средний',
        durationInDays: 18,
        dailyDurationInMinutes: { from: 25, to: 45 },
        workouts: ['fitness_w1', 'fitness_w2', 'fitness_w3'],
    },

    {
        slug: 'step',
        imageSrc: '/images/courses/step.png',
        ctaImageSrc: '/images/courses/cta-step.png',

        _id: 'st55pp',
        nameRU: 'Степ-аэробика',
        nameEN: 'Step',
        description:
            'Динамичная кардио-нагрузка с элементами координации. Отлично разгоняет пульс и настроение.',
        directions: ['Базовые шаги', 'Комбинации', 'Интервалы'],
        fitting: ['Нравится кардио', 'Хотите разнообразия', 'Любите ритм и музыку'],
        difficulty: 'средний',
        durationInDays: 16,
        dailyDurationInMinutes: { from: 20, to: 35 },
        workouts: ['step_w1', 'step_w2', 'step_w3'],
    },

    {
        slug: 'bodyflex',
        imageSrc: '/images/courses/bodyflex.png',
        ctaImageSrc: '/images/courses/cta-bodyflex.png',

        _id: 'bf05kq',
        nameRU: 'Бодифлекс',
        nameEN: 'BodyFlex',
        description:
            'Система, сочетающая упражнения и дыхательную гимнастику. Хорошо подходит для домашних занятий и работы над метаболизмом.',
        directions: ['базовый', 'продвинутый'],
        fitting: ['Хотите укрепить лёгкие', 'Улучшить пищеварение', 'Ускорить метаболизм'],
        difficulty: 'сложный',
        durationInDays: 15,
        dailyDurationInMinutes: { from: 50, to: 70 },
        workouts: ['bodyflex_w1', 'bodyflex_w2', 'bodyflex_w3'],
    },
];
