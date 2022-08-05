import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

import { isRotationMatrix } from "./matrixProperties";
import { IDENTITYQUATERNION, ORIGIN, UP, DURATION } from "./constants";

export interface VectorProps {
	/**
	 * Numerical representation of the vector.
	 */
	vector: THREE.Vector3;
	/**
	 * Vector name. Can get messy.
	 * @default ""
	 */
	text?: string;
	/**
	 * Displacement of the vector, which can be seen as the new origin of the
	 * vector.
	 * @default [0,0,0] (origin of the space)
	 */
	origin?: THREE.Vector3;
	/**
	 * Color of the object.
	 * @default #E9E9E9
	 */
	color?: string;
	/**
	 * Opacity of the object.
	 */
	opacity?: number;
	/**
	 * Represent the vector by a sphere.
	 */
	sphere?: boolean;
	/**
	 * On click event.
	 */
	onClick?: () => void;
}

export type Vector = {
	/**
	 * Move the position of the vector with interpolation.
	 */
	move: (vec: THREE.Vector3) => void;
	/**
	 * Transform vector with matrix. This checks whether the transformation is a
	 * rotation or not and performs the interpolation as a rotation if
	 * appropriate.
	 */
	transform: (matrix: THREE.Matrix3) => void;
	/**
	 * Move origin.
	 */
	moveOrigin: (vec: THREE.Vector3) => void;
};

const X_ROTATION = new THREE.Matrix4().makeRotationX(Math.PI / 2);
const X_NEG_ROTATION = new THREE.Matrix4().makeRotationX(-Math.PI / 2);

const radius = 0.1;
const coneHeight = radius * 5;
const cylinderGeometry = new THREE.CylinderBufferGeometry(
	radius,
	radius,
	1,
	16,
	1,
	false
);
const coneGeometry = new THREE.ConeBufferGeometry(
	radius * 2,
	coneHeight,
	24,
	1
);

export const Vector = forwardRef<Vector, VectorProps>((props, ref) => {
	const {
		vector: v,
		text,
		origin: o = ORIGIN,
		color = "#E9E9E9",
		opacity = 1,
		sphere = false,
		onClick,
	} = props;

	const cylinderRef = useRef<THREE.Mesh>(null);
	const coneRef = useRef<THREE.Mesh>(null);
	const sphereRef = useRef<THREE.Mesh>(null);

	const [vector] = useState(v.clone());
	const [origin] = useState(o.clone());
	const [currentVector] = useState(v.clone());
	const [currentOrigin] = useState(o.clone());
	const orientation = new THREE.Matrix4();

	function setMeshes(ori: THREE.Vector3, vec: THREE.Vector3) {
		const length = vec.length();
		const cylinderVector = vec
			.clone()
			.normalize()
			.multiplyScalar(length - coneHeight);

		const cylinderPosition = cylinderVector
			.clone()
			.divideScalar(2)
			.add(ori);
		const conePosition = vec
			.clone()
			.normalize()
			.multiplyScalar(length - coneHeight / 2)
			.add(ori);

		orientation.lookAt(ORIGIN, vec.clone().multiplyScalar(2), UP);
		const cylinderOrientation = orientation.clone().multiply(X_ROTATION);
		const coneOrientation = orientation.clone().multiply(X_NEG_ROTATION);

		cylinderRef.current?.scale.set(1, length - coneHeight, 1);
		cylinderRef.current?.setRotationFromMatrix(cylinderOrientation);
		cylinderRef.current?.position.copy(cylinderPosition);

		coneRef.current?.setRotationFromMatrix(coneOrientation);
		coneRef.current?.position.copy(conePosition);

		sphereRef.current?.position.copy(vec.clone().add(ori));
	}

	function rotate(mat: THREE.Matrix3) {
		const mat4 = new THREE.Matrix4().setFromMatrix3(mat);
		const quaternion = new THREE.Quaternion().setFromRotationMatrix(mat4);

		const currentQuaternion = new THREE.Quaternion();
		const t = { value: 0 };
		new TWEEN.Tween(t)
			.to({ value: 1 }, DURATION)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				currentQuaternion.slerpQuaternions(
					IDENTITYQUATERNION,
					quaternion,
					t.value
				);

				const rotatedOrigin = origin
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedVector = vector
					.clone()
					.applyQuaternion(currentQuaternion);

				setMeshes(rotatedOrigin, rotatedVector);
			})
			.onComplete(() => {
				setMeshes(currentOrigin, currentVector);
			})
			.start();
	}

	function moveVector(ori: THREE.Vector3, vec: THREE.Vector3) {
		new TWEEN.Tween([origin, vector])
			.to([ori, vec], DURATION)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				setMeshes(origin, vector);
			})
			.start();
	}

	useImperativeHandle(ref, () => ({
		move: (vec) => {
			vector.copy(currentVector);
			currentVector.copy(vec);

			moveVector(currentOrigin, vec);
		},
		transform: (mat) => {
			vector.copy(currentVector);
			origin.copy(currentOrigin);
			currentVector.applyMatrix3(mat);
			currentOrigin.applyMatrix3(mat);

			if (isRotationMatrix(mat)) {
				rotate(mat);
			} else {
				moveVector(currentOrigin, currentVector);
			}
		},
		moveOrigin: (vec) => {
			origin.copy(currentOrigin);
			currentOrigin.copy(vec);

			moveVector(vec, currentVector);
		},
	}));

	useEffect(() => {
		setMeshes(currentOrigin, currentVector);
	}, [sphere]);

	const material = new THREE.MeshMatcapMaterial({
		color,
		opacity: opacity,
		transparent: true,
	});

	return (
		<group onClick={onClick}>
			{sphere || (
				<>
					<mesh
						ref={cylinderRef}
						material={material}
						geometry={cylinderGeometry}
					/>
					<mesh
						ref={coneRef}
						material={material}
						geometry={coneGeometry}
					/>
				</>
			)}

			{sphere && (
				<mesh ref={sphereRef} position={vector} material={material}>
					<sphereGeometry args={[0.2]} />
				</mesh>
			)}
		</group>
	);
});
