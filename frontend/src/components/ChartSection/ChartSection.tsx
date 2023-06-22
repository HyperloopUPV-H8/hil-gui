import { VehicleState } from "App";
import { LineDescription, LinesChart, useGlobalTicker } from "common";
import { useState } from "react";

type Props = {
    info: VehicleState;
};

const startTimestamp = performance.now();

function getSineValue() {
    const elapsed = performance.now() - startTimestamp;
    const frequency = 0.5; // Ajusta la frecuencia de la curva senoidal
    const amplitude = 50; // Ajusta la amplitud de la curva senoidal
    const offset = 50; // Ajusta el desplazamiento vertical de la curva senoidal

    // Calcula el valor senoidal
    const value = Math.sin((elapsed * frequency) / 1000) * amplitude + offset;

    return value;
}

function createLineDescription(): LineDescription {
    return {
        id: "id",
        color: "red",
        range: [0, 100],
        getUpdate: () => {
            //console.log(getSineValue());
            return getSineValue();
        },
    };
}

export function ChartSection({ info }: Props) {
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
