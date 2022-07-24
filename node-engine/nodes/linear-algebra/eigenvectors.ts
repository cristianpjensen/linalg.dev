import _ from "lodash";
import { action, makeObservable, observable } from "mobx";
import { EigenvalueDecomposition } from "ml-matrix";

import { Context } from "../../context";
import {
	Node,
	NodeInputPorts,
	NodeOutputPorts,
	NodeProps,
	NodeType,
} from "../../node";
import { InputPort, OutputPort, PortValueType } from "../../port";
import { Matrix, Vector } from "./types";

export interface EigenvectorsNodeInputPorts extends NodeInputPorts {
	matrix: InputPort<Matrix>;
}

export interface EigenvectorsNodeOutputPorts extends NodeOutputPorts {
	v1: OutputPort<Vector>;
	v2: OutputPort<Vector>;
	v3: OutputPort<Vector>;
}

export interface EigenvectorsNode extends Node {
	inputPorts: EigenvectorsNodeInputPorts;
	outputPorts: EigenvectorsNodeOutputPorts;
}

export class EigenvectorsNode extends Node {
	type = NodeType.EIGENVECTORS;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				matrix: {
					defaultValue: [1, 0, 0, 0, 1, 0, 0, 0, 1],
					valueType: PortValueType.MATRIX,
				},
			},
			outputPorts: {
				v1: {
					defaultValue: { x: 0, y: 0, z: 0},
					valueType: PortValueType.VECTOR,
				},
				v2: {
					defaultValue: { x: 0, y: 0, z: 0},
					valueType: PortValueType.VECTOR,
				},
				v3: {
					defaultValue: { x: 0, y: 0, z: 0},
					valueType: PortValueType.VECTOR,
				},
			},
		} as NodeProps);

		super(context, props);

		makeObservable(this, {
			type: observable,
			compute: action,
		});
	}

	compute() {
		if (!this.inputPorts.matrix.isConnected) {
			this.outputPorts.v1.value = { x: 0, y: 0, z: 0 };
			this.outputPorts.v2.value = { x: 0, y: 0, z: 0 };
			this.outputPorts.v3.value = { x: 0, y: 0, z: 0 };
		}

		const m = this.inputPorts.matrix.value;
		const matrix = [
			[m[0], m[1], m[2]],
			[m[3], m[4], m[5]],
			[m[6], m[7], m[8]],
		];
		const eigenpairs = new EigenvalueDecomposition(matrix);

		const ev = eigenpairs.realEigenvalues;
		const e1 = eigenpairs.eigenvectorMatrix.getColumn(0);
		const e2 = eigenpairs.eigenvectorMatrix.getColumn(1);
		const e3 = eigenpairs.eigenvectorMatrix.getColumn(2);

		const sortedEv = _.sortBy(
			_.zip(ev, [e1, e2, e3]) as Array<[number, number[]]>,
			([e]) => -Math.abs(e)
		);

		this.outputPorts.v1.value = {
			x: sortedEv[0][1][0],
			y: sortedEv[0][1][1],
			z: sortedEv[0][1][2],
		};
		this.outputPorts.v2.value = {
			x: sortedEv[1][1][0],
			y: sortedEv[1][1][1],
			z: sortedEv[1][1][2],
		};
		this.outputPorts.v3.value = {
			x: sortedEv[2][1][0],
			y: sortedEv[2][1][1],
			z: sortedEv[2][1][2],
		};
	}
}
