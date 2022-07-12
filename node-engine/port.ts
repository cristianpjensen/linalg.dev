import { v4 as uuid } from "uuid";
import { observable, action, computed } from "mobx";

import { Node } from "./node";
import { Connection } from "./connection";
import { Data } from "./context";

export abstract class Port<T> {
	@observable public id: string;
	@observable public abstract type: PortType;
	@observable public defaultValue: T;
	
	/**
	 * Reference to the parent node.
	 */
	@observable public node: Node<any, any>;

	/**
	 * The port's current value. If this is an input port, then when the value
	 * is set, the output ports of that same node are updated by calling
	 * compute() on the parent node.
	 */
	@observable private _value!: T;

	/**
	 * Optional data store to contain information about the port.
	 */
	@observable public data?: Data = {};

	/**
	 * Optional validation function that will be called when the value is set.
	 * @param value - Value to validate.
	 */
	public validate?(value: any): boolean;

	constructor(node: Node<any, any>, props: PortProps<T>) {
		this.node = node;
		this.id = props.id || uuid();
		this.defaultValue = props.defaultValue;
		this.value = props.value || props.defaultValue;
		this.data = props.data;

		if (typeof props.validate === "function") {
			this.validate = props.validate;
		}
	}

	@computed public get value() {
		return this._value;
	}

	public set value(value: T) {
		this._value = value;

		if (this.type === PortType.INPUT) {
			this.node.compute && this.node.compute();
		}
	}

	/**
	 * Returns an array of the connected ports.
	 */
	@computed public get connections() {
		return this.node.connections.filter((connection) => {
			return connection.fromPort.id === this.id || connection.toPort.id === this.id;
		});
	}

	@computed public get isConnected(): boolean {
		return this.connections.length > 0;
	}

	serialize() {
		return {
			id: this.id,
			defaultValue: this.defaultValue,
			value: this.value,
			validate: this.validate,
		};
	}
}

export class InputPort<T> extends Port<T> {
	public type = PortType.INPUT;
}

export class OutputPort<T> extends Port<T> {
	public type = PortType.OUTPUT;

	/**
	 * Connects this port with an input port.
	 * @param targetPort - Input port to connect to.
	 * @returns The created connection.
	 */
	@action public connect(targetPort: InputPort<T>): Connection {
		return this.node.context.createConnection({
			fromPort: this,
			toPort: targetPort,
		});
	}
}

export enum PortType {
	INPUT = "input",
	OUTPUT = "output",
}

export type PortProps<T> = {
	id?: string;
	defaultValue: T;
	validate?: (value: any) => boolean;
	value?: T;
	data?: Data;
};
