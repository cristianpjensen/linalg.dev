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

const centerPosition = ({ x, y }: Position): Position => {
	return {
		x: x - (x % 24) - 12,
		y: y - (y % 24) - 12,
	};
};

export const vectorNodeObject = (position: Position): Node<T.VectorData> => ({
	type: "vector",
	id: getId(),
	position: centerPosition(position),
	data: {
		x: numberInput(),
		y: numberInput(),
		z: numberInput(),
		origin: vectorInput(),
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
	position: centerPosition(position),
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
	position: centerPosition(position),
	data: {
		value: numberInput(),
		output: {
			result: 0,
		},
	},
});

export const unaryOperationObject = (
	position: Position
): Node<T.UnaryOperationData> => ({
	type: "unaryOperation",
	id: getId(),
	position: centerPosition(position),
	data: {
		value: numberInput(),
		operator: "square",
		output: {
			result: 0,
		},
	},
});

export const binaryOperationObject = (
	position: Position
): Node<T.BinaryOperationData> => ({
	type: "binaryOperation",
	id: getId(),
	position: centerPosition(position),
	data: {
		left: numberInput(),
		right: numberInput(),
		operator: "add",
		output: {
			result: 0,
		},
	},
});
