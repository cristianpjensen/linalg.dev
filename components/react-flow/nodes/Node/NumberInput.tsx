import MathInput from "../../../MathInput";
import { displayRounded } from "../../helpers";

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
		<MathInput
			value={displayRounded(value)}
			onChange={onChange}
			className={`bg-transparent text-xl rounded px-2 py-1 opacity-100 ${
				isConnected ? "shadow-none" : "shadow-b1 focus:shadow-b2"
			} ${className}`}
			disabled={isConnected}
		/>
	);
};

export default NumberInput;
