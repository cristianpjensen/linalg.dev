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

export type ConstantData = {
	value: number;
	output: {
		result: number;
	};
};

export type UnaryOperatorData = {
	value: number;
	operator: "sqrt" | "square" | "cube";
	output: {
		result: number;
	};
};

export type BinaryOperatorData = {
	left: number;
	right: number;
	operator: "add" | "subtract" | "multiply" | "divide";
	output: {
		result: number;
	};
};
