import style from "./Controls.module.scss";
import { ControlButtons } from "./ControlButtons/ControlButtons";
import { PerturbationButtons } from "./PerturbationButtons/PerturbationButtons";
import { useEffect, useState } from "react";
import { ControlEvent, ControlOrder, SimulationEvent } from "./types";
import { FlowControl } from "./FlowControl/FlowControl";

type Props = {
    onSimulationClick: (ev: SimulationEvent) => void;
    onControlClick: (ev: ControlEvent) => void;
    onPerturbationClick: (ev: ControlOrder) => void;
    lastMessage: MessageEvent<any> | null;
    enabled: boolean;
};

export type PlayButtons = {
    play: boolean;
    stop: boolean;
};

const START_IDLE = "Back-end is ready!";

export const Controls = ({
    onSimulationClick,
    onControlClick,
    onPerturbationClick,
    lastMessage,
    enabled,
}: Props) => {
    const [buttonsState, setButtonsState] = useState<PlayButtons>({
        play: false, //FIXME: put it false, changed because now IDLE not connected
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
        <div className={style.controls}>
            <FlowControl
                onStart={() =>
                    setButtonsState((prev) => {
                        const newPlay = !prev.play;
                        onSimulationClick({
                            kind: "START_SIMULATION",
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
                onStop={() =>
                    setButtonsState((prev) => {
                        const newStop = !prev.stop;
                        onSimulationClick({
                            kind: "STOP_SIMULATION",
                        });
                        return {
                            play: !prev.play,
                            stop: newStop,
                        };
                    })
                }
            />
            <div className={style.section}>
                <div className={style.title}>Controls</div>
                <div className={style.body}>
                    <ControlButtons
                        onClick={(ev) => onControlClick(ev)}
                        disabled={!enabled}
                    />
                    <PerturbationButtons
                        onClick={(ev) => onPerturbationClick(ev)}
                        disabled={!enabled}
                    />
                </div>
            </div>
        </div>
    );
};
