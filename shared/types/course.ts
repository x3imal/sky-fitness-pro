export type Difficulty = 'easy' | 'medium' | 'hard';

export type Course = {
    id: string;
    title: string;
    imageSrc: string;
    days: number;
    timeMin: number;
    timeMax: number;
    difficulty: Difficulty;
};
