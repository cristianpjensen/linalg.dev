import { observable } from "mobx";

import { Port, Node } from "../node-engine";

export enum Tool {
	HAND = "",
	VECTOR = "vector",
	MATRIX = "matrix",
	CONSTANT = "constant",
	UNARY_OPERATOR = "unary-operator",
	BINARY_OPERATOR = "binary-operator",
	EIGENVALUES = "eigenvalues",
	EIGENVECTORS = "eigenvectors",
}

export interface EditorContext {
	/**
	 * Current coordinates of the grid.
	 */
	position: { x: number; y: number };

	/**
	 * Current scale of the grid.
	 */
	scale: number;

	/**
	 * Current tool.
	 */
	tool: Tool;

	/**
	 * The current port that is being connected to another port.
	 */
	connectingPort: Port<any> | null;

	/**
	 * The currently selected node that is highlighted in the editor.
	 */
	selectedNode: Node | null;
}

/**
 * The editor context is a singleton that is used to store global state.
 * It is used to store the current state of the editor, such as the current
 * port being connected, scale, current position in the editor, etc.
 */
export const editorContext = observable<EditorContext>({
	position: { x: 10, y: 58 },
	scale: 1,
	tool: Tool.HAND,
	connectingPort: null,
	selectedNode: null,
});
