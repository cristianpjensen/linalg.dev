import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useHotkeys } from "react-hotkeys-hook";
import useMouse from "@react-hook/mouse-position";
import { when } from "mobx";

import { Context as _Context, Connection as _Connection } from "../node-engine";
import { editorContext as editor } from "../editor-state";

export interface IConnectionsProps {
	context: _Context;
	className: string;
}

export const Connections = observer(
	({ context, className }: IConnectionsProps) => {
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

		// Escape remove the currently being connected connection
		useHotkeys("esc", () => {
			editor.connectingPort = null;
		});

		// If the node gets deleted while it is being connected, remove the
		// connection following the cursor
		when(
			() =>
				!!editor.connectingPort &&
				!Array.from(context.nodes.values()).includes(
					editor.connectingPort.node
				),
			() => (editor.connectingPort = null)
		);

		const selectedConnections = editor.selectedNode?.connections;

		return (
			<svg className={className} width="100%" height="100%">
				{Array.from(context.connections.values()).map((connection) => (
					<Connection
						key={connection.id}
						connection={connection}
						selected={
							selectedConnections
								? selectedConnections.includes(connection)
								: false
						}
					/>
				))}

				{editor.connectingPort && (
					<SteppedBezierLine
						x1={
							editor.connectingPort.data.position.x +
							editor.connectingPort.node.data.position.x
						}
						y1={
							editor.connectingPort.data.position.y +
							editor.connectingPort.node.data.position.y
						}
						x2={(mousePosition.x - editor.position.x) / editor.scale}
						y2={(mousePosition.y - editor.position.y) / editor.scale}
						className="stroke-zinc-300 dark:stroke-zinc-600 opacity-40"
						strokeWidth={2}
						fill="none"
					/>
				)}
			</svg>
		);
	}
);

interface IConnectionProps {
	connection: _Connection;
	selected: boolean;
}

export const Connection = observer(
	({ connection, selected }: IConnectionProps) => {
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

		return (
			<g className={`cursor-pointer pointer-events-auto`}>
				<SteppedBezierLine
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
					className="peer stroke-transparent"
					strokeWidth={24}
					fill="none"
				/>

				<SteppedBezierLine
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
					className={`transition-colors duration-200 ${
						selected
							? "stroke-zinc-400"
							: "stroke-zinc-300 dark:stroke-zinc-600 hover:stroke-zinc-400 dark:hover:stroke-zinc-400 peer-hover:stroke-zinc-400 dark:peer-hover:stroke-zinc-400"
					}`}
					strokeWidth={2}
					fill="none"
				/>
			</g>
		);
	}
);

interface ISteppedBezierLineProps {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	debug?: boolean;
	radius?: number;
	className?: string;
	id?: string;
	style?: React.CSSProperties;
	strokeWidth?: string | number;
	fill?: string;
	stroke?: string;
}

const SteppedBezierLine = ({
	x1,
	y1,
	x2: x6,
	y2: y6,
	debug = false,
	radius = 24,
	className,
	id,
	style,
	strokeWidth,
	fill,
	stroke,
}: ISteppedBezierLineProps) => {
	const left = x6 < x1;
	const down = y6 > y1;

	const cx = (x1 + x6) / 2;
	const dx = (x6 - x1) / 2;
	const dy = (y6 - y1) / 2;

	const rx = Math.min(radius, dx);
	const rnx = Math.min(radius, -dx);
	const ry = Math.min(radius, dy);
	const rny = Math.min(radius, -dy);

	const x2 = cx + radius * (left ? 1 : -1);
	const y2 = y1;

	const x3 = cx;
	const y3 = y1 + (down ? ry : -rny);

	const x4 = cx;
	const y4 = y6 + (down ? -ry : rny);

	const x5 = cx + radius * (left ? -1 : 1);
	const y5 = y6;

	const bx1 = cx + (left ? rnx * 0.4 : -rx * 0.4);
	const by1 = y1;

	const bx2 = cx;
	const by2 = y1 + (down ? ry * 0.4 : -rny * 0.4);

	const bx3 = cx;
	const by3 = y6 + (down ? -ry * 0.4 : rny * 0.4);

	const bx4 = cx + (left ? -rnx * 0.4 : rx * 0.4);
	const by4 = y6;

	return (
		<>
			<path
				id={id}
				d={`
					M ${x1.toFixed(3)} ${y1.toFixed(3)}
					L ${x2.toFixed(3)} ${y2.toFixed(3)}
					C ${bx1.toFixed(3)} ${by1.toFixed(3)}, ${bx2.toFixed(3)} ${by2.toFixed(3)}, ${x3.toFixed(3)} ${y3.toFixed(3)}
					L ${x4.toFixed(3)} ${y4.toFixed(3)}
					C ${bx3.toFixed(3)} ${by3.toFixed(3)}, ${bx4.toFixed(3)} ${by4.toFixed(3)}, ${x5.toFixed(3)} ${y5.toFixed(3)}
					L ${x6.toFixed(3)} ${y6.toFixed(3)}
				`}
				className={className}
				style={style}
				strokeWidth={strokeWidth}
				fill={fill}
				stroke={stroke}
			/>

			{debug && (
				<g className="stroke-red-500">
					<circle cx={x1} cy={y1} r={2} />
					<circle cx={x2} cy={y2} r={2} />
					<circle cx={x3} cy={y3} r={2} />
					<circle cx={x4} cy={y4} r={2} />
					<circle cx={x5} cy={y5} r={2} />
					<circle cx={x6} cy={y6} r={2} />
					<circle cx={bx1} cy={by1} r={2} />
					<circle cx={bx2} cy={by2} r={2} />
					<circle cx={bx3} cy={by3} r={2} />
					<circle cx={bx4} cy={by4} r={2} />
					<line x1={x2} y1={y2} x2={bx1} y2={by1} />
					<line x1={x3} y1={y3} x2={bx2} y2={by2} />
					<line x1={x4} y1={y4} x2={bx3} y2={by3} />
					<line x1={x5} y1={y5} x2={bx4} y2={by4} />
				</g>
			)}
		</>
	);
};
