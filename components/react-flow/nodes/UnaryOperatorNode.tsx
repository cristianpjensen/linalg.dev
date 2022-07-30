import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer";

import type { UnaryOperatorData } from "../types";
import Handle from "../custom/Handle";
import useStore from "../store";
import useOutput from "../hooks/useOutput";

const UnaryOperatorHandle = Handle<Omit<UnaryOperatorData, "operator">>;

const UnaryOperatorNode = memo(({ id, data }: NodeProps<UnaryOperatorData>) => {
	const setNodeData = useStore((state) => state.setNodeData);
	const isConnected = useStore((state) => state.isConnected);

	const onConnect = useOutput<UnaryOperatorData>(
		id,
		["result-number"],
		data,
		(data) => {
			let result = 0;
			switch (data.operator) {
				case "sqrt":
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
		}
	);

	const onChange = (e: React.FormEvent<HTMLInputElement>) => {
		if (e.currentTarget.value === "") {
			setNodeData(id, { ...data, value: 0 });
		}

		const value = parseInt(e.currentTarget.value);
		value && setNodeData(id, { ...data, value });
	};

	return (
		<>
			<UnaryOperatorHandle
				type="target"
				id="value-number"
				position={Position.Left}
			/>
			<div>
				<label htmlFor="value">Unary:</label>
				<input
					id="value"
					className="w-12"
					name="value"
					type="number"
					value={data.value}
					onChange={onChange}
					disabled={isConnected(id, "value-number")}
				/>
			</div>
			<UnaryOperatorHandle
				type="source"
				id="result-number"
				position={Position.Right}
				onConnect={onConnect}
			/>
		</>
	);
});

export default UnaryOperatorNode;
