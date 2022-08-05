import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import type { VectorScalingData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import { useNodeStore } from "../../stores";

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

export default VectorScalingNode;
