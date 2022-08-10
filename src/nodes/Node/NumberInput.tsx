import { useCallback, useContext } from "react";

import { MathInput } from "../../utils";
import { displayRounded, getHandleType } from "../helpers";
import { useNodeStore } from "../../../stores";
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

	const setNodeData = useNodeStore((state) => state.setNodeData);
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

export default NumberInput;
