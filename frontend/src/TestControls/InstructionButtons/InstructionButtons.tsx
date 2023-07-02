import style from "./InstructionButtons.module.scss";
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import { ControlOrder, PerturbatioEvent } from "TestControls/types";
import { ToggleButton } from "common";

type Props = {
    onClick: (ev: ControlOrder) => void;
};

export const PerturbationButtons = ({ onClick }: Props) => {
    return (
        <div className={style.instructionsWrapper}>
            <ToggleButton
                icon={<PerturbationIcon />}
                label="Custom 0"
                onClick={(state) => onClick({ id: 3, state })}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                label="Custom 1"
                onClick={(state) => onClick({ id: 4, state })}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                label="Custom 2"
                onClick={(state) => onClick({ id: 5, state })}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                label="Custom 3"
                onClick={(state) => onClick({ id: 6, state })}
            />
        </div>
    );
};
