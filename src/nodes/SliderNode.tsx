import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { SliderData } from "./types";
import { useOutput } from "./hooks";
import { useNodeStore } from "../../stores";
import * as Node from "./Node";

const SliderNode = memo(({ id, data, selected }: NodeProps<SliderData>) => {
	const setNodeData = useNodeStore((state) => state.setNodeData);

	useOutput(id, data, (data) => {
		return {
			result:
				(data.max.value - data.min.value) * data.value + data.min.value,
		};
	});

	const onChange = useCallback((value: number) => {
		setNodeData(id, { value });
	}, []);

	return (
		<Node.Root
			id={id}
			data={data}
			selected={selected}
			title="Slider"
			color="green-ext"
			width={8}
			height={6}
		>
			<Node.Dragger />

			<Node.Handle type="target" id="min" top="calc(33.33% + 8px)" />
			<Node.Handle type="target" id="max" top="calc(66.66% + 8px)" />

			<div className="flex flex-col gap-2">
				<div className="flex flex-row gap-2">
					<Node.NumberInput id="min" />
					<Node.NumberInput id="max" />
				</div>

				<Slider value={data.value} onChange={onChange} />
			</div>

			<Node.Handle type="source" id="result" />
		</Node.Root>
	);
});

type ISliderProps = {
	value: number;
	onChange: (value: number) => void;
};

const Slider = ({ value, onChange }: ISliderProps) => {
	const onValueChange = ([value]: [number]) => {
		onChange(value);
	};

	return (
		<SliderPrimitive.Root
			className="relative flex items-center w-full h-5 mt-3 select-none touch-none"
			value={[value]}
			onValueChange={onValueChange}
			max={1}
			min={0}
			step={0.01}
		>
			<SliderPrimitive.Track className="relative h-1 rounded-full bg-green-ext-400 dark:bg-green-ext-900 grow">
				<SliderPrimitive.Range className="absolute h-full rounded-full bg-green-ext-600 dark:bg-green-ext-700" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb className="block w-4 h-4 rounded-full shadow-sm outline-none focus:shadow-b2 focus:shadow-green-ext-600 dark:focus:shadow-green-ext-500 bg-green-ext-800 dark:bg-green-ext-700" />
		</SliderPrimitive.Root>
	);
};

SliderNode.displayName = "Slider node";

export default SliderNode;
