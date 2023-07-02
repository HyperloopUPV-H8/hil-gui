import { animated, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import THREE, { Mesh, MeshPhongMaterial, Vector3 } from "three";

const MAX_YDISTANCE = 22;
const MIN_YDISTANCE = 10;
const MAX_CANVAS_X = 3;

type Props = {
    yDistance: number;
};

function calculatePositionY(yDistance: number) {
    if (yDistance >= 10) {
        return (
            ((yDistance - MIN_YDISTANCE) * MAX_CANVAS_X) /
            (MAX_YDISTANCE - MIN_YDISTANCE)
        );
    } else {
        return 0;
    }
}

export function VehicleRepresentation({ yDistance }: Props) {
    const meshRef = useRef<Mesh>(null!);
    const positionYRef = useRef(calculatePositionY(yDistance));

    const model = useGLTF("./pod_simplified.glb");

    const [springProps, setSpringProps] = useSpring(() => ({
        positionY: 0,
        rotationY: 0,
        //meshRef: meshRef.current,
        config: {
            mass: 1,
            tension: 15,
            friction: 10,
            precision: 0.0001,
        },
    }));

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const timeScale = 2.5;
        const amplitude = 0.1;
        meshRef.current.rotation.y = amplitude * Math.sin(t * timeScale);
        meshRef.current.rotation.z = amplitude * Math.cos(t * timeScale);
        meshRef.current.rotation.x = amplitude * Math.sin(t * timeScale);
        //meshRef.current.rotation.x += 0.01;
    });

    useEffect(() => {
        positionYRef.current = calculatePositionY(yDistance);
        setSpringProps({ positionY: positionYRef.current, rotationY: 2 });
        meshRef.current.rotation.y += 0.5;
    }, [yDistance]);

    return (
        <animated.mesh
            scale={3}
            ref={meshRef}
            position-y={springProps.positionY}
            //rotateY={meshRef.current.rotation.y}
            //rotation={[1, 0, 0]}
        >
            <primitive object={model.scene} />
        </animated.mesh>
    );
}
