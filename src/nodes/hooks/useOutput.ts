import { useCallback, useEffect, useState } from "react";

import type { ValidInputOutput } from "../types";
import useStore from "../../../stores/nodes";

function useOutput<N extends { output: { [prop: string]: ValidInputOutput } }>(
	id: string,
	data: N,
	fn: (data: Omit<N, "output">) => N["output"]
) {
	const updateChildren = useStore((state) => state.updateChildren);
	const memoizedFn = useCallback(fn, []);
	const [output, setOutput] = useState(memoizedFn(data));

	// Return this function, such that it can be called from outside the hook,
	// for example when the node gets connected
	const onDataChange = useCallback(() => {
		const output = memoizedFn(data);
		setOutput(output);

		Object.keys(output).forEach((sourceHandle) => {
			updateChildren(id, sourceHandle, output[sourceHandle]);
		});

	}, [data]);

	// Whenever the data changes, update the output values and then the children
	// connected to those outputs
	useEffect(() => {
		onDataChange();
	}, [data]);

	return output;
}

export default useOutput;
