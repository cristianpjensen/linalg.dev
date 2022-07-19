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
import { Vector, Matrix } from "./types";

export interface MatrixNodeInputPorts extends NodeInputPorts {
	m1: InputPort<Vector>;
	m2: InputPort<Vector>;
	m3: InputPort<Vector>;
}

export interface MatrixNodeOutputPorts extends NodeOutputPorts {
	result: OutputPort<Matrix>;
}

export interface MatrixNode extends Node {
	inputPorts: MatrixNodeInputPorts;
	outputPorts: MatrixNodeOutputPorts;
}

export class MatrixNode extends Node {
	type = NodeType.MATRIX;

	constructor(context: Context, props: NodeProps) {
		_.defaultsDeep(props, {
			inputPorts: {
				m1: {
					defaultValue: { x: 1, y: 0, z: 0 },
					valueType: PortValueType.VECTOR,
					validate: (val: any) =>
						val.x &&
						val.y &&
						val.z &&
						_.isNumber(val.x) &&
						_.isNumber(val.y) &&
						_.isNumber(val.z),
					data: {
						position: {
							x: 0,
							y: 73,
						},
					},
				},
				m2: {
					defaultValue: { x: 0, y: 1, z: 0 },
					valueType: PortValueType.VECTOR,
					validate: (val: any) =>
						val.x &&
						val.y &&
						val.z &&
						_.isNumber(val.x) &&
						_.isNumber(val.y) &&
						_.isNumber(val.z),
					data: {
						position: {
							x: 0,
							y: 136,
						},
					},
				},
				m3: {
					defaultValue: { x: 0, y: 0, z: 1 },
					valueType: PortValueType.VECTOR,
					validate: (val: any) =>
						val.x &&
						val.y &&
						val.z &&
						_.isNumber(val.x) &&
						_.isNumber(val.y) &&
						_.isNumber(val.z),
					data: {
						position: {
							x: 0,
							y: 199,
						},
					},
				},
			},
			outputPorts: {
				result: {
					defaultValue: [0, 0, 0, 0, 0, 0, 0, 0, 0],
					valueType: PortValueType.MATRIX,
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
		this.outputPorts.result.value = [
			this.inputPorts.m1.value.x,
			this.inputPorts.m1.value.y,
			this.inputPorts.m1.value.z,
			this.inputPorts.m2.value.x,
			this.inputPorts.m2.value.y,
			this.inputPorts.m2.value.z,
			this.inputPorts.m3.value.x,
			this.inputPorts.m3.value.y,
			this.inputPorts.m3.value.z,
		];
	}
}
