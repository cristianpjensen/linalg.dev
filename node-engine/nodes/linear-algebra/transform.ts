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
import { Matrix, Vector } from "./types";

export interface TransformNodeInputPorts extends NodeInputPorts {
	matrix: InputPort<Matrix>;
	vector: InputPort<Vector>;
}

export interface TransformNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<Vector>;
}

export interface TransformNode extends Node {
	inputPorts: TransformNodeInputPorts;
	outputPorts: TransformNodeOutputPorts;
}

export class TransformNode extends Node {
	type = NodeType.TRANSFORM;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				matrix: {
					defaultValue: [1, 0, 0, 0, 1, 0, 0, 0, 1],
					valueType: PortValueType.MATRIX,
				},
				vector: {
					defaultValue: {
						x: 0,
						y: 0,
						z: 0,
					},
					valueType: PortValueType.VECTOR,
				},
			},
			outputPorts: {
				result: {
					defaultValue: {
						x: 0,
						y: 0,
						z: 0,
					},
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
		const m = this.inputPorts.matrix.value;
		const v = this.inputPorts.vector.value;

		this.outputPorts.result.value = {
			x: m[0] * v.x + m[1] * v.y + m[2] * v.z,
			y: m[3] * v.x + m[4] * v.y + m[5] * v.z,
			z: m[6] * v.x + m[7] * v.y + m[8] * v.z,
		};
	}
}
