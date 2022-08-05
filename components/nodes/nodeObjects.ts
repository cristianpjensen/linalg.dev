import { Node } from "react-flow-renderer/nocss";

import * as T from "./types";

type Position = { x: number; y: number };

const getId = () => {
	return `${Date.now()}-${Math.round(Math.random() * 100)}`;
};

const numberInput = (value: number = 0): T.Input<number> => ({
	value,
	isConnected: false,
});

const vectorInput = (
	value: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
): T.Input<T.Vector> => ({
	value,
	isConnected: false,
});

const matrixInput = (
	value: [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number
	] = [1, 0, 0, 0, 1, 0, 0, 0, 1]
) => ({
	value,
	isConnected: false,
});

const snapToGrid = ({ x, y }: Position): Position => {
	return {
		x: x - (x % 24) - 12,
		y: y - (y % 24) - 12,
	};
};

export const vectorNodeObject = (position: Position): Node<T.VectorData> => ({
	type: "vector",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		x: numberInput(),
		y: numberInput(),
		z: numberInput(),
		origin: vectorInput(),
		hidden: false,
		output: {
			result: {
				x: 0,
				y: 0,
				z: 0,
			},
		},
	},
});

export const matrixNodeObject = (position: Position): Node<T.MatrixData> => ({
	type: "matrix",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		m1: vectorInput({ x: 1, y: 0, z: 0 }),
		m2: vectorInput({ x: 0, y: 1, z: 0 }),
		m3: vectorInput({ x: 0, y: 0, z: 1 }),
		output: {
			result: [1, 0, 0, 0, 1, 0, 0, 0, 1],
		},
	},
});

export const constantNodeObject = (
	position: Position
): Node<T.ConstantData> => ({
	type: "constant",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		value: numberInput(),
		output: {
			result: 0,
		},
	},
});

export const sliderNodeObject = (position: Position): Node<T.SliderData> => ({
	type: "slider",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		min: numberInput(),
		max: numberInput(1),
		value: 0,
		output: {
			result: 0,
		},
	},
});

export const unaryOperationNodeObject = (
	position: Position
): Node<T.UnaryOperationData> => ({
	type: "unaryOperation",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		value: numberInput(),
		operator: "square",
		output: {
			result: 0,
		},
	},
});

export const binaryOperationNodeObject = (
	position: Position
): Node<T.BinaryOperationData> => ({
	type: "binaryOperation",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		left: numberInput(),
		right: numberInput(),
		operator: "add",
		output: {
			result: 0,
		},
	},
});

export const normNodeObject = (position: Position): Node<T.NormData> => ({
	type: "norm",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		vector: vectorInput(),
		output: {
			result: 0,
		},
	},
});

export const transformNodeObject = (
	position: Position
): Node<T.TransformData> => ({
	type: "transform",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		vector: vectorInput(),
		matrix: matrixInput(),
		hidden: true,
		output: {
			result: {
				x: 0,
				y: 0,
				z: 0,
			},
		},
	},
});

export const vectorScalingNodeObject = (
	position: Position
): Node<T.VectorScalingData> => ({
	type: "vectorScaling",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		vector: vectorInput(),
		scalar: numberInput(1),
		hidden: true,
		output: {
			result: {
				x: 0,
				y: 0,
				z: 0,
			},
		},
	},
});

export const transposeNodeObject = (
	position: Position
): Node<T.TransposeData> => ({
	type: "transpose",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		matrix: matrixInput(),
		output: {
			result: [1, 0, 0, 0, 1, 0, 0, 0, 1],
		},
	},
});

export const matrixMultiplicationNodeObject = (
	position: Position
): Node<T.MatrixMultiplicationData> => ({
	type: "matrixMultiplication",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		left: matrixInput(),
		right: matrixInput(),
		output: {
			result: [1, 0, 0, 0, 1, 0, 0, 0, 1],
		},
	},
});

export const eigenvaluesNodeObject = (
	position: Position
): Node<T.EigenvaluesData> => ({
	type: "eigenvalues",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		matrix: matrixInput(),
		output: {
			eigenvalue1: 1,
			eigenvalue2: 1,
			eigenvalue3: 1,
		},
	},
});

export const eigenvectorsNodeObject = (
	position: Position
): Node<T.EigenvectorsData> => ({
	type: "eigenvectors",
	id: getId(),
	position: snapToGrid(position),
	dragHandle: ".dragger",
	data: {
		matrix: matrixInput(),
		hidden: true,
		output: {
			eigenvector1: {
				x: 1,
				y: 0,
				z: 0,
			},
			eigenvector2: {
				x: 0,
				y: 1,
				z: 0,
			},
			eigenvector3: {
				x: 0,
				y: 0,
				z: 1,
			},
		},
	},
});
