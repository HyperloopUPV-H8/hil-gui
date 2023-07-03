import { VehicleState } from "App";
import { LineDescription, LinesChart, useGlobalTicker } from "common";
import { useEffect, useState } from "react";
import style from "./ChartSection.module.scss";

type Props = {
    info: VehicleState;
};

const palette = ["#EE8735", "#51C6EB", "#7BEE35"];

const startTimestamp = performance.now();

function getSineValue() {
    const elapsed = performance.now() - startTimestamp;
    const frequency = 0.5;
    const amplitude = 50;
    const offset = 50;

    const value = Math.sin((elapsed * frequency) / 1000) * amplitude + offset;

    return value;
}

function createLineDescriptionArray(info: VehicleState): LineDescription[] {
    let result: LineDescription[] = [];
    let attribute: keyof typeof info;
    let colorIndex = 0;
    for (attribute in info) {
        if (
            !attribute.endsWith("Rotation") &&
            !attribute.endsWith("Distance")
        ) {
            result.push(
                createSingleLineDescription(
                    attribute,
                    info[attribute],
                    colorIndex
                )
            );
            colorIndex++;
        }
    }
    return result;
}

function createSingleLineDescription(
    attribute: string,
    value: number,
    colorIndex: number
): LineDescription {
    return {
        id: attribute,
        name: attribute,
        color: palette[colorIndex % palette.length],
        range: getRange(attribute),
        getUpdate: () => {
            return value;
        },
    };
}

function getRange(attribute: string): [number | null, number | null] {
    switch (true) {
        case attribute.endsWith("Distance"):
            return [0, 30];
        default:
            return [0, 100];
    }
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
            <ul className={style.list}>
                <li>
                    <div className={style.attributeList}>xDistance</div>
                    <div className={style.num}>
                        {info.xDistance.toFixed(2)} mm
                    </div>
                </li>
                <li>
                    <div className={style.attributeList}>yDistance</div>
                    <div className={style.num}>
                        {info.yDistance.toFixed(2)} mm
                    </div>
                </li>
                <li>
                    <div className={style.attributeList}>zDistance</div>
                    <div className={style.num}>
                        {info.zDistance.toFixed(2)} mm
                    </div>
                </li>
            </ul>
            <ul className={style.list}>
                <li>
                    <div className={style.attributeList}>xRotation</div>
                    <div className={style.num}>
                        {info.xRotation.toFixed(2)} rad
                    </div>
                </li>
                <li>
                    <div className={style.attributeList}>yRotation</div>
                    <div className={style.num}>
                        {info.yRotation.toFixed(2)} rad
                    </div>
                </li>
                <li>
                    <div className={style.attributeList}>zRotation</div>
                    <div className={style.num}>
                        {info.zRotation.toFixed(2)} rad
                    </div>
                </li>
            </ul>
            {Object.entries(lineDescArray).map(([name, lineDesc]) => {
                return (
                    <div key={name} className={style.chart}>
                        <LinesChart
                            divisions={6}
                            showGrid={true}
                            items={[lineDesc]}
                            length={1000}
                            className={style.maxSize}
                        ></LinesChart>
                        <div className={style.legend}>{lineDesc.name}</div>
                    </div>
                );
            })}
        </>
    );
}
