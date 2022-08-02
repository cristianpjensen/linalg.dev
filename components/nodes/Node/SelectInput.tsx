import {
	CaretDownIcon,
	CaretUpIcon,
	CheckIcon,
	ChevronDownIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

import NodeContext from "./context";

type ISelectInputProps<T extends string> = {
	value: T;
	values: Array<T>;
	onChange: (value: T) => void;
};

const SelectInput = <T extends string>({
	value,
	values,
	onChange,
}: ISelectInputProps<T>) => {
	return (
		<NodeContext.Consumer>
			{({ color }) => {
				const colorStyling = `bg-${color}-300 dark:bg-${color}-900 text-${color}-900 dark:text-${color}-100`;
				const triggerColorStyling = `shadow-${color}-500 dark:shadow-${color}-700 focus:shadow-${color}-700 dark:focus:shadow-${color}-500 text-${color}-900 dark:text-${color}-200`;

				return (
					<Select.Root value={value} onValueChange={onChange}>
						<Select.Trigger
							className={`flex items-center justify-center px-3 py-2 text-sm rounded outline-none h-12 w-full gap-2 shadow-b1 focus:shadow-b2 ${triggerColorStyling}`}
						>
							<Select.Value />
							<Select.Icon>
								<ChevronDownIcon />
							</Select.Icon>
						</Select.Trigger>

						<Select.Content
							className={`w-full overflow-hidden rounded shadow-b1 shadow-zinc-300 dark:shadow-zinc-600 ${colorStyling}`}
						>
							<Select.ScrollUpButton
								className={`flex items-center justify-center h-6 cursor-default ${colorStyling}`}
							>
								<CaretUpIcon />
							</Select.ScrollUpButton>

							<Select.Viewport className="p-2">
								{values.map((value) => (
									<Select.Item
										value={value}
										className="relative flex items-center h-8 px-6 text-sm rounded-sm select-none outline-none cursor-pointer dark:focus:bg-[rgba(255,255,255,0.08)] focus:bg-[rgba(0,0,0,0.06)] dark:focus:text-offwhite focus:text-offblack"
									>
										<Select.ItemText>
											{value[0].toUpperCase() +
												value.slice(1)}
										</Select.ItemText>
										<Select.ItemIndicator className="absolute left-0 inline-flex items-center justify-center w-6">
											<CheckIcon />
										</Select.ItemIndicator>
									</Select.Item>
								))}
							</Select.Viewport>

							<Select.ScrollDownButton
								className={`flex items-center justify-center h-6 cursor-default ${colorStyling}`}
							>
								<CaretDownIcon />
							</Select.ScrollDownButton>
						</Select.Content>
					</Select.Root>
				);
			}}
		</NodeContext.Consumer>
	);
};

export default SelectInput;
