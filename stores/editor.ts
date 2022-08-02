import create from "zustand";
import * as THREE from "three";

export enum Tool {
	Hand = "",
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
		})),
	isMatrixReset: false,
	resetMatrix: () =>
		set((state) => ({
			matrix: state.matrix.identity(),
			isMatrixReset: true,
		})),
	showCube: false,
	toggleShowCube: () => set((state) => ({ showCube: !state.showCube })),
}));

export default useStore;
