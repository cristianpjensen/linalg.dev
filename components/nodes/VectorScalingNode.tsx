import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import {
	ArrowTopRightIcon,
	EyeClosedIcon,
	EyeOpenIcon,
	GlobeIcon,
	ShadowInnerIcon,
} from "@radix-ui/react-icons";

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

export default VectorScalingNode;
