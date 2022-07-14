import { observable } from "mobx";
import { Port } from "../node-engine";

export interface EditorContext {
	/**
	 * The current port that is being connected to another port.
	 */
	connectingPort: Port<any> | null;
}

/**
 * The editor context is a singleton that is used to store global state.
 * It is used to store the current state of the editor, such as the current
 * port being connected, scale, current position in the editor, etc.
 */
export const editorContext = observable<EditorContext>({
	connectingPort: null,
});
