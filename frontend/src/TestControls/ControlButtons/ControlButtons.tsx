import { ToggleButton } from "common";
import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import style from "./ControlButtons.module.scss";
import { ControlEvent } from "TestControls/types";

type Props = {
    onClick: (ev: ControlEvent) => void;
};

export const ControlButtons = ({ onClick }: Props) => {
    return (
        <div className={style.controlsWrapper}>
            <ToggleButton
                label="Levitate"
                icon={<LevitateIcon />}
                onClick={(state) => onClick({ kind: "levitate", state })}
            />
            <ToggleButton
                label="Accelerate"
                icon={<PropulseIcon />}
                onClick={(state) => onClick({ kind: "accelerate", state })}
            />
            <ToggleButton
                label="Brake"
                icon={<BreakIcon />}
                onClick={(state) => onClick({ kind: "brake", state })}
            />
        </div>
    );
};
