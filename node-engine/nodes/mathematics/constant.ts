import * as _ from "lodash";
import { action, makeObservable, observable } from "mobx";

import { Context } from "../../context";
import {
	Node,
	NodeInputPorts,
	NodeOutputPorts,
	NodeProps,
	NodeType,
} from "../../node";
import { InputPort, OutputPort } from "../../port";

export interface ConstantNodeInputPorts extends NodeInputPorts {
	x: InputPort<number>;
}

export interface ConstantNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<number>;
}

export interface ConstantNode extends Node {
	inputPorts: ConstantNodeInputPorts;
	outputPorts: ConstantNodeOutputPorts;
}

export class ConstantNode extends Node {
	type = NodeType.Constant;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				x: {
					defaultValue: 0,
					validate: (val: any) => _.isNumber(val),
				},
			},
			outputPorts: {
				result: {
					defaultValue: 0,
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
		this.outputPorts.result.value = this.inputPorts.x.value;
	}
}
