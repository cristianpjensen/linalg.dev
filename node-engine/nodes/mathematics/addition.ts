import * as _ from "lodash";

import { Context } from "../../context";
import { Node, NodeInputPorts, NodeOutputPorts, NodeProps } from "../../node";
import { InputPort, OutputPort } from "../../port";

export interface AdditionNodeInputPorts extends NodeInputPorts {
	x: InputPort<number>;
	y: InputPort<number>;
}

export interface AdditionNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<number>;
}

type AdditionProps = NodeProps<AdditionNodeInputPorts, AdditionNodeOutputPorts>;

export class AdditionNode extends Node<AdditionNodeInputPorts, AdditionNodeOutputPorts> {
	constructor(context: Context, props: AdditionProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				x: {
					defaultValue: 0,
					validate: (val: any) => _.isNumber(val),
				},
				y: {
					defaultValue: 0,
					validate: (val: any) => _.isNumber(val),
				},
			},
			outputPorts: {
				result: {
					defaultValue: 0,
				},
			}
		} as AdditionProps);

		super(context, props);
	}

	compute() {
		this.outputPorts.result.value = this.inputPorts.x.value + this.inputPorts.y.value;
	}
}
