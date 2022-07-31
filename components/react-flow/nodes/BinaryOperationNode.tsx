import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";

import type { BinaryOperationData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import Handle from "../custom/Handle";
import * as Node from "./Node";

const BinaryOperationHandle = Handle<Omit<BinaryOperationData, "operator">>;

const BinaryOperationNode = memo(
	({ id, data, selected }: NodeProps<BinaryOperationData>) => {
		const setNodeData = useStore((state) => state.setNodeData);

		useOutput<BinaryOperationData>(id, ["result"], data, (data) => {
			let result = 0;
			switch (data.operator) {
				case "add":
					result = data.left.value + data.right.value;
					break;

				case "subtract":
					result = data.left.value - data.right.value;
					break;

				case "multiply":
					result = data.left.value * data.right.value;
					break;

				case "divide":
					result = data.left.value / data.right.value;
					break;

				case "modulo":
					result = data.left.value % data.right.value;
					break;
			}

			return { result };
		});

		const onChangeOperator = useCallback(
			(operator: BinaryOperationData["operator"]) => {
				setNodeData(id, { operator });
			},
			[]
		);

		const onChangeLeft = useCallback((value: number) => {
			setNodeData(id, { left: { value, isConnected: false } });
		}, []);

		const onChangeRight = useCallback((value: number) => {
			setNodeData(id, { right: { value, isConnected: false } });
		}, []);

		return (
			<>
				<BinaryOperationHandle
					type="target"
					id="left"
					nodeId={id}
					value={data.left.value}
					isConnected={data.left.isConnected}
					selected={selected}
					position={Position.Left}
					style={{ top: 120 }}
				/>
				<BinaryOperationHandle
					type="target"
					id="right"
					nodeId={id}
					value={data.right.value}
					isConnected={data.right.isConnected}
					selected={selected}
					position={Position.Left}
					style={{ top: 175 }}
				/>

				<Node.Root
					title="Binary operation"
					color="yellow-ext"
					width={144}
					height={216}
					selected={selected}
				>
					<Node.Dragger />

					<div className="flex flex-col gap-2">
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
						/>

						<Node.NumberInput
							value={data.left.value}
							isConnected={data.left.isConnected}
							onChange={onChangeLeft}
						/>

						<Node.NumberInput
							value={data.right.value}
							isConnected={data.right.isConnected}
							onChange={onChangeRight}
						/>
					</div>
				</Node.Root>

				<BinaryOperationHandle
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

export default BinaryOperationNode;
