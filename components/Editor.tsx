import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
	Background,
	BackgroundVariant,
	MiniMap,
	Node,
	OnSelectionChangeFunc,
	useKeyPress,
	useReactFlow,
} from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";
import { useWindowSize } from "@react-hook/window-size";

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
import Toolbar from "./Toolbar";
import { VectorData } from "./nodes/types";

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

const Editor = () => {
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
		useNodeStore();
	const tool = useEditorStore((state) => state.tool);
	const setTool = useEditorStore((state) => state.setTool);
	const vectorSpaceSize = useEditorStore((state) => state.vectorSpaceSize);
	const selectedVectorNode = useEditorStore(
		(state) => state.selectedVectorNode
	);
	const selectedVectorFrom = useEditorStore(
		(state) => state.selectedVectorFrom
	);
	const setSelectedVectorNode = useEditorStore(
		(state) => state.setSelectedVectorNode
	);

	useEffect(() => {
		if (
			selectedVectorNode &&
			selectedVectorNode.width &&
			selectedVectorNode.height &&
			selectedVectorFrom === "space"
		) {
			const x =
				selectedVectorNode.position.x + selectedVectorNode.width / 2;
			const y =
				selectedVectorNode.position.y + selectedVectorNode.height / 2;
			const zoom = 1.85;

			reactFlow.setCenter(x, y, { zoom, duration: 400 });

			// Reset selection after moving toward the node
			setSelectedVectorNode(null, null);
		}
	}, [selectedVectorNode, selectedVectorFrom]);

	const [width, height] = useWindowSize();

	const reactFlow = useReactFlow();
	const isShiftPressed = useKeyPress("Shift");

	const [isConnecting, setIsConnecting] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const onConnectStart = useCallback(() => setIsConnecting(true), []);
	const onConnectEnd = useCallback(() => setIsConnecting(false), []);
	const onDragStart = useCallback(() => setIsDragging(true), []);
	const onDragEnd = useCallback(() => setIsDragging(false), []);

	const onSelectionChange: OnSelectionChangeFunc = useCallback(
		({ nodes }) => {
			if (
				nodes.length !== 1 ||
				(nodes[0].type !== "vector" &&
					nodes[0].type !== "vectorScaling" &&
					nodes[0].type !== "transform")
			) {
				setSelectedVectorNode(null, null);
				return;
			}

			const node = { ...nodes[0] };

			// Add origin to camera position
			if (node.data.origin) {
				node.data.output.x += node.data.origin.value.x;
				node.data.output.y += node.data.origin.value.y;
				node.data.output.z += node.data.origin.value.z;
			}

			setSelectedVectorNode(node, "editor");
		},
		[]
	);

	const onAddNode = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			if (tool === Tool.Hand) {
				return;
			}

			const position = reactFlow.project({
				x: e.clientX,
				y: e.clientY - 48,
			});

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

	return (
		<>
			<Toolbar />
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
					width: (1 - 1 / vectorSpaceSize) * width,
					height: height - 48,
					marginTop: 48,
				}}
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onConnectStart={onConnectStart}
				onConnectEnd={onConnectEnd}
				onNodeDragStart={onDragStart}
				onNodeDragStop={onDragEnd}
				onSelectionDragStart={onDragStart}
				onSelectionDragStop={onDragEnd}
				onPointerDown={onDragStart}
				onPointerUp={onDragEnd}
				onClick={onAddNode}
				onSelectionChange={onSelectionChange}
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
					nodeBorderRadius={4}
					nodeStrokeWidth={2}
					maskColor="none"
				/>
			</ReactFlow>
		</>
	);
};

export default Editor;
