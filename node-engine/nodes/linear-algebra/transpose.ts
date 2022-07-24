import _ from "lodash";
import { action, makeObservable, observable } from "mobx";

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

export interface TransposeNodeInputPorts extends NodeInputPorts {
	matrix: InputPort<Matrix>;
}

export interface TransposeNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<Matrix>;
}

export interface TransposeNode extends Node {
	inputPorts: TransposeNodeInputPorts;
	outputPorts: TransposeNodeOutputPorts;
}

export class TransposeNode extends Node {
	type = NodeType.TRANSPOSE;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				m: {
					defaultValue: [1, 0, 0, 0, 1, 0, 0, 0, 1],
					valueType: PortValueType.MATRIX,
				},
			},
			outputPorts: {
				result: {
					defaultValue: [1, 0, 0, 0, 1, 0, 0, 0, 1],
					valueType: PortValueType.MATRIX,
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
		const m = this.inputPorts.m.value;
		this.outputPorts.result.value = [
			m[0],
			m[3],
			m[6],
			m[1],
			m[4],
			m[7],
			m[2],
			m[5],
			m[8],
		];
	}
}
