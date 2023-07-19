export type SimulationEvent = {
    kind: "START_SIMULATION" | "STOP_SIMULATION";
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
