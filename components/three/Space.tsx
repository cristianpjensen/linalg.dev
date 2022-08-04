import React, {
	forwardRef,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Canvas } from "@react-three/fiber";

import CameraControls from "./helpers/CameraControls";
import type { CameraControls as CameraControlsType } from "./helpers/CameraControls";
import RenderCycler from "./helpers/RenderCycler";
import { Line } from "./helpers/Line";
import { isRotationMatrix } from "./matrixProperties";
import { Text } from "./Text";
import { IDENTITYQUATERNION, DURATION } from "./constants";

export interface SpaceProps {
	children?: React.ReactElement | React.ReactElement[];
	/**
	 * The space is gridSize x gridSize x gridSize.
	 */
	gridSize?: number;
	/**
	 * Width of the viewport.
	 * @default window.innerWidth
	 */
	width?: number;
	/**
	 * Height of the viewport.
	 * @default window.innerHeight
	 */
	height?: number;
	/**
	 * Background color of the scene.
	 * @default #090909
	 */
	backgroundColor?: string;
	/**
	 * Camera configuration.
	 */
	camera?: any;
	/**
	 * Show the z-axis or not, which may be distracting for certain usecases.
	 * @default true
	 */
	showZAxis?: boolean;
	/**
	 * Show the XZ and YZ planes as grid. Not recommended, but could be useful.
	 * @default false
	 */
	showZPlanes?: boolean;
	/**
	 * Show the axis labels or not, which may be unnecessary and distracting for
	 * certain usecases.
	 * @default true
	 */
	showAxisLabels?: boolean;
	/**
	 * Show a cube of lines that give reference to where the space is. The line
	 * have a gradient of colors according to the RGB color space.
	 * @default true
	 */
	showCube?: boolean;
	/**
	 * Scale of the axis labels, relative to their default size, so some
	 * experimentation may be needed to get the correct size for your usecase.
	 * @default 1
	 */
	axisLabelScale?: number;
	/**
	 * X-axis label text.
	 * @default "x"
	 */
	xLabel?: string;
	/**
	 * Y-axis label text.
	 * @default "y"
	 */
	yLabel?: string;
	/**
	 * Z-axis label text.
	 * @default "z"
	 */
	zLabel?: string;
}

export type Space = {
	/**
	 * Move the camera such that one axis is out of view. This is helpful for when
	 * you want to see the scene in "2 dimensions". For example, after a
	 * transformation with a 2x3 matrix.
	 */
	viewPlane: (plane: "XY" | "YZ" | "XZ") => void;
	/**
	 * Transform the space by a given matrix. This can be helpful for visualizing
	 * what a matrix transformation does to an entire space, instead of just
	 * visualizing a subset of vectors.
	 */
	transform: (matrix: THREE.Matrix3) => void;
	/**
	 * Reset the space to its initial position.
	 */
	reset: () => void;
	/**
	 * Move camera around the origin.
	 */
	moveCamera: (x: number, y: number, z: number) => void;
};

export const Space = forwardRef<Space, SpaceProps>((props, ref) => {
	const {
		children,
		gridSize = 20,
		width = window.innerWidth,
		height = window.innerHeight,
		backgroundColor = "#090909",
		camera = {},
		showZAxis = true,
		showZPlanes = false,
		showAxisLabels = true,
		showCube = true,
		axisLabelScale = 1,
		xLabel = "x",
		yLabel = "y",
		zLabel = "z",
	} = props;

	const cameraRef = useRef<CameraControlsType>(null);
	const gridRef = useRef<Grid>(null);

	useImperativeHandle(ref, () => ({
		viewPlane: (plane) => {
			if (plane === "XY") {
				cameraRef.current?.setLookAt(0, 0, gridSize / 2, 0, 0, 0, true);
			} else if (plane === "YZ") {
				cameraRef.current?.setLookAt(gridSize / 2, 0, 0, 0, 0, 0, true);
			} else if (plane === "XZ") {
				cameraRef.current?.setLookAt(0, gridSize / 2, 0, 0, 0, 0, true);
			}
		},
		transform: (M) => {
			gridRef.current?.transform(M);
		},
		reset: () => {
			gridRef.current?.reset();
		},
		moveCamera: (x, y, z) => {
			cameraRef.current?.setLookAt(x, y, z, 0, 0, 0, true);
		}
	}));

	return (
		<Canvas
			dpr={window.devicePixelRatio}
			style={{ width, height, backgroundColor }}
			camera={{
				isPerspectiveCamera: true,
				position: [0, 0, 10],
				far: gridSize * 20,
				up: [0, 0, 1],
				...camera,
			}}
		>
			<ambientLight />

			<Grid
				ref={gridRef}
				size={gridSize}
				showAxisLabels={showAxisLabels}
				showZAxis={showZAxis}
				showZPlanes={showZPlanes}
				showCube={showCube}
				axisLabelScale={axisLabelScale}
				xLabel={xLabel}
				yLabel={yLabel}
				zLabel={zLabel}
			/>

			<CameraControls
				ref={cameraRef}
				dampingFactor={0.08}
				draggingDampingFactor={0.2}
				minDistance={2}
				maxDistance={4 * gridSize}
			/>

			<RenderCycler />

			{children}
		</Canvas>
	);
});

interface GridProps {
	size: number;
	showAxisLabels: boolean;
	showZAxis: boolean;
	showZPlanes: boolean;
	showCube: boolean;
	axisLabelScale: number;
	xLabel: string;
	yLabel: string;
	zLabel: string;
}

export type Grid = {
	/**
	 * Transform the space.
	 */
	transform: (matrix: THREE.Matrix3) => void;
	/**
	 * Reset the space to its initial position.
	 */
	reset: () => void;
};

export const Grid = forwardRef<Grid, GridProps>((props, ref) => {
	const {
		size,
		showAxisLabels,
		showZAxis,
		showZPlanes,
		showCube,
		axisLabelScale,
		xLabel,
		yLabel,
		zLabel,
	} = props;

	const size2 = size / 2;
	const size4 = size2 / 2;
	const center = Math.floor(size2);

	const xLabelVector = new THREE.Vector3(center + 0.4, 0, 0);
	const yLabelVector = new THREE.Vector3(0, center + 0.4, 0);
	const zLabelVector = new THREE.Vector3(0, 0, center + 0.4);

	const [Mx] = useState(new THREE.Vector3(1, 0, 0));
	const [currentMx] = useState(new THREE.Vector3(1, 0, 0));
	const [My] = useState(new THREE.Vector3(0, 1, 0));
	const [currentMy] = useState(new THREE.Vector3(0, 1, 0));
	const [Mz] = useState(new THREE.Vector3(0, 0, 1));
	const [currentMz] = useState(new THREE.Vector3(0, 0, 1));
	const [xLine1] = useState(new THREE.Vector3(size2, 0, 0));
	const [currentXLine1] = useState(new THREE.Vector3(size2, 0, 0));
	const [xLine2] = useState(new THREE.Vector3(-size2, 0, 0));
	const [currentXLine2] = useState(new THREE.Vector3(-size2, 0, 0));
	const [yLine1] = useState(new THREE.Vector3(0, size2, 0));
	const [currentYLine1] = useState(new THREE.Vector3(0, size2, 0));
	const [yLine2] = useState(new THREE.Vector3(0, -size2, 0));
	const [currentYLine2] = useState(new THREE.Vector3(0, -size2, 0));
	const [zLine1] = useState(new THREE.Vector3(0, 0, size2));
	const [currentZLine1] = useState(new THREE.Vector3(0, 0, size2));
	const [zLine2] = useState(new THREE.Vector3(0, 0, -size2));
	const [currentZLine2] = useState(new THREE.Vector3(0, 0, -size2));

	const [cubeBottom1] = useState(new THREE.Vector3(size4, size4, -size4));
	const [currentCubeBottom1] = useState(cubeBottom1.clone());
	const [cubeBottom2] = useState(new THREE.Vector3(-size4, size4, -size4));
	const [currentCubeBottom2] = useState(cubeBottom2.clone());
	const [cubeBottom3] = useState(new THREE.Vector3(-size4, -size4, -size4));
	const [currentCubeBottom3] = useState(cubeBottom3.clone());
	const [cubeBottom4] = useState(new THREE.Vector3(size4, -size4, -size4));
	const [currentCubeBottom4] = useState(cubeBottom4.clone());
	const [cubeTop1] = useState(new THREE.Vector3(size4, size4, size4));
	const [currentCubeTop1] = useState(cubeTop1.clone());
	const [cubeTop2] = useState(new THREE.Vector3(-size4, size4, size4));
	const [currentCubeTop2] = useState(cubeTop2.clone());
	const [cubeTop3] = useState(new THREE.Vector3(-size4, -size4, size4));
	const [currentCubeTop3] = useState(cubeTop3.clone());
	const [cubeTop4] = useState(new THREE.Vector3(size4, -size4, size4));
	const [currentCubeTop4] = useState(cubeTop4.clone());
	const cubeBias = 0.2;

	const xyLineRefs = useRef<Array<THREE.BufferGeometry | null>>([]);
	const yxLineRefs = useRef<Array<THREE.BufferGeometry | null>>([]);
	const xzLineRefs = useRef<Array<THREE.BufferGeometry | null>>([]);
	const zxLineRefs = useRef<Array<THREE.BufferGeometry | null>>([]);
	const yzLineRefs = useRef<Array<THREE.BufferGeometry | null>>([]);
	const zyLineRefs = useRef<Array<THREE.BufferGeometry | null>>([]);
	const xLabelRef = useRef<Text>(null);
	const yLabelRef = useRef<Text>(null);
	const zLabelRef = useRef<Text>(null);

	const refCubeLeg1 = useRef<THREE.BufferGeometry>(null);
	const refCubeLeg2 = useRef<THREE.BufferGeometry>(null);
	const refCubeLeg3 = useRef<THREE.BufferGeometry>(null);
	const refCubeLeg4 = useRef<THREE.BufferGeometry>(null);
	const refCubeBottom1 = useRef<THREE.BufferGeometry>(null);
	const refCubeBottom2 = useRef<THREE.BufferGeometry>(null);
	const refCubeBottom3 = useRef<THREE.BufferGeometry>(null);
	const refCubeBottom4 = useRef<THREE.BufferGeometry>(null);
	const refCubeTop1 = useRef<THREE.BufferGeometry>(null);
	const refCubeTop2 = useRef<THREE.BufferGeometry>(null);
	const refCubeTop3 = useRef<THREE.BufferGeometry>(null);
	const refCubeTop4 = useRef<THREE.BufferGeometry>(null);

	function setLines(
		x: THREE.Vector3,
		y: THREE.Vector3,
		z: THREE.Vector3,
		xl1: THREE.Vector3,
		xl2: THREE.Vector3,
		yl1: THREE.Vector3,
		yl2: THREE.Vector3,
		zl1: THREE.Vector3,
		zl2: THREE.Vector3,
		cb1: THREE.Vector3,
		cb2: THREE.Vector3,
		cb3: THREE.Vector3,
		cb4: THREE.Vector3,
		ct1: THREE.Vector3,
		ct2: THREE.Vector3,
		ct3: THREE.Vector3,
		ct4: THREE.Vector3
	) {
		xyLineRefs.current?.forEach((line, index) => {
			const multiple = y.clone().multiplyScalar(index - center);
			line?.setFromPoints([
				xl1.clone().add(multiple),
				xl2.clone().add(multiple),
			]);
		});

		yxLineRefs.current?.forEach((line, index) => {
			const multiple = x.clone().multiplyScalar(index - center);
			line?.setFromPoints([
				yl1.clone().add(multiple),
				yl2.clone().add(multiple),
			]);
		});

		refCubeLeg1.current?.setFromPoints([cb1, ct1]);
		refCubeLeg2.current?.setFromPoints([cb2, ct2]);
		refCubeLeg3.current?.setFromPoints([cb3, ct3]);
		refCubeLeg4.current?.setFromPoints([cb4, ct4]);
		refCubeBottom1.current?.setFromPoints([cb1, cb2]);
		refCubeBottom2.current?.setFromPoints([cb2, cb3]);
		refCubeBottom3.current?.setFromPoints([cb3, cb4]);
		refCubeBottom4.current?.setFromPoints([cb4, cb1]);
		refCubeTop1.current?.setFromPoints([ct1, ct2]);
		refCubeTop2.current?.setFromPoints([ct2, ct3]);
		refCubeTop3.current?.setFromPoints([ct3, ct4]);
		refCubeTop4.current?.setFromPoints([ct4, ct1]);

		if (!showZPlanes && showZAxis) {
			zxLineRefs.current[center]?.setFromPoints([zl1, zl2]);
		}

		if (showZPlanes) {
			xzLineRefs.current?.forEach((line, index) => {
				const multiple = z.clone().multiplyScalar(index - center);
				line?.setFromPoints([
					xl1.clone().add(multiple),
					xl2.clone().add(multiple),
				]);
			});

			zxLineRefs.current?.forEach((line, index) => {
				const multiple = x.clone().multiplyScalar(index - center);
				line?.setFromPoints([
					zl1.clone().add(multiple),
					zl2.clone().add(multiple),
				]);
			});

			yzLineRefs.current?.forEach((line, index) => {
				const multiple = z.clone().multiplyScalar(index - center);
				line?.setFromPoints([
					yl1.clone().add(multiple),
					yl2.clone().add(multiple),
				]);
			});

			zyLineRefs.current?.forEach((line, index) => {
				const multiple = y.clone().multiplyScalar(index - center);
				line?.setFromPoints([
					zl1.clone().add(multiple),
					zl2.clone().add(multiple),
				]);
			});
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

				const rotatedMx = Mx.clone().applyQuaternion(currentQuaternion);
				const rotatedMy = My.clone().applyQuaternion(currentQuaternion);
				const rotatedMz = Mz.clone().applyQuaternion(currentQuaternion);

				const rotatedXLine1 = xLine1
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedXLine2 = xLine2
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedYLine1 = yLine1
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedYLine2 = yLine2
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedZLine1 = zLine1
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedZLine2 = zLine2
					.clone()
					.applyQuaternion(currentQuaternion);

				const rotatedCubeBottom1 = cubeBottom1
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedCubeBottom2 = cubeBottom2
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedCubeBottom3 = cubeBottom3
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedCubeBottom4 = cubeBottom4
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedCubeTop1 = cubeTop1
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedCubeTop2 = cubeTop2
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedCubeTop3 = cubeTop3
					.clone()
					.applyQuaternion(currentQuaternion);
				const rotatedCubeTop4 = cubeTop4
					.clone()
					.applyQuaternion(currentQuaternion);

				setLines(
					rotatedMx,
					rotatedMy,
					rotatedMz,
					rotatedXLine1,
					rotatedXLine2,
					rotatedYLine1,
					rotatedYLine2,
					rotatedZLine1,
					rotatedZLine2,
					rotatedCubeBottom1,
					rotatedCubeBottom2,
					rotatedCubeBottom3,
					rotatedCubeBottom4,
					rotatedCubeTop1,
					rotatedCubeTop2,
					rotatedCubeTop3,
					rotatedCubeTop4
				);
			})
			.onComplete(() => {
				setLines(
					currentMx,
					currentMy,
					currentMz,
					currentXLine1,
					currentXLine2,
					currentYLine1,
					currentYLine2,
					currentZLine1,
					currentZLine2,
					currentCubeBottom1,
					currentCubeBottom2,
					currentCubeBottom3,
					currentCubeBottom4,
					currentCubeTop1,
					currentCubeTop2,
					currentCubeTop3,
					currentCubeTop4
				);
			})
			.start();
	}

	function move(
		x: THREE.Vector3,
		y: THREE.Vector3,
		z: THREE.Vector3,
		xl1: THREE.Vector3,
		xl2: THREE.Vector3,
		yl1: THREE.Vector3,
		yl2: THREE.Vector3,
		zl1: THREE.Vector3,
		zl2: THREE.Vector3,
		cb1: THREE.Vector3,
		cb2: THREE.Vector3,
		cb3: THREE.Vector3,
		cb4: THREE.Vector3,
		ct1: THREE.Vector3,
		ct2: THREE.Vector3,
		ct3: THREE.Vector3,
		ct4: THREE.Vector3
	) {
		new TWEEN.Tween([
			Mx,
			My,
			Mz,
			xLine1,
			xLine2,
			yLine1,
			yLine2,
			zLine1,
			zLine2,
			cubeBottom1,
			cubeBottom2,
			cubeBottom3,
			cubeBottom4,
			cubeTop1,
			cubeTop2,
			cubeTop3,
			cubeTop4,
		])
			.to(
				[
					x,
					y,
					z,
					xl1,
					xl2,
					yl1,
					yl2,
					zl1,
					zl2,
					cb1,
					cb2,
					cb3,
					cb4,
					ct1,
					ct2,
					ct3,
					ct4,
				],
				DURATION
			)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				setLines(
					Mx,
					My,
					Mz,
					xLine1,
					xLine2,
					yLine1,
					yLine2,
					zLine1,
					zLine2,
					cubeBottom1,
					cubeBottom2,
					cubeBottom3,
					cubeBottom4,
					cubeTop1,
					cubeTop2,
					cubeTop3,
					cubeTop4
				);
			})
			.start();
	}

	const initializeAnimation = () => {
		Mx.copy(currentMx);
		My.copy(currentMy);
		Mz.copy(currentMz);
		xLine1.copy(currentXLine1);
		xLine2.copy(currentXLine2);
		yLine1.copy(currentYLine1);
		yLine2.copy(currentYLine2);
		zLine1.copy(currentZLine1);
		zLine2.copy(currentZLine2);
		cubeBottom1.copy(currentCubeBottom1);
		cubeBottom2.copy(currentCubeBottom2);
		cubeBottom3.copy(currentCubeBottom3);
		cubeBottom4.copy(currentCubeBottom4);
		cubeTop1.copy(currentCubeTop1);
		cubeTop2.copy(currentCubeTop2);
		cubeTop3.copy(currentCubeTop3);
		cubeTop4.copy(currentCubeTop4);
	};

	useImperativeHandle(ref, () => ({
		transform: (mat) => {
			initializeAnimation();

			currentMx.applyMatrix3(mat);
			currentMy.applyMatrix3(mat);
			currentMz.applyMatrix3(mat);
			currentXLine1.applyMatrix3(mat);
			currentXLine2.applyMatrix3(mat);
			currentYLine1.applyMatrix3(mat);
			currentYLine2.applyMatrix3(mat);
			currentZLine1.applyMatrix3(mat);
			currentZLine2.applyMatrix3(mat);
			currentCubeBottom1.applyMatrix3(mat);
			currentCubeBottom2.applyMatrix3(mat);
			currentCubeBottom3.applyMatrix3(mat);
			currentCubeBottom4.applyMatrix3(mat);
			currentCubeTop1.applyMatrix3(mat);
			currentCubeTop2.applyMatrix3(mat);
			currentCubeTop3.applyMatrix3(mat);
			currentCubeTop4.applyMatrix3(mat);

			xLabelRef.current?.transform(mat);
			yLabelRef.current?.transform(mat);
			zLabelRef.current?.transform(mat);

			if (isRotationMatrix(mat)) {
				rotate(mat);
			} else {
				move(
					currentMx,
					currentMy,
					currentMz,
					currentXLine1,
					currentXLine2,
					currentYLine1,
					currentYLine2,
					currentZLine1,
					currentZLine2,
					currentCubeBottom1,
					currentCubeBottom2,
					currentCubeBottom3,
					currentCubeBottom4,
					currentCubeTop1,
					currentCubeTop2,
					currentCubeTop3,
					currentCubeTop4
				);
			}
		},
		reset: () => {
			initializeAnimation();
			const size2 = size / 2;
			const size4 = size2 / 2;

			currentMx.copy(new THREE.Vector3(1, 0, 0));
			currentMy.copy(new THREE.Vector3(0, 1, 0));
			currentMz.copy(new THREE.Vector3(0, 0, 1));
			currentXLine1.copy(new THREE.Vector3(size2, 0, 0));
			currentXLine2.copy(new THREE.Vector3(-size2, 0, 0));
			currentYLine1.copy(new THREE.Vector3(0, size2, 0));
			currentYLine2.copy(new THREE.Vector3(0, -size2, 0));
			currentZLine1.copy(new THREE.Vector3(0, 0, size2));
			currentZLine2.copy(new THREE.Vector3(0, 0, -size2));

			currentCubeBottom1.copy(new THREE.Vector3(size4, size4, -size4));
			currentCubeBottom2.copy(new THREE.Vector3(-size4, size4, -size4));
			currentCubeBottom3.copy(new THREE.Vector3(-size4, -size4, -size4));
			currentCubeBottom4.copy(new THREE.Vector3(size4, -size4, -size4));
			currentCubeTop1.copy(new THREE.Vector3(size4, size4, size4));
			currentCubeTop2.copy(new THREE.Vector3(-size4, size4, size4));
			currentCubeTop3.copy(new THREE.Vector3(-size4, -size4, size4));
			currentCubeTop4.copy(new THREE.Vector3(size4, -size4, size4));

			xLabelRef.current?.move(new THREE.Vector3(center + 0.4, 0, 0));
			yLabelRef.current?.move(new THREE.Vector3(0, center + 0.4, 0));
			zLabelRef.current?.move(new THREE.Vector3(0, 0, center + 0.4));

			move(
				currentMx,
				currentMy,
				currentMz,
				currentXLine1,
				currentXLine2,
				currentYLine1,
				currentYLine2,
				currentZLine1,
				currentZLine2,
				currentCubeBottom1,
				currentCubeBottom2,
				currentCubeBottom3,
				currentCubeBottom4,
				currentCubeTop1,
				currentCubeTop2,
				currentCubeTop3,
				currentCubeTop4
			);
		},
	}));

	const gridRange: Array<number> = Array.from(
		{ length: size + 1 },
		(_, k) => k - center
	);

	return (
		<>
			{/* XY plane */}
			{gridRange.map((x) => (
				<>
					<Line
						key={`xy-${x}`}
						ref={(line) => (xyLineRefs.current[x + center] = line)}
						points={[
							xLine1.clone().add(My.clone().multiplyScalar(x)),
							xLine2.clone().add(My.clone().multiplyScalar(x)),
						]}
						color={
							x === 0 ? "rgb(150, 150, 150)" : "rgb(80, 80, 80)"
						}
					/>

					<Line
						key={`yx-${x}`}
						ref={(line) => (yxLineRefs.current[x + center] = line)}
						points={[
							yLine1.clone().add(Mx.clone().multiplyScalar(x)),
							yLine2.clone().add(Mx.clone().multiplyScalar(x)),
						]}
						color={
							x === 0 ? "rgb(150, 150, 150)" : "rgb(80, 80, 80)"
						}
					/>
				</>
			))}

			{/* Axis labels */}
			{showAxisLabels && (
				<>
					<Text
						ref={xLabelRef}
						text={xLabel}
						position={xLabelVector}
						scale={axisLabelScale}
						sizeAttenuation={false}
					/>
					<Text
						ref={yLabelRef}
						text={yLabel}
						position={yLabelVector}
						scale={axisLabelScale}
						sizeAttenuation={false}
					/>
				</>
			)}

			{/* Y axis */}
			{showZAxis && !showZPlanes && (
				<>
					<Line
						ref={(line) => (zxLineRefs.current[center] = line)}
						points={[zLine1, zLine2]}
						color="rgb(80, 80, 80)"
					/>
					<Text
						ref={zLabelRef}
						text={zLabel}
						position={zLabelVector}
						scale={axisLabelScale}
						sizeAttenuation={false}
					/>
				</>
			)}

			{showZPlanes && (
				<>
					{/* XZ plane */}
					{gridRange.map((x) => (
						<>
							<Line
								key={`xz-${x}`}
								ref={(line) =>
									(xzLineRefs.current[x + center] = line)
								}
								points={[
									xLine1
										.clone()
										.add(Mz.clone().multiplyScalar(x)),
									xLine2
										.clone()
										.add(Mz.clone().multiplyScalar(x)),
								]}
								color={
									x === 0
										? "rgb(150, 150, 150)"
										: "rgb(80, 80, 80)"
								}
							/>

							<Line
								key={`zx-${x}`}
								ref={(line) =>
									(zxLineRefs.current[x + center] = line)
								}
								points={[
									zLine1
										.clone()
										.add(Mx.clone().multiplyScalar(x)),
									zLine2
										.clone()
										.add(Mx.clone().multiplyScalar(x)),
								]}
								color={
									x === 0
										? "rgb(150, 150, 150)"
										: "rgb(80, 80, 80)"
								}
							/>
						</>
					))}

					{/* YZ plane */}
					{gridRange.map((x) => (
						<>
							<Line
								key={`yz-${x}`}
								ref={(line) =>
									(yzLineRefs.current[x + center] = line)
								}
								points={[
									yLine1
										.clone()
										.add(Mz.clone().multiplyScalar(x)),
									yLine2
										.clone()
										.add(Mz.clone().multiplyScalar(x)),
								]}
								color={
									x === 0
										? "rgb(150, 150, 150)"
										: "rgb(80, 80, 80)"
								}
							/>

							<Line
								key={`zy-${x}`}
								ref={(line) =>
									(zyLineRefs.current[x + center] = line)
								}
								points={[
									zLine1
										.clone()
										.add(My.clone().multiplyScalar(x)),
									zLine2
										.clone()
										.add(My.clone().multiplyScalar(x)),
								]}
								color={
									x === 0
										? "rgb(150, 150, 150)"
										: "rgb(80, 80, 80)"
								}
							/>

							<Text
								ref={zLabelRef}
								text={zLabel}
								position={zLabelVector}
								scale={axisLabelScale}
								sizeAttenuation={false}
							/>
						</>
					))}
				</>
			)}

			{showCube && (
				<>
					<Line
						ref={refCubeLeg1}
						points={[cubeBottom1, cubeTop1]}
						color={["blue", "cyan"]}
						bias={cubeBias}
					/>
					<Line
						ref={refCubeLeg2}
						points={[cubeBottom2, cubeTop2]}
						color={["purple", "white"]}
						bias={cubeBias}
					/>
					<Line
						ref={refCubeLeg3}
						points={[cubeBottom3, cubeTop3]}
						color={["red", "yellow"]}
						bias={cubeBias}
					/>
					<Line
						ref={refCubeLeg4}
						points={[cubeBottom4, cubeTop4]}
						color={["black", "green"]}
						bias={cubeBias}
					/>

					<Line
						ref={refCubeBottom1}
						points={[cubeBottom1, cubeBottom2]}
						color={["blue", "purple"]}
						bias={cubeBias}
					/>
					<Line
						ref={refCubeBottom2}
						points={[cubeBottom2, cubeBottom3]}
						color={["purple", "red"]}
						bias={cubeBias}
					/>
					<Line
						ref={refCubeBottom3}
						points={[cubeBottom3, cubeBottom4]}
						color={["red", "black"]}
						bias={cubeBias}
					/>
					<Line
						ref={refCubeBottom4}
						points={[cubeBottom4, cubeBottom1]}
						color={["black", "blue"]}
						bias={cubeBias}
					/>

					<Line
						ref={refCubeTop1}
						points={[cubeTop1, cubeTop2]}
						color={["white", "cyan"]}
						bias={cubeBias}
					/>

					<Line
						ref={refCubeTop2}
						points={[cubeTop2, cubeTop3]}
						color={["cyan", "yellow"]}
						bias={cubeBias}
					/>

					<Line
						ref={refCubeTop3}
						points={[cubeTop3, cubeTop4]}
						color={["yellow", "green"]}
						bias={cubeBias}
					/>

					<Line
						ref={refCubeTop4}
						points={[cubeTop4, cubeTop1]}
						color={["green", "cyan"]}
						bias={cubeBias}
					/>
				</>
			)}
		</>
	);
});
