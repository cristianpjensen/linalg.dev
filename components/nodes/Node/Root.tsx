import { set } from "mobx";
import { observer } from "mobx-react-lite";
import Draggable, { DraggableData } from "react-draggable";

import { Node as _Node } from "../../../node-engine";
import { GRID_SIZE } from "../../constants";

interface INodeRoot {
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
	({ node, children, className, style }: INodeRoot) => {
		const onDrag = (_: unknown, { x, y }: DraggableData) => {
			set(node.data, "position", { x, y });
		};

		const scale = 1;

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
					className={`absolute rounded shadow-md hover:shadow-lg transition-shadow ${className}`}
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
