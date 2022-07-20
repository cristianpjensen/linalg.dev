import { v4 as uuid } from "uuid";
import {
	observable,
	action,
	computed,
	reaction,
	IReactionDisposer,
	makeObservable,
} from "mobx";

import { InputPort, OutputPort } from "./port";
import { Context } from "./context";

export class Connection {
	public id: string;
	public fromPort: OutputPort<any>;
	public toPort: InputPort<any>;
	public context: Context;

	private reactionDisposer: IReactionDisposer;

	constructor(context: Context, props: ConnectionProps) {
		this.id = props.id || uuid();

		this.context = context;
		this.fromPort = props.fromPort;
		this.toPort = props.toPort;

		this.toPort.value = this.fromPort.value;

		// Use a reaction such that the value in the input port is updated to
		// the value in the output port when the output port value updates.
		this.reactionDisposer = reaction(
			() => this.fromPort.value,
			(value) => {
				this.toPort.value = value;
			}
		);

		makeObservable(this, {
			id: observable,
			fromPort: observable,
			toPort: observable,
			context: observable,
			destroy: action,
			isValid: computed,
		});
	}

	/**
	 * Removes the connection and resets the value of the input port to its
	 * default.
	 */
	public destroy() {
		this.context.removeConnection(this);
		this.reactionDisposer();
		this.toPort.value = this.toPort.defaultValue;
	}

	/**
	 * A connection is valid if the validator function runs successfully. If the
	 * validator function is not defined, then the connection is always valid.
	 */
	public get isValid(): boolean {
		return (
			!this.toPort.validate || this.toPort.validate(this.fromPort.value)
		);
	}

	public serialize() {
		return {
			id: this.id,
			fromPortId: this.fromPort.id,
			toPortId: this.toPort.id,
		};
	}
}

export interface ConnectionProps {
	id?: string;
	fromPort: OutputPort<any>;
	toPort: InputPort<any>;
}
