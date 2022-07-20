import { observer } from "mobx-react-lite";
import * as Select from "@radix-ui/react-select";

import { InputPort as _InputPort } from "../../../node-engine";
import {
	CaretDownIcon,
	CaretUpIcon,
	CheckIcon,
	ChevronDownIcon,
} from "@radix-ui/react-icons";

export interface IPortSelectInputProps<T = any> {
	port: _InputPort<T>;
	values: Array<T>;
	className?: string;
	triggerClassName?: string;
}

export const PortSelectInput = observer(
	({ port, values, className, triggerClassName }: IPortSelectInputProps) => {
		const onValueChange = (value: string) => {
			port.value = value;
		};

		return (
			<Select.Root value={port.value} onValueChange={onValueChange}>
				<Select.Trigger
					className={`flex items-center justify-center px-3 py-2 text-sm rounded outline-none h-12 w-full gap-2 ${triggerClassName}`}
				>
					<Select.Value />
					<Select.Icon>
						<ChevronDownIcon />
					</Select.Icon>
				</Select.Trigger>

				<Select.Content
					className={`w-full overflow-hidden rounded shadow-b1 shadow-zinc-300 dark:shadow-zinc-600 ${className}`}
				>
					<Select.ScrollUpButton
						className={`flex items-center justify-center h-6 cursor-default ${className}`}
					>
						<CaretUpIcon />
					</Select.ScrollUpButton>

					<Select.Viewport className="p-2">
						{values.map((value) => (
							<Select.Item
								value={value}
								className="relative flex items-center h-8 px-6 text-sm rounded-sm select-none outline-none cursor-pointer dark:focus:bg-[rgba(255,255,255,0.08)] focus:bg-[rgba(0,0,0,0.06)] dark:focus:text-offwhite focus:text-offblack"
							>
								<Select.ItemText>{value}</Select.ItemText>
								<Select.ItemIndicator className="absolute left-0 inline-flex items-center justify-center w-6">
									<CheckIcon />
								</Select.ItemIndicator>
							</Select.Item>
						))}
					</Select.Viewport>

					<Select.ScrollDownButton
						className={`flex items-center justify-center h-6 cursor-default ${className}`}
					>
						<CaretDownIcon />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Root>
		);
	}
);
