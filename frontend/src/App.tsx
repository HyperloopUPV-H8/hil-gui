import { useEffect, useState } from "react";
import useWebSocket, { SendMessage } from "react-use-websocket";
import style from "./App.module.scss";
import { TestControls } from "./TestControls/TestControls";
import { ThreeJsVehicle } from "./ThreeJs/ThreeJsVehicle";
import { GaugeSection } from "components/GaugeSection/GaugeSection";
import { ChartSection } from "components/ChartSection/ChartSection";
import { ControlOrder, SimulationEvent } from "TestControls/types";
import { WebSocketMessage } from "react-use-websocket/dist/lib/types";

// const SERVER_URL = `${import.meta.env.VITE_SERVER_IP_HIL}:${
//     //FIXME: change to congif.toml
//     import.meta.env.VITE_SERVER_PORT_HIL
// }${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

const SERVER_URL = "127.0.0.1:8010/backend";

const WEBSOCKET_URL = `ws://${SERVER_URL}`; //FIXME
const START_SIMULATION = "start_simulation";
const FINISH_SIMULTATION = "finish_simulation";

export type VehicleState = {
    xDistance: number;
    yDistance: number;
    zDistance: number;
    current: number;
    duty: number;
    temperature: number;
    xRotation: number;
    yRotation: number;
    zRotation: number;
};

function App() {
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

    const [simulationStarted, setSimulationStarted] = useState<boolean>(false);

    const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage } =
        useWebSocket(WEBSOCKET_URL, {
            shouldReconnect: () => {
                return true;
            },
        });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            const newVehicleState = lastJsonMessage as VehicleState;
            if (newVehicleState.duty >= 0 && newVehicleState.duty < 256) {
                setVehicleState(newVehicleState);
            }
        }
    }, [lastJsonMessage]);

    return (
        <main className={style.pageWrapper}>
            <header className={style.header}>
                <h1>Testing</h1>
            </header>

            <div className={style.testingPageWrapper}>
                <div className={style.podRepresentation}>
                    <TestControls
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
                            console.log(controlOrder);
                            sendJsonMessage(controlOrder);
                        }}
                        onPerturbationClick={(ev) => {
                            console.log(ev);
                            sendJsonMessage(ev);
                        }}
                        onSimulationClick={(ev) => {
                            sendPlayButtonEvent(ev, sendMessage);
                            if (ev.kind == "play" && !ev.state) {
                                setSimulationStarted(true);
                                console.log("executed V");
                            }
                            //FIXME: when stop simulation, freeze the graphics
                            //else if (ev.kind == "stop" && !ev.state) {
                            //     setSimulationStarted(false);
                            //     console.log("executed F");
                            // }
                        }}
                        lastMessage={lastMessage}
                    />
                    <div className={style.threeJSAndInfo}>
                        <div className={style.threeJS}>
                            <ThreeJsVehicle info={vehicleState} />
                        </div>

                        <div className={style.info}>
                            <GaugeSection info={vehicleState} />
                        </div>
                    </div>
                </div>
                <div className={style.graphics}>
                    {simulationStarted ? (
                        <ChartSection info={vehicleState} />
                    ) : (
                        <div className={style.noCharts}>
                            Waiting for starting simulation...
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default App;

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
