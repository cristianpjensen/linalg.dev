/**
 * This implementation of a node engine is HEAVILY inspired by the wire-core
 * package of Emil Widlund (https://github.com/emilwidlund/wire). The main
 * difference is that these files contain more documentation on the
 * implementation and a couple of small differences, such as file organization.
 * 
 * @usage
 * ```typescript
 * import { Context } from "node-engine";
 * import { AdditionNode } from "node-engine/nodes";
 * 
 * const context = new Context();
 * 
 * const nodeA = new AdditionNode(context);
 * const nodeB = new AdditionNode(context);
 * 
 * nodeA.outputPorts.result.connect(nodeB.inputPorts.x);
 * ```
 */

import { v4 as uuid } from "uuid";
import { observable, action } from "mobx";
import serializeObject from "serialize-javascript";

import { Node, NodePortProps } from "./node";
import { Connection, ConnectionProps } from "./connection";
import { PortType, OutputPort, InputPort } from "./port";
import * as Nodes from "./nodes";

export class Context {
	@observable public id: string;

	/**
	 * Optional data store that can contain any information about the context.
	 */
	@observable public data?: Data = {};

	/**
	 * The collection of nodes in this context.
	 */
	@observable public nodes: Map<string, Node<any, any>>;

	/**
	 * The collection of connections in this context.
	 */
	@observable public connections: Map<string, Connection>;

	constructor(props: ContextProps) {
		this.id = props.id || uuid();
		this.data = props.data;

		this.nodes = new Map<string, Node<any, any>>();
		this.connections = new Map<string, Connection>();
	}

	/**
	 * Creates a node and adds it to the context.
	 * @param node - The node to be added.
	 */
	@action public addNode(node: Node<any, any>) {
		if (node instanceof Node) {
			this.nodes.set(node.id, node);
			return node;
		}
	}

	/**
	 * Removes a node from the context.
	 * @param node - The node to be removed.
	 */
	@action public removeNode(node: Node<any, any>) {
		if (node instanceof Node && this.nodes.has(node.id)) {
			this.nodes.delete(node.id);
		} else {
			throw new Error("Node not found in context.");
		}
	}

	/**
	 * Creates a connection between an input and output port, and adds it to the
	 * context.
	 * @param props - Connection properties.
	 */
	@action public createConnection(props: ConnectionProps): Connection {
		const { fromPort, toPort } = props;

		// Connections can only go from output to input ports.
		if (fromPort.type !== PortType.OUTPUT) {
			throw new Error("`fromPort` must be an output port");
		}

		if (toPort.type !== PortType.INPUT) {
			throw new Error("`toPort` must be an input port");
		}

		// Do not allow multiple inputs, but do allow multiple outputs.
		if (toPort.isConnected) {
			throw new Error("`toPort` is already connected");
		}

		if (fromPort.node === toPort.node) {
			throw new Error("Cannot connect a port to itself");
		}

		const connection = new Connection(this, props);

		if (connection) {
			this.connections.set(connection.id, connection);
		}

		return connection;
	}

	/**
	 * Removes a connection from the context.
	 * @param connection - The connection to be removed.
	 */
	@action public removeConnection(connection: Connection) {
		if (this.connections.has(connection.id)) {
			this.connections.delete(connection.id);
		} else {
			throw new Error("Connection not found in context.");
		}
	}

	/**
	 * Serializes the context, such that it can be saved and loaded later.
	 * @returns A serialized representation of the context.
	 */
	serialize() {
		const serializedNodes = Array.from(this.nodes.values()).map((node) => node.serialize());
		const serializedConnections = Array.from(this.connections.values()).map((connection) => connection.serialize());

		return serializeObject({
			id: this.id,
			data: this.data,
			nodes: serializedNodes,
			connections: serializedConnections,
		});
	}

	static load(serialized: string): Context {
		const loadableContext: LoadableContext = eval(`(${serialized})`);

		const context = new this({
			id: loadableContext.id,
		});

		// Go over all nodes in the loaded context and add them to the current
		// context.
		for (const node of loadableContext.nodes) {
			// Figure out which node type it is.
			// @ts-ignore
			const nodeInstance = Nodes[node.name];

			// Add that node type with its properties to the context.
			if (Object.getPrototypeOf(nodeInstance) === Node) {
				new nodeInstance(context, node);
			}
		}

		// Go over all connections in the loaded context and add them to the
		// current context.
		for (const connection of loadableContext.connections) {
			let fromPort: OutputPort<any> | undefined = undefined;
			let toPort: InputPort<any> | undefined = undefined;

			// Look for the ports that make up the connection.
			context.nodes.forEach((node) => {
				for (const inputPort in node.inputPorts) {
					if (node.inputPorts[inputPort].id === connection.toPortId) {
						toPort = node.inputPorts[inputPort];
					}
				}

				for (const outputPort in node.outputPorts) {
					if (node.outputPorts[outputPort].id === connection.fromPortId) {
						fromPort = node.outputPorts[outputPort];
					}
				}
			});

			// Add the connection to the context.
			if (fromPort && toPort) {
				context.createConnection({
					id: connection.id,
					fromPort,
					toPort,
				});
			}
		}

		return context;
	}
}

interface ContextProps {
	id?: string;
	data?: Data;
}

export interface LoadableContext {
	id: string;
	data?: Data;
	nodes: Array<LoadableNode>;
	connections: Array<LoadableConnection>;
}

export interface LoadableNode {
	id: string;
	name: string;
	inputPorts?: NodePortProps<any>;
	outputPorts?: NodePortProps<any>;
	data?: Data;
}

export interface LoadableConnection {
	id: string;
	fromPortId: string;
	toPortId: string;
}

export interface Data {
	[key: string]: any;
}
