import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

import { Text as TroikaText } from "troika-three-text";
import { isRotationMatrix } from "./matrixProperties";
import { IDENTITYQUATERNION, ORIGIN, DURATION, UP } from "./constants";

export interface PlaneTextProps {
	/**
	 * Displayed text.
	 */
	text: string;
	/**
	 * The text will be displayed at this position.
	 */
	point: THREE.Vector3;
	/**
	 * Direction vector of the plane that the text sits on. The text also runs in
	 * the direction of this vector, so pick it carefully.
	 */
	direction1: THREE.Vector3;
	/**
	 * Direction vector of the plane that the text sits on. The sign of this
	 * vector also determines how the text is rotated in the Z direction, so if
	 * the text is displayed from right-to-left, change the sign of this vector
	 * and it will be set left-to-right.
	 */
	direction2: THREE.Vector3;
	/**
	 * Font size.
	 * @default 1.5
	 */
	size?: number;
	/**
	 * Color.
	 * @default #E9E9E9
	 */
	color?: string;
	/**
	 * Opacity.
	 * @default 1
	 */
	opacity?: number;
}

export type PlaneText = {
	move: (vec: THREE.Vector3) => void;
	transform: (matrix: THREE.Matrix3) => void;
};

export const PlaneText = forwardRef<PlaneText, PlaneTextProps>((props, ref) => {
	const {
		text,
		point: p,
		direction1: d1,
		direction2: d2,
		size = 1.5,
		color = "#E9E9E9",
		opacity = 1,
	} = props;

	const point = p.clone();
	const currentPoint = p.clone();
	const direction1 = d1.clone();
	const currentDirection1 = d1.clone();
	const direction2 = d2.clone();
	const currentDirection2 = d2.clone();

	const [troikaMesh] = useState(() => new TroikaText());
	const meshRef = useRef<THREE.Mesh>(null);

	const orientation = new THREE.Matrix4();
	const rotationMatrix = new THREE.Matrix4();
	const geo = new THREE.PlaneBufferGeometry();
	const plane = new THREE.Mesh(geo);

	function setMesh(
		pnt: THREE.Vector3,
		dir1: THREE.Vector3,
		dir2: THREE.Vector3
	) {
		const n = dir1.clone().cross(dir2);
		orientation.lookAt(ORIGIN, n, UP);
		rotationMatrix.makeRotationZ(dir1.angleTo(UP) + Math.PI / 2);
		orientation.multiply(rotationMatrix);
		plane.setRotationFromMatrix(orientation);

		if (meshRef.current) {
			meshRef.current.rotation.set(
				plane.rotation.x,
				plane.rotation.y,
				plane.rotation.z
			);
			meshRef.current.position.set(pnt.x, pnt.y, pnt.z);
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
		<mesh ref={meshRef}>
			<primitive
				object={troikaMesh}
				font="https://d3bea6zkj5zg2g.cloudfront.net/cmunrm.woff"
				fontSize={size}
				text={text}
				color={color}
				fillOpacity={opacity}
			/>
		</mesh>
	);
});
