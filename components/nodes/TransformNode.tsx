import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import {
	ArrowTopRightIcon,
	EyeClosedIcon,
	EyeOpenIcon,
	GlobeIcon,
	ShadowInnerIcon,
} from "@radix-ui/react-icons";

import type { TransformData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import { useNodeStore } from "../../stores";

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

export default TransformNode;
