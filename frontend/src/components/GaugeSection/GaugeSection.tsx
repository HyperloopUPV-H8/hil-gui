import { GaugeTag } from "common";
import style from "./GaugeSection.module.scss";
import { VehicleState } from "App";

type Props = {
    info: VehicleState;
};

const GAUGE_WIDTH = 130;

export function GaugeSection({ info }: Props) {
    return (
        <div className={style.gaugeSection}>
            <div className={style.gaugeWrapper}>
                <GaugeTag
                    className=""
                    name="Current"
                    units="Amp"
                    max={100}
                    min={0}
                    strokeWidth={GAUGE_WIDTH}
                    value={info.current}
                ></GaugeTag>
            </div>
            <div className={style.gaugeWrapper}>
                <GaugeTag
                    className=""
                    name="Duty"
                    units=""
                    max={100}
                    min={0}
                    strokeWidth={GAUGE_WIDTH}
                    value={info.duty}
                ></GaugeTag>
            </div>
            <div className={style.gaugeWrapper}>
                <GaugeTag
                    className=""
                    name="Temperature"
                    max={100}
                    min={0}
                    strokeWidth={GAUGE_WIDTH}
                    value={info.temperature}
                    units="°C"
                ></GaugeTag>
            </div>
        </div>
    );
}
