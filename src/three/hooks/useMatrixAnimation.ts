import { useCallback } from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

/**
 * Hook for interpolating a matrix transformation. The hook keeps track of a
 * stack of tweens, and makes sure that the tweens are executed in order. This
 * way there are no conflicts between the tweens. The transformations look more
 * pleasing, since the user is able to see the transformations they specified in
 * the order of the commands, rather than immediately after the command, which
 * could potentially be conflicting with other commands.
 *
 * A stop function is also returned, which stops all tweens and empties the
 * stack. This is used to reset the stack.
 *
 * @param update Called every frame with the interpolated matrix.
 * @param start Function to be called at the beginning of the interpolation.
 * @param end Function to be called at the end of the interpolation.
 * @returns Transformation and stop function.
 */
const useMatrixAnimation = (functions: {
	update: (matrix: THREE.Matrix4) => void;
	start?: (matrix: THREE.Matrix4) => void;
	end?: (matrix: THREE.Matrix4) => void;
}): {
	transform: (matrix: THREE.Matrix4) => void;
	stopTransformations: () => void;
} => {
	const tweenStack: Array<TWEEN.Tween<number[]>> = [];

	const { update, start, end } = functions;

	const createTween = useCallback(
		(matrix: THREE.Matrix4, onUpdate: (t: number) => THREE.Matrix4) => {
			const tween = new TWEEN.Tween([0] as [number])
				.to([1], 500)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onUpdate(([t]) => {
					const currentMatrix = onUpdate(t);
					update(currentMatrix);
				})
				.onComplete(() => {
					end && end(matrix);

					// Remove from stack and start the next one
					tweenStack.shift();
					tweenStack[0] && tweenStack[0].start();
				})
				.onStart(() => {
					start && start(matrix);
				});

			// Push to stack
			tweenStack.push(tween);

			// Start the first tween
			if (tweenStack.length === 1) {
				tween.start();
			}

			return tween;
		},
		[]
	);

	/**
	 * Interpolates the rotation, scale, and translation of the matrix. This
	 * function does not work with shears, because the shear cannot be
	 * reconstructed by decomposing and recomposing into rotation, scale, and
	 * translation.
	 */
	const transformNoShear = useCallback((matrix: THREE.Matrix4) => {
		const translation = new THREE.Vector3();
		const rotation = new THREE.Quaternion();
		const scale = new THREE.Vector3();

		// Decompose matrix into translation, rotation, and scale
		matrix.decompose(translation, rotation, scale);

		// Define these, such that we do not need to create new vectors every frame
		const zeroVector = new THREE.Vector3();
		const onesVector = new THREE.Vector3(1, 1, 1);
		const zeroQuaternion = new THREE.Quaternion();

		const currentMatrix = new THREE.Matrix4();
		const currentTranslation = new THREE.Vector3();
		const currentRotation = new THREE.Quaternion();
		const currentScale = new THREE.Vector3();

		createTween(matrix, (t) => {
			// Compose the current matrix
			currentMatrix.compose(
				currentTranslation.lerpVectors(zeroVector, translation, t),
				currentRotation.slerpQuaternions(zeroQuaternion, rotation, t),
				currentScale.lerpVectors(onesVector, scale, t)
			);

			return currentMatrix;
		});
	}, []);

	const transformShear = useCallback((matrix: THREE.Matrix4) => {
		const x = new THREE.Vector3();
		const y = new THREE.Vector3();
		const z = new THREE.Vector3();

		matrix.extractBasis(x, y, z);

		const xhat = new THREE.Vector3(1, 0, 0);
		const yhat = new THREE.Vector3(0, 1, 0);
		const zhat = new THREE.Vector3(0, 0, 1);

		const currentX = new THREE.Vector3();
		const currentY = new THREE.Vector3();
		const currentZ = new THREE.Vector3();
		const currentMatrix = new THREE.Matrix4();

		createTween(matrix, (t) => {
			currentX.lerpVectors(xhat, x, t);
			currentY.lerpVectors(yhat, y, t);
			currentZ.lerpVectors(zhat, z, t);
			currentMatrix.makeBasis(currentX, currentY, currentZ);

			return currentMatrix;
		});
	}, []);

	const transform = useCallback((matrix: THREE.Matrix4) => {
		const translation = new THREE.Vector3();
		const rotation = new THREE.Quaternion();
		const scale = new THREE.Vector3();

		// Decompose matrix into translation, rotation, and scale
		matrix.decompose(translation, rotation, scale);
		const recomposedMatrix = new THREE.Matrix4();
		recomposedMatrix.compose(translation, rotation, scale);

		if (
			equalsMatrices(matrix, recomposedMatrix) &&
			matrix.determinant() !== 0
		) {
			transformNoShear(matrix);
		} else {
			transformShear(matrix);
		}
	}, []);

	const stopTransformations = useCallback(() => {
		// Remove all animations from the stack and stop them
		while (tweenStack.length > 0) {
			tweenStack.pop()?.stop();
		}
	}, []);

	return { transform, stopTransformations };
};

const equalsMatrices = (a: THREE.Matrix4, b: THREE.Matrix4) => {
	for (let i = 0; i < 16; i++) {
		if (Math.abs(a.elements[i] - b.elements[i]) > 1e-4) {
			return false;
		}
	}

	return true;
};

export default useMatrixAnimation;
