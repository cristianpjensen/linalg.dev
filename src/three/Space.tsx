import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

import { CameraControls, RenderCycler } from "./helpers";
import Grid from "./Grid";

type ISpaceProps = {
	children?: React.ReactElement | React.ReactElement[];
	/**
	 * The space is gridSize x gridSize x gridSize.
	 */
	gridSize?: number;
	/**
	 * Camera configuration.
	 */
	camera?: any;
	/**
	 * Show a cube of lines that give reference to where the space is. The line
	 * have a gradient of colors according to the RGB color space.
	 * @default true
	 */
	showCube?: boolean;

	style?: React.CSSProperties;
	className?: string;
};

type Space = {
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

const Space = forwardRef<Space, ISpaceProps>((props, ref) => {
	const {
		children,
		gridSize = 20,
		camera = {},
		showCube = true,
		style,
		className,
	} = props;

	const cameraRef = useRef<CameraControls>(null);
	const gridRef = useRef<Grid>(null);

	useImperativeHandle(ref, () => ({
		transform: (M) => {
			gridRef.current?.transform(M);
		},
		reset: () => {
			gridRef.current?.reset();
		},
		moveCamera: (x, y, z) => {
			cameraRef.current?.setLookAt(x, y, z, 0, 0, 0, true);
		},
	}));

	return (
		<Canvas
			dpr={window.devicePixelRatio}
			style={style}
			className={className}
			camera={{
				isPerspectiveCamera: true,
				position: [0, 0, 10],
				far: gridSize * 20,
				up: [0, 0, 1],
				...camera,
			}}
		>
			<ambientLight />

			<Grid ref={gridRef} size={gridSize} showCube={showCube} />

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

Space.displayName = "Space";

export default Space;
