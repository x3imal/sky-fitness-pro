export type DifficultyRU = 'легкий' | 'средний' | 'сложный';

export type DailyDurationInMinutes = {
    from: number;
    to: number;
};

export type Course = {
    _id: string;
    nameRU: string;
    nameEN: string;
    description: string;
    directions: string[];
    fitting: string[];
    difficulty: DifficultyRU;
    durationInDays: number;
    dailyDurationInMinutes: DailyDurationInMinutes;
    workouts: string[];

    slug: string;
    imageSrc: string;
    ctaImageSrc?: string;
};