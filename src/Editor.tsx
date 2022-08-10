import React, { useCallback, useEffect, useState, useRef } from "react";
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

import { Tool, useEditorStore, useNodeStore } from "../stores";
import nodeTypes from "./nodes/nodeTypes";
import Edge from "./nodes/custom/Edge";
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
	vectorComponentsNodeObject,
	vectorNodeObject,
	vectorScalingNodeObject,
	planeNodeObject,
} from "./nodes/nodeObjects";

const edgeTypes = {
	default: Edge,
};

const nodeClassNames: {
	[key: string]: "green" | "yellow" | "blue" | "purple" | "red";
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
	vectorComponents: "blue",
	transpose: "blue",
	matrixMultiplication: "blue",
	eigenvalues: "purple",
	eigenvectors: "purple",
	plane: "red",
};

const nodeClassName = (node: Node<any>) => {
	return node.type && nodeClassNames[node.type]
		? nodeClassNames[node.type]
		: "basic";
};

type IEditorProps = {
	minimap?: boolean;
	className?: string;
	style?: React.CSSProperties;
};

const Editor = ({ minimap = true, className, style }: IEditorProps) => {
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
		useNodeStore();
	const tool = useEditorStore((state) => state.tool);
	const setTool = useEditorStore((state) => state.setTool);
	const selectedVectorNode = useEditorStore(
		(state) => state.selectedVectorNode
	);
	const selectedVectorFrom = useEditorStore(
		(state) => state.selectedVectorFrom
	);
	const setSelectedNode = useEditorStore(
		(state) => state.setSelectedNode
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
			setSelectedNode(null, null);
		}
	}, [selectedVectorNode, selectedVectorFrom]);

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
				setSelectedNode(null, null);
				return;
			}

			setSelectedNode(nodes[0], "editor");
		},
		[]
	);

	const ref = useRef<HTMLDivElement>(null);

	const onAddNode = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			if (tool === Tool.Hand) {
				return;
			}

			const bounds = ref.current?.getBoundingClientRect();
			const x = bounds ? bounds.x : 0;
			const y = bounds ? bounds.y : 0;
			const position = reactFlow.project({
				x: e.clientX - x,
				y: e.clientY - y,
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

				case Tool.VectorComponents:
					reactFlow.addNodes(vectorComponentsNodeObject(position));
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

				case Tool.Plane:
					reactFlow.addNodes(planeNodeObject(position));
					break;
			}

			setTool(Tool.Hand);
		},
		[tool, ref.current]
	);

	return (
		<>
			<ReactFlow
				ref={ref}
				style={{
					cursor:
						isConnecting || tool !== Tool.Hand
							? "crosshair"
							: isShiftPressed
							? "default"
							: isDragging
							? "grabbing"
							: "grab",
					...style,
				}}
				className={className}
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
				{minimap && (
					<MiniMap
						className="bg-zinc-300 dark:bg-zinc-900"
						nodeClassName={nodeClassName}
						nodeBorderRadius={4}
						nodeStrokeWidth={2}
						maskColor="none"
					/>
				)}
			</ReactFlow>
		</>
	);
};

export default Editor;