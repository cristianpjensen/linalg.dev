import { set } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useRef } from "react";
import Draggable, { DraggableData } from "react-draggable";
import useOnClickOutside from "use-onclickoutside";
import { editorContext } from "../../../editor";

import { Node as _Node } from "../../../node-engine";
import { useUIStore } from "../../../stores";
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
			set(node.data, "position", { x, y });
		};

		const scale = useUIStore((state) => state.scale);

		const onClick = useCallback(() => {
			editorContext.selectedNode = node;
		}, []);

		const onClickOutside = useCallback(() => {
			if (editorContext.selectedNode === node) {
				editorContext.selectedNode = null;
			}
		}, [editorContext.selectedNode])

		const ref = useRef<HTMLDivElement>(null);
		useOnClickOutside(ref, onClickOutside);

		return (
			<Draggable
				defaultPosition={{
					x: node.data.position ? node.data.position.x : 0,
					y: node.data.position ? node.data.position.y : 0,
				}}
				grid={[scale * GRID_SIZE, scale * GRID_SIZE]}
				scale={scale}
				onDrag={onDrag}
				handle=".handle"
			>
				<div
					ref={ref}
					onClick={onClick}
					className={`absolute rounded transition-shadow ${
						editorContext.selectedNode === node
							? "shadow-xl"
							: "shadow-md hover:shadow-lg"
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
