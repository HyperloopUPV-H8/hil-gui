import { PlayButton } from "common";
import style from "./TestControls.module.scss";
import { ControlButtons } from "./ControlButtons/ControlButtons";
import { PerturbationButtons } from "./InstructionButtons/InstructionButtons";
import { useEffect, useState } from "react";
import { ControlEvent, ControlOrder, SimulationEvent } from "./types";

type Props = {
    onSimulationClick: (ev: SimulationEvent) => void;
    onControlClick: (ev: ControlEvent) => void;
    onPerturbationClick: (ev: ControlOrder) => void;
    lastMessage: MessageEvent<any> | null;
    simulationStarted: boolean;
};

export type PlayButtons = {
    play: boolean;
    stop: boolean;
};

const START_IDLE = "Back-end is ready!";

export const TestControls = ({
    onSimulationClick,
    onControlClick,
    onPerturbationClick,
    lastMessage,
    simulationStarted,
}: Props) => {
    const [buttonsState, setButtonsState] = useState<PlayButtons>({
        play: false,
        stop: false,
    });

    useEffect(() => {
        const stringData: string = lastMessage?.data;
        if (stringData == START_IDLE) {
            setButtonsState(() => {
                return {
                    play: true,
                    stop: false,
                };
            });
        }
    }, [lastMessage]);

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
                            console.log({
                                play: newPlay,
                                stop: !prev.stop,
                            });
                            return {
                                play: newPlay,
                                stop: !prev.stop,
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
                                play: !prev.play,
                                stop: newStop,
                            };
                        })
                    }
                    state={buttonsState.stop}
                />
            </div>
            <div className={style.sectionWrapper}>
                <div className={style.title}>Controls</div>
                <div className={style.body}>
                    <ControlButtons
                        onClick={(ev) => onControlClick(ev)}
                        disabled={!simulationStarted}
                    />
                    <PerturbationButtons
                        onClick={(ev) => onPerturbationClick(ev)}
                        disabled={!simulationStarted}
                    />
                </div>
            </div>
        </div>
    );
};
