import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { BinaryOperationData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const BinaryOperationNode = memo(
	({ id, data, selected }: NodeProps<BinaryOperationData>) => {
		const setNodeData = useStore((state) => state.setNodeData);

		useOutput(id, data, (data) => {
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

		return (
			<Node.Root
				id={id}
				data={data}
				selected={selected}
				title="Binary operation"
				color="yellow-ext"
				width={144}
				height={216}
			>
				<Node.Dragger />

				<Node.Handle type="target" id="left" top={120} />
				<Node.Handle type="target" id="right" top={175} />

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
					<Node.NumberInput id="left" />
					<Node.NumberInput id="right" />
				</div>

				<Node.Handle type="source" id="result" />
			</Node.Root>
		);
	}
);

export default BinaryOperationNode;
