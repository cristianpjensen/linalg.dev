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

export interface SliderNodeInputPorts extends NodeInputPorts {
	max: InputPort<number>;
	min: InputPort<number>;
	x: InputPort<number>;
}

export interface SliderNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<number>;
}

export interface SliderNode extends Node {
	inputPorts: SliderNodeInputPorts;
	outputPorts: SliderNodeOutputPorts;
}

export class SliderNode extends Node {
	type = NodeType.SLIDER;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				max: {
					defaultValue: 1,
					valueType: PortValueType.NUMBER,
					validate: (val: any) => _.isNumber(val),
				},
				min: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
					validate: (val: any) => _.isNumber(val),
				},
				x: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
					validate: (val: any) => _.isNumber(val),
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
		this.outputPorts.result.value =
			this.inputPorts.x.value *
				(this.inputPorts.max.value - this.inputPorts.min.value) +
			this.inputPorts.min.value;
	}
}
