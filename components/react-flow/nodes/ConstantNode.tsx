import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";

import type { ConstantData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const ConstantHandle = Node.Handle<ConstantData>;

const ConstantNode = memo(({ id, data, selected }: NodeProps<ConstantData>) => {
	const setNodeData = useStore((state) => state.setNodeData);

	useOutput<ConstantData>(id, ["result"], data, (data) => {
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
			title="Constant"
			color="green-ext"
			width={144}
			height={120}
			selected={selected}
		>
			<ConstantHandle
				type="target"
				id="value"
				nodeId={id}
				value={data.value.value}
				isConnected={data.value.isConnected}
				selected={selected}
				position={Position.Left}
				style={{
					top: 64,
				}}
			/>

			<Node.Dragger />

			<Node.NumberInput
				value={data.value.value}
				isConnected={data.value.isConnected}
				onChange={onChange}
			/>

			<ConstantHandle
				type="source"
				id="result"
				nodeId={id}
				value={data.output.result}
				selected={selected}
				position={Position.Right}
				style={{
					top: 64,
				}}
			/>
		</Node.Root>
	);
});

export default ConstantNode;
