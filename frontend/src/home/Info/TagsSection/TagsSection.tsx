import style from "./TagsSection.module.scss";
import { GaugeTag } from "common";
import { BarTag } from "components/BarTag/BarTag";
import { VehicleState } from "models/vehicle";

type Props = {
    info: VehicleState;
};

const GAUGE_WIDTH = 130;

export function DataSection({ info }: Props) {
    return (
        <div className={style.tagsSection}>
            <GaugeTag
                name="Current"
                units="Amp"
                max={100}
                min={0}
                strokeWidth={GAUGE_WIDTH}
                value={info.current}
            ></GaugeTag>
            <GaugeTag
                name="Duty"
                units=""
                max={100}
                min={0}
                strokeWidth={GAUGE_WIDTH}
                value={info.duty}
            ></GaugeTag>
            <BarTag
                barType="range"
                measurement={{
                    id: "X-Distance",
                    name: "X-Distance",
                    safeRange: [0, 50],
                    warningRange: [0, 50],
                    type: "uint8",
                    units: "mm",
                    value: {
                        average: Number(info.xDistance.toFixed(2)),
                        last: Number(info.xDistance.toFixed(2)),
                    },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Y-Distance",
                    name: "Y-Distance",
                    safeRange: [0, 50],
                    warningRange: [0, 50],
                    type: "uint8",
                    units: "mm",
                    value: {
                        average: Number(info.yDistance.toFixed(2)),
                        last: Number(info.yDistance.toFixed(2)),
                    },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Z-Distance",
                    name: "Z-Distance",
                    safeRange: [0, 50],
                    warningRange: [0, 50],
                    type: "uint8",
                    units: "mm",
                    value: {
                        average: Number(info.zDistance.toFixed(2)),
                        last: Number(info.zDistance.toFixed(2)),
                    },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "X-Rotation",
                    name: "X-Rotation",
                    safeRange: [-1, 1],
                    warningRange: [-1, 1],
                    type: "uint8",
                    units: "rad",
                    value: { average: info.xRotation, last: info.xRotation },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Y-Rotation",
                    name: "Y-Rotation",
                    safeRange: [-5, 5],
                    warningRange: [-5, 5],
                    type: "uint8",
                    units: "rad",
                    value: { average: info.yRotation, last: info.yRotation },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Z-Rotation",
                    name: "Z-Rotation",
                    safeRange: [-5, 5],
                    warningRange: [-5, 5],
                    type: "uint8",
                    units: "rad",
                    value: { average: info.zRotation, last: info.zRotation },
                }}
            />
        </div>
    );
}
