export type CourseTheme = {
    cardImageSrc: string;
    heroImageSrc: string;
    heroObjectPosition?: string;
};

export const COURSE_THEME_BY_SLUG: Record<string, CourseTheme> = {
    yoga: {
        cardImageSrc: '/images/courses/Yoga.png',
        heroImageSrc: '/images/courses/yoga-hero.png',
        heroObjectPosition: '80% 20%',
    },

    stretching: {
        cardImageSrc: '/images/courses/stretching.png',
        heroImageSrc: '/images/courses/stretching-hero.png',
        heroObjectPosition: '85% 25%',
    },

    fitness: {
        cardImageSrc: '/images/courses/fitness.png',
        heroImageSrc: '/images/courses/fitness-hero.png',
        heroObjectPosition: '85% 20%',
    },

    step: {
        cardImageSrc: '/images/courses/step.png',
        heroImageSrc: '/images/courses/step-hero.png',
        heroObjectPosition: '85% 30%',
    },

    bodyflex: {
        cardImageSrc: '/images/courses/bodyflex.png',
        heroImageSrc: '/images/courses/bodyflex-hero.png',
        heroObjectPosition: '85% 20%',
    },
};
