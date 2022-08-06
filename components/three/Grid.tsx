import {
	memo,
	forwardRef,
	useRef,
	useState,
	useCallback,
	useImperativeHandle,
} from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

import { Line } from "./helpers/Line";
import { DURATION } from "./constants";

const gridRange = (min: number, max: number, divisions: number) => {
	const range = max + 1 - min;
	const step = range / (divisions + 1);
	const values = [];
	for (let i = 0; i < divisions + 1; i++) {
		values.push(min + i * step);
	}
	return values;
};

type IGridProps = {
	size: number;
	showCube: boolean;
};

type Grid = {
	transform: (matrix: THREE.Matrix3) => void;
	reset: () => void;
};

const Grid = forwardRef<Grid, IGridProps>((props, ref) => {
	const { size, showCube } = props;

	// The first value is the current position during the animation, the second
	// value is the target position. The second value is necessary because the
	// user might press a transformation in rapid succession.
	const [xhat] = useState({
		source: new THREE.Vector3(1, 0, 0),
		current: new THREE.Vector3(1, 0, 0),
		target: new THREE.Vector3(1, 0, 0),
	});
	const [yhat] = useState({
		source: new THREE.Vector3(0, 1, 0),
		current: new THREE.Vector3(0, 1, 0),
		target: new THREE.Vector3(0, 1, 0),
	});
	const [zhat] = useState({
		source: new THREE.Vector3(0, 0, 1),
		current: new THREE.Vector3(0, 0, 1),
		target: new THREE.Vector3(0, 0, 1),
	});

	const { transform, stopTransformations } = useAnimationMatrix({
		update: (matrix) => {
			xhat.current.copy(xhat.source.clone().applyMatrix4(matrix));
			yhat.current.copy(yhat.source.clone().applyMatrix4(matrix));
			zhat.current.copy(zhat.source.clone().applyMatrix4(matrix));

			setPositions(xhat.current, yhat.current, zhat.current);
		},
		start: (matrix) => {
			// Keep the target position up to date to where the vector should be,
			// given the sum of transformations
			xhat.target.applyMatrix4(matrix);
			yhat.target.applyMatrix4(matrix);
			zhat.target.applyMatrix4(matrix);
		},
		end: () => {
			// Set the source to be the target, so that the next transformation starts
			// from there
			xhat.source.copy(xhat.target);
			yhat.source.copy(yhat.target);
			zhat.source.copy(zhat.target);

			// Set the positions to be the target, in case the animation did not go to
			// the correct target position
			setPositions(xhat.target, yhat.target, zhat.target);
		},
	});

	const reset = useCallback(() => {
		stopTransformations();
		new TWEEN.Tween([xhat.current, yhat.current, zhat.current])
			.to(
				[
					new THREE.Vector3(1, 0, 0),
					new THREE.Vector3(0, 1, 0),
					new THREE.Vector3(0, 0, 1),
				],
				DURATION
			)
			.onUpdate(([x, y, z]) => {
				setPositions(x, y, z);
			})
			.onStart(() => {
				// Keep the target position up to date to where the vector should be,
				// given the sum of transformations
				xhat.target = new THREE.Vector3(1, 0, 0);
				yhat.target = new THREE.Vector3(0, 1, 0);
				zhat.target = new THREE.Vector3(0, 0, 1);
			})
			.onComplete(() => {
				// Set the source to be the target, so that the next transformation starts
				// from there
				xhat.source.copy(xhat.target);
				yhat.source.copy(yhat.target);
				zhat.source.copy(zhat.target);
			})
			.start();
	}, []);

	useImperativeHandle(ref, () => ({
		transform: (matrix) => {
			const matrix4 = new THREE.Matrix4().setFromMatrix3(matrix);
			transform(matrix4);
		},
		reset,
	}));

	//               (x) <- (xLabelRef)
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │ (y)
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │
	// │    │    │    │    │    │    │
	//
	const xLinesRef = useRef<Array<THREE.BufferGeometry | null>>([]);
	const xLabelRef = useRef<THREE.Sprite>(null);

	//                (x)
	// ───────────────────────────────
	//
	// ───────────────────────────────
	//
	// ───────────────────────────────
	//
	// ─────────────────────────────── (y) <- (yLabelRef)
	//
	// ───────────────────────────────
	//
	// ───────────────────────────────
	//
	// ───────────────────────────────
	//
	const yLinesRef = useRef<Array<THREE.BufferGeometry | null>>([]);
	const yLabelRef = useRef<THREE.Sprite>(null);

	//               (z)
	//                │
	//                │
	//                │
	//                │
	//                │
	//                │                (x/y)
	//                │
	//                │
	//                │
	//                │
	//                │
	//
	const zLineRef = useRef<THREE.BufferGeometry>(null);
	const zLabelRef = useRef<THREE.Sprite>(null);

	//                (z)
	//                 │
	//          ┌───── │ ─────────┐
	//        ╱ │      │        ╱ │
	//       ┌─────────────────┐  │
	//       │  │      │       │  │
	// ───── │ ────────┼────── │ ───── (x/y)
	//       │  │      │       │  │
	//       │  ╰───── │ ───── │ ─┘
	//       │ ╱       │       │ ╱
	//       ╰─────────────────┘
	//                 │
	//                 │
	//
	const cubeRef = useRef<THREE.BufferGeometry>(null);

	const setPositions = (
		x: THREE.Vector3,
		y: THREE.Vector3,
		z: THREE.Vector3
	) => {
		//                          (x)
		// x1 -> │    │    │    │    │    │    │    │
		//            │    │    │    │    │    │    │
		//       │    │    │    │    │    │    │    │
		//            │    │    │    │    │    │    │
		//       │  y │    │    │    │    │    │    │
		//          > │  > │  > │  > │  > │  > │  > │ (y)
		//       │    │    │    │    │    │    │    │
		//            │    │    │    │    │    │    │
		//       │    │    │    │    │    │    │    │
		//            │    │    │    │    │    │    │
		// x2 -> │    │    │    │    │    │    │    │
		//
		const x1 = x
			.clone()
			.multiplyScalar(size / 2)
			.add(y.clone().multiplyScalar(-size / 2 - 1));
		const x2 = x
			.clone()
			.multiplyScalar(-size / 2)
			.add(y.clone().multiplyScalar(-size / 2 - 1));
		xLinesRef.current?.forEach((line) => {
			x1.add(y);
			x2.add(y);
			line?.setFromPoints([x1, x2]);
		});
		xLabelRef.current?.position.copy(
			x.clone().multiplyScalar(size / 2 + 0.5)
		);

		//                     (x)
		//       ───────────────────────────────
		//                      ^
		//       ───────────────────────────────
		//                      ^
		//       ───────────────────────────────
		//                      ^
		//       ─────────────────────────────── (y)
		//                      ^
		//       ───────────────────────────────
		//                      ^
		//       ───────────────────────────────
		//                      ^
		//       ───────────────────────────────
		//                      ^ <- x
		// y2 -> ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ <- y1
		//
		const y1 = y
			.clone()
			.multiplyScalar(size / 2)
			.add(x.clone().multiplyScalar(-size / 2 - 1));
		const y2 = y
			.clone()
			.multiplyScalar(-size / 2)
			.add(x.clone().multiplyScalar(-size / 2 - 1));
		yLinesRef.current?.forEach((line) => {
			y1.add(x);
			y2.add(x);
			line?.setFromPoints([y1, y2]);
		});
		yLabelRef.current?.position.copy(
			y.clone().multiplyScalar(size / 2 + 0.5)
		);

		//                z
		//                │ <- z1
		//                │
		//                │
		//                │
		//                │
		//                │                x/y
		//                │
		//                │
		//                │
		//                │
		//                │ <- z2
		//
		const z1 = z.clone().multiplyScalar(size / 2);
		const z2 = z.clone().multiplyScalar(-size / 2);
		zLineRef.current?.setFromPoints([z1, z2]);
		zLabelRef.current?.position.copy(
			z.clone().multiplyScalar(size / 2 + 0.5)
		);

		//                 z
		//                 │
		//         3/13 ── │ ─────── 0/4
		//        ╱ │      │        ╱ │
		//      2/10 ──────────── 1/7 │
		//       │  │      │       │  │
		// ───── │ ────────┼────── │ ───── x
		//       │  │      │       │  │
		//       │12/14 ── │ ───── │ 5/13
		//       │ ╱       │       │ ╱
		//      9/11 ──────────── 6/8
		//                 │
		//                 │
		//
		const xc = x.clone().multiplyScalar(size / 2);
		const xcn = xc.clone().multiplyScalar(-1);
		const yc = y.clone().multiplyScalar(size / 2);
		const ycn = yc.clone().multiplyScalar(-1);
		const zc = z.clone().multiplyScalar(size / 2);
		const zcn = zc.clone().multiplyScalar(-1);

		const c0 = xc.clone().add(yc).add(zc);
		const c1 = xc.clone().add(ycn).add(zc);
		const c2 = xcn.clone().add(ycn).add(zc);
		const c3 = xcn.clone().add(yc).add(zc);
		const c5 = xc.clone().add(yc).add(zcn);
		const c6 = xc.clone().add(ycn).add(zcn);
		const c9 = xcn.clone().add(ycn).add(zcn);
		const c12 = xcn.clone().add(yc).add(zcn);

		// prettier-ignore
		cubeRef.current?.setFromPoints([
			c0, c1, c2, c3, c0, c5, c6, c1,
			c6, c9, c2, c9, c12, c3, c12, c5,
		]);
	};

	// Cube positions
	const xc = xhat.current.clone().multiplyScalar(size / 2);
	const xcn = xc.clone().multiplyScalar(-1);
	const yc = yhat.current.clone().multiplyScalar(size / 2);
	const ycn = yc.clone().multiplyScalar(-1);
	const zc = zhat.current.clone().multiplyScalar(size / 2);
	const zcn = zc.clone().multiplyScalar(-1);

	const c0 = xc.clone().add(yc).add(zc);
	const c1 = xc.clone().add(ycn).add(zc);
	const c2 = xcn.clone().add(ycn).add(zc);
	const c3 = xcn.clone().add(yc).add(zc);
	const c5 = xc.clone().add(yc).add(zcn);
	const c6 = xc.clone().add(ycn).add(zcn);
	const c9 = xcn.clone().add(ycn).add(zcn);
	const c12 = xcn.clone().add(yc).add(zcn);

	const grid = gridRange(-size / 2, size / 2, size);

	return (
		<group>
			<group>
				{grid.map((x) => (
					<>
						<Line
							key={`x-${x}`}
							ref={(line) =>
								(xLinesRef.current[x + Math.round(size / 2)] =
									line)
							}
							points={[
								xhat.current
									.clone()
									.multiplyScalar(size / 2)
									.add(
										yhat.current.clone().multiplyScalar(x)
									),
								xhat.current
									.clone()
									.multiplyScalar(-size / 2)
									.add(
										yhat.current.clone().multiplyScalar(x)
									),
							]}
							color={
								x === 0
									? "rgb(150, 150, 150)"
									: "rgb(80, 80, 80)"
							}
						/>

						<Line
							key={`y-${x}`}
							ref={(line) =>
								(yLinesRef.current[x + Math.round(size / 2)] =
									line)
							}
							points={[
								yhat.current
									.clone()
									.multiplyScalar(size / 2)
									.add(
										xhat.current.clone().multiplyScalar(x)
									),
								yhat.current
									.clone()
									.multiplyScalar(-size / 2)
									.add(
										xhat.current.clone().multiplyScalar(x)
									),
							]}
							color={
								x === 0
									? "rgb(150, 150, 150)"
									: "rgb(80, 80, 80)"
							}
						/>
					</>
				))}

				<Line
					ref={zLineRef}
					points={[
						zhat.current.clone().multiplyScalar(size / 2),
						zhat.current.clone().multiplyScalar(-size / 2),
					]}
					color="rgb(150, 150, 150)"
				/>
			</group>
			<group>
				<AxisLabel
					ref={xLabelRef}
					position={xhat.current
						.clone()
						.multiplyScalar(size / 2 + 0.5)}
					label="x"
				/>
				<AxisLabel
					ref={yLabelRef}
					position={yhat.current
						.clone()
						.multiplyScalar(size / 2 + 0.5)}
					label="y"
				/>
				<AxisLabel
					ref={zLabelRef}
					position={zhat.current
						.clone()
						.multiplyScalar(size / 2 + 0.5)}
					label="z"
				/>
			</group>
			{showCube && (
				<group>
					<Line
						ref={cubeRef}
						// prettier-ignore
						points={[
              c0, c1, c2, c3, c0, c5, c6, c1,
              c6, c9, c2, c9, c12, c3, c12, c5,
            ]}
						color={[
							"white",
							"purple",
							"blue",
							"cyan",
							"white",
							"yellow",
							"red",
							"purple",
							"red",
							"black",
							"blue",
							"black",
							"green",
							"cyan",
							"green",
							"yellow",
						]}
						bias={0.05}
					/>
				</group>
			)}
		</group>
	);
});

type IAxisLabelProps = {
	label: "x" | "y" | "z";
	position: THREE.Vector3;
};

const AxisLabel = forwardRef<THREE.Sprite, IAxisLabelProps>(
	({ position, label }, ref) => {
		const texture = useLoader(THREE.TextureLoader, `/assets/${label}.png`);
		const { gl } = useThree();
		texture.anisotropy = gl.capabilities.getMaxAnisotropy();
		texture.needsUpdate = true;

		useFrame(() => {
			texture.needsUpdate = true;
		});

		const yScale = label === "x" ? 0.79 : label === "y" ? 1.321 : 0.973;

		return (
			<sprite
				ref={ref}
				scale={[0.04, yScale * 0.04, 1]}
				position={position}
			>
				<spriteMaterial
					sizeAttenuation={false}
					opacity={0.6}
					transparent
					map={texture}
					attach="material"
				/>
			</sprite>
		);
	}
);

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
const useAnimationMatrix = (functions: {
	update: (matrix: THREE.Matrix4) => void;
	start?: (matrix: THREE.Matrix4) => void;
	end?: (matrix: THREE.Matrix4) => void;
}): {
	transform: (matrix: THREE.Matrix4) => void;
	stopTransformations: () => void;
} => {
	const tweenStack: Array<TWEEN.Tween<number[]>> = [];

	const { update, start, end } = functions;

	const transform = useCallback((matrix: THREE.Matrix4) => {
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

		const tween = new TWEEN.Tween([0])
			.to([1], DURATION)
			.easing(TWEEN.Easing.Quadratic.InOut);

		// Push to stack
		tweenStack.push(tween);

		tween.onUpdate(([t]) => {
			// Compose the current matrix
			currentMatrix.compose(
				currentTranslation.lerpVectors(zeroVector, translation, t),
				currentRotation.slerpQuaternions(zeroQuaternion, rotation, t),
				currentScale.lerpVectors(onesVector, scale, t)
			);

			// Pass the current matrix to the callback
			update(currentMatrix);
		});

		tween.onComplete(() => {
			end && end(matrix);

			// Remove from stack and start the next one
			tweenStack.shift();
			tweenStack[0] && tweenStack[0].start();
		});

		tween.onStart(() => {
			start && start(matrix);
		});

		// Start the first tween
		if (tweenStack.length === 1) {
			tween.start();
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

export default memo(Grid);
