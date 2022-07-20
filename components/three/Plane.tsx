import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

import { IDENTITYQUATERNION, ORIGIN, DURATION, UP } from "./constants";
import { isRotationMatrix } from "./matrixProperties";

export interface PlaneProps {
	/**
	 * Any point on the plane. This will be the middle point of the visualized
	 * plane, but in reality the plane is infinitely big.
	 */
	point: THREE.Vector3;
	/**
	 * Point on the plane that is not the origin.
	 */
	direction1: THREE.Vector3;
	/**
	 * Point on the plane that is not equal to ``direction1`` or the origin.
	 */
	direction2: THREE.Vector3;
	/**
	 * Color of the object.
	 * @default #E9E9E9
	 */
	color?: string;
	/**
	 * Opacity of the object.
	 * @default 0.8
	 */
	opacity?: number;
}

export type Plane = {
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
};

const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);

export const Plane = forwardRef<Plane, PlaneProps>((props, ref) => {
	const {
		point: p,
		direction1: d1,
		direction2: d2,
		color = "#e9e9e9",
		opacity = 0.8,
	} = props;

	const refPlane = useRef<THREE.Mesh>(null);

	const point = p.clone();
	const direction1 = d1.clone();
	const direction2 = d2.clone();
	const currentPoint = p.clone();
	const currentDirection1 = d1.clone();
	const currentDirection2 = d2.clone();
	const orientation = new THREE.Matrix4();

	function setMesh(
		pt: THREE.Vector3,
		dir1: THREE.Vector3,
		dir2: THREE.Vector3
	) {
		const normal = dir1.clone().cross(dir2);

		if (refPlane.current) {
			orientation.lookAt(ORIGIN, normal, UP);
			refPlane.current.setRotationFromMatrix(orientation);
			refPlane.current.position.copy(pt);
		}
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

				const rotatedPoint = point
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedDirection1 = direction1
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedDirection2 = direction2
					.clone()
					.applyQuaternion(currentQuaternion);

				setMesh(rotatedPoint, rotatedDirection1, rotatedDirection2);
			})
			.start();
	}

	function move(
		vec: THREE.Vector3,
		dir1: THREE.Vector3,
		dir2: THREE.Vector3
	) {
		new TWEEN.Tween([point, direction1, direction2])
			.to([vec, dir1, dir2], DURATION)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				setMesh(point, direction1, direction2);
			})
			.onComplete(() => {
				setMesh(currentPoint, currentDirection1, currentDirection2);
			})
			.start();
	}

	useImperativeHandle(ref, () => ({
		move: (vec) => {
			point.copy(currentPoint);
			currentPoint.copy(vec);

			move(vec, currentDirection1, currentDirection2);
		},
		transform: (mat) => {
			point.copy(currentPoint);
			direction1.copy(currentDirection1);
			direction2.copy(currentDirection2);
			currentPoint.applyMatrix3(mat);
			currentDirection1.applyMatrix3(mat);
			currentDirection2.applyMatrix3(mat);

			if (isRotationMatrix(mat)) {
				rotate(mat);
			} else {
				move(currentPoint, currentDirection1, currentDirection2);
			}
		},
	}));

	useEffect(() => {
		setMesh(point, direction1, direction2);
	}, []);

	return (
		<mesh ref={refPlane} geometry={planeGeometry}>
			<meshMatcapMaterial
				color={color}
				opacity={opacity}
				transparent
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
});
