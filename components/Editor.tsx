import React, { useCallback, useState } from "react";
import ReactFlow, {
	Background,
	BackgroundVariant,
	MiniMap,
	Node,
	ReactFlowProvider,
	useKeyPress,
	useReactFlow,
} from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";

import { Tool, useEditorStore, useNodeStore } from "../stores";
import nodeTypes from "./nodes/nodeTypes";
import Edge from "./custom/Edge";
import {
	binaryOperationObject,
	constantNodeObject,
	matrixNodeObject,
	unaryOperationObject,
	vectorNodeObject,
} from "./nodes/nodeObjects";

const edgeTypes = {
	default: Edge,
};

const nodeClassNames: { [key: string]: string } = {
	constant: "green",
	unaryOperation: "yellow",
	binaryOperation: "yellow",
	vector: "blue",
	matrix: "blue",
};

const nodeClassName = (node: Node<any>) => {
	return node.type && nodeClassNames[node.type]
		? nodeClassNames[node.type]
		: "basic";
};

const Editor = () => (
	<ReactFlowProvider>
		<Flow />
	</ReactFlowProvider>
);

const Flow = () => {
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
		useNodeStore();
	const tool = useEditorStore((state) => state.tool);
	const setTool = useEditorStore((state) => state.setTool);

	const reactFlow = useReactFlow();
	const isShiftPressed = useKeyPress("Shift");

	const [isConnecting, setIsConnecting] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const onConnectStart = useCallback(() => setIsConnecting(true), []);
	const onConnectEnd = useCallback(() => setIsConnecting(false), []);
	const onDragStart = useCallback(() => setIsDragging(true), []);
	const onDragEnd = useCallback(() => setIsDragging(false), []);

	const onAddNode = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			const position = reactFlow.project({ x: e.clientX, y: e.clientY });

			switch (tool) {
				case Tool.Vector:
					reactFlow.addNodes(vectorNodeObject(position));
					break;

				case Tool.Matrix:
					reactFlow.addNodes(matrixNodeObject(position));
					break;

				case Tool.Constant:
					reactFlow.addNodes(constantNodeObject(position));
					break;

				case Tool.UnaryOperation:
					reactFlow.addNodes(unaryOperationObject(position));
					break;

				case Tool.BinaryOperation:
					reactFlow.addNodes(binaryOperationObject(position));
					break;
			}

			setTool(Tool.Hand);
		},
		[tool]
	);

	return (
		<ReactFlow
			style={{
				position: "absolute",
				cursor:
					isConnecting || tool !== Tool.Hand
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
			onClick={onAddNode}
			snapGrid={[24, 24]}
			defaultZoom={1}
			minZoom={0.2}
			maxZoom={2}
			panOnDrag={tool === Tool.Hand}
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

export default Editor;
