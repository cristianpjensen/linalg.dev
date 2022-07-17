import React, { useCallback, useState, useEffect } from "react";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { observer } from "mobx-react-lite";

import {
	BINARY_OPERATOR_HEIGHT,
	BINARY_OPERATOR_WIDTH,
	CONSTANT_HEIGHT,
	CONSTANT_WIDTH,
	GRID_SIZE,
	SLIDER_HEIGHT,
	SLIDER_WIDTH,
	UNARY_OPERATOR_HEIGHT,
	UNARY_OPERATOR_WIDTH,
	VECTOR_HEIGHT,
	VECTOR_WIDTH,
} from "./constants";
import {
	Context as _NodeContext,
	ConstantNode as _ConstantNode,
	SliderNode as _SliderNode,
	UnaryOperatorNode as _UnaryOperatorNode,
	BinaryOperatorNode as _BinaryOperatorNode,
	VectorNode as _VectorNode,
} from "../node-engine";
import { NodeWrapper } from "./nodes/NodeWrapper";
import { Connections } from "./Connections";
import { EditorContext, Tool } from "../editor-state";

const useGesture = createUseGesture([dragAction, pinchAction]);

interface IEditorProps {
	context: _NodeContext;
	editorContext: EditorContext;
}

const Editor = observer(({ context, editorContext: editor }: IEditorProps) => {
	useEffect(() => {
		// Disables default browser pinch-to-zoom when pinching the grid, such that
		// it only zooms in as wanted on the grid
		const disablePinchToZoom = (e: WheelEvent) => {
			if (e.ctrlKey) {
				e.preventDefault();
			}
		};

		window.addEventListener("wheel", disablePinchToZoom, {
			passive: false,
		});

		return () => {
			window.removeEventListener("wheel", disablePinchToZoom);
		};
	}, []);

	const getNodePosition_ = (
		mouse: { x: number; y: number },
		size: { width: number; height: number }
	) => {
		return getNodePosition(editor.position, mouse, size, editor.scale);
	};

	const onGridClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			switch (editor.tool) {
				case Tool.HAND:
					return;

				case Tool.CONSTANT:
					new _ConstantNode(context, {
						data: {
							position: getNodePosition_(
								{ x: e.clientX, y: e.clientY },
								{
									width: CONSTANT_WIDTH,
									height: CONSTANT_HEIGHT,
								}
							),
							size: {
								width: CONSTANT_WIDTH,
								height: CONSTANT_HEIGHT,
							},
						},
					});
					break;

				case Tool.SLIDER:
					new _SliderNode(context, {
						data: {
							position: getNodePosition_(
								{ x: e.clientX, y: e.clientY },
								{
									width: SLIDER_WIDTH,
									height: SLIDER_HEIGHT,
								}
							),
							size: {
								width: SLIDER_WIDTH,
								height: SLIDER_HEIGHT,
							},
						},
					});
					break;

				case Tool.UNARY_OPERATOR:
					new _UnaryOperatorNode(context, {
						data: {
							position: getNodePosition_(
								{ x: e.clientX, y: e.clientY },
								{
									width: UNARY_OPERATOR_WIDTH,
									height: UNARY_OPERATOR_HEIGHT,
								}
							),
							size: {
								width: UNARY_OPERATOR_WIDTH,
								height: UNARY_OPERATOR_HEIGHT,
							},
						},
					});
					break;

				case Tool.BINARY_OPERATOR:
					new _BinaryOperatorNode(context, {
						data: {
							position: getNodePosition_(
								{ x: e.clientX, y: e.clientY },
								{
									width: BINARY_OPERATOR_WIDTH,
									height: BINARY_OPERATOR_HEIGHT,
								}
							),
							size: {
								width: BINARY_OPERATOR_WIDTH,
								height: BINARY_OPERATOR_HEIGHT,
							},
						},
					});
					break;

				case Tool.VECTOR:
					new _VectorNode(context, {
						data: {
							position: getNodePosition_(
								{ x: e.clientX, y: e.clientY },
								{
									width: VECTOR_WIDTH,
									height: VECTOR_HEIGHT,
								}
							),
							size: {
								width: VECTOR_WIDTH,
								height: VECTOR_HEIGHT,
							},
						},
					});
					break;
			}

			editor.tool = Tool.HAND;
		},
		[editor.tool]
	);

	const [pointerDown, setPointerDown] = useState(false);

	const bind = useGesture({
		onDrag: ({ initial: [ix, iy], xy: [mx, my], first, memo }) => {
			if (editor.tool !== Tool.HAND) {
				return;
			}

			if (first) {
				memo = { ...editor.position };
			}

			editor.position.x = memo.x + (mx - ix);
			editor.position.y = memo.y + (my - iy);

			return memo;
		},
		onDragStart: () => {
			if (editor.tool !== Tool.HAND) {
				return;
			}

			setPointerDown(true);
		},
		onDragEnd: () => {
			setPointerDown(false);
		},
		onPinch: ({
			origin: [ox, oy],
			movement: [ms],
			direction: [dir],
			first,
			memo,
		}) => {
			if (
				(editor.scale <= 0.2 && dir === -1) ||
				(editor.scale >= 2 && dir === 1)
			) {
				return memo;
			}

			if (first) {
				const tx = ox - editor.position.x + 12;
				const ty = oy - editor.position.y + 12;
				memo = [
					editor.position.x,
					editor.position.y,
					tx,
					ty,
					editor.scale,
				];
			}

			editor.position.x = memo[0] - (ms - 1) * memo[2];
			editor.position.y = memo[1] - (ms - 1) * memo[3];
			editor.scale = Math.min(Math.max(ms * memo[4], 0.2), 2);

			return memo;
		},
	});

	return (
		<div id="editor" className="relative w-full h-screen overflow-hidden">
			<div
				className="absolute top-0 bottom-0 left-0 right-0 bg-repeat select-none bg-offwhite dark:bg-offblack touch-none"
				id="grid"
				style={{
					backgroundImage:
						"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgB7dOrEcMwEEBByTYITCkpITA9GaunQJeQUgIN9IkEUoRHu+Tm4L2Ziymlx7qurxjjmXM+9n3/hIks27Y9W2u3Wut9hAiTWcbx/6VHOMNkllLKu0f4jhfo8wgAAAAAAAAAAAAAAAAAAAAX9APY5yL/ZyiGWAAAAABJRU5ErkJggg==)",
					backgroundSize: editor.scale * GRID_SIZE,
					backgroundPositionX: editor.position.x,
					backgroundPositionY: editor.position.y,
					cursor:
						editor.tool === Tool.HAND
							? pointerDown
								? "grabbing"
								: "grab"
							: "crosshair",
				}}
				onClick={onGridClick}
				{...bind()}
			>
				{/* Crosshair at (0,0) */}
				<div
					className="w-0 h-0"
					style={{
						translate: `${editor.position.x}px ${editor.position.y}px`,
						transform: `scale(${editor.scale})`,
					}}
				>
					<div
						className="absolute w-2 bg-gray-400 rounded-sm dark:bg-gray-600"
						style={{ height: 1.25, marginLeft: -3.375 }}
					/>
					<div
						className="absolute h-2 bg-gray-400 rounded-sm dark:bg-gray-600"
						style={{ width: 1.25, marginTop: -3.375 }}
					/>
				</div>
			</div>

			<div
				className="w-0 h-0"
				style={{
					translate: `${editor.position.x}px ${editor.position.y}px`,
					transform: `scale(${editor.scale})`,
				}}
			>
				<Connections
					className="absolute top-0 left-0 w-1 h-1 overflow-visible pointer-events-none"
					context={context}
				/>
				<Nodes context={context} />
			</div>
		</div>
	);
});

const Nodes = observer(({ context }: { context: _NodeContext }) => {
	return (
		<>
			{Array.from(context.nodes.values()).map((node) => (
				<NodeWrapper key={node.id} node={node} />
			))}
		</>
	);
});

function getNodePosition(
	position: {
		x: number;
		y: number;
	},
	mouse: {
		x: number;
		y: number;
	},
	node: {
		width: number;
		height: number;
	},
	scale: number
) {
	return {
		x:
			Math.round(
				(mouse.x - position.x - node.width * 0.5) / (GRID_SIZE * scale)
			) * GRID_SIZE,
		y:
			Math.round(
				(mouse.y - position.y - node.height * 0.5) / (GRID_SIZE * scale)
			) * GRID_SIZE,
	};
}

export default Editor;
