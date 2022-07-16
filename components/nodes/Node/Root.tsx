import { observer } from "mobx-react-lite";
import { useCallback, useRef } from "react";
import Draggable, { DraggableData } from "react-draggable";
import useOnClickOutside from "use-onclickoutside";

import { editorContext as editor } from "../../../editor-state";
import { Node as _Node } from "../../../node-engine";
import { GRID_SIZE } from "../../constants";

interface INodeRootProps {
	/**
	 * Internal representation of the node. This is only used for getting and
	 * setting the position of the node in the editor.
	 */
	node: _Node;

	/**
	 * Content of the node.
	 */
	children?: React.ReactNode;

	/**
	 * Node class.
	 */
	className?: string;

	/**
	 * Node styling.
	 */
	style?: React.CSSProperties;
}

export const Root = observer(
	({ node, children, className, style }: INodeRootProps) => {
		const onDrag = (_: unknown, { x, y }: DraggableData) => {
			node.data.position = { x, y };
		};

		const onClick = useCallback(() => {
			editor.selectedNode = node;
		}, []);

		const onClickOutside = useCallback(() => {
			if (editor.selectedNode === node) {
				editor.selectedNode = null;
			}
		}, [editor.selectedNode]);

		const ref = useRef<HTMLDivElement>(null);
		useOnClickOutside(ref, onClickOutside);

		return (
			<Draggable
				defaultPosition={{
					x: node.data.position ? node.data.position.x : 0,
					y: node.data.position ? node.data.position.y : 0,
				}}
				grid={[editor.scale * GRID_SIZE, editor.scale * GRID_SIZE]}
				scale={editor.scale}
				onDrag={onDrag}
				handle=".handle"
			>
				<div
					ref={ref}
					onClick={onClick}
					className={`absolute rounded transition-shadow duration-200 ${
						editor.selectedNode === node
							? "shadow-b2 shadow-zinc-400 dark:shadow-zinc-400"
							: "shadow-b1 shadow-zinc-200 dark:shadow-zinc-700"
					} ${className}`}
					style={{
						width: node.data.size.width,
						height: node.data.size.height,
						...style,
					}}
					children={children}
				/>
			</Draggable>
		);
	}
);
