export type Exercise = {
    _id: string;
    name: string;
};

export type Workout = {
    _id: string;
    name: string;
    video: string;
    exercises: Exercise[];
};
