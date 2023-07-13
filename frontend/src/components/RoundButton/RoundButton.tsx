import { ReactNode } from "react";
import style from "./RoundButton.module.scss";

// type Variant = {
//     icon: ReactNode;
//     colorClass: string;
// };

export type PlayButtons = {
    play: boolean;
    stop: boolean;
};

// const buttonVariants = {
//     play: {
//         icon: <FaPlay />,
//         colorClass: style.green,
//     },
//     pause: {
//         icon: <FaPause />,
//         colorClass: style.yellow,
//     },
//     stop: {
//         icon: <FaStop />,
//         colorClass: style.red,
//     },
//     disabled: {
//         icon: <FaStop />,
//         colorClass: style.gray,
//     },
// } as const;

type Props = {
    icon: ReactNode;
    color: string;
    enabled: boolean;
    onClick: () => void;
};

export function RoundButton({ icon, enabled, color, onClick }: Props) {
    return (
        <button
            className={`${style.roundButton} ${!enabled ? style.disabled : ""}`}
            style={{ backgroundColor: color }}
            disabled={!enabled}
            onClick={onClick}
        >
            {icon}
        </button>
    );
}

// function handleClick(
//     variant: ButtonType,
//     state: boolean,
//     sendMessage: SendMessage | undefined,
//     changeState: (playButtons: PlayButtons) => void
// ) {
//     switch (variant) {
//         case "play":
//             sendMsgSimultation(sendMessage!, START_SIMULATION);
//             changeState({ play: !state, stop: state });
//             break;
//         case "stop":
//             sendMsgSimultation(sendMessage!, FINISH_SIMULTATION);
//             changeState({ play: state, stop: !state });
//             break;
//     }
// }

// function sendMsgSimultation(sendMessage: SendMessage, msg: string) {
//     const message: WebSocketMessage = msg;
//     sendMessage(message);
// }
