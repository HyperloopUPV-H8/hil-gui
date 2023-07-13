import { LineDescription, LinesChart, useGlobalTicker } from "common";
import { useEffect, useState } from "react";
import styles from "./ChartSection.module.scss";
import { LoadableChart } from "components/LoadableChart/LoadableChart";
import { VehicleState } from "models/vehicle";

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

type Props = {
    info: VehicleState;
    isLoading: boolean;
};

export function ChartSection({ info, isLoading }: Props) {
    const [lineDescArray, setLineDescArray] = useState<LineDescription[]>(
        createLineDescriptionArray(info)
    );

    useEffect(() => {
        setLineDescArray(createLineDescriptionArray(info));
    }, [info]);

    return (
        <div className={styles.chartSection}>
            {Object.entries(lineDescArray).map(([name, lineDesc]) => {
                return (
                    <div
                        key={name}
                        className={styles.chart}
                    >
                        <LoadableChart
                            isLoading={false}
                            line={lineDesc}
                        />
                        <div className={styles.legend}>{lineDesc.name}</div>
                    </div>
                );
            })}
        </div>
        /* <ul className={style.list}>
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
            </ul> */
    );
}
