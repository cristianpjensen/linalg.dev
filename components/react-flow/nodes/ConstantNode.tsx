import React, { useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer";

import type { ConstantData } from "../types";
import Handle from "../custom/Handle";

const ConstantNode = ({ data }: NodeProps<ConstantData>) => {
	const onChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
		data.value = parseInt(e.currentTarget.value);
	}, []);

	return (
		<>
			<Handle type="target" position={Position.Left} id="input-number" />
			<div>
				<label htmlFor="value">Value:</label>
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

export default ConstantNode;
