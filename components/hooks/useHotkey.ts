import { useEffect } from "react";
import { useKeyPress, KeyCode } from "react-flow-renderer/nocss";

/**
 * Calls a function when a key is pressed.
 * @param key The key to listen for. Valid keys can be found in the
 * react-flow-renderer documentation.
 * @param fn Function to call on pressing the key.
 */
function useHotkey(key: KeyCode, fn: () => void) {
	const pressed = useKeyPress(key);

	useEffect(() => {
		if (pressed) {
			fn();
		}
	}, [pressed]);
}

export default useHotkey;
