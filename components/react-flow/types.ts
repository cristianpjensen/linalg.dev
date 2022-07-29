export type ConstantData = {
	value: number;
	output: number;
};

export type UnaryOperatorData = {
	value: number;
	operator: "sqrt" | "square" | "cube";
	output: number;
};

export type BinaryOperatorData = {
	left: number;
	right: number;
	operator: "add" | "subtract" | "multiply" | "divide";
	output: number;
};
