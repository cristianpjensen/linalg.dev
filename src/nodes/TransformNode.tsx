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

import { TransformData } from "./types";
import { useOutput } from "./hooks";
import { useNodeStore } from "../../stores";
import * as Node from "./Node";

const TransformNode = memo(
	({ id, data, selected }: NodeProps<TransformData>) => {
		useOutput(id, data, (data) => {
			const m = data.matrix.value;
			const v = data.vector.value;

			return {
				result: {
					x: m[0] * v.x + m[1] * v.y + m[2] * v.z,
					y: m[3] * v.x + m[4] * v.y + m[5] * v.z,
					z: m[6] * v.x + m[7] * v.y + m[8] * v.z,
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
				title="Transform"
				color="slate"
				width={10}
				height={5}
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
						tooltip="Show/hide transformed vector"
						onClick={onHide}
					>
						{data.hidden ? <EyeClosedIcon /> : <EyeOpenIcon />}
					</Node.DraggerButton>
				</Node.Dragger>

				<Node.Handle
					type="target"
					id="matrix"
					top="calc(33.33% + 8px)"
				/>
				<Node.Handle
					type="target"
					id="vector"
					top="calc(66.66% + 8px)"
				/>

				<Node.DisplayVector vector={data.vector.value} />

				<Node.Handle type="source" id="result" />
			</Node.Root>
		);
	}
);

TransformNode.displayName = "Transform node";

export default TransformNode;
