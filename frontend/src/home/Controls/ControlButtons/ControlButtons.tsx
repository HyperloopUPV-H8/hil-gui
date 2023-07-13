import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import style from "./ControlButtons.module.scss";
import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ControlEvent } from "../types";

type Props = {
    onClick: (ev: ControlEvent) => void;
    disabled: boolean;
};

export const ControlButtons = ({ onClick, disabled }: Props) => {
    return (
        <div className={style.controlsWrapper}>
            <ToggleButton
                label="Levitate"
                icon={<LevitateIcon />}
                onClick={(state) => onClick({ kind: "levitate", state })}
                disabled={disabled}
            />
            <ToggleButton
                label="Accelerate"
                icon={<PropulseIcon />}
                onClick={(state) => onClick({ kind: "accelerate", state })}
                disabled={disabled}
            />
            <ToggleButton
                label="Brake"
                icon={<BreakIcon />}
                onClick={(state) => onClick({ kind: "brake", state })}
                disabled={disabled}
            />
        </div>
    );
};
