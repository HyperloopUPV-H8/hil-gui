import { VehicleState } from "App";
import { LineDescription, LinesChart, useGlobalTicker } from "common";
import { useEffect, useState } from "react";

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

function createLineDescriptionArray(info: VehicleState): LineDescription[] {
    let result: LineDescription[] = [];
    let attribute: keyof typeof info;
    for (attribute in info) {
        result.push(createSingleLineDescription(attribute, info[attribute]));
    }
    return result;
}

function createSingleLineDescription(
    attribute: string,
    value: number
): LineDescription {
    return {
        id: attribute,
        color: "red",
        range: [0, 100],
        getUpdate: () => {
            return value;
        },
    };
}

export function ChartSection({ info }: Props) {
    const [lineDescArray, setLineDescArray] = useState<LineDescription[]>(
        createLineDescriptionArray(info)
    );

    useEffect(() => {
        setLineDescArray(createLineDescriptionArray(info));
    }, [info]);

    return (
        <>
            {lineDescArray.length == 0 ? ( //TODO: This condition has changed
                <div>Waiting for starting simulation...</div>
            ) : (
                Object.entries(lineDescArray).map(([_, lineDesc]) => {
                    return (
                        <LinesChart
                            divisions={6}
                            showGrid={true}
                            items={[lineDesc]}
                            length={1000}
                        ></LinesChart>
                    );
                })
            )}
        </>
    );
}
