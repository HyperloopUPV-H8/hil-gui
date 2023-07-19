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

    const [firstSimulation, setFirstSimulation] = useState<boolean>(false);
    const [simulationStarted, setSimulationStarted] = useState<boolean>(false);

    const { lastJsonMessage, lastMessage, sendJsonMessage, sendMessage } =
        useBackend();

    useEffect(() => {
        if (lastJsonMessage !== null) {
            const newVehicleState = lastJsonMessage as VehicleState;
            if (newVehicleState.duty >= 0 && newVehicleState.duty < 256) {
                setVehicleState(newVehicleState);
            }
        }
    }, [lastJsonMessage]);

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
                                sendJsonMessage(createSimMessage());
                                setFirstSimulation(true);
                                setSimulationStarted(true);
                                break;
                            case "STOP_SIMULATION":
                                sendJsonMessage(createSimMessage());
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
