import React, { memo, useCallback, useState } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import {
	ColorWheelIcon,
	EyeClosedIcon,
	EyeOpenIcon,
} from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { HexColorPicker } from "react-colorful";

import { PlaneData } from "./types";
import { useNodeStore } from "../../stores";
import * as Node from "./Node";

const PlaneNode = memo(({ id, data, selected }: NodeProps<PlaneData>) => {
	const setNodeData = useNodeStore((state) => state.setNodeData);
	const onHide = useCallback(() => {
		setNodeData(id, { hidden: !data.hidden });
	}, [data.hidden]);

	const [colorString, setColorString] = useState(data.color);

	const onColorChange = useCallback((color: string) => {
		setNodeData(id, { color: color.toUpperCase() });
		setColorString(color.toUpperCase());
	}, []);

	const onColorInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const color = e.target.value;
			setColorString(color);

			// Check whether it is a valid hex color
			if (color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
				setNodeData(id, { color });
			}
		},
		[]
	);

	return (
		<Node.Root
			id={id}
			data={data}
			selected={selected}
			title="Plane"
			color="red-ext"
			width={8}
			height={11}
		>
			<Node.Dragger>
				<Popover.Root>
					<Popover.Trigger>
						<Node.DraggerButton tooltip="Customise plane colour">
							<ColorWheelIcon />
						</Node.DraggerButton>
					</Popover.Trigger>

					<Popover.Content side="top" sideOffset={2}>
						<div className="w-[232px] p-4 rounded shadow-b2 bg-offwhite dark:bg-offblack shadow-zinc-400 dark:shadow-zinc-400">
							<HexColorPicker
								color={data.color}
								onChange={onColorChange}
								className="colorpicker"
							/>

							<input
								type="text"
								className="w-full px-4 py-2 mt-2 rounded outline-none shadow-b1 focus:shadow-b2 shadow-zinc-400 focus:shadow-zinc-600 dark:shadow-zinc-600 dark:focus:shadow-zinc-400 bg-offwhite dark:bg-offblack text-offblack dark:text-offwhite"
								value={colorString}
								onChange={onColorInputChange}
							/>
						</div>
					</Popover.Content>
				</Popover.Root>

				<Node.DraggerButton tooltip="Show/hide plane" onClick={onHide}>
					{data.hidden ? <EyeClosedIcon /> : <EyeOpenIcon />}
				</Node.DraggerButton>
			</Node.Dragger>

			<Node.Handle type="target" id="point" top={71} />
			<Node.Handle type="target" id="direction1" top={139} />
			<Node.Handle type="target" id="direction2" top={207} />

			<div className="flex flex-col gap-2">
				<Node.DisplayVector vector={data.point.value} />
				<Node.DisplayVector vector={data.direction1.value} />
				<Node.DisplayVector vector={data.direction2.value} />
			</div>
		</Node.Root>
	);
});

PlaneNode.displayName = "Plane node";

export default PlaneNode;
