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

const START_SIMULATION = "start_simulation";
const FINISH_SIMULTATION = "finish_simulation";

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
                        let numericId = -1;
                        switch (ev.kind) {
                            case "levitate":
                                numericId = 0;
                                break;
                            case "accelerate":
                                numericId = 1;
                                break;
                            case "brake":
                                numericId = 2;
                                break;
                        }
                        const controlOrder: ControlOrder = {
                            id: numericId,
                            state: ev.state,
                        };
                        sendJsonMessage(controlOrder);
                    }}
                    onPerturbationClick={(ev) => {
                        sendJsonMessage(ev);
                    }}
                    onSimulationClick={(ev) => {
                        sendPlayButtonEvent(ev, sendMessage);
                        if (ev.kind == "play" && !ev.state) {
                            setFirstSimulation(true);
                            setSimulationStarted(true);
                        }
                        //FIXME: when stop simulation, freeze the graphics
                        else if (ev.kind == "stop" && !ev.state) {
                            setSimulationStarted(false);
                        }
                    }}
                    lastMessage={lastMessage}
                />
                <Info state={vehicleState} />
            </div>
        </main>
    );
};

function sendPlayButtonEvent(
    ev: SimulationEvent,
    sendMessage: SendMessage | undefined
) {
    switch (ev.kind) {
        case "play":
            console.log(START_SIMULATION);
            sendMsgSimultation(sendMessage!, START_SIMULATION);
            break;
        case "stop":
            console.log(FINISH_SIMULTATION);
            sendMsgSimultation(sendMessage!, FINISH_SIMULTATION);
            break;
    }
}

function sendMsgSimultation(sendMessage: SendMessage, msg: string) {
    const message: WebSocketMessage = msg;
    sendMessage(message);
}
