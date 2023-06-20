import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "styles/styles.css";
import "common/dist/style.css";
import { GlobalTicker } from "common";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <GlobalTicker fps={100}>
            <App />
        </GlobalTicker>
    </React.StrictMode>
);
