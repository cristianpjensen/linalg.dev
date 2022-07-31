import type { Vector, Matrix } from "./types";

export const isNumber = (value: any): value is number =>
	typeof value === "number";

export const isVector = (value: any): value is Vector =>
	isNumber(value.x) && isNumber(value.y) && isNumber(value.z);

export const isMatrix = (value: any): value is Matrix =>
	isNumber(value[0]) &&
	isNumber(value[1]) &&
	isNumber(value[2]) &&
	isNumber(value[3]) &&
	isNumber(value[4]) &&
	isNumber(value[5]) &&
	isNumber(value[6]) &&
	isNumber(value[7]) &&
	isNumber(value[8]);

export const getHandleType = (
	value: any
): "number" | "vector" | "matrix" | "unknown" => {
	if (isNumber(value)) {
		return "number";
	} else if (isVector(value)) {
		return "vector";
	} else if (isMatrix(value)) {
		return "matrix";
	}

	return "unknown";
};

export const displayRounded = (value: number): string => {
	const rounded = Math.round(value * 100) / 100;
	const roundedString = rounded.toString();

	if (roundedString.length > 6) {
		return value.toExponential(1);
	}

	return roundedString;
};

export const getAllIndices = <T>(
	array: Array<T>,
	isElement: (element: T) => boolean
): Array<number> => {
	const indices = [];

	for (let i = 0; i < array.length; i++) {
		if (isElement(array[i])) {
			indices.push(i);
		}
	}

	return indices;
};
