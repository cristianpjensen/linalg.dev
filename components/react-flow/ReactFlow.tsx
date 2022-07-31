import React, { useCallback, useState } from "react";
import ReactFlow, {
	Background,
	BackgroundVariant,
	MiniMap,
	Node,
	OnEdgeUpdateFunc,
	useKeyPress,
} from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";

import useStore from "./store";
import nodeTypes from "./nodes/nodeTypes";

const nodeClassName = (node: Node<any>) => {
	switch (node.type) {
		case "constant":
			return "green";

		case "unaryOperator":
			return "yellow";

		case "binaryOperator":
			return "yellow";

		default:
			return "basic";
	}
};

const Flow = () => {
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
		useStore();

	const isShiftPressed = useKeyPress("Shift");

	const [isConnecting, setIsConnecting] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const onConnectStart = useCallback(() => {
		setIsConnecting(true);
	}, []);
	const onConnectEnd = useCallback(() => {
		setIsConnecting(false);
	}, []);

	const onDragStart = useCallback(() => setIsDragging(true), []);
	const onDragEnd = useCallback(() => setIsDragging(false), []);

	return (
		<ReactFlow
			style={{
				position: "absolute",
				cursor: isConnecting
					? "crosshair"
					: isShiftPressed
					? "default"
					: isDragging
					? "grabbing"
					: "grab",
				height: window.innerHeight,
			}}
			onConnectStart={onConnectStart}
			onConnectEnd={onConnectEnd}
			onNodeDragStart={onDragStart}
			onNodeDragStop={onDragEnd}
			onPointerDown={onDragStart}
			onPointerUp={onDragEnd}
			nodeTypes={nodeTypes}
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			snapGrid={[24, 24]}
			defaultZoom={1}
			minZoom={0.2}
			maxZoom={2}
			snapToGrid
			elevateEdgesOnSelect
		>
			<Background
				className="bg-offwhite dark:bg-offblack grandchild:stroke-zinc-300 dark:grandchild:stroke-zinc-800 grandchild:opacity-20"
				variant={BackgroundVariant.Lines}
				gap={24}
				size={1}
			/>
			<MiniMap
				className="bg-zinc-300 dark:bg-zinc-900"
				nodeClassName={nodeClassName}
				nodeStrokeWidth={1}
				maskColor="none"
			/>
		</ReactFlow>
	);
};

export default Flow;
