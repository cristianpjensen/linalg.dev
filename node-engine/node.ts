import { v4 as uuid } from "uuid";
import { observable, action, computed, makeObservable } from "mobx";

import { InputPort, OutputPort, PortProps } from "./port";
import { Context, Data } from "./context";
import { Connection } from "./connection";

export abstract class Node {
	public id: string;
	public abstract type: NodeType;

	/**
	 * Dictionary with the input ports of the node, where the key is the name of
	 * the port. The type of this property must be set for each node type, such
	 * that it can infer types better.
	 */
	public inputPorts: { [key: string]: InputPort<any> } = {};

	/**
	 * Dictionary with the output ports of the node, where the key is the name of
	 * the port. The type of this property must be set for each node type, such
	 * that it can infer types better.
	 */
	public outputPorts: { [key: string]: OutputPort<any> } = {};

	/**
	 * Reference to the parent context.
	 */
	public context: Context;

	/**
	 * Optional data store that can contain information about the node. For
	 * example, the position and dimensions of the pane in the node environment.
	 */
	public data: Data;

	constructor(context: Context, props: NodeProps) {
		this.id = props.id || uuid();
		this.data = props.data || {};
		this.context = context;

		this.generatePorts(props);

		makeObservable<Node, "generatePorts">(this, {
			id: observable,
			inputPorts: observable,
			outputPorts: observable,
			context: observable,
			data: observable,
			destroy: action,
			generatePorts: action,
			connections: computed,
		});

		context.addNode(this);

		this.initialize && this.initialize();
		this.compute && this.compute();
	}

	/**
	 * Generates in- and output ports.
	 */
	private generatePorts(nodeProps: NodeProps) {
		for (const inputPort in nodeProps.inputPorts) {
			this.inputPorts[inputPort] = new InputPort(
				this,
				nodeProps.inputPorts[inputPort]
			);
		}

		for (const outputPort in nodeProps.outputPorts) {
			this.outputPorts[outputPort] = new OutputPort(
				this,
				nodeProps.outputPorts[outputPort]
			);
		}
	}

	/**
	 * Initialization function that is called when the node is added to the
	 * context.
	 */
	public initialize?(): void;

	/**
	 * Computation function that runs whever values in the input ports are
	 * updated.
	 */
	public compute?(): void;

	/**
	 * Cleanup function that runs when the node gets removed from the context.
	 */
	public dispose?(): void;

	public destroy() {
		this.dispose && this.dispose();
		this.context.removeNode(this);

		for (const connection of this.connections) {
			connection.destroy();
		}
	}

	public get connections(): Array<Connection> {
		return Array.from(this.context.connections.values()).filter(
			(connection) => {
				return (
					connection.fromPort.node.id === this.id ||
					connection.toPort.node.id === this.id
				);
			}
		);
	}

	serialize() {
		const serializedInputPorts: { [key: string]: any } = {};
		const serializedOutputPorts: { [key: string]: any } = {};

		for (const inputPort in this.inputPorts) {
			serializedInputPorts[inputPort] =
				this.inputPorts[inputPort].serialize();
		}

		for (const outputPort in this.outputPorts) {
			serializedOutputPorts[outputPort] =
				this.outputPorts[outputPort].serialize();
		}

		return {
			id: this.id,
			name: this.constructor.name,
			inputPorts: serializedInputPorts,
			outputPorts: serializedOutputPorts,
			data: this.data,
		};
	}
}

export interface NodeProps {
	id?: string;
	inputPorts?: NodePortProps<any>;
	outputPorts?: NodePortProps<any>;
	data?: Data;
}

export interface NodePortProps<T> {
	[key: string]: PortProps<T>;
}

export interface NodeInputPorts {
	[key: string]: InputPort<any>;
}

export interface NodeOutputPorts {
	[key: string]: OutputPort<any>;
}

export enum NodeType {
	CONSTANT = "Constant",
	SLIDER = "Slider",
	UNARY_OPERATOR = "Unary operator",
	BINARY_OPERATOR = "Binary operator",
	VECTOR = "Vector",
	MATRIX = "Matrix",
	EIGENVALUES = "Eigenvalues",
	EIGENVECTORS = "Eigenvectors",
	TRANSPOSE = "Transpose",
	MATRIXMULT = "Matrix multiplication",
	VECTORSCALING = "Vector scaling",
	NORM = "Norm",
	TRANSFORM = "Transform",
}
