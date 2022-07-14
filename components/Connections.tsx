import { observer } from "mobx-react-lite";
import { getArrow } from "perfect-arrows";

import { Context as _Context, Connection as _Connection } from "../node-engine";
import { editorContext } from "../editor";

export interface IConnectionsProps {
	context: _Context;
	className: string;
}

export const Connections = observer(
	({ context, className }: IConnectionsProps) => {
		return (
			<svg className={className} width="100%" height="100%">
				{Array.from(context.connections.values()).map((connection) => (
					<Connection key={connection.id} connection={connection} />
				))}
			</svg>
		);
	}
);

interface IConnectionProps {
	connection: _Connection;
}

export const Connection = observer(({ connection }: IConnectionProps) => {
	if (
		!connection.fromPort.data.position ||
		!connection.toPort.data.position
	) {
		return null;
	}

	const fromPort = connection.fromPort;
	const toPort = connection.toPort;

	const x0 = fromPort.node.data.position.x + fromPort.data.position.x;
	const y0 = fromPort.node.data.position.y + fromPort.data.position.y;
	const x1 = toPort.node.data.position.x + toPort.data.position.x;
	const y1 = toPort.node.data.position.y + toPort.data.position.y;

	const [sx, sy, , , ex, ey] = getArrow(x0, y0, x1, y1);

	const selected =
		editorContext.selectedNode &&
		(fromPort.node === editorContext.selectedNode ||
			toPort.node === editorContext.selectedNode);
    
	return (
		<g className="cursor-pointer pointer-events-auto">
			<path
				className="peer stroke-transparent"
				d={`M${sx},${sy} ${ex},${ey}`}
				strokeWidth={24}
				fill="none"
			/>
			<path
				className={`transition-colors duration-200 hover:stroke-zinc-400 dark:hover:stroke-zinc-400 peer-hover:stroke-zinc-400 dark:peer-hover:stroke-zinc-400 ${
					selected ? "stroke-zinc-500 dark:stroke-zinc-400" : "stroke-zinc-300 dark:stroke-zinc-600"
				}`}
				d={`M${sx},${sy} ${ex},${ey}`}
				strokeWidth={2}
				fill="none"
			/>
		</g>
	);
});
