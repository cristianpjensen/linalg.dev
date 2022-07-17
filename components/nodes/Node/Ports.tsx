import { useEffect } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import {
	Node as _Node,
	InputPort as _InputPort,
	OutputPort as _OutputPort,
	Port as _Port,
	PortType,
} from "../../../node-engine";
import { editorContext as editor } from "../../../editor-state";

export interface INodePortsProps {
	node: _Node;
	omit?: _Port<any>[];
}

export const InputPorts = observer(({ node, omit }: INodePortsProps) => {
	const omitIds = omit?.map((port) => port.id);

	const inputPorts = Object.values(node.inputPorts).filter(
		(port) => !omitIds || !omitIds.includes(port.id)
	);

	return (
		<div className="absolute flex flex-col justify-evenly h-[calc(100%-32px)] top-8 -left-3">
			{inputPorts.map((port, index) => (
				<Port
					key={port.id}
					port={port}
					index={index}
					total={inputPorts.length}
				/>
			))}
		</div>
	);
});

export const OutputPorts = observer(({ node }: INodePortsProps) => {
	const outputPorts = Object.values(node.outputPorts);

	return (
		<div className="absolute top-8 flex flex-col justify-evenly h-[calc(100%-32px)] right-3">
			{outputPorts.map((port, index) => (
				<Port
					key={port.id}
					port={port}
					index={index}
					total={outputPorts.length}
				/>
			))}
		</div>
	);
});

export interface INodePortProps {
	port: _Port<any>;
	index: number;
	total: number;
}

export const Port = observer(({ port, index, total }: INodePortProps) => {
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

		if (editor.connectingPort?.node === port.node) {
			// If the port is currently the one being connected, cancel the connection
			editor.connectingPort = null;
		} else if (editor.connectingPort) {
			// Connect ports if possible, otherwise set the connecting port to this
			// one
			if (port.valueType !== editor.connectingPort.valueType) {
				editor.connectingPort = null;
			} else if (
				port instanceof _InputPort &&
				editor.connectingPort instanceof _OutputPort
			) {
				editor.connectingPort.connect(port);
				editor.connectingPort = null;
			} else if (
				port instanceof _OutputPort &&
				editor.connectingPort instanceof _InputPort
			) {
				port.connect(editor.connectingPort);
				editor.connectingPort = null;
			} else {
				editor.connectingPort = port;
			}
		} else {
			// If no port is being connected, set this port to be the one being
			// connected
			editor.connectingPort = port;
		}
	};

	useEffect(() => {
		if (port.data.position) return;

		const sectionSize = port.node.data.size.height / (total + 1);
		const x = port.type === PortType.OUTPUT ? port.node.data.size.width : 0;
		const y = sectionSize * (index + 1) + 2;
		port.data.position = { x, y: y + 14 };
	}, [port.node.data.size, index]);

	return (
		<button
			className={`absolute flex justify-center items-center w-6 h-6 text-[10px] cursor-pointer font-medium border-2 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 rounded-full bg-offwhite dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-400 transition-colors duration-200 ${
				editor.connectingPort === port
					? "bg-zinc-600 dark:bg-zinc-300"
					: ""
			} ${
				editor.connectingPort &&
				(editor.connectingPort.type === port.type ||
					editor.connectingPort.node === port.node ||
					editor.connectingPort.valueType !== port.valueType) &&
				editor.connectingPort !== port
					? "opacity-40"
					: ""
			} ${
				editor.selectedNode === port.node
					? "border-zinc-400 dark:border-zinc-400"
					: ""
			}`}
			style={
				port.type === PortType.INPUT
					? {
							left: port.data.position ? port.data.position.x : 0,
							top: port.data.position
								? port.data.position.y - 44
								: 0,
					  }
					: {}
			}
			onClick={onClick}
		>
			{port.valueType}
			{port.isConnected && port.type === PortType.INPUT && (
				<button className="absolute flex items-center justify-center w-6 h-6 transition-opacity bg-red-400 border-2 border-red-500 rounded-full opacity-0 dark:bg-red-500 dark:border-red-400 hover:opacity-100 text-offwhite">
					<Cross2Icon />
				</button>
			)}
		</button>
	);
});
