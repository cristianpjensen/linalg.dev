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

export interface VectorNodeInputPorts extends NodeInputPorts {
	x: InputPort<number>;
	y: InputPort<number>;
	z: InputPort<number>;
	origin: InputPort<Vector>;
}

export interface VectorNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<Vector>;
}

export interface VectorNode extends Node {
	inputPorts: VectorNodeInputPorts;
	outputPorts: VectorNodeOutputPorts;
}

export class VectorNode extends Node {
	type = NodeType.VECTOR;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				x: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
					validate: (val: any) => _.isNumber(val),
					data: {
						position: {
							x: 0,
							y: 72,
							isPositioned: true,
						},
					},
				},
				y: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
					validate: (val: any) => _.isNumber(val),
					data: {
						position: {
							x: 0,
							y: 126,
							isPositioned: true,
						},
					},
				},
				z: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
					validate: (val: any) => _.isNumber(val),
					data: {
						position: {
							x: 0,
							y: 182,
							isPositioned: true,
						},
					},
				},
				origin: {
					defaultValue: {
						x: 0,
						y: 0,
						z: 0,
					},
					valueType: PortValueType.VECTOR,
					data: {
						position: {
							x: 0,
							y: 243,
							isPositioned: true,
						},
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
		this.outputPorts.result.value = {
			x: this.inputPorts.x.value,
			y: this.inputPorts.y.value,
			z: this.inputPorts.z.value,
		};
	}
}
