import React, { memo, useCallback } from "react";
import { NodeProps } from "reactflow";
import { EigenvalueDecomposition } from "ml-matrix";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { EigenvectorsData } from "./types";
import { useOutput } from "./hooks";
import * as Node from "./Node";
import { useNodeStore } from "../../stores";

const EigenvectorsNode = memo(
	({ id, data, selected }: NodeProps<EigenvectorsData>) => {
		const output = useOutput(id, data, (data) => {
			const m = data.matrix.value;
			const matrix = [
				[m[0], m[1], m[2]],
				[m[3], m[4], m[5]],
				[m[6], m[7], m[8]],
			];
			const eigenpairs = new EigenvalueDecomposition(matrix);
			const realEigenvalues = eigenpairs.realEigenvalues;
			const eigenvectors = eigenpairs.eigenvectorMatrix;

			const eigenvalues: Array<[number, number[]]> = [
				[realEigenvalues[0], eigenvectors.getColumn(0)],
				[realEigenvalues[1], eigenvectors.getColumn(1)],
				[realEigenvalues[2], eigenvectors.getColumn(2)],
			];

			// Sort by absolute value of the real eigenvalues
			eigenvalues.sort((a, b) => {
				return Math.abs(b[0]) - Math.abs(a[0]);
			});

			return {
				eigenvector1: {
					x: eigenvalues[0][1][0],
					y: eigenvalues[0][1][1],
					z: eigenvalues[0][1][2],
				},
				eigenvector2: {
					x: eigenvalues[1][1][0],
					y: eigenvalues[1][1][1],
					z: eigenvalues[1][1][2],
				},
				eigenvector3: {
					x: eigenvalues[2][1][0],
					y: eigenvalues[2][1][1],
					z: eigenvalues[2][1][2],
				},
			};
		});

		const setNodeData = useNodeStore((state) => state.setNodeData);
		const onHide = useCallback(() => {
			setNodeData(id, { hidden: !data.hidden });
		}, [data.hidden]);

		return (
			<Node.Root
				id={id}
				data={data}
				selected={selected}
				title="Eigenvectors"
				color="purple-ext"
				width={10}
				height={9}
			>
				<Node.Dragger>
					<Node.DraggerButton
						tooltip="Show/hide eigenvectors"
						onClick={onHide}
					>
						{data.hidden ? <EyeClosedIcon /> : <EyeOpenIcon />}
					</Node.DraggerButton>
				</Node.Dragger>

				<Node.Handle type="target" id="matrix" />

				<div>
					<Node.DisplayVector vector={output.eigenvector1} />
					<Node.DisplayVector vector={output.eigenvector2} />
					<Node.DisplayVector vector={output.eigenvector3} />
				</div>

				<Node.Handle type="source" id="eigenvector1" top={70} />
				<Node.Handle type="source" id="eigenvector2" top={114} />
				<Node.Handle type="source" id="eigenvector3" top={158} />
			</Node.Root>
		);
	}
);

EigenvectorsNode.displayName = "Eigenvectors node";

export default EigenvectorsNode;
