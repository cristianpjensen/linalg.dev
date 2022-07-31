import React, { useCallback, useState } from "react";
import ReactFlow, {
	Background,
	BackgroundVariant,
	MiniMap,
	Node,
	useKeyPress,
} from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";

import useStore from "./store";
import nodeTypes from "./nodes/nodeTypes";
import Edge from "./custom/Edge";

const edgeTypes = {
	default: Edge,
};

const nodeClassName = (node: Node<any>) => {
	switch (node.type) {
		case "constant":
			return "green";

		case "unaryOperation":
			return "yellow";

		case "binaryOperation":
			return "yellow";

		case "vector":
			return "blue";

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
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
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
				nodeStrokeWidth={2}
				maskColor="none"
			/>
		</ReactFlow>
	);
};

export default Flow;
