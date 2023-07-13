import { ThreeJsVehicle } from "ThreeJs/ThreeJsVehicle";
import styles from "./VehicleSimulation.module.scss";
import { VehicleState } from "models/vehicle";

type Props = {
    vehicleState: VehicleState;
};

export const VehicleSimulation = ({ vehicleState }: Props) => {
    return (
        <div className={styles.threeJS}>
            <ThreeJsVehicle info={vehicleState} />
        </div>
    );
};
