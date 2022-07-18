import { observer } from "mobx-react-lite";
import { MathInput } from "react-three-linalg";
import TeX from "@matejmazur/react-katex";

import { InputPort as _InputPort } from "../../../node-engine";

export interface IPortNumberInput {
	port: _InputPort<number>;
}

export const PortNumberInput = observer(({ port }: IPortNumberInput) => {
	const onValueChange = (value: number) => {
		port.value = value;
	};

	return (
		<div style={{ height: 50 }}>
			<div
				className={`transition-opacity duration-200 ease-out z-20 ${
					port.isConnected
						? "opacity-0 invisible"
						: "opacity-100 visible"
				}`}
			>
				<MathInput
					value={Math.round(port.value * 100) / 100}
					onChange={onValueChange}
					style={{
						backgroundColor: "transparent",
						color: "none",
					}}
				/>
			</div>

			<TeX
				className={`flex justify-left text-xl -mt-[2.5625rem] ml-[0.625rem] transition-opacity duration-200 z-10 ease-in ${
					port.isConnected
						? "opacity-100 visible"
						: "opacity-0 invisible"
				}`}
				math={`${Math.round(port.value * 100) / 100}`}
			/>
		</div>
	);
});
