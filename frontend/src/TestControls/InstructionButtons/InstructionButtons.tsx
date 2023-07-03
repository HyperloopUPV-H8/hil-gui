import style from "./InstructionButtons.module.scss";
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import { ControlOrder, PerturbatioEvent } from "TestControls/types";
import { ToggleButton } from "common";

type Props = {
    onClick: (ev: ControlOrder) => void;
    disabled: boolean;
};

export const PerturbationButtons = ({ onClick, disabled }: Props) => {
    return (
        <div className={style.instructionsWrapper}>
            <ToggleButton
                icon={<PerturbationIcon />}
                label="Custom 0"
                onClick={(state) => onClick({ id: 3, state })}
                disabled={disabled}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                label="Custom 1"
                onClick={(state) => onClick({ id: 4, state })}
                disabled={disabled}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                label="Custom 2"
                onClick={(state) => onClick({ id: 5, state })}
                disabled={disabled}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                label="Custom 3"
                onClick={(state) => onClick({ id: 6, state })}
                disabled={disabled}
            />
        </div>
    );
};
