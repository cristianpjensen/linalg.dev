import * as THREE from "three";

/**
 * Checks whether the given matrix is a rotation matrix or not. This is done by
 * checking whether the inverse is the transpose and the determinant is 1.
 * @param matrix Matrix to be checked.
 * @returns boolean.
 */
export const isRotationMatrix = (matrix: THREE.Matrix3) => {
	const inverse = matrix.clone().invert();
	const transpose = matrix.clone().transpose();

	return (
		isClose(matrix.determinant(), 1) && isMatrixClose(inverse, transpose)
	);
};

export function dot(v1: Array<number>, v2: Array<number>): number {
	return v1.reduce((a, b, i) => a + b * v2[i], 0);
}

export function multiplyMatrices(
	m1: Array<Array<number>>,
	m2: Array<Array<number>>
): Array<Array<number>> {
	const result = [];
	for (let i = 0; i < m1.length; i += 1) {
		const row = [];
		for (let j = 0; j < m2[0].length; j += 1) {
			for (let k = 0; k < m1[0].length; k += 1) {
				row.push(m1[i][k] * m2[k][j]);
			}
		}
		result.push(row);
	}
	return result;
}

export function norm(vector: Array<number>): number {
	return Math.sqrt(dot(vector, vector));
}

/**
 * Check whether two numbers are close, since floating-point arithmetic is not
 * very accurate.
 */
export const isClose = (a: number, b: number) => Math.abs(a - b) < 1e-3;

/**
 * Check whether two matrices are close, since floating-point arithmetic is not
 * very accurate.
 */
export const isMatrixClose = (m1: THREE.Matrix3, m2: THREE.Matrix3) => {
	const m1Elements = m1.elements;
	const m2Elements = m2.elements;

	for (let i = 0; i < 9; i += 1) {
		if (!isClose(m1Elements[i], m2Elements[i])) {
			return false;
		}
	}

	return true;
};
