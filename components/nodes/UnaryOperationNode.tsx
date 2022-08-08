import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { UnaryOperationData } from "./types";
import useStore from "../../stores/nodes";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const UnaryOperationNode = memo(
	({ id, data, selected }: NodeProps<UnaryOperationData>) => {
		const setNodeData = useStore((state) => state.setNodeData);

		useOutput(id, data, (data) => {
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

		return (
			<Node.Root
				id={id}
				data={data}
				title="Unary operation"
				selected={selected}
				color="yellow-ext"
				width={6}
				height={7}
			>
				<Node.Dragger />

				<Node.Handle type="target" id="value" top={120} />

				<div className="flex flex-col gap-2">
					<Node.SelectInput
						value={data.operator}
						values={["square root", "cube", "square"]}
						onChange={onChangeOperator}
					/>

					<Node.NumberInput id="value" />
				</div>

				<Node.Handle type="source" id="result" />
			</Node.Root>
		);
	}
);

UnaryOperationNode.displayName = "Unary operation node";

export default UnaryOperationNode;
