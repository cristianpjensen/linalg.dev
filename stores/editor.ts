import create from "zustand";
import * as THREE from "three";

import { Node } from "react-flow-renderer/nocss";

export enum Tool {
	Select = "Select",
	Hand = "Hand",
	Vector = "Vector",
	Matrix = "Matrix",
	Constant = "Constant",
	Slider = "Slider",
	UnaryOperation = "Unary operation",
	BinaryOperation = "Binary operation",
	Eigenvalues = "Eigenvalues",
	Eigenvectors = "Eigenvectors",
	Transpose = "Transpose",
	MatrixMultiplication = "Matrix multiplication",
	Norm = "Norm",
	VectorScaling = "Vector scaling",
	Transformed = "Transform",
}

type EditorState = {
	/**
	 * Currently equipped tool. This is the tool that is used to create new
	 * nodes and manipulate existing ondes.
	 */
	tool: Tool;
	setTool: (tool: Tool) => void;

	/**
	 * 1 / n is how much width of the screen real estate goes to the vector
	 * space in the editor. 1e99 = infinity.
	 */
	vectorSpaceSize: 1 | 2 | 3 | 4 | 1e99;
	setVectorSpaceSize: (vectorSpaceSize: 1 | 2 | 3 | 4 | 1e99) => void;

	/**
	 * The current total transformation of the space.
	 */
	matrix: THREE.Matrix3;
	transform: (matrix: THREE.Matrix3) => void;

	/**
	 * Helper function for resetting the space, since an inverse is not always
	 * possible.
	 */
	isMatrixReset: boolean;
	resetMatrix: () => void;

	/**
	 * Shows a colorful cube that gives a good reference for transformations.
	 */
	showCube: boolean;
	toggleShowCube: () => void;

	/**
	 * React flow does have a selected property on all nodes, but in this
	 * application we only want to move the camera to a vector if it is the only
	 * node selected. This is impossible to do with the selected property, so
	 * this variable will be used for it.
	 */
	selectedVectorNode: Node | null;

	/**
	 * This variable is used for determining where the selection took place. If
	 * the selection took place in the vector space, we want to move the editor
	 * viewport to the node of the vector. If the selection took place in the
	 * node editor, we want to move the camera toward the vector in the vector
	 * space.
	 */
	selectedVectorFrom: "space" | "editor" | null;
	setSelectedVectorNode: (
		node: Node | null,
		selectedVectorFrom: "space" | "editor" | null
	) => void;
};

const useStore = create<EditorState>((set) => ({
	tool: Tool.Hand,
	setTool: (tool: Tool) => set({ tool }),
	vectorSpaceSize: 3,
	setVectorSpaceSize: (vectorSpaceSize) => set({ vectorSpaceSize }),
	matrix: new THREE.Matrix3(),
	transform: (matrix: THREE.Matrix3) =>
		set((state) => ({
			matrix: state.matrix.multiply(matrix),
			isMatrixReset: false,
		})),
	isMatrixReset: false,
	resetMatrix: () =>
		set((state) => ({
			matrix: state.matrix.identity(),
			isMatrixReset: true,
		})),
	showCube: false,
	toggleShowCube: () => set((state) => ({ showCube: !state.showCube })),
	selectedVectorNode: null,
	selectedVectorFrom: null,
	setSelectedVectorNode: (node, from) =>
		set({ selectedVectorNode: node, selectedVectorFrom: from }),
}));

export default useStore;
