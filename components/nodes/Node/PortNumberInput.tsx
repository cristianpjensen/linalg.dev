import { observer } from "mobx-react-lite";

import { InputPort as _InputPort } from "../../../node-engine";
import MathInput from "../../MathInput";

export interface IPortNumberInput {
	port: _InputPort<number>;
	className?: string;
}

export const PortNumberInput = observer(
	({ port, className }: IPortNumberInput) => {
		const onValueChange = (value: number) => {
			port.value = value;
		};

		return (
			<MathInput
				value={Math.round(port.value * 100) / 100}
				onChange={onValueChange}
				className={
					"bg-transparent text-xl rounded px-2 py-1 opacity-100 " +
					(port.isConnected
						? "shadow-none "
						: "shadow-b1 focus:shadow-b2 ") +
					className
				}
				disabled={port.isConnected}
			/>
		);
	}
);
