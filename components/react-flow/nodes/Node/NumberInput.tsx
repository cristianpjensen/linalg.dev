import MathInput from "../../../MathInput";
import { displayRounded } from "../../helpers";
import NodeContext from "./context";

type INumberInputProps = {
	value: number;
	isConnected?: boolean;
	onChange?: (value: number) => void;
	className?: string;
};

const NumberInput = ({
	value,
	isConnected,
	onChange,
	className,
}: INumberInputProps) => {
	return (
		<NodeContext.Consumer>
			{({ color }) => {
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
			}}
		</NodeContext.Consumer>
	);
};

export default NumberInput;
