import React, { useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer";

import type { ConstantData } from "../types";
import Handle from "../custom/Handle";

const ConstantHandle = Handle<ConstantData>;

const ConstantNode = ({ data }: NodeProps<ConstantData>) => {
	const onChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
		data.value = parseInt(e.currentTarget.value);
	}, []);

	return (
		<>
			<ConstantHandle
				type="target"
				position={Position.Left}
				id="value-number"
			/>
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
			<ConstantHandle
				type="source"
				position={Position.Right}
				id="output-number"
			/>
		</>
	);
};

export default ConstantNode;
