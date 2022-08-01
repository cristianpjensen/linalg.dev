import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { ConstantData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const ConstantNode = memo(({ id, data, selected }: NodeProps<ConstantData>) => {
	const setNodeData = useStore((state) => state.setNodeData);

	useOutput(id, ["result"], data, (data) => {
		return {
			result: data.value.value,
		};
	});

	const onChange = useCallback((value: number) => {
		// Since we are able to change the value, the handle is not connected
		setNodeData(id, { value: { value, isConnected: false } });
	}, []);

	return (
		<Node.Root
			id={id}
			data={data}
			selected={selected}
			title="Constant"
			color="green-ext"
			width={144}
			height={120}
		>
			<Node.Dragger />

			<Node.Handle type="target" id="value" top={64} />
			<Node.NumberInput id="value" onChange={onChange} />

			<Node.Handle type="source" id="result" top={64} />
		</Node.Root>
	);
});

export default ConstantNode;
