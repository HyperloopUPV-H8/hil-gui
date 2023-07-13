import { LineDescription, LinesChart } from "common";
import styles from "./LoadableChart.module.scss";
type Props = {
    isLoading: boolean;
    line: LineDescription;
};

export const LoadableChart = ({ line, isLoading }: Props) => {
    return (
        <div className={styles.loadableChart}>
            {isLoading && <div className={styles.loadingFallback} />}
            <LinesChart
                divisions={6}
                showGrid={true}
                items={[line]}
                length={1000}
                className={styles.linesChart}
            ></LinesChart>
        </div>
    );
};
