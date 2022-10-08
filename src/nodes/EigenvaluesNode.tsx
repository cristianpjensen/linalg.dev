import React, { memo } from "react";
import { NodeProps } from "reactflow";
import { EigenvalueDecomposition } from "ml-matrix";
import TeX from "@matejmazur/react-katex";

import { EigenvaluesData } from "./types";
import { useOutput } from "./hooks";
import * as Node from "./Node";
import { displayRounded } from "./helpers";

const EigenvaluesNode = memo(
	({ id, data, selected }: NodeProps<EigenvaluesData>) => {
		const output = useOutput(id, data, (data) => {
			const m = data.matrix.value;
			const matrix = [
				[m[0], m[1], m[2]],
				[m[3], m[4], m[5]],
				[m[6], m[7], m[8]],
			];
			const eigenpairs = new EigenvalueDecomposition(matrix);
			const realEigenvalues = eigenpairs.realEigenvalues;
			const imaginaryEigenvalues = eigenpairs.imaginaryEigenvalues;

			const eigenvalues: Array<[number, number]> = [
				[realEigenvalues[0], imaginaryEigenvalues[0]],
				[realEigenvalues[1], imaginaryEigenvalues[1]],
				[realEigenvalues[2], imaginaryEigenvalues[2]],
			];

			// Sort by absolute value of the real eigenvalues
			eigenvalues.sort((a, b) => {
				return Math.abs(b[0]) - Math.abs(a[0]);
			});

			return {
				eigenvalue1: eigenvalues[0][0],
				eigenvalue2: eigenvalues[1][0],
				eigenvalue3: eigenvalues[2][0],
			};
		});

		return (
			<Node.Root
				id={id}
				data={data}
				selected={selected}
				title="Eigenvalues"
				color="purple-ext"
				width={6}
				height={8}
			>
				<Node.Dragger />

				<Node.Handle type="target" id="matrix" />

				<div>
					<TeX math={displayRounded(output.eigenvalue1)} block />
					<TeX math={displayRounded(output.eigenvalue2)} block />
					<TeX math={displayRounded(output.eigenvalue3)} block />
				</div>

				<Node.Handle type="source" id="eigenvalue1" top={68} />
				<Node.Handle type="source" id="eigenvalue2" top={106} />
				<Node.Handle type="source" id="eigenvalue3" top={146} />
			</Node.Root>
		);
	}
);

EigenvaluesNode.displayName = "Eigenvalues node";

export default EigenvaluesNode;
