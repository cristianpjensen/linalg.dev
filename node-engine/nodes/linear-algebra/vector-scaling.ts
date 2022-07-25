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

export interface VectorScalingNodeInputPorts extends NodeInputPorts {
	vector: InputPort<Vector>;
	scalar: InputPort<number>;
}

export interface VectorScalingNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<Vector>;
}

export interface VectorScalingNode extends Node {
	inputPorts: VectorScalingNodeInputPorts;
	outputPorts: VectorScalingNodeOutputPorts;
}

export class VectorScalingNode extends Node {
	type = NodeType.VECTORSCALING;

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
					data: {
						position: {
							x: 0,
							y: 70,
						},
						isPositioned: true,
					},
				},
				scalar: {
					defaultValue: 1,
					valueType: PortValueType.NUMBER,
					data: {
						position: {
							x: 0,
							y: 128,
						},
						isPositioned: true,
					},
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
		const v = this.inputPorts.vector.value;
		const s = this.inputPorts.scalar.value;

		this.outputPorts.result.value = {
			x: v.x * s,
			y: v.y * s,
			z: v.z * s,
		};
	}
}
