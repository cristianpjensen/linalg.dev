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

type IVectorProps = {
	/**
	 * Numerical representation of the vector.
	 */
	vector: THREE.Vector3;
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
};

type Vector = {
	/**
	 * Move the position of the vector with interpolation. This vector will move
	 * to the position in the space of the total transformations of the vector.
	 */
	move: (origin: THREE.Vector3, vector: THREE.Vector3) => void;
	/**
	 * Transform the space of the vector with the matrix.
	 */
	transform: (matrix: THREE.Matrix3) => void;
	/**
	 * Resets the vector to its original vector space.
	 */
	reset: () => void;
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

const Vector = forwardRef<Vector, IVectorProps>((props, ref) => {
	const {
		vector: v,
		origin: o = ORIGIN,
		color = "#E9E9E9",
		opacity = 1,
		sphere = false,
		onClick,
	} = props;

	const cylinderRef = useRef<THREE.Mesh>(null);
	const coneRef = useRef<THREE.Mesh>(null);
	const sphereRef = useRef<THREE.Mesh>(null);

	const orientation = new THREE.Matrix4();
	const position = new THREE.Vector3();
	function setPosition(origin: THREE.Vector3, vector: THREE.Vector3) {
		const length = vector.length();
		const cylinderVector = vector
			.clone()
			.normalize()
			.multiplyScalar(length - coneHeight);

		const cylinderPosition = cylinderVector
			.clone()
			.divideScalar(2)
			.add(origin);
		const conePosition = vector
			.clone()
			.normalize()
			.multiplyScalar(length - coneHeight / 2)
			.add(origin);

		orientation.lookAt(ORIGIN, vector.clone().multiplyScalar(2), UP);
		const cylinderOrientation = orientation.clone().multiply(X_ROTATION);
		const coneOrientation = orientation.clone().multiply(X_NEG_ROTATION);

		cylinderRef.current?.scale.set(1, length - coneHeight, 1);
		cylinderRef.current?.setRotationFromMatrix(cylinderOrientation);
		cylinderRef.current?.position.copy(cylinderPosition);

		coneRef.current?.setRotationFromMatrix(coneOrientation);
		coneRef.current?.position.copy(conePosition);

		sphereRef.current?.position.copy(position.addVectors(vector, origin));
	}

	const [vector] = useState({
		source: v.clone(),
		current: v.clone(),
		target: v.clone(),
	});
	const [origin] = useState({
		source: o.clone(),
		current: o.clone(),
		target: o.clone(),
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
				origin.current.clone().applyMatrix4(matrix.current),
				vector.current.clone().applyMatrix4(matrix.current)
			);
		},
		start: (mat) => {
			// Keep the target vector space up to date
			matrix.target.multiplyMatrices(mat, matrix.target);
		},
		end: () => {
			// Set the source to be the target, so that the next transformation starts
			// from there
			matrix.source.copy(matrix.target);

			// Set the positions to be the target, in case the animation did not go to
			// the correct target position
			setPosition(
				origin.current.clone().applyMatrix4(matrix.target),
				vector.current.clone().applyMatrix4(matrix.target)
			);
		},
	});

	const { move, stopMove } = useVectorAnimation(
		[origin.target, vector.target],
		{
			update: ([o, v]) => {
				// Keep the origin and vector up to date within the original vector space
				origin.current.copy(o);
				vector.current.copy(v);

				// Set the positions to be in the vector space defined by the matrix
				setPosition(
					origin.current.clone().applyMatrix4(matrix.current),
					vector.current.clone().applyMatrix4(matrix.current)
				);
			},
			start: ([o, v]) => {
				// Keep the target position up to date to where the vector is supposed to
				// be
				origin.target.copy(o);
				vector.target.copy(v);
			},
			end: ([o, v]) => {
				// Set the source to be the target, so that the next move starts from
				// there
				origin.source.copy(o);
				vector.source.copy(v);
			},
		}
	);

	useImperativeHandle(ref, () => ({
		move: (ori, vec) => {
			move([ori, vec]);
		},
		transform: (mat) => {
			const m = new THREE.Matrix4().setFromMatrix3(mat);
			transform(m);
		},
		reset: () => {
			// Stop all animations
			stopTransformations();
			stopMove();

			// Move to original vector space
			new TWEEN.Tween([
				origin.current.clone().applyMatrix4(matrix.current),
				vector.current.clone().applyMatrix4(matrix.current),
			])
				.to([origin.target, vector.target], 500)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onUpdate(([o, v]) => {
					setPosition(o, v);
				})
				.onStart(() => {
					origin.source.copy(origin.current);
					vector.source.copy(vector.current);

					const identityMatrix = new THREE.Matrix4();
					matrix.source.copy(identityMatrix);
					matrix.current.copy(identityMatrix);
					matrix.target.copy(identityMatrix);
				})
				.onComplete(() => {
					origin.source.copy(origin.target);
					vector.source.copy(vector.target);
				})
				.start();
		},
	}));

	useEffect(() => {
		setPosition(
			origin.current.clone().applyMatrix4(matrix.current),
			vector.current.clone().applyMatrix4(matrix.current)
		);
	}, [sphere]);

	const material = new THREE.MeshMatcapMaterial({
		color,
		opacity,
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
				<mesh ref={sphereRef} material={material}>
					<sphereGeometry args={[0.2]} />
				</mesh>
			)}
		</group>
	);
});

Vector.displayName = "Vector";

export default Vector;
