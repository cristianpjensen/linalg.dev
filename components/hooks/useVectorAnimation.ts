import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

/**
 * Hook used for updating a position vector. Every time the position vector
 * changes, the hook will run a tween to interpolate the position from the
 * current position. It will stop the active tween and start tweening from where
 * the previous tween left off.
 *
 * @param vector Vector to interpolate on update.
 * @param update Called every frame with the interpolated matrix. The argument
 * is the vector at every step
 * @param start Function to be called at the beginning of the interpolation. The
 * argument is the vector at the end of the interpolation.
 * @param stop Function to be called when vector changes in the middle of the
 * interpolation to another vector. The argument is the vector at the moment of
 * stopping.
 * @param end Function to be called at the end of the interpolation. The
 * argument is the vector at the end of the interpolation.
 */
const useVectorAnimation = <V extends [THREE.Vector3, ...THREE.Vector3[]]>(
	vecs: V,
	functions: {
		update: (vectors: V) => void;
		start?: (vectors: V) => void;
		stop?: (vectors: V) => void;
		end?: (vectors: V) => void;
	}
) => {
	const { update, start, stop, end } = functions;

	const [vectors] = useState(
		vecs.map((v) => ({
			source: v.clone(),
			current: v.clone(),
			target: v.clone(),
		}))
	);

	let tween = new TWEEN.Tween([0] as [number]);

	const move = useCallback((vecs: V) => {
		tween.stop();
		TWEEN.remove(tween);

		const nextTween = new TWEEN.Tween([0] as [number])
			.to([1], 500)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(([t]) => {
				vectors.forEach((vector) => {
					vector.current.lerpVectors(vector.source, vector.target, t);
				});

				update(vectors.map((vec) => vec.current) as V);
			})
			.onStart(() => {
				vectors.forEach((vector, i) => {
					vector.target.copy(vecs[i]);
					vector.source.copy(vector.current);
				});

				start && start(vecs);
			})
			.onStop(() => {
				stop && stop(vectors.map((vec) => vec.current) as V);
			})
			.onComplete(() => {
				vectors.forEach((vector) => {
					vector.source.copy(vector.target);
					vector.current.copy(vector.target);
				});

				end && end(vecs);
			})
			.start();

		tween = nextTween;
	}, []);

	const stopMove = useCallback(() => {
		tween.stop();
		TWEEN.remove(tween);
	}, []);

	return { move, stopMove };
};

export default useVectorAnimation;
