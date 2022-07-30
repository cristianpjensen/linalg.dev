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
		const isConnected = useStore((state) => state.isConnected);

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
					<label htmlFor="left">Left:</label>
					<input
						id="left"
						className="w-12"
						name="left"
						type="number"
						value={data.left}
						onChange={onChangeLeft}
						disabled={isConnected(id, "left-number")}
					/>
				</div>
				<div>
					<label htmlFor="right">Right:</label>
					<input
						id="right"
						className="w-12"
						name="right"
						type="number"
						value={data.right}
						onChange={onChangeRight}
						disabled={isConnected(id, "right-number")}
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
