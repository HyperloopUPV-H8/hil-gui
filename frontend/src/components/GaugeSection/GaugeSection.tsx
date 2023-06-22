import { GaugeTag } from "common";
import style from "./GaugeSection.module.scss";
import { VehicleState } from "App";

type Props = {
    info: VehicleState;
};

const GAUGE_WIDTH = 130;

export function GaugeSection({ info }: Props) {
    return (
        <div className={style.GaugeWrapper}>
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
            <GaugeTag
                name="Temperature"
                max={100}
                min={0}
                strokeWidth={GAUGE_WIDTH}
                value={info.temperature}
                units="°C"
            ></GaugeTag>
        </div>
    );
}
