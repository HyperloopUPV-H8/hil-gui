import styles from "components/ValueData/ValueData.module.scss";
import { Measurement, isNumericMeasurement } from "common";

type Props = {
    measurement: Measurement;
};

export const ValueData = ({ measurement }: Props) => {
    const isNumeric = isNumericMeasurement(measurement);

    return (
        <div className={styles.valueDataWrapper}>
            <span className={styles.name}>{measurement.name}</span>
            {isNumeric && (
                <>
                    <span className={styles.value}>
                        {measurement.value.average}
                    </span>
                    <span className={styles.units}>{measurement.units}</span>
                </>
            )}
            {!isNumeric && (
                <span className={styles.value}>
                    {measurement.value.toString()}
                </span>
            )}
        </div>
    );
};
