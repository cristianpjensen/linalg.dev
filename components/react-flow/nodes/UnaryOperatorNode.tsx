import React, { useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer";

import type { UnaryOperatorData } from "../types";
import Handle from "../custom/Handle";

const UnaryOperatorHandle = Handle<Omit<UnaryOperatorData, "operator">>;

const UnaryOperatorNode = ({
	data,
	...props
}: NodeProps<UnaryOperatorData>) => {
	const onChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
		data.value = parseInt(e.currentTarget.value);
	}, []);

	return (
		<>
			<UnaryOperatorHandle
				type="target"
				position={Position.Left}
				id="value-number"
			/>
			<div>
				<label htmlFor="value">Unary:</label>
				<input
					id="value"
					className="w-12"
					name="value"
					type="number"
					defaultValue={data.value}
					onChange={onChange}
				/>
			</div>
			<UnaryOperatorHandle
				type="source"
				position={Position.Right}
				id="output-number"
			/>
		</>
	);
};

export default UnaryOperatorNode;
