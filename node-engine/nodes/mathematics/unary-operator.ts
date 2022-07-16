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

export enum UnaryOperator {
	SQUARE = "Square",
	SQRT = "Square root",
	CUBE = "Cube",
	SIN = "Sine",
	COS = "Cosine",
	TAN = "Tangent",
}

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
	public type = NodeType.UNARY_OPERATOR;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				x: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
					validate: (val: any) => _.isNumber(val),
				},
				operator: {
					defaultValue: UnaryOperator.SQUARE,
					valueType: PortValueType.NONE,
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
		switch (this.inputPorts.operator.value) {
			case UnaryOperator.SQUARE:
				this.outputPorts.result.value =
					this.inputPorts.x.value * this.inputPorts.x.value;
				break;

			case UnaryOperator.SQRT:
				this.outputPorts.result.value = Math.sqrt(
					this.inputPorts.x.value
				);
				break;

			case UnaryOperator.CUBE:
				this.outputPorts.result.value =
					this.inputPorts.x.value *
					this.inputPorts.x.value *
					this.inputPorts.x.value;
				break;

			case UnaryOperator.SIN:
				this.outputPorts.result.value = Math.sin(
					this.inputPorts.x.value
				);
				break;

			case UnaryOperator.COS:
				this.outputPorts.result.value = Math.cos(
					this.inputPorts.x.value
				);
				break;

			case UnaryOperator.TAN:
				this.outputPorts.result.value = Math.tan(
					this.inputPorts.x.value
				);
				break;
		}
	}
}
