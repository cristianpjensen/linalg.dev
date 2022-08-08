import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

import CameraControls from "./helpers/CameraControls";
import type { CameraControls as CameraControlsType } from "./helpers/CameraControls";
import RenderCycler from "./helpers/RenderCycler";
import Grid, { type Grid as GridType } from "./Grid";

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
	 * Show a cube of lines that give reference to where the space is. The line
	 * have a gradient of colors according to the RGB color space.
	 * @default true
	 */
	showCube?: boolean;
}

export type Space = {
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
		showCube = true,
	} = props;

	const cameraRef = useRef<CameraControlsType>(null);
	const gridRef = useRef<GridType>(null);

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
