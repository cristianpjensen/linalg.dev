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
		const isConnected = useStore((state) => state.isConnected);

		useOutput<UnaryOperatorData>(id, ["result"], data, (data) => {
			let result = 0;
			switch (data.operator) {
				case "square root":
					result = Math.sqrt(data.value);
					break;

				case "square":
					result = data.value * data.value;
					break;

				case "cube":
					result = data.value * data.value * data.value;
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
			setNodeData(id, { left: value });
		}, []);

		return (
			<>
				<UnaryOperatorHandle
					type="target"
					id="value"
					value={data.value}
					selected={selected}
					position={Position.Left}
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
						value={data.value}
						onChange={onChangeValue}
						isConnected={isConnected(id, "value")}
						className="mb-2 shadow-yellow-ext-500 dark:shadow-yellow-ext-700 focus:shadow-yellow-ext-700 dark:focus:shadow-yellow-ext-500 text-yellow-ext-900 dark:text-yellow-ext-200"
					/>
				</Node.Root>

				<UnaryOperatorHandle
					type="source"
					id="result"
					value={data.output.result}
					selected={selected}
					position={Position.Right}
				/>
			</>
		);
	}
);

export default UnaryOperatorNode;
