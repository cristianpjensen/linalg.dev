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
import { useWindowHeight } from "@react-hook/window-size";

import { Tool, useEditorStore, useNodeStore } from "../stores";
import nodeTypes from "./nodes/nodeTypes";
import Edge from "./custom/Edge";
import {
	binaryOperationNodeObject,
	constantNodeObject,
	eigenvaluesNodeObject,
	eigenvectorsNodeObject,
	matrixMultiplicationNodeObject,
	matrixNodeObject,
	normNodeObject,
	sliderNodeObject,
	transformNodeObject,
	transposeNodeObject,
	unaryOperationNodeObject,
	vectorNodeObject,
	vectorScalingNodeObject,
} from "./nodes/nodeObjects";

const edgeTypes = {
	default: Edge,
};

const nodeClassNames: {
	[key: string]: "green" | "yellow" | "blue" | "purple";
} = {
	vector: "blue",
	matrix: "blue",
	constant: "green",
	slider: "green",
	unaryOperation: "yellow",
	binaryOperation: "yellow",
	norm: "blue",
	transform: "blue",
	vectorScaling: "blue",
	transpose: "blue",
	matrixMultiplication: "blue",
	eigenvalues: "purple",
	eigenvectors: "purple",
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

				case Tool.Slider:
					reactFlow.addNodes(sliderNodeObject(position));
					break;

				case Tool.UnaryOperation:
					reactFlow.addNodes(unaryOperationNodeObject(position));
					break;

				case Tool.BinaryOperation:
					reactFlow.addNodes(binaryOperationNodeObject(position));
					break;

				case Tool.Norm:
					reactFlow.addNodes(normNodeObject(position));
					break;

				case Tool.Transformed:
					reactFlow.addNodes(transformNodeObject(position));
					break;

				case Tool.VectorScaling:
					reactFlow.addNodes(vectorScalingNodeObject(position));
					break;

				case Tool.Transpose:
					reactFlow.addNodes(transposeNodeObject(position));
					break;

				case Tool.MatrixMultiplication:
					reactFlow.addNodes(
						matrixMultiplicationNodeObject(position)
					);
					break;

				case Tool.Eigenvalues:
					reactFlow.addNodes(eigenvaluesNodeObject(position));
					break;

				case Tool.Eigenvectors:
					reactFlow.addNodes(eigenvectorsNodeObject(position));
					break;
			}

			setTool(Tool.Hand);
		},
		[tool]
	);

	const height = useWindowHeight();

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
				height,
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
