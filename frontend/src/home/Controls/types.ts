export type SimulationEvent = {
    kind: "play" | "stop";
    state: boolean;
};

export type ControlEvent = {
    kind: "levitate" | "accelerate" | "brake";
    state: boolean;
};

export type ControlOrder = {
    id: number;
    state: boolean;
};

export type PerturbatioEvent = { id: string };
