import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { UnaryOperationData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const UnaryOperationNode = memo(
	({ id, data, selected }: NodeProps<UnaryOperationData>) => {
		const setNodeData = useStore((state) => state.setNodeData);

		useOutput(id, ["result"], data, (data) => {
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
			setNodeData(id, { value: { value, isConnected: false } });
		}, []);

		return (
			<Node.Root
				id={id}
				data={data}
				title="Unary operation"
				selected={selected}
				color="yellow-ext"
				width={144}
				height={168}
			>
				<Node.Dragger />

				<Node.Handle type="target" id="value" top={120} />

				<div className="flex flex-col gap-2">
					<Node.SelectInput
						value={data.operator}
						values={["square root", "cube", "square"]}
						onChange={onChangeOperator}
					/>

					<Node.NumberInput id="value" onChange={onChangeValue} />
				</div>

				<Node.Handle type="source" id="result" />
			</Node.Root>
		);
	}
);

export default UnaryOperationNode;
