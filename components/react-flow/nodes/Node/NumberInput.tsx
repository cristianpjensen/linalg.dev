import { useContext } from "react";
import MathInput from "../../../MathInput";
import { displayRounded } from "../../helpers";
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
			`${id} is not defined in the data of node ${context.id}. Is it spelled correctly, or is it maybe an output?`
		);
	}

	const value = data[id].value;
	const isConnected = data[id].isConnected;

	const colorStyling = `shadow-${color}-500 dark:shadow-${color}-700 focus:shadow-${color}-700 dark:focus:shadow-${color}-500 text-${color}-900 dark:text-${color}-200`;
	const connectedStyling = isConnected
		? "shadow-none"
		: "shadow-b1 focus:shadow-b2";

	return (
		<MathInput
			value={displayRounded(value)}
			onChange={onChange}
			className={`bg-transparent text-xl rounded px-2 py-1 opacity-100 ${connectedStyling} ${colorStyling} ${className}`}
			disabled={isConnected}
		/>
	);
};

export default NumberInput;
