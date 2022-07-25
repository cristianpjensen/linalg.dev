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
import { Vector } from "./types";

export interface NormNodeInputPorts extends NodeInputPorts {
	vector: InputPort<Vector>;
}

export interface NormNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<number>;
}

export interface NormNode extends Node {
	inputPorts: NormNodeInputPorts;
	outputPorts: NormNodeOutputPorts;
}

export class NormNode extends Node {
	type = NodeType.NORM;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
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
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
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
		const v = this.inputPorts.vector.value;

		this.outputPorts.result.value = Math.sqrt(
			v.x * v.x + v.y * v.y + v.z * v.z
		);
	}
}
