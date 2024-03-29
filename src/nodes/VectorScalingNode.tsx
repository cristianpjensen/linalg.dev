import React, { memo, useCallback, useState } from "react";
import { NodeProps } from "reactflow";
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

import { VectorScalingData } from "./types";
import { useOutput } from "./hooks";
import { useNodeStore } from "../../stores";
import * as Node from "./Node";

const VectorScalingNode = memo(
	({ id, data, selected }: NodeProps<VectorScalingData>) => {
		useOutput(id, data, (data) => {
			const v = data.vector.value;
			const s = data.scalar.value;

			return {
				result: {
					x: v.x * s,
					y: v.y * s,
					z: v.z * s,
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
				title="Vector scaling"
				color="slate"
				width={10}
				height={8}
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

					<Node.DraggerButton
						tooltip="Show/hide scaled vector"
						onClick={onHide}
					>
						{data.hidden ? <EyeClosedIcon /> : <EyeOpenIcon />}
					</Node.DraggerButton>
				</Node.Dragger>

				<Node.Handle type="target" id="vector" top={71} />
				<Node.Handle type="target" id="scalar" top={131} />

				<div className="flex flex-col gap-2">
					<Node.DisplayVector vector={data.vector.value} />
					<Node.NumberInput id="scalar" />
				</div>

				<Node.Handle type="source" id="result" />
			</Node.Root>
		);
	}
);

VectorScalingNode.displayName = "Vector scaling node";

export default VectorScalingNode;
