//import { PlayButton } from "common/dist/components";
import { PlayButton } from "common"; //FIXME
import style from "./TestControls.module.scss";
// import { useControlForm } from "./useControlForm";
// import { initialFormDescription } from "./initialFormDataMock";
import { ControlButtons } from "./ControlButtons/ControlButtons";
import { PerturbationButtons } from "./InstructionButtons/InstructionButtons";
import { useState } from "react";
import { ControlEvent, PerturbatioEvent, SimulationEvent } from "./types";

// type Props = {
//     sendJsonMessage: SendJsonMessage;
//     sendMessage: SendMessage;
//     lastMessage: MessageEvent<any> | null;
// };

type Props = {
    onSimulationClick: (ev: SimulationEvent) => void;
    onControlClick: (ev: ControlEvent) => void;
    onPerturbationClick: (ev: PerturbatioEvent) => void;
};

export type PlayButtons = {
    play: boolean;
    stop: boolean;
};

export const TestControls = ({
    onSimulationClick,
    onControlClick,
    onPerturbationClick,
}: Props) => {
    const [buttonsState, setButtonsState] = useState<PlayButtons>({
        play: false,
        stop: false,
    });

    return (
        <div className={style.testControlsWrapper}>
            <div className={style.playWrapper}>
                <PlayButton
                    variant="play"
                    onClick={() =>
                        setButtonsState((prev) => {
                            const newPlay = !prev.play;
                            onSimulationClick({
                                kind: "play",
                                state: newPlay,
                            });
                            return {
                                play: newPlay,
                                stop: prev.stop,
                            };
                        })
                    }
                    state={buttonsState.play}
                />
                <PlayButton
                    variant="stop"
                    onClick={() =>
                        setButtonsState((prev) => {
                            const newStop = !prev.stop;
                            onSimulationClick({
                                kind: "stop",
                                state: newStop,
                            });
                            return {
                                play: newStop,
                                stop: prev.stop,
                            };
                        })
                    }
                    state={buttonsState.stop}
                />
            </div>
            <div className={style.sectionWrapper}>
                <div className={style.title}>Controls</div>
                <div className={style.body}>
                    <ControlButtons onClick={(ev) => onControlClick(ev)} />
                    <PerturbationButtons
                        onClick={(ev) => onPerturbationClick(ev)}
                    />
                </div>
            </div>
        </div>
    );
};
