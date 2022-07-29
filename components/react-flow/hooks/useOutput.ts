import { useCallback } from "react";

/**
 * The function should take an object without output and returns it with output.
 * The hook is basically just an abstraction for the types.
 */
function useOutput<N extends object>(fn: (data: Omit<N, "output">) => N) {
	return useCallback(fn, []);
}

export default useOutput;
