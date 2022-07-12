import * as _ from "lodash";

import { Context } from "../../context";
import { Node, NodeInputPorts, NodeOutputPorts, NodeProps } from "../../node";
import { InputPort, OutputPort } from "../../port";

export interface ConstantNodeInputPorts extends NodeInputPorts {
	x: InputPort<number>;
}

export interface ConstantNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<number>;
}

type ConstantProps = NodeProps<ConstantNodeInputPorts, ConstantNodeOutputPorts>;

export class ConstantNode extends Node<ConstantNodeInputPorts, ConstantNodeOutputPorts> {
	constructor(context: Context, props: ConstantProps) {
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
		} as ConstantProps);

		super(context, props);
	}

	compute() {
		this.outputPorts.result.value = this.inputPorts.x.value;
	}
}
