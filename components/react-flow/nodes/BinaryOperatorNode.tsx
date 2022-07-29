import React, { useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer";

import type { BinaryOperatorData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import Handle from "../custom/Handle";

const BinaryOperatorHandle = Handle<Omit<BinaryOperatorData, "operator">>;

const BinaryOperatorNode = ({ id, data }: NodeProps<BinaryOperatorData>) => {
	const { setNodeData } = useStore();

	const addOutput = useOutput<BinaryOperatorData>((data) => {
		let val = 0;
		switch (data.operator) {
			case "add":
				val = data.left + data.right;
				break;

			case "subtract":
				val = data.left - data.right;
				break;

			case "multiply":
				val = data.left * data.right;
				break;

			case "divide":
				val = data.left / data.right;
				break;
		}

		return { ...data, output: val };
	});

	const onChangeLeft = useCallback((e: React.FormEvent<HTMLInputElement>) => {
		if (e.currentTarget.value === "") {
			setNodeData(id, addOutput({ ...data, left: 0 }));
		}

		const value = parseInt(e.currentTarget.value);
		value && setNodeData(id, addOutput({ ...data, left: value }));
	}, []);

	const onChangeRight = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			if (e.currentTarget.value === "") {
				setNodeData(id, addOutput({ ...data, right: 0 }));
			}

			const value = parseInt(e.currentTarget.value);
			value && setNodeData(id, addOutput({ ...data, right: value }));
		},
		[]
	);

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
				position={Position.Right}
				id="output-number"
			/>
		</>
	);
};

type ObjectKey = keyof BinaryOperatorData;
const s: ObjectKey = "left";

export default BinaryOperatorNode;
