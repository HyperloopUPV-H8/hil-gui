import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "common/dist/style.css";
import { GlobalTicker } from "common";
import { Home } from "home/Home.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <GlobalTicker fps={100}>
            <Home />
        </GlobalTicker>
    </React.StrictMode>
);
