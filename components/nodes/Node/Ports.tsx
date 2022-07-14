import { Cross2Icon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import {
	Node as _Node,
	InputPort as _InputPort,
	OutputPort as _OutputPort,
	Port as _Port,
	PortType,
} from "../../../node-engine";
import { editorContext } from "../../../editor";

export interface INodePortsProps {
	node: _Node;
	omit?: _Port<any>[];
}

export const InputPorts = observer(({ node, omit }: INodePortsProps) => {
	const omitIds = omit?.map((port) => port.id);

	return (
		<div className="absolute flex flex-col justify-around h-[calc(100%-32px)] top-8 -left-3">
			{Object.values(node.inputPorts).map(
				(port) =>
					omitIds?.includes(port.id) || (
						<Port key={port.id} port={port} />
					)
			)}
		</div>
	);
});

export const OutputPorts = observer(({ node }: INodePortsProps) => {
	return (
		<div className="absolute top-8 flex flex-col justify-around h-[calc(100%-32px)] -right-3">
			{Object.values(node.outputPorts).map((port) => (
				<Port key={port.id} port={port} />
			))}
		</div>
	);
});

export interface INodePortProps {
	port: _Port<any>;
}

export const Port = observer(({ port }: INodePortProps) => {
	const destroyConnections = () => {
		port.connections.forEach((connection) => {
			connection.destroy();
		});
	};

	const onClick = () => {
		if (port.isConnected && port.type === PortType.INPUT) {
			destroyConnections();
			return;
		}

		if (editorContext.connectingPort === port) {
			// If the port is currently the one being connected, cancel the connection
			editorContext.connectingPort = null;
		} else if (editorContext.connectingPort) {
			// Connect ports if possible, otherwise set the connecting port to this
			// one
			if (
				port instanceof _InputPort &&
				editorContext.connectingPort instanceof _OutputPort
			) {
				editorContext.connectingPort.connect(port);
				editorContext.connectingPort = null;
			} else if (
				port instanceof _OutputPort &&
				editorContext.connectingPort instanceof _InputPort
			) {
				port.connect(editorContext.connectingPort);
				editorContext.connectingPort = null;
			} else {
				editorContext.connectingPort = port;
			}
		} else {
			// If no port is being connected, set this port to be the one being
			// connected
			editorContext.connectingPort = port;
		}
	};

	return (
		<button
			className={`flex justify-center items-center w-6 h-6 text-[10px] cursor-pointer font-medium border-2 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 rounded-full bg-offwhite dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 ease-out ${
				editorContext.connectingPort === port
					? "bg-zinc-600 dark:bg-zinc-300"
					: ""
			} ${
				editorContext.connectingPort &&
				editorContext.connectingPort.type === port.type &&
				editorContext.connectingPort !== port
					? "opacity-40"
					: ""
			}`}
			onClick={onClick}
		>
			N
			{port.isConnected && port.type === PortType.INPUT && (
				<button className="absolute flex items-center justify-center w-6 h-6 transition-opacity bg-red-400 border-2 border-red-500 rounded-full opacity-0 dark:bg-red-500 dark:border-red-400 hover:opacity-100 text-offwhite">
					<Cross2Icon />
				</button>
			)}
		</button>
	);
});
