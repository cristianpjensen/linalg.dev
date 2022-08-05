import React, { memo, useCallback, useState } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import {
	ArrowTopRightIcon,
	ColorWheelIcon,
	EyeClosedIcon,
	EyeOpenIcon,
	GlobeIcon,
	ShadowInnerIcon,
} from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { HexColorPicker } from "react-colorful";

import type { VectorData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import { useNodeStore } from "../../stores";

const VectorNode = memo(({ id, data, selected }: NodeProps<VectorData>) => {
	useOutput(id, data, (data) => {
		return {
			result: {
				x: data.x.value,
				y: data.y.value,
				z: data.z.value,
			},
		};
	});

	const setNodeData = useNodeStore((state) => state.setNodeData);
	const onHide = useCallback(() => {
		setNodeData(id, { hidden: !data.hidden });
	}, [data.hidden]);

	const onRepresentationChange = useCallback(() => {
		// Global -> sphere -> vector -> global -> ...
		setNodeData(id, {
			representation:
				data.representation === "sphere"
					? "vector"
					: data.representation === "vector"
					? "global"
					: "sphere",
		});
	}, [data.representation]);

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
			title="Vector"
			color="slate"
			width={8}
			height={12}
		>
			<Node.Dragger>
				<Popover.Root>
					<Popover.Trigger>
						<Node.DraggerButton tooltip="Customise vector colour">
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

				<Node.DraggerButton
					onClick={onRepresentationChange}
					tooltip={
						data.representation === "sphere"
							? "Show vector as sphere"
							: data.representation === "vector"
							? "Show vector as vector"
							: "Let representation be decided by global setting"
					}
				>
					{data.representation === "sphere" ? (
						<ShadowInnerIcon />
					) : data.representation === "vector" ? (
						<ArrowTopRightIcon />
					) : (
						<GlobeIcon />
					)}
				</Node.DraggerButton>

				<Node.DraggerButton tooltip="Show/hide vector" onClick={onHide}>
					{data.hidden ? <EyeClosedIcon /> : <EyeOpenIcon />}
				</Node.DraggerButton>
			</Node.Dragger>

			<Node.Handle type="target" id="x" top={64} />
			<Node.Handle type="target" id="y" top={119} />
			<Node.Handle type="target" id="z" top={174} />
			<Node.Handle type="target" id="origin" top={235} />

			<div className="flex flex-col gap-2">
				<Node.NumberInput id="x" />
				<Node.NumberInput id="y" />
				<Node.NumberInput id="z" />

				<Node.DisplayVector vector={data.origin.value} />
			</div>

			<Node.Handle type="source" id="result" />
		</Node.Root>
	);
});

export default VectorNode;
