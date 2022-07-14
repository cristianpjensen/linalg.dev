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

export type UnaryOperator =
	| "square"
	| "square root"
	| "cubed"
	| "cos"
	| "tan"
	| "sin";

export interface UnaryOperatorNodeInputPorts extends NodeInputPorts {
	x: InputPort<number>;
	operator: InputPort<UnaryOperator>;
}

export interface UnaryOperatorNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<number>;
}

export interface UnaryOperatorNode extends Node {
	inputPorts: UnaryOperatorNodeInputPorts;
	outputPorts: UnaryOperatorNodeOutputPorts;
}

export class UnaryOperatorNode extends Node {
	public type = NodeType.UnaryOperator;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				x: {
					defaultValue: 0,
					validate: (val: any) => _.isNumber(val),
				},
				operator: {
					defaultValue: "square",
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
		switch (this.inputPorts.operator.value) {
			case "square":
				this.outputPorts.result.value =
					this.inputPorts.x.value * this.inputPorts.x.value;
				break;

			case "square root":
				this.outputPorts.result.value = Math.sqrt(
					this.inputPorts.x.value
				);
				break;

			case "cubed":
				this.outputPorts.result.value =
					this.inputPorts.x.value *
					this.inputPorts.x.value *
					this.inputPorts.x.value;
				break;

			case "cos":
				this.outputPorts.result.value = Math.cos(
					this.inputPorts.x.value
				);
				break;

			case "tan":
				this.outputPorts.result.value = Math.tan(
					this.inputPorts.x.value
				);
				break;

			case "sin":
				this.outputPorts.result.value = Math.sin(
					this.inputPorts.x.value
				);
				break;
		}
	}
}
