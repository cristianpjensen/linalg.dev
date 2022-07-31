export type Vector = {
	x: number;
	y: number;
	z: number;
};

export type Matrix = [
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number
];

export type ValidInputOutput = number | Vector | Matrix;

type Input<T extends ValidInputOutput> = {
	value: T;
	isConnected: boolean;
};

export type ConstantData = {
	value: Input<number>;
	output: {
		result: number;
	};
};

export type UnaryOperatorData = {
	value: Input<number>;
	operator: "square root" | "square" | "cube";
	output: {
		result: number;
	};
};

export type BinaryOperatorData = {
	left: Input<number>;
	right: Input<number>;
	operator: "add" | "subtract" | "multiply" | "divide" | "modulo";
	output: {
		result: number;
	};
};

export type VectorNodeData = {
	x: Input<number>;
	y: Input<number>;
	z: Input<number>;
	origin: Input<Vector>;
	output: {
		result: Vector;
	};
};
