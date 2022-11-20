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

export type Input<T extends ValidInputOutput> = {
	value: T;
	isConnected: boolean;
};

export type VectorRepresentation = "global" | "sphere" | "vector";

export type VectorData = {
	x: Input<number>;
	y: Input<number>;
	z: Input<number>;
	origin: Input<Vector>;
	hidden: boolean;
	representation: VectorRepresentation;
	color: string;
	output: {
		result: Vector;
	};
};

export type MatrixData = {
	m1: Input<Vector>;
	m2: Input<Vector>;
	m3: Input<Vector>;
	output: {
		result: Matrix;
	};
};

export type ScalarData = {
	value: Input<number>;
	output: {
		result: number;
	};
};

export type SliderData = {
	min: Input<number>;
	max: Input<number>;
	value: number;
	output: {
		result: number;
	};
};

export type UnaryOperationData = {
	value: Input<number>;
	operator: "square root" | "square" | "cube";
	output: {
		result: number;
	};
};

export type BinaryOperationData = {
	left: Input<number>;
	right: Input<number>;
	operator: "add" | "subtract" | "multiply" | "divide" | "modulo";
	output: {
		result: number;
	};
};

export type NormData = {
	vector: Input<Vector>;
	output: {
		result: number;
	};
};

export type TransformData = {
	matrix: Input<Matrix>;
	vector: Input<Vector>;
	hidden: boolean;
	color: string;
	representation: VectorRepresentation;
	output: {
		result: Vector;
	};
};

export type VectorScalingData = {
	vector: Input<Vector>;
	scalar: Input<number>;
	hidden: boolean;
	color: string;
	representation: VectorRepresentation;
	output: {
		result: Vector;
	};
};

export type VectorComponentsData = {
	vector: Input<Vector>;
	output: {
		x: number;
		y: number;
		z: number;
	};
};

export type TransposeData = {
	matrix: Input<Matrix>;
	output: {
		result: Matrix;
	};
};

export type MatrixMultiplicationData = {
	left: Input<Matrix>;
	right: Input<Matrix>;
	output: {
		result: Matrix;
	};
};

export type EigenvaluesData = {
	matrix: Input<Matrix>;
	output: {
		eigenvalue1: number;
		eigenvalue2: number;
		eigenvalue3: number;
	};
};

export type EigenvectorsData = {
	matrix: Input<Matrix>;
	hidden: boolean;
	output: {
		eigenvector1: Vector;
		eigenvector2: Vector;
		eigenvector3: Vector;
	};
};

export type PlaneData = {
	point: Input<Vector>;
	direction1: Input<Vector>;
	direction2: Input<Vector>;
	hidden: boolean;
	color: string;
};
