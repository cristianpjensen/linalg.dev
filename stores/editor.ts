import create from "zustand";
import * as THREE from "three";

export enum Tool {
	Hand = "Hand",
	Vector = "Vector",
	Matrix = "Matrix",
	Scalar = "Scalar",
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
	VectorComponents = "Vector components",
	Plane = "Plane",
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
	 * If true, show the vectors in the vector space as spheres. This is useful
	 * if there are many vectors or if the vectors should represent datapoints.
	 */
	showVectorsAsSpheres: boolean;
	toggleShowVectorsAsSpheres: () => void;

	/**
	 * For some transformations it gives a better overview if not the entire
	 * space is transformed, but only the vectors.
	 */
	showSpaceTransformations: boolean;
	toggleShowSpaceTransformations: () => void;

	/**
	 * If true, the page can stop loading.
	 */
	isLoaded: boolean;
	setIsLoaded: (isLoaded: true) => void;
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
	showVectorsAsSpheres: false,
	toggleShowVectorsAsSpheres: () =>
		set((state) => ({ showVectorsAsSpheres: !state.showVectorsAsSpheres })),
	showSpaceTransformations: true,
	toggleShowSpaceTransformations: () =>
		set((state) => ({
			showSpaceTransformations: !state.showSpaceTransformations,
		})),
	isLoaded: false,
	setIsLoaded: (isLoaded: true) => set({ isLoaded }),
}));

export default useStore;
