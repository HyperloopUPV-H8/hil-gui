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

type BackendMessage<Type extends string, Payload> = {
    type: Type;
    payload: Payload;
};

type ControlOrderMsg = BackendMessage<"control_order", ControlOrder>;
type StartSimulationMsg = BackendMessage<
    "start_simulation",
    "start_simulation"
>;
type FinishSimulationMsg = BackendMessage<
    "finish_simulation",
    "finish_simulation"
>;
