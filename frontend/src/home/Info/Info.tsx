import styles from "./Info.module.scss";
import { VehicleState } from "models/vehicle";
import { VehicleSimulation } from "./VehicleSimulation/VehicleSimulation";
import { DataSection } from "./TagsSection/TagsSection";
import { ChartSection } from "./ChartSection/ChartSection";

type Props = {
    state: VehicleState;
};

export const Info = ({ state }: Props) => {
    return (
        <div className={styles.info}>
            <VehicleSimulation vehicleState={state} />
            <DataSection info={state} />
            <ChartSection
                info={state}
                isLoading={true}
            />
        </div>
    );
};
