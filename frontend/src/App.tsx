import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import style from "./App.module.scss";
import { TestControls } from "./TestControls/TestControls";
import "common/dist/style.css"; //FIXME
import { ThreeJsVehicle } from "./ThreeJs/ThreeJsVehicle";

const SERVER_URL = `${import.meta.env.VITE_SERVER_IP_HIL}:${
    //FIXME: change to congif.toml
    import.meta.env.VITE_SERVER_PORT_HIL
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

const WEBSOCKET_URL = `ws://${SERVER_URL}`; //FIXME

export type VehicleState = {
    yDistance: number;
    current: number;
    duty: number;
    temperature: number;
};

function App() {
    const [vehicleState, setVehicleState] = useState<VehicleState>({
        current: 0,
        duty: 0,
        temperature: 0,
        yDistance: 0,
    } as VehicleState);

    const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage } =
        useWebSocket(WEBSOCKET_URL, {
            shouldReconnect: (closeEvent) => {
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
        <PageWrapper title="Testing">
            <div className={style.testingPageWrapper}>
                <TestControls
                    sendJsonMessage={sendJsonMessage}
                    sendMessage={sendMessage}
                    lastMessage={lastMessage}
                />
                <div className={style.podRepresentation}>
                    <div className={style.threeJSAndInfo}>
                        <div className={style.threeJS}>
                            <ThreeJsVehicle
                                yDistance={vehicleState.yDistance}
                            />
                        </div>

                        <div className={style.info}></div>
                    </div>
                    <div className={style.graphics}></div>
                </div>
            </div>
        </PageWrapper>
    );
}

export default App;
