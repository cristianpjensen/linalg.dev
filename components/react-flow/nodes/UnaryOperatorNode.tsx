import React, { useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer";

import type { UnaryOperatorData } from "../types";
import Handle from "../custom/Handle";

const UnaryOperatorNode = ({
	data,
	...props
}: NodeProps<UnaryOperatorData>) => {
	const onChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
		data.value = parseInt(e.currentTarget.value);
	}, []);

	return (
		<>
			<Handle type="target" position={Position.Left} id="input-number" />
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
			<Handle
				type="source"
				position={Position.Right}
				id="output-number"
			/>
		</>
	);
};

export default UnaryOperatorNode;
