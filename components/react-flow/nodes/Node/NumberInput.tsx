import MathInput from "../../../MathInput";

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
			value={Math.round(value * 100) / 100}
			onChange={onChange}
			className={`bg-transparent text-xl rounded px-2 py-1 opacity-100 ${
				isConnected ? "shadow-none" : "shadow-b1 focus:shadow-b2"
			} ${className}`}
			disabled={isConnected}
		/>
	);
};

export default NumberInput;
