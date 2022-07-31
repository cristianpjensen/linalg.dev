import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";

import type { UnaryOperationData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const UnaryOperationHandle = Node.Handle<Omit<UnaryOperationData, "operator">>;

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
			<Node.Root
				title="Unary operation"
				color="yellow-ext"
				width={144}
				height={168}
				selected={selected}
			>
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
				<Node.Dragger />

				<div className="flex flex-col gap-2">
					<Node.SelectInput
						value={data.operator}
						values={["square root", "cube", "square"]}
						onChange={onChangeOperator}
					/>

					<Node.NumberInput
						value={data.value.value}
						isConnected={data.value.isConnected}
						onChange={onChangeValue}
					/>
				</div>

				<UnaryOperationHandle
					type="source"
					id="result"
					nodeId={id}
					value={data.output.result}
					selected={selected}
					position={Position.Right}
				/>
			</Node.Root>
		);
	}
);

export default UnaryOperationNode;
