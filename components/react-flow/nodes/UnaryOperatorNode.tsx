import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";

import type { UnaryOperatorData } from "../types";
import Handle from "../custom/Handle";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const UnaryOperatorHandle = Handle<Omit<UnaryOperatorData, "operator">>;

const UnaryOperatorNode = memo(
	({ id, data, selected }: NodeProps<UnaryOperatorData>) => {
		const setNodeData = useStore((state) => state.setNodeData);

		useOutput<UnaryOperatorData>(id, ["result"], data, (data) => {
			let result = 0;
			switch (data.operator) {
				case "square root":
					result = Math.sqrt(data.value.value);
					break;

				case "square":
					result = data.value.value * data.value.value;
					break;

				case "cube":
					result =
						data.value.value * data.value.value * data.value.value;
					break;
			}

			return { result };
		});

		const onChangeOperator = useCallback(
			(operator: UnaryOperatorData["operator"]) => {
				setNodeData(id, { operator });
			},
			[]
		);

		const onChangeValue = useCallback((value: number) => {
			// Since we are able to change the value, the handle is not connected
			setNodeData(id, { value: { value, isConnected: false } });
		}, []);

		return (
			<>
				<UnaryOperatorHandle
					type="target"
					id="value"
					nodeId={id}
					value={data.value.value}
					isConnected={data.value.isConnected}
					selected={selected}
					position={Position.Left}
					style={{
						top: 120,
					}}
				/>

				<Node.Root
					selected={selected}
					className="w-[144px] h-[168px] bg-yellow-ext-200 dark:bg-yellow-ext-800 text-yellow-ext-900 dark:text-yellow-ext-100"
				>
					<Node.Dragger
						title="Binary operator"
						className="bg-yellow-ext-700 dark:bg-yellow-ext-900 text-yellow-ext-200 dark:text-yellow-ext-100"
					/>

					<Node.SelectInput
						value={data.operator}
						values={["square root", "cube", "square"]}
						onChange={onChangeOperator}
						className="bg-yellow-ext-300 text-yellow-ext-900 dark:bg-yellow-ext-900 dark:text-yellow-ext-100"
						triggerClassName="flex-1 shadow-b1 shadow-yellow-ext-500 dark:shadow-yellow-ext-700 text-yellow-ext-900 dark:text-yellow-ext-200 mb-2"
					/>

					<Node.NumberInput
						value={data.value.value}
						isConnected={data.value.isConnected}
						onChange={onChangeValue}
						className="mb-2 shadow-yellow-ext-500 dark:shadow-yellow-ext-700 focus:shadow-yellow-ext-700 dark:focus:shadow-yellow-ext-500 text-yellow-ext-900 dark:text-yellow-ext-200"
					/>
				</Node.Root>

				<UnaryOperatorHandle
					type="source"
					id="result"
					nodeId={id}
					value={data.output.result}
					selected={selected}
					position={Position.Right}
				/>
			</>
		);
	}
);

export default UnaryOperatorNode;
