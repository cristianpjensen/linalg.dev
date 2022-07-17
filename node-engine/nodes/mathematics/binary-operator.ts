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

export enum BinaryOperator {
    ADD = "Add",
    SUBTRACT = "Subtract",
    MULTIPLY = "Multiply",
    DIVIDE = "Divide",
    MODULO = "Modulo",
}

export interface BinaryOperatorNodeInputPorts extends NodeInputPorts {
	x: InputPort<number>;
	y: InputPort<number>;
	operator: InputPort<BinaryOperator>;
}

export interface BinaryOperatorNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<number>;
}

export interface BinaryOperatorNode extends Node {
	inputPorts: BinaryOperatorNodeInputPorts;
	outputPorts: BinaryOperatorNodeOutputPorts;
}

export class BinaryOperatorNode extends Node {
	public type = NodeType.BINARY_OPERATOR;

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
							y: 127,
						}
					}
				},
				y: {
					defaultValue: 0,
					valueType: PortValueType.NUMBER,
					validate: (val: any) => _.isNumber(val),
					data: {
						position: {
							x: 0,
							y: 193,
						}
					}
				},
				operator: {
					defaultValue: BinaryOperator.ADD,
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
			case BinaryOperator.ADD:
				this.outputPorts.result.value = this.inputPorts.x.value + this.inputPorts.y.value;
				break;

			case BinaryOperator.SUBTRACT:
                this.outputPorts.result.value = this.inputPorts.x.value - this.inputPorts.y.value;
				break;

			case BinaryOperator.MULTIPLY:
                this.outputPorts.result.value = this.inputPorts.x.value * this.inputPorts.y.value;
				break;

			case BinaryOperator.DIVIDE:
                this.outputPorts.result.value = this.inputPorts.x.value / this.inputPorts.y.value;
				break;

			case BinaryOperator.MODULO:
                this.outputPorts.result.value = this.inputPorts.x.value % this.inputPorts.y.value;
				break;
		}
	}
}
