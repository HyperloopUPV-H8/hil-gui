import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

const SERVER_URL = "127.0.0.1:8010/backend";
const WEBSOCKET_URL = `ws://${SERVER_URL}`;

export function useBackend() {
    const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage } =
        useWebSocket(WEBSOCKET_URL, {
            shouldReconnect: () => true,
            reconnectInterval: 2,
            reconnectAttempts: Infinity,
        });

    return { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage };
}
