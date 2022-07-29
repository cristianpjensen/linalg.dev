import React, { memo } from "react";
import { NodeProps, Position } from "react-flow-renderer";

import type { BinaryOperatorData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import Handle from "../custom/Handle";

const BinaryOperatorHandle = Handle<Omit<BinaryOperatorData, "operator">>;

const BinaryOperatorNode = memo(
	({ id, data }: NodeProps<BinaryOperatorData>) => {
		const setNodeData = useStore((state) => state.setNodeData);

		const onConnect = useOutput<BinaryOperatorData>(
			id,
			["result-number"],
			data,
			(data) => {
				let result = 0;
				switch (data.operator) {
					case "add":
						result = data.left + data.right;
						break;

					case "subtract":
						result = data.left - data.right;
						break;

					case "multiply":
						result = data.left * data.right;
						break;

					case "divide":
						result = data.left / data.right;
						break;
				}

				return { result };
			}
		);

		const onChangeLeft = (e: React.FormEvent<HTMLInputElement>) => {
			if (e.currentTarget.value === "") {
				setNodeData(id, { ...data, left: 0 });
			}

			const value = parseInt(e.currentTarget.value);
			value && setNodeData(id, { ...data, left: value });
		};

		const onChangeRight = (e: React.FormEvent<HTMLInputElement>) => {
			if (e.currentTarget.value === "") {
				setNodeData(id, { ...data, right: 0 });
			}

			const value = parseInt(e.currentTarget.value);
			value && setNodeData(id, { ...data, right: value });
		};

		return (
			<>
				<BinaryOperatorHandle
					type="target"
					id="left-number"
					position={Position.Left}
					style={{ top: 10 }}
				/>
				<BinaryOperatorHandle
					type="target"
					id="right-number"
					position={Position.Left}
					style={{ bottom: 10, top: "auto" }}
				/>
				<div>
					<label htmlFor="value">Left:</label>
					<input
						id="value"
						className="w-12"
						name="value"
						type="number"
						value={data.left}
						onChange={onChangeLeft}
					/>
				</div>
				<div>
					<label htmlFor="value">Right:</label>
					<input
						id="value"
						className="w-12"
						name="value"
						type="number"
						value={data.right}
						onChange={onChangeRight}
					/>
				</div>
				<BinaryOperatorHandle
					type="source"
					id="result-number"
					position={Position.Right}
					onConnect={onConnect}
				/>
			</>
		);
	}
);

export default BinaryOperatorNode;
