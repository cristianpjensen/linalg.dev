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
export type ValidInputOutputString = "number" | "vector" | "matrix";

// Turns a valid input/output into a string that can be used as a key in a map
export type ValidInputOutputToString<T> = T extends Matrix
	? "matrix"
	: T extends Vector
	? "vector"
	: T extends number
	? "number"
	: "unknown";

// Only accepts strings of the form "property-type". Only works for properties
// of type ValidInputOutput.

// TODO: Fix the problem where if there are multiple properties with different
// types, the type of the other property will also be accepted for the property.
export type PropertyTypeString<O extends { [prop: string]: any }> = Extract<
	keyof O,
	string
> extends `${infer R}`
	? `${R}-${ValidInputOutputToString<O[R]>}`
	: "";

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
