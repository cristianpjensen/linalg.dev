import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";

import type { UnaryOperationData } from "../types";
import Handle from "../custom/Handle";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const UnaryOperationHandle = Handle<Omit<UnaryOperationData, "operator">>;

const UnaryOperationNode = memo(
	({ id, data, selected }: NodeProps<UnaryOperationData>) => {
		const setNodeData = useStore((state) => state.setNodeData);

		useOutput<UnaryOperationData>(id, ["result"], data, (data) => {
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
			(operator: UnaryOperationData["operator"]) => {
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
				<UnaryOperationHandle
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
						title="Binary operation"
						className="bg-yellow-ext-700 dark:bg-yellow-ext-900 text-yellow-ext-200 dark:text-yellow-ext-100"
					/>

					<div className="flex flex-col gap-2">
						<Node.SelectInput
							value={data.operator}
							values={["square root", "cube", "square"]}
							onChange={onChangeOperator}
							className="bg-yellow-ext-300 text-yellow-ext-900 dark:bg-yellow-ext-900 dark:text-yellow-ext-100"
							triggerClassName="shadow-b1 shadow-yellow-ext-500 dark:shadow-yellow-ext-700 text-yellow-ext-900 dark:text-yellow-ext-200"
						/>

						<Node.NumberInput
							value={data.value.value}
							isConnected={data.value.isConnected}
							onChange={onChangeValue}
							className="shadow-yellow-ext-500 dark:shadow-yellow-ext-700 focus:shadow-yellow-ext-700 dark:focus:shadow-yellow-ext-500 text-yellow-ext-900 dark:text-yellow-ext-200"
						/>
					</div>
				</Node.Root>

				<UnaryOperationHandle
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

export default UnaryOperationNode;
