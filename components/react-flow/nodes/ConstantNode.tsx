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
	const isConnected = useStore((state) => state.isConnected);

	const onDataChange = useOutput<ConstantData>(
		id,
		["result"],
		data,
		(data) => {
			return {
				result: data.value,
			};
		}
	);

	const onChange = useCallback((value: number) => {
		setNodeData(id, { value });
	}, []);

	return (
		<>
			<ConstantHandle
				type="target"
				id="value"
				value={data.value}
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
					value={data.value}
					onChange={onChange}
					isConnected={isConnected(id, "value")}
					className="shadow-green-ext-500 dark:shadow-green-ext-700 focus:shadow-green-ext-700 dark:focus:shadow-green-ext-500 text-green-ext-900 dark:text-green-ext-200"
				/>
			</Node.Root>

			<ConstantHandle
				type="source"
				id="result"
				value={data.output.result}
				selected={selected}
				position={Position.Right}
				onConnect={onDataChange}
				style={{
					top: 64,
				}}
			/>
		</>
	);
});

export default ConstantNode;
