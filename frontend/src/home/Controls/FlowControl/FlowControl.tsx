import styles from "./FlowControl.module.scss";
import { RoundButton } from "components/RoundButton/RoundButton";
import { FaPlay, FaStop } from "react-icons/fa";

type Props = {
    onStart: () => void;
    onStop: () => void;
};

export const FlowControl = ({ onStart, onStop }: Props) => {
    return (
        <div className={styles.flowControl}>
            <RoundButton
                icon={<FaPlay />}
                color="green"
                enabled={true}
                onClick={onStart}
            />
            <RoundButton
                icon={<FaStop />}
                color="red"
                enabled={true}
                onClick={onStop}
            />
        </div>
    );
};
