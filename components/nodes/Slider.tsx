import { useEffect, useState } from "react";
import { makeObservable, observable } from "mobx";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import * as Slider from "@radix-ui/react-slider";
import { Root as Label } from "@radix-ui/react-label";

import { SliderNode as _SliderNode } from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";
import MathInput from "../MathInput";

// This timer is used for slider nodes to tap into to get their state when
// looping. It works by taking the current timer value and modulo 2 on it. Then
// if it is smaller than 1, it should be 1 - value and if it is greater than 1,
// it should be value - 1. This makes it go from 0 -> 1 and then 1 -> 0, over
// and over again.
class Timer {
	public value = 0;

	constructor() {
		setInterval(() => {
			this.value += 1;
		}, 10);

		makeObservable(this, {
			value: observable,
		});
	}
}

const timer = new Timer();

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
					<div className="min-w-0 grow">
						<MathInput
							value={
								Math.round(node.inputPorts.min.value * 100) /
								100
							}
							onChange={onMinChange}
							className="w-full px-2 py-1 text-xl bg-transparent rounded shadow-b1 shadow-green-ext-500 focus:shadow-b2 focus:shadow-green-ext-700 dark:focus:shadow-green-ext-500 dark:shadow-green-ext-700 text-green-ext-900 dark:text-green-ext-200"
						/>
					</div>

					<div className="min-w-0 grow">
						<MathInput
							value={
								Math.round(node.inputPorts.max.value * 100) /
								100
							}
							onChange={onMaxChange}
							className="w-full px-2 py-1 text-xl bg-transparent rounded shadow-b1 shadow-green-ext-500 focus:shadow-b2 focus:shadow-green-ext-700 dark:focus:shadow-green-ext-500 dark:shadow-green-ext-700 text-green-ext-900 dark:text-green-ext-200"
						/>
					</div>
				</div>

				<SliderInput node={node} />

				<Node.OutputPorts node={node} />
			</Node.Body>
		</Node.Root>
	);
});

const SliderInput = observer(({ node }: Node.INodeProps<_SliderNode>) => {
	const onValueChange = (value: number) => {
		onSwitchChange(false);
		node.inputPorts.x.value = value;
	};

	const [loop, setLoop] = useState(false);
	const [intervalState, setIntervalState] = useState<NodeJS.Timer>();
	const [randomValue] = useState(Math.random() * 2000);

	const onSwitchChange = (value: boolean) => {
		setLoop(value);

		if (value) {
			setIntervalState(
				setInterval(() => {
					const t = ((timer.value + randomValue) / 1000) % 2;
					node.inputPorts.x.value = t > 1 ? t - 1 : 1 - t;
				}, 100)
			);
		} else {
			clearInterval(intervalState);
		}
	};

	useEffect(() => {
		return () => clearInterval(intervalState);
	}, []);

	return (
		<>
			<SliderComponent
				value={node.inputPorts.x.value}
				onValueChange={onValueChange}
			/>

			<div className="flex mt-4">
				<Node.Switch
					value={loop}
					onValueChange={onSwitchChange}
					className="bg-green-ext-400 dark:bg-green-ext-900 data-state-checked:bg-green-ext-700 dark:data-state-checked:bg-green-ext-700 focus:shadow-b2 focus:shadow-green-ext-600 dark:focus:shadow-green-ext-500"
				/>
				<Label className="flex items-center ml-2 text-sm font-medium text-green-ext-800 dark:text-green-ext-100 grow">
					Loop
				</Label>
			</div>
		</>
	);
});

interface ISliderComponentProps {
	value: number;
	onValueChange: (value: number) => void;
}

const SliderComponent = ({ value, onValueChange }: ISliderComponentProps) => {
	const _onValueChange = ([value]: [number]) => {
		onValueChange(value);
	};

	return (
		<Slider.Root
			className="relative flex items-center w-full h-5 mt-3 select-none touch-none"
			value={[value]}
			onValueChange={_onValueChange}
			max={1}
			min={0}
			step={0.01}
			aria-label="Value from 0 to 1"
		>
			<Slider.Track className="relative h-1 rounded-full bg-green-ext-400 dark:bg-green-ext-900 grow">
				<Slider.Range className="absolute h-full rounded-full bg-green-ext-600 dark:bg-green-ext-700" />
			</Slider.Track>
			<Slider.Thumb className="block w-4 h-4 rounded-full shadow-sm focus:shadow-b2 focus:shadow-green-ext-600 dark:focus:shadow-green-ext-500 bg-green-ext-800 dark:bg-green-ext-700" />
		</Slider.Root>
	);
};
