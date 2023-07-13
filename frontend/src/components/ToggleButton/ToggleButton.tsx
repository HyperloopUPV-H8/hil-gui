import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    ReactNode,
    useEffect,
} from "react";
import style from "./ToggleButton.module.scss";
import { useToggle } from "common";

type Props = {
    label?: string;
    icon: ReactNode;
    onClick?: (state: boolean) => void;
} & Omit<
    DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >,
    "onClick"
>;

export function ToggleButton({
    label = "",
    icon,
    onClick,
    disabled,
    ...buttonProps
}: Props) {
    const [isOn, flip] = useToggle(false);

    useEffect(() => {
        onClick?.(isOn);
    }, [isOn]);

    const labelClass = `${style.toggleButton} ${
        disabled ? style.disabled : isOn ? style.on : style.off
    }`;

    return (
        <label className={labelClass}>
            <button
                onClick={() => {
                    flip();
                }}
                disabled={disabled}
                {...buttonProps}
            >
                {icon}
            </button>
            <p>{label}</p>
        </label>
    );
}
