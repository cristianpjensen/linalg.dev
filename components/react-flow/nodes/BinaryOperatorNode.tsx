import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";

import type { BinaryOperatorData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import Handle from "../custom/Handle";
import * as Node from "./Node";

const BinaryOperatorHandle = Handle<Omit<BinaryOperatorData, "operator">>;

const BinaryOperatorNode = memo(
	({ id, data, selected }: NodeProps<BinaryOperatorData>) => {
		const setNodeData = useStore((state) => state.setNodeData);
		const isConnected = useStore((state) => state.isConnected);

		useOutput<BinaryOperatorData>(id, ["result"], data, (data) => {
			let result = 0;
			switch (data.operator) {
				case "add":
					result = data.left + data.right;
					break;

				case "subtract":
					result = data.left - data.right;
					break;

				case "multiply":
					result = data.left * data.right;
					break;

				case "divide":
					result = data.left / data.right;
					break;

				case "modulo":
					result = data.left % data.right;
					break;
			}

			return { result };
		});

		const onChangeOperator = useCallback(
			(operator: BinaryOperatorData["operator"]) => {
				setNodeData(id, { operator });
			},
			[]
		);

		const onChangeLeft = useCallback((value: number) => {
			setNodeData(id, { left: value });
		}, []);

		const onChangeRight = useCallback((value: number) => {
			setNodeData(id, { right: value });
		}, []);

		return (
			<>
				<BinaryOperatorHandle
					type="target"
					id="left"
					value={data.left}
					selected={selected}
					position={Position.Left}
					style={{ top: 120 }}
				/>
				<BinaryOperatorHandle
					type="target"
					id="right"
					value={data.right}
					selected={selected}
					position={Position.Left}
					style={{ top: 175 }}
				/>

				<Node.Root
					selected={selected}
					className="w-[144px] h-[216px] bg-yellow-ext-200 dark:bg-yellow-ext-800 text-yellow-ext-900 dark:text-yellow-ext-100"
				>
					<Node.Dragger
						title="Binary operator"
						className="bg-yellow-ext-700 dark:bg-yellow-ext-900 text-yellow-ext-200 dark:text-yellow-ext-100"
					/>

					<Node.SelectInput
						value={data.operator}
						values={[
							"add",
							"subtract",
							"multiply",
							"divide",
							"modulo",
						]}
						onChange={onChangeOperator}
						className="bg-yellow-ext-300 text-yellow-ext-900 dark:bg-yellow-ext-900 dark:text-yellow-ext-100"
						triggerClassName="flex-1 shadow-b1 shadow-yellow-ext-500 dark:shadow-yellow-ext-700 text-yellow-ext-900 dark:text-yellow-ext-200 mb-2"
					/>

					<Node.NumberInput
						value={data.left}
						onChange={onChangeLeft}
						isConnected={isConnected(id, "left")}
						className="mb-2 shadow-yellow-ext-500 dark:shadow-yellow-ext-700 focus:shadow-yellow-ext-700 dark:focus:shadow-yellow-ext-500 text-yellow-ext-900 dark:text-yellow-ext-200"
					/>

					<Node.NumberInput
						value={data.right}
						onChange={onChangeRight}
						isConnected={isConnected(id, "right")}
						className="shadow-yellow-ext-500 dark:shadow-yellow-ext-700 focus:shadow-yellow-ext-700 dark:focus:shadow-yellow-ext-500 text-yellow-ext-900 dark:text-yellow-ext-200"
					/>
				</Node.Root>

				<BinaryOperatorHandle
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

export default BinaryOperatorNode;
