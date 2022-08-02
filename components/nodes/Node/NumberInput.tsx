import { useCallback, useContext, useEffect } from "react";
import MathInput from "../../MathInput";
import { displayRounded, getHandleType } from "../../helpers";
import useStore from "../../../stores/nodes";
import { Vector } from "../types";
import NodeContext from "./context";

type INumberInputProps = {
	id: string;
	onChange?: (value: number) => void;
	className?: string;
};

const NumberInput = ({ id, onChange, className }: INumberInputProps) => {
	const { data, color, ...context } = useContext(NodeContext);

	if (data[id] === undefined) {
		throw new Error(
			`${id} is not defined in the data of node ${
				context.id
			} (${Object.keys(
				data
			)}). Is it spelled correctly, or is it maybe an output?`
		);
	}

	if (getHandleType(data[id].value) !== "number") {
		throw new Error(
			`${id} is not a number in the data of node ${
				context.id
			} (${Object.keys(data)}). Perhaps you should use VectorInput?`
		);
	}

	const setNodeData = useStore((state) => state.setNodeData);
	const value = data[id].value;
	const isConnected = data[id].isConnected;

	const colorStyling = `shadow-${color}-500 dark:shadow-${color}-700 focus:shadow-${color}-700 dark:focus:shadow-${color}-500 text-${color}-900 dark:text-${color}-200`;
	const connectedStyling = isConnected
		? "shadow-none"
		: "shadow-b1 focus:shadow-b2";

	const onChangeData = useCallback((value: number) => {
		// Since we are able to change the value, the handle is not connected
		setNodeData(context.id, { [id]: { value, isConnected: false } });
	}, []);

	const onChangeNumber = useCallback((value: number) => {
		onChangeData(value);

		if (onChange) {
			onChange(value);
		}
	}, []);

	return (
		<MathInput
			value={displayRounded(value)}
			onChange={onChangeNumber}
			className={`bg-transparent text-xl rounded px-2 py-1 opacity-100 ${connectedStyling} ${colorStyling} ${className}`}
			disabled={isConnected}
		/>
	);
};

type IVectorInputProps = {
	id: string;
	onChange?: (value: Vector) => void;
	className?: string;
};

export const VectorInput = ({ id, onChange, className }: IVectorInputProps) => {
	const { data, color, ...context } = useContext(NodeContext);

	if (data[id] === undefined) {
		throw new Error(
			`${id} is not defined in the data of node ${context.id}. Is it spelled correctly, or is it maybe an output?`
		);
	}

	if (getHandleType(data[id].value) !== "vector") {
		throw new Error(
			`${id} is not a vector in the data of node ${context.id}. Perhaps you should use NumberInput?`
		);
	}

	const setNodeData = useStore((state) => state.setNodeData);
	const vector = data[id].value as Vector;
	const isConnected = data[id].isConnected;

	const colorStyling = `shadow-${color}-500 dark:shadow-${color}-700 focus:shadow-${color}-700 dark:focus:shadow-${color}-500 text-${color}-900 dark:text-${color}-200`;
	const connectedStyling = isConnected
		? "shadow-none"
		: "shadow-b1 focus:shadow-b2";

	const styling = `bg-transparent text-xl rounded px-2 py-1 opacity-100 ${connectedStyling} ${colorStyling} ${className}`;

	const onChangeVector = (vec: Vector) => {
		setNodeData(context.id, {
			[id]: { value: { ...vec }, isConnected: false },
		});
	};

	const onChangeX = (x: number) => {
		const vec = { x, y: vector.y, z: vector.z };
		onChangeVector(vec);

		if (onChange) {
			onChange(vec);
		}
	};

	const onChangeY = (y: number) => {
		const vec = { x: vector.x, y, z: vector.z };
		onChangeVector(vec);

		if (onChange) {
			onChange(vec);
		}
	};

	const onChangeZ = (z: number) => {
		const vec = { x: vector.x, y: vector.y, z };
		onChangeVector(vec);

		if (onChange) {
			onChange(vec);
		}
	};

	return (
		<>
			<MathInput
				value={displayRounded(vector.x)}
				onChange={onChangeX}
				className={styling}
				disabled={isConnected}
			/>
			<MathInput
				value={displayRounded(vector.y)}
				onChange={onChangeY}
				className={styling}
				disabled={isConnected}
			/>
			<MathInput
				value={displayRounded(vector.z)}
				onChange={onChangeZ}
				className={styling}
				disabled={isConnected}
			/>
		</>
	);
};

export default NumberInput;
