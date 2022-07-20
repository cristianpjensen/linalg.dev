import React, {
	forwardRef,
	ForwardedRef,
	MutableRefObject,
	useEffect,
	useRef,
} from "react";
import {
	MOUSE,
	Vector2,
	Vector3,
	Vector4,
	Quaternion,
	Matrix4,
	Spherical,
	Box3,
	Sphere,
	Raycaster,
	MathUtils,
} from "three";
import * as THREE from "three";
import {
	ReactThreeFiber,
	extend,
	useFrame,
	useThree,
} from "@react-three/fiber";
import CameraControlsDefault from "camera-controls";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			cameraControlsDefault: ReactThreeFiber.Node<
				CameraControlsDefault,
				typeof CameraControlsDefault
			>;
		}
	}
}

const subsetOfTHREE = {
	MOUSE,
	Vector2,
	Vector3,
	Vector4,
	Quaternion,
	Matrix4,
	Spherical,
	Box3,
	Sphere,
	Raycaster,
	MathUtils: {
		DEG2RAD: MathUtils.DEG2RAD,
		clamp: MathUtils.clamp,
	},
};

CameraControlsDefault.install({ THREE: subsetOfTHREE });
extend({ CameraControlsDefault });

export interface CameraControlsProps {
	camera?: THREE.PerspectiveCamera | THREE.OrthographicCamera;
	enabled?: boolean;
	active?: boolean;
	minDistance?: number;
	maxDistance?: number;
	minZoom?: number;
	maxZoom?: number;
	polarAngle?: number;
	minPolarAngle?: number;
	maxPolarAngle?: number;
	azimuthAngle?: number;
	minAzimuthAngle?: number;
	maxAzimuthAngle?: number;
	boundaryFriction?: number;
	boundaryEnclosesCamera?: boolean;
	dampingFactor?: number;
	draggingDampingFactor?: number;
	azimuthRotateSpeed?: number;
	polarRotateSpeed?: number;
	dollySpeed?: number;
	truckSpeed?: number;
	verticalDragToForward?: boolean;
	dollyToCursor?: boolean;
	colliderMeshes?: Array<THREE.Mesh>;
	infinityDolly?: boolean;
	restThreshold?: number;
}

export default forwardRef<CameraControlsDefault, CameraControlsProps>(
	(props, ref) => {
		const cameraControls = useRef<CameraControlsDefault | null>(null);
		const camera = useThree((state) => state.camera);
		const renderer = useThree((state) => state.gl);

		useFrame((_, delta) => cameraControls.current?.update(delta));
		useEffect(() => () => cameraControls.current?.dispose(), []);

		return (
			<cameraControlsDefault
				ref={mergeRefs<CameraControlsDefault>(cameraControls, ref)}
				args={[camera, renderer.domElement]}
				{...props}
			/>
		);
	}
);

export type CameraControls = CameraControlsDefault;

function mergeRefs<T>(...refs: (MutableRefObject<T> | ForwardedRef<T>)[]) {
	return (instance: T): void => {
		for (let i = 0; i < refs.length; i += 1) {
			const ref = refs[i];
			if (typeof ref === "function") {
				ref(instance);
			} else if (ref) {
				ref.current = instance;
			}
		}
	};
}
