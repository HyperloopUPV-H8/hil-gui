import { SimulationEvent } from "./home/Controls/types";
import { ControlOrder } from "home/Controls/types";

type BackendMessage<Type extends string, Payload> = {
    type: Type;
    payload: Payload;
};

type SimMessageType = "sim";
type ControlMessageType = "control";

export type ControlOrderMsg = BackendMessage<ControlMessageType, ControlOrder>;

export type StartSimulationMsg = BackendMessage<
    SimMessageType,
    "start_simulation"
>;
export type FinishSimulationMsg = BackendMessage<
    SimMessageType,
    "finish_simulation"
>;

export function createSimMessage<T extends SimulationEvent>(
    payload: T
): BackendMessage<SimMessageType, T> {
    return {
        type: "sim",
        payload: payload,
    };
}

export function createControlMessage<T extends ControlOrder>(
    payload: T
): BackendMessage<ControlMessageType, T> {
    return {
        type: "control",
        payload: payload,
    };
}
