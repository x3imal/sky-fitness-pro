export type Exercise = {
    _id: string;
    name: string;
    progress?: number;
};

export type Workout = {
    _id: string;
    name: string;
    video: string;
    exercises: Exercise[];
    completed?: boolean;
};
