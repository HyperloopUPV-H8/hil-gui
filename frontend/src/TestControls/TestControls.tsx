//import { PlayButton } from "common/dist/components";
import { PlayButton } from "../../../../common-front/dist/components";
import style from "./TestControls.module.scss";
// import { useControlForm } from "./useControlForm";
// import { initialFormDescription } from "./initialFormDataMock";
import { ControlButtons } from "./ControlButtons/ControlButtons";
import {
    SendJsonMessage,
    SendMessage,
} from "react-use-websocket/dist/lib/types";
import { InstructionButtons } from "./InstructionButton/InstructionButtons";
import { useState } from "react";

type Props = {
    sendJsonMessage: SendJsonMessage;
    sendMessage: SendMessage;
    lastMessage: MessageEvent<any> | null;
};

export type PlayButtons = {
    play: boolean;
    stop: boolean;
};

export const TestControls = ({
    sendJsonMessage,
    sendMessage,
    lastMessage,
}: Props) => {
    //FIXME: Not used now
    // const [form, ChangeValue, ChangeEnable, SubmitHandler] = useControlForm(
    //     initialFormDescription
    // );
    const [playButtonsState, setPlayButtonsState] = useState<PlayButtons>({
        play: false,
        stop: false,
    });

    const changePlayButtons = (buttonStates: PlayButtons) => {
        setPlayButtonsState(buttonStates);
    };

    return (
        <div className={style.testControlsWrapper}>
            <div className={style.playWrapper}>
                <PlayButton
                    variant="play"
                    sendMessage={sendMessage}
                    lastMessage={lastMessage}
                    state={playButtonsState.play}
                    changeState={changePlayButtons}
                />
                <PlayButton
                    variant="stop"
                    state={playButtonsState.stop}
                    changeState={changePlayButtons}
                    sendMessage={sendMessage}
                />
            </div>
            <div className={style.sectionWrapper}>
                <div className={style.title}>Controls</div>
                <div className={style.body}>
                    <ControlButtons sendJsonMessage={sendJsonMessage} />
                    <InstructionButtons sendJsonMessage={sendJsonMessage} />
                </div>
            </div>
        </div>
    );
};
