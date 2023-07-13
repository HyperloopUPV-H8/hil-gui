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
                    id: "Default",
                    name: "Default",
                    safeRange: [0, 100],
                    warningRange: [0, 100],
                    type: "uint8",
                    units: "A",
                    value: { average: 0, last: 0 },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Default",
                    name: "Default",
                    safeRange: [0, 100],
                    warningRange: [0, 100],
                    type: "uint8",
                    units: "A",
                    value: { average: 0, last: 0 },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Default",
                    name: "Default",
                    safeRange: [0, 100],
                    warningRange: [0, 100],
                    type: "uint8",
                    units: "A",
                    value: { average: 0, last: 0 },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Default",
                    name: "Default",
                    safeRange: [0, 100],
                    warningRange: [0, 100],
                    type: "uint8",
                    units: "A",
                    value: { average: 0, last: 0 },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Default",
                    name: "Default",
                    safeRange: [0, 100],
                    warningRange: [0, 100],
                    type: "uint8",
                    units: "A",
                    value: { average: 0, last: 0 },
                }}
            />
            <BarTag
                barType="range"
                measurement={{
                    id: "Default",
                    name: "Default",
                    safeRange: [0, 100],
                    warningRange: [0, 100],
                    type: "uint8",
                    units: "A",
                    value: { average: 0, last: 0 },
                }}
            />
        </div>
    );
}
