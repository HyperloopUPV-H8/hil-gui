import styles from "./Home.module.scss";
import { useEffect, useState } from "react";
import useWebSocket, { SendMessage } from "react-use-websocket";
import { WebSocketMessage } from "react-use-websocket/dist/lib/types";
import { Header } from "./Header/Header";
import { ControlOrder, SimulationEvent } from "./Controls/types";
import { Controls } from "./Controls/Controls";
import { Info } from "./Info/Info";
import { VehicleState } from "models/vehicle";
import { useBackend } from "./useBackend";
import { createControlMessage, createSimMessage } from "messages";

const START_SIMULATION = "start_simulation";
const FINISH_SIMULTATION = "finish_simulation";

const eventKindToNumericId = {
    levitate: 0,
    accelerate: 1,
    brake: 2,
};

function firstSimVehicleState(): VehicleState {
    const vehicleState: VehicleState = {
        xDistance: Number((Math.random() * 4 + 10).toFixed(2)),
        yDistance: Number((Math.random() * 6 + 10).toFixed(2)),
        zDistance: Number((Math.random() * 4 + 10).toFixed(2)),
        current: Number((Math.random() * 20).toFixed(2)),
        duty: Math.floor(Math.random() * 20 + 15),
        temperature: Number((Math.random() * 40 + 20).toFixed(2)),
        xRotation: Number(((Math.random() - 0.5) * (Math.PI / 16)).toFixed(2)),
        yRotation: Number(((Math.random() - 0.5) * (Math.PI / 16)).toFixed(2)),
        zRotation: Number(((Math.random() - 0.5) * (Math.PI / 16)).toFixed(2)),
    };
    console.log(vehicleState);
    return vehicleState;
}

function simVehicleState(previous: VehicleState): VehicleState {
    const vehicleState: VehicleState = {
        xDistance: getRandomApproximation(previous.xDistance, 3),
        yDistance: getRandomApproximation(previous.xDistance, 5),
        zDistance: getRandomApproximation(previous.xDistance, 3),
        current: getRandomApproximation(previous.current, 4),
        duty: getRandomApproximation(previous.duty, 5),
        temperature: getRandomApproximation(previous.current, 2),
        xRotation: getRandomApproximation(previous.current, 0.1),
        yRotation: getRandomApproximation(previous.current, 0.1),
        zRotation: getRandomApproximation(previous.current, 0.1),
    };
    console.log(vehicleState);
    return vehicleState;
}

function getRandomApproximation(previousValue: number, maxDifference: number) {
    const randomDifference =
        Math.random() * (maxDifference * 2) - maxDifference;
    const newValue = previousValue + randomDifference;
    return newValue;
}

export const Home = () => {
    const [vehicleState, setVehicleState] = useState<VehicleState>({
        current: 0,
        duty: 0,
        temperature: 0,
        xDistance: 0,
        yDistance: 0,
        zDistance: 0,
        xRotation: 0,
        yRotation: 0,
        zRotation: 0,
    } as VehicleState);

    // const [previousVehicleState, setPreviousVehicleState] =
    //     useState<VehicleState>({
    //         current: 0,
    //         duty: 0,
    //         temperature: 0,
    //         xDistance: 0,
    //         yDistance: 0,
    //         zDistance: 0,
    //         xRotation: 0,
    //         yRotation: 0,
    //         zRotation: 0,
    //     } as VehicleState);

    const [firstSimulation, setFirstSimulation] = useState<boolean>(false);
    const [simulationStarted, setSimulationStarted] = useState<boolean>(false);
    const [customInterval, setCustomInterval] = useState<number>();

    const { lastJsonMessage, lastMessage, sendJsonMessage, sendMessage } =
        useBackend();

    //FIXME: THIS CODE IS CORRECT
    // useEffect(() => {
    //     if (lastJsonMessage !== null) {
    //         const newVehicleState = lastJsonMessage as VehicleState;
    //         if (newVehicleState.duty >= 0 && newVehicleState.duty < 256) {
    //             setVehicleState(newVehicleState);
    //         }
    //     }
    // }, [lastJsonMessage]);

    // useEffect(() => {
    //     console.log("first value");
    //     setVehicleState(firstSimVehicleState());
    // }, [firstSimulation]);

    useEffect(() => {
        clearInterval(customInterval);
        if (simulationStarted) {
            const interval = setInterval(() => {
                console.log("timer, simulation started: ", simulationStarted);
                //if (simulationStarted) {
                //setPreviousVehicleState(vehicleState);
                const newVehicleState = firstSimVehicleState();
                setVehicleState(newVehicleState);

                // }
            }, 2000);
            setCustomInterval(interval);
        }
        //return () => clearInterval(customInterval);
    }, [simulationStarted]);

    // useEffect(() => {
    //     console.log("previous: ", previousVehicleState);
    //     console.log("actual: ", vehicleState);
    // }, [previousVehicleState, vehicleState]);

    return (
        <main className={styles.home}>
            <Header title="Kénos Sim" />
            <div className={styles.content}>
                <Controls
                    enabled={simulationStarted}
                    onControlClick={(ev) => {
                        const id = eventKindToNumericId[ev.kind];
                        if (id === undefined) {
                            console.warn(`unrecognized event kind ${ev.kind}`);
                            return;
                        }

                        sendJsonMessage(
                            createControlMessage({
                                id: id,
                                state: ev.state,
                            })
                        );
                    }}
                    onPerturbationClick={(ev) => {
                        sendJsonMessage(ev);
                    }}
                    onSimulationClick={(ev) => {
                        switch (ev.kind) {
                            case "START_SIMULATION":
                                sendJsonMessage(
                                    createSimMessage({
                                        kind: "START_SIMULATION",
                                    })
                                );
                                setFirstSimulation(true);
                                setSimulationStarted(true);
                                break;
                            case "STOP_SIMULATION":
                                sendJsonMessage(
                                    createSimMessage({
                                        kind: "STOP_SIMULATION",
                                    }) //FIXME: Back is waiting for "FINISH_SIMULATION", change
                                );
                                setSimulationStarted(false);
                                break;
                        }
                    }}
                    lastMessage={lastMessage}
                />
                <Info state={vehicleState} />
            </div>
        </main>
    );
};

function sendMsgSimultation(sendMessage: SendMessage, msg: string) {
    const message: WebSocketMessage = msg;
    sendMessage(message);
}
