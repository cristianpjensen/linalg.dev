import { Cross2Icon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import { Node as _Node, Port as _Port } from "../../../node-engine";

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

	return (
		<div className="flex justify-center items-center w-6 h-6 text-[10px] cursor-pointer font-medium border-2 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 rounded-full bg-offwhite dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-200 ease-out">
			N
			{port.isConnected && (
				<button
					className="absolute flex items-center justify-center w-6 h-6 transition-opacity bg-red-500 border-2 border-red-400 rounded-full opacity-0 hover:opacity-100 text-offwhite"
					onClick={destroyConnections}
				>
					<Cross2Icon />
				</button>
			)}
		</div>
	);
});
