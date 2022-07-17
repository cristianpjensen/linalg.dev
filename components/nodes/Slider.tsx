import { CrossCircledIcon } from "@radix-ui/react-icons";
import { MathInput } from "react-three-linalg";
import { observer } from "mobx-react-lite";
import * as Slider from "@radix-ui/react-slider";

import {
	SliderNode as _SliderNode,
	ConstantNodeInputPorts as _ConstantNodeInputPorts,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const SliderNode = observer(({ node }: Node.INodeProps<_SliderNode>) => {
	const onRemove = () => {
		node.destroy();
	};

	const onMinChange = (value: number) => {
		node.inputPorts.min.value = value;
	};

	const onMaxChange = (value: number) => {
		node.inputPorts.max.value = value;
	};

	const onValueChange = ([value]: Array<number>) => {
		node.inputPorts.x.value = value;
	};

	return (
		<Node.Root node={node}>
			<Node.Handle
				title={node.type}
				className="bg-green-ext-700 dark:bg-green-ext-900 text-green-ext-200 dark:text-green-ext-100"
			>
				<Tooltip tip="Remove slider">
					<button
						onClick={onRemove}
						className="flex items-center justify-center w-8 h-8 hover:bg-gray-300/20"
					>
						<CrossCircledIcon />
					</button>
				</Tooltip>
			</Node.Handle>

			<Node.Body className="bg-green-ext-200 dark:bg-green-ext-800 text-green-ext-900 dark:text-green-ext-100">
				<div className="flex gap-2">
					<div className="grow">
						<MathInput
							value={Math.round(node.inputPorts.min.value * 100) / 100}
							onChange={onMinChange}
							style={{
								backgroundColor: "transparent",
								color: "none",
							}}
						/>
					</div>

					<div className="grow">
						<MathInput
							value={Math.round(node.inputPorts.max.value * 100) / 100}
							onChange={onMaxChange}
							style={{
								backgroundColor: "transparent",
								color: "none",
							}}
						/>
					</div>
				</div>

				<Slider.Root
					className="relative flex items-center w-full h-5 mt-3 select-none touch-none"
					defaultValue={[node.inputPorts.x.value]}
          onValueChange={onValueChange}
					max={1}
					min={0}
					step={0.01}
					aria-label="Value from 0 to 1"
				>
					<Slider.Track className="relative h-1 rounded-full bg-green-ext-400 dark:bg-green-ext-900 grow">
						<Slider.Range className="absolute h-full rounded-full bg-green-ext-700 dark:bg-green-ext-600" />
					</Slider.Track>
					<Slider.Thumb className="w-4 h-4 block shadow-sm rounded-full outline-none bg-green-ext-800 dark:bg-green-ext-500 focus:shadow-[0_0_0_5px_rgba(0,0,0,0.1)] dark:focus:shadow-[0_0_0_5px_rgba(255,255,255,0.1)]" />
				</Slider.Root>

				<Node.OutputPorts node={node} />
			</Node.Body>
		</Node.Root>
	);
});
