import { useCallback } from "react";

function useOutput<T extends object>(fn: (data: Omit<T, "output">) => T) {
	return useCallback(fn, []);
}

export default useOutput;
