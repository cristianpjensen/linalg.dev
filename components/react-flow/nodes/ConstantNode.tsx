import React, { memo } from "react";
import { Connection, NodeProps, OnConnect, Position } from "react-flow-renderer";

import type { ConstantData } from "../types";
import Handle from "../custom/Handle";
import useStore from "../store";
import useOutput from "../hooks/useOutput";

const ConstantHandle = Handle<ConstantData>;

const ConstantNode = memo(({ id, data }: NodeProps<ConstantData>) => {
	const setNodeData = useStore((state) => state.setNodeData);
	const isConnected = useStore((state) => state.isConnected);

	const onDataChange = useOutput<ConstantData>(
		id,
		["result"],
		data,
		(data) => {
			return {
				result: data.value,
			};
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
			<ConstantHandle type="target" id="value" position={Position.Left} />
			<div>
				<label htmlFor="value">Value:</label>
				<input
					id="value"
					className="w-12"
					name="value"
					type="number"
					value={data.value}
					onChange={onChange}
					disabled={isConnected(id, "value")}
				/>
			</div>
			<ConstantHandle
				type="source"
				id="result"
				position={Position.Right}
				onConnect={onDataChange}
			/>
		</>
	);
});

export default ConstantNode;
