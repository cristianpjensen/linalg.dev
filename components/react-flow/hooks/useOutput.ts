import { useCallback, useEffect } from "react";
import useStore from "../store";

import { ValidInputOutput, ValidInputOutputString } from "../types";

// TODO: Do some TS trickery to have the second part of the sourceHandles be the
// type of the respective output type. So if the sourceHandle for "value" is a
// number, then allow sourceHandles to contain "value-number" and not
// "value-vector" or "value-matrix".
function useOutput<N extends { output: { [prop: string]: ValidInputOutput } }>(
	id: string,
	sourceHandles: `${Extract<
		keyof N["output"],
		string
	>}-${ValidInputOutputString}`[],
	data: N,
	fn: (data: Omit<N, "output">) => N["output"]
) {
	const updateChildren = useStore((state) => state.updateChildren);
	const memoizedFn = useCallback(fn, []);

	const onDataChange = useCallback(() => {
		console.log(1);
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
