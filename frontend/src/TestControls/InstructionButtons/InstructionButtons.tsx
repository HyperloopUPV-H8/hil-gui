import style from "./InstructionButtons.module.scss";
// import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg"; //"assets/svg/perturbationIcon.svg"; //FIXME
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import { PerturbatioEvent } from "TestControls/types";
import { ToggleButton } from "common";
//import { InstructionButton } from "components/InstructionButton/InstructionButton"; //FIXME: Changes imports to abs paths

type Props = {
    onClick: (ev: PerturbatioEvent) => void;
};

export const PerturbationButtons = ({ onClick }: Props) => {
    return (
        <div className={style.instructionsWrapper}>
            <ToggleButton
                icon={<PerturbationIcon />}
                onClick={() => onClick({ id: "default" })}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                onClick={() => onClick({ id: "default" })}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                onClick={() => onClick({ id: "default" })}
            />
            <ToggleButton
                icon={<PerturbationIcon />}
                onClick={() => onClick({ id: "default" })}
            />
        </div>
    );
};
