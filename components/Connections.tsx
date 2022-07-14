import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useHotkeys } from "react-hotkeys-hook";
import useMouse from "@react-hook/mouse-position";
import { when } from "mobx";

import { Context as _Context, Connection as _Connection } from "../node-engine";
import { editorContext } from "../editor";
import { useUIStore } from "../stores";

export interface IConnectionsProps {
	context: _Context;
	className: string;
}

export const Connections = observer(
	({ context, className }: IConnectionsProps) => {
		const scale = useUIStore((state) => state.scale);
		const mouse = useMouse(document.getElementById("editor"));

		// Use states, such that the connection won't be removed when hovering over
		// something else (making mouse.clientX and mouse.clientY null)
		const [mousePosition, setMousePosition] = useState({
			x: 0,
			y: 0,
		});

		useEffect(() => {
			if (mouse.clientX && mouse.clientY) {
				setMousePosition({ x: mouse.clientX, y: mouse.clientY });
			}
		}, [mouse]);

		const { x, y } = useUIStore((state) => ({
			x: state.x,
			y: state.y,
		}));

		// Escape remove the currently being connected connection
		useHotkeys("esc", () => {
			editorContext.connectingPort = null;
		});

		// If the node gets deleted while it is being connected, remove the
		// connection following the cursor
		when(
			() =>
				!!editorContext.connectingPort &&
				!Array.from(context.nodes.values()).includes(
					editorContext.connectingPort.node
				),
			() => (editorContext.connectingPort = null)
		);

		return (
			<svg className={className} width="100%" height="100%">
				{Array.from(context.connections.values()).map((connection) => (
					<Connection key={connection.id} connection={connection} />
				))}

				{editorContext.connectingPort && (
					<line
						className="stroke-zinc-300 dark:stroke-zinc-600 opacity-40"
						strokeWidth={2}
						x1={
							editorContext.connectingPort.data.position.x +
							editorContext.connectingPort.node.data.position.x
						}
						y1={
							editorContext.connectingPort.data.position.y +
							editorContext.connectingPort.node.data.position.y
						}
						x2={(mousePosition.x - x) / scale}
						y2={(mousePosition.y - y) / scale}
					/>
				)}
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

	// Port position is relative to the node
	const x1 = fromPort.node.data.position.x + fromPort.data.position.x;
	const y1 = fromPort.node.data.position.y + fromPort.data.position.y;
	const x2 = toPort.node.data.position.x + toPort.data.position.x;
	const y2 = toPort.node.data.position.y + toPort.data.position.y;

	const selected =
		editorContext.selectedNode &&
		(fromPort.node === editorContext.selectedNode ||
			toPort.node === editorContext.selectedNode);

	return (
		<g className="cursor-pointer pointer-events-auto">
			<line
				className="peer stroke-transparent"
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				strokeWidth={24}
				fill="none"
			/>
			<line
				className={`transition-colors duration-200 hover:stroke-zinc-400 dark:hover:stroke-zinc-400 peer-hover:stroke-zinc-400 dark:peer-hover:stroke-zinc-400 ${
					selected
						? "stroke-zinc-400"
						: "stroke-zinc-300 dark:stroke-zinc-600"
				}`}
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				strokeWidth={2}
				fill="none"
			/>
		</g>
	);
});
