import * as SwitchPrimitive from "@radix-ui/react-switch";

export interface ISwitchProps {
	value: boolean;
	onValueChange: (value: boolean) => void;
	className?: string;
}

export const Switch = ({ value, onValueChange, className }: ISwitchProps) => {
	return (
		<SwitchPrimitive.Root
			checked={value}
			onCheckedChange={onValueChange}
			className={`relative w-[32px] h-[21px] rounded-full ${className}`}
		>
			<SwitchPrimitive.Thumb className="block w-[17px] h-[17px] bg-offwhite rounded-full shadow-sm transition-transform duration-100 ease-in translate-x-[2px] will-change-transform data-state-checked:translate-x-[13px]" />
		</SwitchPrimitive.Root>
	);
};
