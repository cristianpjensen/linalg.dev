import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";

import type { ConstantData } from "../types";
import Handle from "../custom/Handle";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const ConstantHandle = Handle<ConstantData>;

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
		<>
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

			<Node.Root
				selected={selected}
				className="w-[144px] h-[120px] bg-green-ext-200 dark:bg-green-ext-800 text-green-ext-900 dark:text-green-ext-100"
			>
				<Node.Dragger
					title="Constant"
					className="bg-green-ext-700 dark:bg-green-ext-900 text-green-ext-200 dark:text-green-ext-100"
				/>

				<Node.NumberInput
					value={data.value.value}
					onChange={onChange}
					isConnected={data.value.isConnected}
					className="shadow-green-ext-500 dark:shadow-green-ext-700 focus:shadow-green-ext-700 dark:focus:shadow-green-ext-500 text-green-ext-900 dark:text-green-ext-200"
				/>
			</Node.Root>

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
		</>
	);
});

export default ConstantNode;
