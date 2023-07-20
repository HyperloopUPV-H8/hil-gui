import { animated, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { VehicleState } from "models/vehicle";
//import { VehicleState } from "App";
import { useEffect, useRef } from "react";
import { Mesh } from "three";

const MAX_YDISTANCE = 25; //22;
const MIN_YDISTANCE = 15;
const MAX_CANVAS_X = 3;

type Props = {
    info: VehicleState;
};

function calculatePositionDistance(distance: number) {
    if (distance >= 10) {
        return (
            ((distance - MIN_YDISTANCE) * MAX_CANVAS_X) /
            (MAX_YDISTANCE - MIN_YDISTANCE)
        );
    } else {
        return 0;
    }
}

function calculatePositionYDistance(yDistance: number) {
    return ((yDistance - 0 + 1) * MAX_CANVAS_X) / (5 - 0);
}

export function VehicleRepresentation({ info }: Props) {
    const meshRef = useRef<Mesh>(null!);
    const valueRef = useRef(info);

    const model = useGLTF("./pod_simplified.glb");

    const [springProps, setSpringProps] = useSpring(() => ({
        positionX: calculatePositionDistance(info.xDistance),
        positionY: calculatePositionYDistance(info.yDistance),
        positionZ: calculatePositionDistance(info.zDistance),
        rotationX: info.xRotation,
        rotationY: info.yRotation,
        rotationZ: info.zRotation,
        config: {
            mass: 1,
            tension: 15,
            friction: 10,
            precision: 0.0001,
        },
    }));

    useEffect(() => {
        valueRef.current = info;
        valueRef.current.xDistance = calculatePositionDistance(info.xDistance);
        valueRef.current.yDistance = calculatePositionYDistance(info.yDistance);
        valueRef.current.zDistance = calculatePositionDistance(info.zDistance);

        setSpringProps({
            positionX: valueRef.current.xDistance,
            positionY: valueRef.current.yDistance,
            positionZ: valueRef.current.zDistance,
            rotationX: valueRef.current.xRotation,
            rotationY: valueRef.current.yRotation,
            rotationZ: valueRef.current.zRotation,
        });
    }, [info]);

    return (
        <animated.mesh
            scale={3}
            ref={meshRef}
            position-x={springProps.positionX}
            position-y={springProps.positionY}
            position-z={springProps.positionZ}
            rotation-x={springProps.rotationX}
            rotation-y={springProps.rotationY}
            rotation-z={springProps.rotationZ}
        >
            <primitive object={model.scene} />
        </animated.mesh>
    );
}
