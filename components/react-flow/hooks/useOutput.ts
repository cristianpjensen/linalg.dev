import { useCallback, useEffect } from "react";
import useStore from "../store";

import { PropertyTypeString, ValidInputOutput } from "../types";

function useOutput<N extends { output: { [prop: string]: ValidInputOutput } }>(
	id: string,
	sourceHandles: Array<PropertyTypeString<N["output"]>>,
	data: N,
	fn: (data: Omit<N, "output">) => N["output"]
) {
	const updateChildren = useStore((state) => state.updateChildren);
	const memoizedFn = useCallback(fn, []);

	// Return this function, such that it can be called from outside the hook,
	// for example when the node gets connected
	const onDataChange = useCallback(() => {
		const output = memoizedFn(data);

		sourceHandles.forEach((sourceHandle) => {
			const outputProp = sourceHandle.split("-")[0];
			updateChildren(id, sourceHandle, output[outputProp]);
		});
	}, [data]);

	// Whenever the data changes, update the output values and then the children
	// connected to those outputs
	useEffect(() => {
		onDataChange();
	}, [data]);

	return onDataChange;
}

export default useOutput;
