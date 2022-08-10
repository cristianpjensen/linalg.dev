import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

import { ORIGIN, UP } from "./constants";
import { useMatrixAnimation, useVectorAnimation } from "./hooks";

type IPlaneProps = {
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

	onClick?: () => void;
};

type Plane = {
	/**
	 * Move the position of the plane with interpolation.
	 */
	move: (pt: THREE.Vector3, dir1: THREE.Vector3, dir2: THREE.Vector3) => void;
	/**
	 * Transform the space of the plane with the matrix.
	 */
	transform: (matrix: THREE.Matrix3) => void;
	/**
	 * Reset the plane to its original vector space.
	 */
	reset: () => void;
};

const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);

const Plane = forwardRef<Plane, IPlaneProps>((props, ref) => {
	const {
		point: p,
		direction1: d1,
		direction2: d2,
		color = "#e9e9e9",
		opacity = 0.8,
		onClick,
	} = props;

	const planeRef = useRef<THREE.Mesh>(null);

	const orientation = new THREE.Matrix4();
	const normal = new THREE.Vector3();

	function setPosition(
		point: THREE.Vector3,
		direction1: THREE.Vector3,
		direction2: THREE.Vector3
	) {
		normal.crossVectors(direction1, direction2);

		orientation.lookAt(ORIGIN, normal, UP);
		planeRef.current?.setRotationFromMatrix(orientation);
		planeRef.current?.position.copy(point);
	}

	const [point] = useState({
		source: p.clone(),
		current: p.clone(),
		target: p.clone(),
	});

	const [direction1] = useState({
		source: d1.clone(),
		current: d1.clone(),
		target: d1.clone(),
	});

	const [direction2] = useState({
		source: d2.clone(),
		current: d2.clone(),
		target: d2.clone(),
	});

	const [matrix] = useState({
		source: new THREE.Matrix4(),
		current: new THREE.Matrix4(),
		target: new THREE.Matrix4(),
	});

	const { transform, stopTransformations } = useMatrixAnimation({
		update: (mat) => {
			matrix.current.multiplyMatrices(mat, matrix.source);

			setPosition(
				point.current.clone().applyMatrix4(matrix.current),
				direction1.current.clone().applyMatrix4(matrix.current),
				direction2.current.clone().applyMatrix4(matrix.current)
			);
		},
		start: (mat) => {
			// Keep the target space up to date
			matrix.target.multiplyMatrices(mat, matrix.target);
		},
		end: () => {
			// Set the source to be the target, so that the next transformation starts
			// from there
			matrix.source.copy(matrix.target);

			// Set the positions to be the target, in case the animation did not go to
			// the correct target position
			setPosition(
				point.current.clone().applyMatrix4(matrix.target),
				direction1.current.clone().applyMatrix4(matrix.target),
				direction2.current.clone().applyMatrix4(matrix.target)
			);
		},
	});

	const { move, stopMove } = useVectorAnimation(
		[point.target, direction1.target, direction2.target],
		{
			update: ([p, d1, d2]) => {
				// Keep the positions up to date within the original vector space
				point.current.copy(p);
				direction1.current.copy(d1);
				direction2.current.copy(d2);

				// Set the positions to be in the vector space defined by the matrix
				setPosition(
					point.current.clone().applyMatrix4(matrix.current),
					direction1.current.clone().applyMatrix4(matrix.current),
					direction2.current.clone().applyMatrix4(matrix.current)
				);
			},
			start: ([p, d1, d2]) => {
				// Keep the target position up to date to where they are supposed to be
				point.target.copy(p);
				direction1.target.copy(d1);
				direction2.target.copy(d2);
			},
			end: ([p, d1, d2]) => {
				// Set the source to be the target, so that the next move starts from
				// there
				point.source.copy(p);
				direction1.source.copy(d1);
				direction2.source.copy(d2);
			},
		}
	);

	useImperativeHandle(ref, () => ({
		move: (pt, dir1, dir2) => {
			move([pt, dir1, dir2]);
		},
		transform: (mat) => {
			const m = new THREE.Matrix4().setFromMatrix3(mat);
			transform(m);
		},
		reset: () => {
			stopTransformations();
			stopMove();

			new TWEEN.Tween([
				point.current.clone().applyMatrix4(matrix.current),
				direction1.current.clone().applyMatrix4(matrix.current),
				direction2.current.clone().applyMatrix4(matrix.current),
			])
				.to([point.target, direction1.target, direction2.target], 500)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onUpdate(([p, d1, d2]) => {
					setPosition(p, d1, d2);
				})
				.onStart(() => {
					point.source.copy(point.current);
					direction1.source.copy(direction1.current);
					direction2.source.copy(direction2.current);

					const identityMatrix = new THREE.Matrix4();
					matrix.source.copy(identityMatrix);
					matrix.current.copy(identityMatrix);
					matrix.target.copy(identityMatrix);
				})
				.onComplete(() => {
					point.source.copy(point.target);
					direction1.source.copy(direction1.target);
					direction2.source.copy(direction2.target);
				})
				.start();
		},
	}));

	useEffect(() => {
		setPosition(
			point.current.clone().applyMatrix4(matrix.current),
			direction1.current.clone().applyMatrix4(matrix.current),
			direction2.current.clone().applyMatrix4(matrix.current)
		);
	}, []);

	return (
		<mesh ref={planeRef} geometry={planeGeometry} onClick={onClick}>
			<meshMatcapMaterial
				color={color}
				opacity={opacity}
				transparent
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
});

Plane.displayName = "Plane";

export default Plane;
