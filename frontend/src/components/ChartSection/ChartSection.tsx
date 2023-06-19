import { LineDescription, LinesChart, useGlobalTicker } from "common";
import { useState } from "react";

function createLineDescription(): LineDescription {
    return {
        id: "id",
        color: "red",
        range: [0, 50],
        getUpdate: () => {
            return Math.random() * 50;
        },
    };
}

export function ChartSection() {
    const [lineDesc, setLineDesc] = useState<LineDescription>(
        createLineDescription()
    );

    useGlobalTicker(() => {
        // setLineDesc( (prev) =>{
        //     ...prev,
        // }
    });

    return (
        <LinesChart
            divisions={6}
            showGrid={true}
            items={[lineDesc]} //TODO
            length={1000}
        ></LinesChart>
    );
}
