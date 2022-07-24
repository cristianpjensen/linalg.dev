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
import { Matrix } from "./types";

export interface EigenvaluesNodeInputPorts extends NodeInputPorts {
	matrix: InputPort<Matrix>;
}

export interface EigenvaluesNodeOutputPorts extends NodeOutputPorts {
	e1: OutputPort<number>;
	e2: OutputPort<number>;
	e3: OutputPort<number>;
	i1: OutputPort<number>;
	i2: OutputPort<number>;
	i3: OutputPort<number>;
}

export interface EigenvaluesNode extends Node {
	inputPorts: EigenvaluesNodeInputPorts;
	outputPorts: EigenvaluesNodeOutputPorts;
}

export class EigenvaluesNode extends Node {
	type = NodeType.EIGENVALUES;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				matrix: {
					defaultValue: [1, 0, 0, 0, 1, 0, 0, 0, 1],
					valueType: PortValueType.MATRIX,
				},
			},
			outputPorts: {
				e1: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
				},
				e2: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
				},
				e3: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
				},
				i1: {
					defaultValue: 0,
					valueType: PortValueType.NONE,
				},
				i2: {
					defaultValue: 0,
					valueType: PortValueType.NONE,
				},
				i3: {
					defaultValue: 0,
					valueType: PortValueType.NONE,
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
			this.outputPorts.e1.value = 0;
			this.outputPorts.e2.value = 0;
			this.outputPorts.e3.value = 0;
			this.outputPorts.i1.value = 0;
			this.outputPorts.i2.value = 0;
			this.outputPorts.i3.value = 0;
		}

		const m = this.inputPorts.matrix.value;
		const matrix = [
			[m[0], m[1], m[2]],
			[m[3], m[4], m[5]],
			[m[6], m[7], m[8]],
		];
		const eigenpairs = new EigenvalueDecomposition(matrix);
		const ev = eigenpairs.realEigenvalues;
		const iv = eigenpairs.imaginaryEigenvalues;

		const sortedEv: Array<[number, number]> = _.sortBy(
			_.zip(ev, iv) as Array<[number, number]>,
			([e]) => -Math.abs(e)
		);

		this.outputPorts.e1.value = sortedEv[0][0];
		this.outputPorts.e2.value = sortedEv[1][0];
		this.outputPorts.e3.value = sortedEv[2][0];
		this.outputPorts.i1.value = sortedEv[0][1];
		this.outputPorts.i2.value = sortedEv[1][1];
		this.outputPorts.i3.value = sortedEv[2][1];
	}
}
